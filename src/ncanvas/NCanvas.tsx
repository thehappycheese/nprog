import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "redux-undo";
import { Accordion } from "./components/Accordion.tsx";
import ModalDialog from "./components/ModalDialog.tsx";
import { NJson } from "./components/NJson.tsx";
import { draw_grid } from "./draw/grid";
import { grabby_edge } from "./grabby_edge.tsx";
import { GraphNode } from "./graph_types/GraphNode.ts";
import { HandelReference, HandelType } from "./graph_types/HandelReference.ts";
import helpers from "./helpers";
import { NodeRegistry } from "./graph_types/RegisteredNodeType.ts";
import { actions, RootState } from "./store";
import { Vector2 } from "./Vector2";
import { ViewportTransform } from "./ViewportTransform";
import { handel_bezier_segments } from "./bezier/handel_bezier.tsx";
import { HelpControls } from "./components/HelpControls.tsx";
import { ContextMenu, ContextMenuRef } from "./components/ContextMenu.tsx";
import { HandleRefRegistry } from "./nodes/core/Handel.tsx";
import { NodeRemoved } from "./nodes/NodeRemoved.tsx";

// MARK: type ActiveItem
type ActiveItem = {
    type: "none",
} | {
    type: "drag_canvas",
} | {
    type: "hover_edge",
    target_id: string
} | {
    type: "drag_node",
    target_ids: string[],
    mouse_down_coord: Vector2,
} | {
    type: "drag_edge",
    target_id: string,
    mouse_down_coord: Vector2,
} | {
    type: "start_edge_from_left",
    source: HandelReference
} | {
    type: "start_edge_from_right",
    source: HandelReference
} | {
    type: "handel_grab_start",
    edge_id: string
} | {
    type: "handel_grab_end",
    edge_id: string
} | {
    type: "draw_edge_cut", 
    mouse_down_position_screen: Vector2
} | {
    type: "draw_edge_split",
    mouse_down_position_screen: Vector2
} | {
    type:"bounding_box_select",
    mouse_down_position_screen: Vector2
};

/**
 * ```typescript
 * // Always use it like this:
 * screen_size(canvas_ref)
 * ```
*/
const screen_size = (canvas_ref:React.MutableRefObject<HTMLCanvasElement | null>) => (
    canvas_ref.current
    ? { x: canvas_ref.current.width, y: canvas_ref.current.height }
    : { x: 1, y: 1 }
);

