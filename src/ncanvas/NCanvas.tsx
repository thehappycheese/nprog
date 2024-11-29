import { useCallback, useRef, useState } from "react";
import { GraphNode, NodeRegistry } from "./graph_types.ts";
import { HandelReference, HandelReference_compare } from "./graph_types.ts/HandelReference.ts";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "./store";
import { ActionCreators } from "redux-undo";

import { draw_grid } from "./draw/grid";
import { ViewportTransform } from "./ViewportTransform";
import ModalDialog from "./components/ModalDialog.tsx";
import { useConstrainedNumber } from "./hooks/useConstrainedNumber";
import { Vector2 } from "./Vector2";
import helpers from "./helpers";
import { NJson } from "./components/NJson.tsx";
import { Accordion } from "./components/Accordion.tsx";
import { solve_x } from "./bezier/solve_x.tsx";
import { handel_bezier } from "./bezier/index.tsx";

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
    target_id: string,
    mouse_down_coord: Vector2.Vector2,
} | {
    type: "drag_edge",
    target_id: string,
    mouse_down_coord: Vector2.Vector2,
} | {
    type: "handel_out_left",
    source: HandelReference
} | {
    type: "handel_grab_start",
    start_of_edge_id: string
} | {
    type: "handel_grab_end",
    end_of_edge_id: string
};


