import { useCallback, useRef, useState } from "react";
import { GraphNode, HandelReference, NodeRegistry } from "./graph_types";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "./store";
import { ActionCreators } from "redux-undo";

import { MouseToolMode, MouseToolModeControls } from "./components/MouseToolModeControls";
import { default_node_style } from "./draw/NodeRenderStyle";
import { draw_grid } from "./draw/grid";
import { ViewportTransform } from "./ViewportTransform";
import SettingsMenu from "./components/SettingsMenu";
import { useConstrainedNumber } from "./hooks/useConstrainedNumber";
import { Vector2 } from "./Vector2";

// MARK: type ActiveItem
type ActiveItem = {
    type: "none",
    target_id: null,
} | {
    type: "drag_canvas",
    target_id: null,
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
};


export const NCanvas: React.FC = () => {
    // MARK: DOM REFS
    const canvas_ref = useRef<HTMLCanvasElement | null>(null);
    const canvas_host_ref = useRef<HTMLDivElement | null>(null);
    const resize_observer_ref = useRef<ResizeObserver | null>(null);

    const handel_refs = useRef<Record<string, Record<string, HTMLDivElement>>>({})
    // MARK: REDUX STATE
    const dispatch = useDispatch();
    const undo_history = useSelector((state: RootState) => ({
        past_states: state.graph.past.length,
        future_states: state.graph.future.length,
        limit: state.graph.limit
    }));
    const nodes = useSelector((state: RootState) => state.graph.present.nodes);
    const edges = useSelector((state: RootState) => state.graph.present.edges);
    const viewport = useSelector((state: RootState) => state.viewport);

    // MARK: LOCAL STATE
    const [dirty_counter, set_dirty_counter] = useState(Number.MIN_SAFE_INTEGER);

    const [mouse_position_screen, set_mouse_position_screen] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_position_world, set_mouse_position_world] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_down_position_world, set_mouse_down_position_world] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_down_position_screen, set_mouse_down_position_screen] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_down, set_mouse_down] = useState(false);

    const [mouse_tool_mode, set_mouse_tool_mode] = useState<MouseToolMode>({ type: "select" });

    const [active_item, set_active_item] = useState<ActiveItem>({ type: "none", target_id: null });

    const [grid_spacing, set_grid_spacing] = useConstrainedNumber(50, [5, 1000]);


    const screen_size: Vector2.Vector2 = (
        canvas_ref.current
            ? { x: canvas_ref.current.width, y: canvas_ref.current.height }
            : { x: 1, y: 1 }
    );

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
    const handle_canvas_pointer_event = (e: React.PointerEvent<HTMLDivElement>) => {
        const canvasRect = e.currentTarget.getBoundingClientRect();
        let x = e.clientX - canvasRect.left;
        let y = e.clientY - canvasRect.top;
        let new_position = { x, y };
        let new_position_world = transform.screen_to_world(new_position)

        set_mouse_position_screen(new_position);
        set_mouse_position_world(new_position_world);

        if (e.type === "pointerdown") {
            // MARK: >> pointerdown
            set_mouse_down(true);
            set_mouse_down_position_screen(new_position);
            set_mouse_down_position_world(new_position_world);
            if (e.target === canvas_ref.current) {
                set_active_item({
                    type: "drag_canvas",
                    target_id: null
                })
            }
        } else if (e.type === "pointerup") {
            // MARK: >> pointer up
            set_mouse_down(false);
            if (active_item.type === "drag_node") {
                dispatch(actions.graph.offset_node({
                    id: active_item.target_id,
                    offset: Vector2.sub(new_position_world, active_item.mouse_down_coord)
                }))
                set_active_item({ type: "none", target_id: null });
            } else if (active_item.type === "drag_canvas") {
                dispatch(actions.viewport.translate(offset_screen))
                set_active_item({
                    type: "none",
                    target_id: null,
                })
            } else {
                set_active_item({
                    type: "none",
                    target_id: null,
                })
            }
        } else if (e.type === "pointerout") {
            if (e.target === e.currentTarget) {
                set_active_item({
                    type: "none",
                    target_id: null,
                })
            }
        } else if (e.type === "pointerover") {
            // TODO: pointer over
        } else {
            console.log(`Pointer event ${e.type} WHAT?`);
        }
    };

    // MARK: POINTERMOVE
    const handle_canvas_pointer_move_event = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (canvas_host_ref.current === null) return
        set_dirty_counter(i => i + 1);
        const canvasRect = canvas_host_ref.current.getBoundingClientRect();
        let x = e.clientX - canvasRect.left;
        let y = e.clientY - canvasRect.top;

        let new_mouse_position = { x, y };
        let new_mouse_position_world = transform.screen_to_world(new_mouse_position);

        set_mouse_position_screen(new_mouse_position);
        set_mouse_position_world(new_mouse_position_world);

    }
    const handle_wheel_event = (e: React.WheelEvent<HTMLDivElement>) => {
        if (e.deltaY < 0) {
            dispatch(actions.viewport.zoom_in_to({
                target_screen_position: mouse_position_screen,
                screen_size
            }));
        } else if (e.deltaY > 0) {
            dispatch(actions.viewport.zoom_out_from({
                target_screen_position: mouse_position_screen,
                screen_size
            }));
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

    //useLayoutEffect(()=>{
    // MARK: CANVAS RENDER
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
                minimum_spacing_px: 20
            }
        )

        // MARK: >> draw edges
        if (handel_refs.current && canvas_host_ref.current) {

            let hrc = handel_refs.current;
            let get_pos = (handel_reference: HandelReference) => {
                let h_rect = hrc?.[handel_reference.node]?.[handel_reference.handel]?.getBoundingClientRect();
                let host_rect = (canvas_host_ref.current as HTMLDivElement).getBoundingClientRect(); // TODO: unhappy lambda
                let hpos: Vector2.Vector2 = {
                    x: h_rect.left + h_rect.width / 2 - host_rect.left,
                    y: h_rect.top + h_rect.height / 2 - host_rect.top,
                };
                return hpos
            }
            for (let edge of edges) {
                let a = get_pos(edge.from);
                let b = get_pos(edge.to);
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
    // },[
    //     // ??
    // ]);

    // MARK: DOM RENDER
    return <div className="n-canvas-root">
        <div className="n-canvas-controls">
            <div style={{ display: "none" }}>{dirty_counter}</div>
            <SettingsMenu isOpen={false} onClose={() => {
            }}>
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
            </SettingsMenu>
            <button className="btn btn-accent" onClick={() => dispatch(ActionCreators.undo())}>Undo</button>
            <button className="btn" onClick={() => dispatch(ActionCreators.redo())}>Redo</button>
            <button className="btn" onClick={() => {
                const newNode: GraphNode = {
                    id: `node-${nodes.length + 1}`,
                    title: 'New Node',
                    position: mouse_position_screen,
                    size: { x: 150, y: 50 },
                    registered_type: "tau",
                }; // Example structure
                dispatch(actions.graph.add_node(newNode));
            }}>Add Node
            </button>

            <button onClick={() => dispatch(actions.viewport.reset())}>Reset View</button>
            <MouseToolModeControls mouse_tool_mode={mouse_tool_mode} set_mouse_tool_mode={set_mouse_tool_mode} />
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
            <div>{nodes.map(item => `<Node:${item.id} ${item.title} ...>`).join("\n")}</div>
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
                    let node_style = default_node_style(); // TODO: this is a bit dumb to have to call it here and in the canvas rendering code.
                    return nodes.map(node => {
                        const is_active_item = active_item.target_id === node.id;
                        const is_being_dragged = is_active_item && active_item.type === "drag_node";
                        let node_position_world = node.position;
                        if (is_being_dragged) {
                            node_position_world = Vector2.add(
                                node.position,
                                Vector2.sub(
                                    transform.screen_to_world(mouse_position_screen),
                                    mouse_down_position_world
                                )
                            );
                        }

                        const node_screen_position = transform.world_to_screen(node_position_world);

                        const node_screen_size = transform.scale_only_world_to_screen(node.size);

                        const NodeType = NodeRegistry[node.registered_type];
                        return <NodeType
                            key={node.id}
                            node={node}
                            screen_padding={{
                                x: node_style.padding,
                                y: node_style.padding
                            }}
                            screen_position={node_screen_position}
                            screen_size={node_screen_size}
                            font_scale={viewport.zoom}
                            ref={handel_refs}
                            onPointerDown={e => {
                                e.preventDefault();
                                const canvasRect = canvas_host_ref.current!.getBoundingClientRect();
                                let x = e.clientX - canvasRect.left;
                                let y = e.clientY - canvasRect.top;
                                let event_mouse_position = { x, y };
                                let event_mouse_position_world = transform.screen_to_world(event_mouse_position)
                                set_active_item({
                                    type: "drag_node",
                                    target_id: node.id,
                                    mouse_down_coord: event_mouse_position_world
                                })
                            }}
                        />
                    })
                })()
            }
        </div>
    </div>
}