export const NCanvas: React.FC = () => {
    // MARK: DOM REFS
    const canvas_ref = useRef<HTMLCanvasElement | null>(null);
    const canvas_host_ref = useRef<HTMLDivElement | null>(null);
    const resize_observer_ref = useRef<ResizeObserver | null>(null);

    const handel_refs = useRef<HandleRefRegistry>({}) // TODO: combine with node body location registry also

    const context_menu_ref = useRef<ContextMenuRef>(null);

    // MARK: DERIVED FROM REFS

    // MARK: REDUX STATE
    const dispatch = useDispatch();
    const undo_history = useSelector((state: RootState) => ({
        past_states: state.graph.past.length,
        future_states: state.graph.future.length,
        limit: state.graph.limit
    }));
    const nodes = useSelector((state: RootState) => state.graph.present.nodes);
    const edges = useSelector((state: RootState) => state.graph.present.edges);
    const selection = useSelector((state: RootState) => state.graph.present.selected);
    const viewport = useSelector((state: RootState) => state.viewport);

    // MARK: LOCAL STATE
    const [dirty_counter, set_dirty_counter] = useState(Number.MIN_SAFE_INTEGER);

    const [mouse_position_screen, set_mouse_position_screen] = useState<Vector2>({ x: 0, y: 0 });
    const [mouse_position_world, set_mouse_position_world] = useState<Vector2>({ x: 0, y: 0 });
    const [mouse_down_position_world, set_mouse_down_position_world] = useState<Vector2>({ x: 0, y: 0 });
    const [mouse_down_position_screen, set_mouse_down_position_screen] = useState<Vector2>({ x: 0, y: 0 });
    const [mouse_down, set_mouse_down] = useState(false);

    const [active_item, set_active_item] = useState<ActiveItem>({ type: "none" });

    const [grid_spacing, set_grid_spacing] = useState(50);


    // MARK: DERIVED LOCAL STATE

    const offset_screen = Vector2.sub(mouse_position_screen, mouse_down_position_screen);

    const transform = useMemo(() => new ViewportTransform(
        viewport.zoom,
        //offset_viewport_midpoint,
        (
            mouse_down && active_item.type === "drag_canvas"
                ? Vector2.add(viewport.midpoint, offset_screen)
                : viewport.midpoint
        ),
        screen_size(canvas_ref)
    ), [active_item, mouse_down, viewport, offset_screen]);

    // MARK: GLOBAL EVENTS
    useEffect(() => {
        const handle_keydown = (e: KeyboardEvent) => {
            if (e.key === "z" && e.ctrlKey) {
                dispatch(ActionCreators.undo())
            } else if (e.key === "y" && e.ctrlKey) {
                dispatch(ActionCreators.redo())
            } else if(e.key==="Delete"){
                dispatch(actions.graph.remove_nodes(selection.filter(i=>i.type==="node").map(i=>i.id)))
            } else if(e.key==="D" && e.shiftKey){
                if(selection.length>0){
                    const id_map = Object.fromEntries(selection.filter(item=>item.type==="node").map(item=>[item.id, Math.random()+"TODODUP"]))
                    // TODO: what if this fails?
                    dispatch(actions.graph.duplicate_nodes(id_map));
                    set_active_item({
                        type:"drag_node",
                        target_ids:[...Object.values(id_map)],
                        mouse_down_coord:mouse_position_world
                    })
                }
            }
        }
        window.addEventListener("keydown", handle_keydown)
        return () => {
            window.removeEventListener("keydown", handle_keydown);
        }
    }, [dispatch, selection, mouse_position_world]);

    // MARK: RESIZE CALLBACK
    const canvas_resize_callback = useCallback((canvas_host: HTMLDivElement | null) => {
        // const canvas = canvas_ref.current;
        // if(!canvas) return;
        if (canvas_host) {
            canvas_host_ref.current = canvas_host;
            resize_observer_ref.current = new ResizeObserver(entries => {
                const canvas = canvas_ref.current;
                if (!canvas) return;
                if (entries?.[0]) {
                    canvas.width = entries[0].contentRect.width;
                    canvas.height = entries[0].contentRect.height;
                    // console.log(`Setting Canvas size to ${entries[0].contentRect.width.toFixed(3)}, ${entries[0].contentRect.height.toFixed(3)}`)
                }

                set_dirty_counter(i => i + 1)
            });
            resize_observer_ref.current.observe(canvas_host)
            // console.log("canvas host mounted");
        } else {
            canvas_host_ref.current = null;
            if (resize_observer_ref.current) {
                resize_observer_ref.current.disconnect();
                resize_observer_ref.current = null;
            }
            // console.log("canvas host unmounted")
        }
    }, [set_dirty_counter]);

    // MARK: CANVAS RENDER
    // TODO: consider switching back to useLayoutEffect
    useLayoutEffect(() => {
        if (canvas_ref.current) {
            const canvas = canvas_ref.current;
            const ctx = canvas.getContext("2d")!;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // MARK: >> draw grid
            draw_grid(
                ctx,
                transform,
                {
                    grid_spacing,
                    color: "rgb(32, 28, 32)",
                    line_width: 1,
                    minimum_spacing_px: 20,
                    show_origin_gizmo: false,
                }
            )

            // MARK: >> draw edges
            if (canvas_host_ref.current !== null) {

                for (let edge of edges) {
                    let a = helpers.get_handel_position(edge.from, handel_refs.current, canvas_host_ref.current);
                    let b = helpers.get_handel_position(edge.to, handel_refs.current, canvas_host_ref.current);

                    if (active_item.type === "handel_grab_start" && active_item.edge_id === edge.id) {
                        a = mouse_position_screen;
                    } else if (active_item.type === "handel_grab_end" && active_item.edge_id === edge.id) {
                        b = mouse_position_screen;
                    }
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 3;
                    helpers.draw_edge(a,b,ctx);
                }

                // MARK: >> Dragged Edges
                if (active_item.type === "start_edge_from_left" || active_item.type==="start_edge_from_right") {
                    let a = helpers.get_handel_position(active_item.source, handel_refs.current, canvas_host_ref.current);
                    let b = mouse_position_screen;
                    if (active_item.type == "start_edge_from_right"){
                        [a,b] = [b,a];
                    }
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 3;
                    helpers.draw_edge(a,b, ctx);
                }
            }
            // MARK: >> Cut Edges
            if (active_item.type === "draw_edge_cut" || active_item.type==="draw_edge_split") {
                ctx.strokeStyle = "red";
                if(active_item.type==="draw_edge_split"){
                    ctx.strokeStyle = "grey";
                    ctx.setLineDash([3,3]);
                }
                ctx.beginPath();
                ctx.moveTo(active_item.mouse_down_position_screen.x, active_item.mouse_down_position_screen.y);
                ctx.lineTo(mouse_position_screen.x, mouse_position_screen.y);
                ctx.stroke();
                ctx.setLineDash([]);
            } else if(active_item.type=="bounding_box_select"){
                
                let rect_size = Vector2.sub(mouse_position_screen,active_item.mouse_down_position_screen);
                ctx.setLineDash([3,3]);
                ctx.strokeStyle = "grey";
                ctx.strokeRect(
                    active_item.mouse_down_position_screen.x, active_item.mouse_down_position_screen.y,
                    rect_size.x, rect_size.y
                )
                ctx.setLineDash([]);
            }
        }
    }, [active_item, mouse_position_screen, edges, grid_spacing, transform]);

    // MARK: DOM RENDER
    return <div className="n-canvas-root">
        <div className="n-canvas-controls">
            <div style={{ display: "none" }}>{dirty_counter}</div>
            <ContextMenu ref={context_menu_ref}>
                <button
                    onClick={()=>{
                        dispatch(actions.graph.add_node({
                            "title":"New Node!",
                            "registered_type":"add",
                            "data":null,
                            "position":mouse_position_world,
                            "id":"TODO:"+Math.random()
                        }));
                        context_menu_ref.current!.close();
                    }}
                >Add</button>
            </ContextMenu>
            <h1 className="text-4xl font-bold mb-3">🐲 <sup>N</sup>Canvas</h1>
            <ModalDialog title="Settings">
                <div className="grid grid-cols-1 gap-2 p-5">
                    <button onClick={() => dispatch(ActionCreators.clearHistory())}>Clear Undo History</button>
                    <div className="grid grid-cols-2 gap-x-2 ml-3">
                        <div>Past States:</div>
                        <div>{undo_history.past_states}</div>
                        <div>Future States:</div>
                        <div>{undo_history.future_states}</div>
                        <div>Limit:</div>
                        <div>{undo_history.limit}</div>
                    </div>
                    <button onClick={() => {
                        localStorage.clear();
                        set_dirty_counter(i => i + 1);
                    }}>Clear Local Storage
                    </button>
                    <div className="grid grid-cols-2 gap-x-2 ml-3">
                        <div>Size:</div>
                        <div>{JSON.stringify(localStorage).length}</div>
                    </div>
                    <button onClick={() => dispatch(actions.graph.clear_all())}>Delete All</button>
                    <div className="grid grid-cols-2 gap-x-2 ml-3">
                        <div>Nodes:</div>
                        <div>{nodes.length}</div>
                        <div>Edges:</div>
                        <div>{edges.length}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 ml-3">
                        <label>Grid Spacing</label><input
                            type="range"
                            value={grid_spacing}
                            min="20"
                            max="1000"
                            onChange={e => set_grid_spacing(parseFloat(e.target.value))}
                            className="bg-level-0" />
                    </div>
                </div>
            </ModalDialog>
            <button className="btn btn-accent" onClick={() => dispatch(ActionCreators.undo())}>Undo</button>
            <button className="btn" onClick={() => dispatch(ActionCreators.redo())}>Redo</button>
            <button className="btn" onClick={() => {
                const newNode: GraphNode<null> = {
                    id: `node-${nodes.length + 1}`,
                    title: 'New Node',
                    position: mouse_position_screen,
                    registered_type: "tau",
                    data: null
                }; // Example structure
                dispatch(actions.graph.add_node(newNode));
            }}>Add Node
            </button>

            <button onClick={() => dispatch(actions.viewport.reset())}>Reset View</button>
            <ModalDialog title="View Data">
                <div className="p-2 h-[80vh] overflow-y-auto">
                    <Accordion
                        items={
                            Object.entries({ nodes, edges, selection })
                                .map(([key, value]) =>
                                    ({ title: key, content: <NJson key={key} value={value} depth={0} /> })
                                )
                        }
                    />
                </div>
            </ModalDialog>
            <HelpControls />
            <NJson value={active_item} depth={0} font_size={0.6} />
        </div>
        <div
            className="n-canvas-canvas-host"
            ref={canvas_resize_callback}
            onPointerMove={e=>{
                // MARK: >> Host.pointermove
                let { mouse_position_screen, mouse_position_world } = helpers.get_mouse_positions(e, transform, e.currentTarget);
                set_mouse_position_screen(mouse_position_screen);
                set_mouse_position_world(mouse_position_world);
            }}
            onPointerDown={e=>{
                // MARK: >> Host.pointerdown
                let { mouse_position_screen, mouse_position_world } = helpers.get_mouse_positions(e, transform, canvas_host_ref.current!);
                set_mouse_position_screen(mouse_position_screen);
                set_mouse_position_world(mouse_position_world);
                set_mouse_down(true);
                set_mouse_down_position_screen(mouse_position_screen);
                set_mouse_down_position_world(mouse_position_world);
                if (e.target === canvas_ref.current) {
                    if (active_item.type==="drag_node"){
                        // dispatch(actions.graph.offset_nodes({
                        //     ids: active_item.target_ids,
                        //     offset: Vector2.sub(mouse_position_world, active_item.mouse_down_coord)
                        // }))
                        // set_active_item({ type: "none" });
                        return
                    }
                    if (e.button === 0 && e.shiftKey) {
                        set_active_item({ type: "draw_edge_split", mouse_down_position_screen: mouse_position_screen });
                    }else if(e.button === 0){
                        set_active_item({ type: "bounding_box_select", mouse_down_position_screen:mouse_position_screen });
                    }else if (e.button === 1) {
                        set_active_item({ type: "drag_canvas" });
                    } else if (e.button === 2 && e.ctrlKey) {
                        set_active_item({ type: "draw_edge_cut", mouse_down_position_screen: mouse_position_screen });
                    } 
                }
            }}
            onPointerUp={e=>{
                // MARK: >> Host.pointerup
                let { mouse_position_screen, mouse_position_world } = helpers.get_mouse_positions(e, transform, canvas_host_ref.current!);
                set_mouse_position_screen(mouse_position_screen);
                set_mouse_position_world(mouse_position_world);
                set_mouse_down(false);
                if (active_item.type === "none") {
                    if (e.button===2 && context_menu_ref.current) {
                        e.preventDefault()
                        context_menu_ref.current.open_at({
                            x: e.clientX,
                            y: e.clientY
                        });
                    }
                }else if(active_item.type==="bounding_box_select"){
                    if(Vector2.mag_squared(Vector2.sub(mouse_down_position_screen, mouse_position_screen))<2*2){
                        dispatch(actions.graph.select_none());
                    }else{
                        // TODO: Complete bounding box selection
                    }
                    set_active_item({ type: "none" });
                } else if (active_item.type === "drag_node") {
                    dispatch(actions.graph.offset_nodes({
                        ids: active_item.target_ids,
                        offset: Vector2.sub(mouse_position_world, active_item.mouse_down_coord)
                    }))
                    set_active_item({ type: "none" });
                } else if (active_item.type === "drag_canvas") {
                    dispatch(actions.viewport.translate(offset_screen));
                    set_active_item({ type: "none" });
                } else if (active_item.type === "draw_edge_cut") {
                    let hit_test = Vector2.line_segments_intersect(mouse_position_screen, active_item.mouse_down_position_screen);
                    let touched_edges = edges.filter(edge => {
                        let a = helpers.get_handel_position(edge.from, handel_refs.current, canvas_host_ref.current!);
                        let b = helpers.get_handel_position(edge.to, handel_refs.current, canvas_host_ref.current!);
                        let segments = handel_bezier_segments(a, b, 20);


                        return segments.some(([a, b]) => hit_test(a, b))
                    }).map(item => item.id);
                    dispatch(actions.graph.remove_edges(touched_edges));
                    set_active_item({ type: "none" });
                
                } else if(active_item.type==="draw_edge_split"){
                    // TODO: implement split edges
                    set_active_item({ type: "none" });
                }else if(active_item.type==="handel_grab_end"||active_item.type==="handel_grab_start"){
                    dispatch(actions.graph.remove_edges([
                        active_item.edge_id
                    ]))
                    set_active_item({ type: "none" });
                } else {
                    throw new Error("Unhandled Active Item")
                }
            }}
            onPointerOut={e=>{
                // MARK: >> Host.pointerout
                if (e.target === e.currentTarget) {
                    set_active_item({ type: "none" });
                }
            }}
            onWheel={e=>{
                // MARK: >> Host.wheel
                if (e.deltaY < 0) {
                    dispatch(actions.viewport.zoom_in_to({
                        target_screen_position: mouse_position_screen,
                        screen_size:screen_size(canvas_ref)
                    }));
                    set_dirty_counter(i => i + 1);
                } else if (e.deltaY > 0) {
                    dispatch(actions.viewport.zoom_out_from({
                        target_screen_position: mouse_position_screen,
                        screen_size:screen_size(canvas_ref)
                    }));
                    set_dirty_counter(i => i + 1);
                }
            }}
            onContextMenu={e => { e.preventDefault() }}
        >
            <canvas
                className="n-canvas-canvas rounded-md bg-level-1 w-full h-full select-none"
                ref={canvas_ref}
            />
            {
                // MARK: Node DOM Render
                (() => {
                    return nodes.map(node => {

                        let node_position_world = node.position;

                        if (active_item.type === "drag_node" && active_item.target_ids.some(id=>id === node.id)) {
                            node_position_world = Vector2.add(
                                node.position,
                                Vector2.sub(
                                    transform.screen_to_world(mouse_position_screen),
                                    mouse_down_position_world
                                )
                            );
                        }

                        const node_screen_position = transform.world_to_screen(node_position_world);

                        let NodeType = NodeRegistry[node.registered_type];
                        
                        if (NodeType === undefined){
                            NodeType = NodeRemoved;
                        }

                        return <NodeType
                            key={node.id}
                            node={node}
                            ref={handel_refs} // TODO: node body location refs are now also needed
                            set_node_data={new_value => dispatch(actions.graph.set_node_data({
                                node_id: node.id,
                                new_value
                            }))}
                            body_props={{
                                node: node,
                                font_scale: viewport.zoom,
                                screen_position: node_screen_position,
                                selected: selection.findIndex(item => item.type === "node" && item.id === node.id) !== -1,
                                onClick: e=>{
                                    const {mouse_position_screen} = helpers.get_mouse_positions(e,transform,canvas_host_ref.current!);
                                    if(Vector2.mag_squared(Vector2.sub(mouse_down_position_screen, mouse_position_screen))<2*2){
                                        if(e.button===0){
                                            if (e.shiftKey){
                                                dispatch(actions.graph.select_toggle({type:"node", id:node.id}));
                                            }else{
                                                dispatch(actions.graph.select_replace({type:"node", id:node.id}));
                                            }
                                        }
                                    }
                                },
                                onPointerDown: e => {
                                    // MARK: Body pointer Down
                                    //e.preventDefault();
                                    let { mouse_position_world } = helpers.get_mouse_positions(e, transform, canvas_host_ref.current!);
                                    set_active_item({
                                        type: "drag_node",
                                        target_ids: [node.id],
                                        mouse_down_coord: mouse_position_world
                                    })
                                }
                            }}
                            onPointerDownHandel={(e, handel_reference, handle_type) => {
                                // MARK: Handle Pointer Down
                                e.stopPropagation();
                                let { mouse_position_screen } = helpers.get_mouse_positions(e, transform, canvas_host_ref.current!);
                                if (active_item.type === "none") {
                                    switch (handle_type) {
                                        case HandelType.input:
                                            break;
                                        case HandelType.output:
                                            break
                                    }
                                    if (handle_type === HandelType.input || e.ctrlKey) { // User must hold control key to grab the start of an edge
                                        const result = grabby_edge(
                                            edges,
                                            mouse_position_screen,
                                            handel_reference,
                                            ref => helpers.get_handel_position(ref, handel_refs.current, canvas_host_ref.current!),
                                            handle_type
                                        )
                                        if (result) {
                                            if (handle_type === HandelType.output) {
                                                set_active_item({
                                                    type: "handel_grab_start",
                                                    edge_id: result
                                                });
                                            } else if (handle_type === "input") {
                                                set_active_item({
                                                    type: "handel_grab_end",
                                                    edge_id: result
                                                });
                                            }
                                        }else{
                                            set_active_item({
                                                type: "start_edge_from_right",
                                                source: handel_reference
                                            })
                                        }
                                    } else if (handle_type === HandelType.output) {
                                        set_active_item({
                                            type: "start_edge_from_left",
                                            source: handel_reference
                                        })
                                    }
                                }
                            }}
                            onPointerUpHandel={(e, handel_reference, handel_type) => {
                                // MARK: Handle Pointer Up
                                if (active_item.type === "start_edge_from_left" && handel_type === "input") {
                                    e.stopPropagation()
                                    set_active_item({ type: "none" });
                                    dispatch(actions.graph.add_edge({
                                        from: active_item.source,
                                        to: handel_reference,
                                    }));
                                }else if (active_item.type === "start_edge_from_right" && handel_type === "output") {
                                    e.stopPropagation()
                                    set_active_item({ type: "none" });
                                    dispatch(actions.graph.add_edge({
                                        from: handel_reference,
                                        to: active_item.source,
                                    }));
                                }
                            }}
                        />
                    })
                })()
            }
        </div>
    </div >
}