export const NCanvas: React.FC = () => {
    // MARK: DOM REFS
    const canvas_ref = useRef<HTMLCanvasElement | null>(null);
    const canvas_host_ref = useRef<HTMLDivElement | null>(null);
    const resize_observer_ref = useRef<ResizeObserver | null>(null);

    const handel_refs = useRef<Record<string, Record<string, HTMLDivElement>>>({})

    // MARK: DERIVED FROM REFS

    const screen_size: Vector2.Vector2 = (
        canvas_ref.current
            ? { x: canvas_ref.current.width, y: canvas_ref.current.height }
            : { x: 1, y: 1 }
    );

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

    const [mouse_position_screen, set_mouse_position_screen] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_position_world, set_mouse_position_world] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_down_position_world, set_mouse_down_position_world] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_down_position_screen, set_mouse_down_position_screen] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_down, set_mouse_down] = useState(false);

    const [active_item, set_active_item] = useState<ActiveItem>({ type: "none" });

    const [grid_spacing, set_grid_spacing] = useConstrainedNumber(50, [5, 1000]);


    // MARK: DERIVED LOCAL STATE

    const offset_screen = Vector2.sub(mouse_position_screen, mouse_down_position_screen);
    //const offset_world = Vector2.scale(offset_screen, viewport.zoom);

    const offset_viewport_midpoint = (
        mouse_down && active_item.type === "drag_canvas"
            ? Vector2.add(viewport.midpoint, offset_screen)
            : viewport.midpoint
    );

    const transform = new ViewportTransform(
        viewport.zoom,
        offset_viewport_midpoint,
        screen_size
    );



    // MARK: POINTER EVENT
    const handle_canvas_pointer_event = (e: React.PointerEvent<HTMLElement>) => {
        let { mouse_position, mouse_position_world } = helpers.mouse_positions(e, transform);
        set_mouse_position_screen(mouse_position);
        set_mouse_position_world(mouse_position_world);

        if (e.type === "pointerdown") {
            // MARK: >> pointerdown
            set_mouse_down(true);
            set_mouse_down_position_screen(mouse_position);
            set_mouse_down_position_world(mouse_position_world);
            if (e.target === canvas_ref.current) {
                set_active_item({ type: "drag_canvas" });
            }
        } else if (e.type === "pointerup") {
            // MARK: >> pointer up
            set_mouse_down(false);
            if (active_item.type === "drag_node") {
                dispatch(actions.graph.offset_node({
                    id: active_item.target_id,
                    offset: Vector2.sub(mouse_position_world, active_item.mouse_down_coord)
                }))
                set_active_item({ type: "none" });
            } else if (active_item.type === "drag_canvas") {
                dispatch(actions.viewport.translate(offset_screen));
                set_active_item({ type: "none" });
            } else {
                set_active_item({ type: "none" });
            }
        } else if (e.type === "pointerout") {
            if (e.target === e.currentTarget) {
                set_active_item({ type: "none" });
            }
        } else if (e.type === "pointerover") {
            // TODO: pointer over
        } else {
            console.log(`Pointer event ${e.type} WHAT?`);
        }
    };

    // MARK: POINTERMOVE
    const handle_canvas_pointer_move_event = (e: React.PointerEvent<HTMLDivElement>) => {
        let { mouse_position, mouse_position_world } = helpers.mouse_positions(e, transform);
        set_mouse_position_screen(mouse_position);
        set_mouse_position_world(mouse_position_world);
    }

    // MARK: WHEEL
    const handle_wheel_event = (e: React.WheelEvent<HTMLDivElement>) => {
        if (e.deltaY < 0) {
            dispatch(actions.viewport.zoom_in_to({
                target_screen_position: mouse_position_screen,
                screen_size
            }));
            set_dirty_counter(i => i + 1);
        } else if (e.deltaY > 0) {
            dispatch(actions.viewport.zoom_out_from({
                target_screen_position: mouse_position_screen,
                screen_size
            }));
            set_dirty_counter(i => i + 1);
        }
    }

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

                if (active_item.type === "handel_grab_start" && active_item.start_of_edge_id === edge.id) {
                    a = mouse_position_screen;
                } else if (active_item.type === "handel_grab_end" && active_item.end_of_edge_id === edge.id) {
                    b = mouse_position_screen;
                }

                let abx = Vector2.scale({ x: Math.abs(b.x - a.x), y: 0 }, 0.5);
                let c1 = Vector2.add(a, abx);
                let c2 = Vector2.sub(b, abx);
                ctx.strokeStyle = "white";
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.bezierCurveTo(
                    c1.x, c1.y,
                    c2.x, c2.y,
                    b.x, b.y
                );
                ctx.stroke()
                // MARK: temp bez test
                let partway = handel_bezier(a, b, 0.2);
                ctx.fillStyle = "black";
                ctx.fillRect(partway.x - 3, partway.y - 3, 6, 6);
                let result = solve_x(a.x + 10, t => handel_bezier(a, b, t));
                if (result) {
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(a.x + 10 - 3, result.y - 3, 6, 6);
                }

            }

            if (active_item.type === "handel_out_left") {
                let a = helpers.get_handel_position(active_item.source, handel_refs.current, canvas_host_ref.current);
                let b = mouse_position_screen
                let abx = Vector2.scale({ x: Math.abs(b.x - a.x), y: 0 }, 0.5);
                let c1 = Vector2.add(a, abx);
                let c2 = Vector2.sub(b, abx);
                ctx.strokeStyle = "white";
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.bezierCurveTo(
                    c1.x, c1.y,
                    c2.x, c2.y,
                    b.x, b.y
                );
                ctx.stroke()
            }
        }
    }

    // MARK: DOM RENDER
    return <div className="n-canvas-root">
        <div className="n-canvas-controls">
            <div style={{ display: "none" }}>{dirty_counter}</div>
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
                        <label>Grid Spacing</label><input type="number" value={grid_spacing}
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

            <div className="grid grid-cols-2 gap-2 text-[0.8em] font-mono">
                <div>Mouse Screen</div>
                <div>{Vector2.toString(mouse_position_screen)}</div>
                <div>Mouse Down Screen</div>
                <div>{Vector2.toString(mouse_down_position_screen)}</div>
                <div>Mouse World</div>
                <div>{Vector2.toString(mouse_position_world)}</div>
                <div>Mouse Down World</div>
                <div>{Vector2.toString(mouse_down_position_world)}</div>
                <div>Mouse Down</div>
                <div>{mouse_down.toString()}</div>
                <div>Active Item</div>
                <pre className="text-[0.8em]">{JSON.stringify(active_item, null, 1)}</pre>
            </div>
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
        </div>
        <div
            className="n-canvas-canvas-host"
            ref={canvas_resize_callback}
            onPointerMove={handle_canvas_pointer_move_event}
            onPointerDown={handle_canvas_pointer_event}
            onPointerUp={handle_canvas_pointer_event}
            onPointerOut={handle_canvas_pointer_event}
            onPointerOver={handle_canvas_pointer_event}
            onWheel={handle_wheel_event}
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

                        if (active_item.type === "drag_node" && active_item.target_id === node.id) {
                            node_position_world = Vector2.add(
                                node.position,
                                Vector2.sub(
                                    transform.screen_to_world(mouse_position_screen),
                                    mouse_down_position_world
                                )
                            );
                        }

                        const node_screen_position = transform.world_to_screen(node_position_world);

                        const NodeType = NodeRegistry[node.registered_type];

                        return <NodeType
                            key={node.id}
                            node={node}
                            ref={handel_refs}
                            set_node_data={new_value => dispatch(actions.graph.set_node_data({
                                node_id: node.id,
                                new_value
                            }))}
                            body_props={{
                                node: node,
                                font_scale: viewport.zoom,
                                screen_position: node_screen_position,
                                selected: selection.findIndex(item => item.type === "node" && item.id === node.id) !== -1,
                                onPointerDown: e => {
                                    // MARK: Body pointer Down
                                    //e.preventDefault();
                                    let { mouse_position_world } = helpers.mouse_positions(e, transform, canvas_host_ref.current!);
                                    set_active_item({
                                        type: "drag_node",
                                        target_id: node.id,
                                        mouse_down_coord: mouse_position_world
                                    })
                                }
                            }}
                            onPointerDownHandel={(e, handel_reference, handel_type) => {
                                // MARK: Handle Pointer Down
                                e.stopPropagation();
                                if (active_item.type === "none" && handel_type === "output") {
                                    if (e.ctrlKey) { // User must hold control key to grab the start of an edge
                                        let user_grabbed_edges_start = edges.filter(
                                            item => HandelReference_compare(item.from, handel_reference)
                                        );
                                        if (user_grabbed_edges_start.length > 0) {
                                            // read the position of the edge 20% of the way in, and pick the nearest edge to the mouse
                                            const edge_from_to = user_grabbed_edges_start
                                                .map(edge => ({
                                                    edge_id: edge.id,
                                                    from: helpers.get_handel_position(edge.from, handel_refs.current, canvas_host_ref.current!),
                                                    to: helpers.get_handel_position(edge.to, handel_refs.current, canvas_host_ref.current!)
                                                }));
                                            const edge_sample_near_click = edge_from_to
                                                .map(({ edge_id, from, to }) => {
                                                    let result = solve_x(from.x + 5, t => handel_bezier(from, to, t))
                                                    if (result && result.t < 0.1) {
                                                        return { edge_id, partway: { x: from.x, y: result.y } };
                                                    } else {
                                                        return { edge_id, partway: { x: from.x, y: handel_bezier(from, to, 0.1).y } };
                                                    }
                                                });
                                            const best_edge = edge_sample_near_click
                                                .reduce<{ edge_id: string | null, best: number }>(({ edge_id, best }, { edge_id: challenger_edge_id, partway }) => {
                                                    let challenger = Vector2.mag_squared(Vector2.sub(mouse_position_screen, partway));
                                                    if (challenger <= best) {
                                                        return { edge_id: challenger_edge_id, best: challenger }
                                                    } else {
                                                        return { edge_id, best }
                                                    }
                                                }, { edge_id: null, best: Infinity })
                                            //debugger
                                            let user_grabbed_edge_start_id = best_edge.edge_id ?? user_grabbed_edges_start[0].id;
                                            set_active_item({
                                                type: "handel_grab_start",
                                                start_of_edge_id: user_grabbed_edge_start_id
                                            });
                                        }
                                    } else {
                                        // TODO: disconnect existing?
                                        // TODO: handel release over none
                                        set_active_item({
                                            type: "handel_out_left",
                                            source: handel_reference
                                        })
                                    }
                                }
                            }}

                            onPointerUpHandel={(e, handel_reference, handel_type) => {
                                // MARK: Handle Pointer Up
                                if (active_item.type === "handel_out_left" && handel_type === "input") {
                                    e.stopPropagation()
                                    set_active_item({ type: "none" });
                                    if (active_item.source.node_id !== handel_reference.node_id && active_item.source.handel_id !== handel_reference.handel_id) {
                                        let new_edge = {
                                            from: active_item.source,
                                            to: handel_reference,
                                        };
                                        dispatch(actions.graph.add_edge(new_edge));
                                    }
                                }
                            }}
                        />
                    })
                })()
            }
        </div>
    </div>
}



