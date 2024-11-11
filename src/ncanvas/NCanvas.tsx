import { useCallback, useRef, useState } from "react";
import { GraphNode } from "./graph_types";
import { useDispatch, useSelector } from "react-redux";
import { RootState, actions } from "./store";
import { ActionCreators } from "redux-undo";
import * as Vector2 from "./Vector2";
import { MouseToolMode, MouseToolModeControls } from "./components/MouseToolModeControls";
import { hit_test_nodes } from "./util";
import { default_style } from "./draw/style";
import { draw_node_body_and_title_bar } from "./draw/node_body_and_title_bar";
import { draw_grid } from "./draw/grid";
import { ViewportTransform } from "./store/viewport_slice";


type ActiveItem = {
    type: "none",
    target_id: null,
} | {
    type: "drag_canvas",
    target_id: null,
} | {
    type: "hover_node",
    target_id: string
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


export function NCanvas() {

    // REDUX MAIN STORE OBJECTS
    const dispatch = useDispatch();
    const nodes = useSelector((state: RootState) => state.graph.present.nodes);
    const edges = useSelector((state: RootState) => state.graph.present.edges);
    const viewport = useSelector((state:RootState)=> state.viewport);

    // LOCAL STATE OBJECTS
    const [canvas_resize_counter, set_canvas_resize_counter] = useState(Number.MIN_SAFE_INTEGER);

    const [mouse_position_screen, set_mouse_position_screen] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_position_world, set_mouse_position_world] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_down_position_world, set_mouse_down_position_world] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_down_position_screen, set_mouse_down_position_screen] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_down, set_mouse_down] = useState(false);

    const [mouse_tool_mode, set_mouse_tool_mode] = useState<MouseToolMode>({type:"select"});

    const [active_item, set_active_item] = useState<ActiveItem>({ type: "none" , target_id:null});

    const [grid_spacing, set_grid_spacing] = useState(50);

    // DOM REFS
    const canvas_ref          = useRef< HTMLCanvasElement | null >(null);
    const canvas_host_ref     = useRef< HTMLDivElement    | null >(null);
    const resize_observer_ref = useRef< ResizeObserver    | null >(null);

    // DERIVED STATE

    const offset_screen = Vector2.sub(mouse_position_screen, mouse_down_position_screen);
    const offset_world  = Vector2.scale(offset_screen, viewport.zoom);

    const offset_viewport_midpoint = mouse_down && active_item.type==="drag_canvas" ? Vector2.add(viewport.midpoint, offset_screen) : viewport.midpoint;

    const transform = new ViewportTransform(
        viewport.zoom,
        offset_viewport_midpoint,
        canvas_ref.current ? {x:canvas_ref.current.width, y:canvas_ref.current.height}: {x:1, y:1}
    );


    const handle_canvas_pointer_event = (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.preventDefault();

        const canvasRect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        let x = e.clientX - canvasRect.left;
        let y = e.clientY - canvasRect.top;
        let new_position = {x, y};

        set_mouse_position_screen(new_position);
        set_mouse_position_world(transform.screen_to_world(new_position));
        

        if (e.type === "pointerdown") {
            set_mouse_down(true);
            set_mouse_down_position_screen(new_position);
            set_mouse_down_position_world(transform.screen_to_world(new_position));

            // Handle drag node?
            // TODO: abstract somehow?
            // TODO: handle transforms?
            let result = hit_test_nodes(nodes, mouse_position_screen);
            if (result){
                set_active_item({
                    type:"drag_node",
                    mouse_down_coord:mouse_down_position_world,
                    target_id:result.id
                })
            }else{
                set_active_item({
                    type:"drag_canvas",
                    target_id:null
                })
            }
        }else if(e.type === "pointerup"){
            set_mouse_down(false);
            if(active_item.type==="drag_node"){
                dispatch(actions.graph.offset_node({
                    id:active_item.target_id,
                    offset:Vector2.sub(mouse_position_screen, mouse_down_position_world)
                }))
                set_active_item( {
                    type:"hover_node",
                    target_id:active_item.target_id,
                })
            }else if(active_item.type==="drag_canvas"){
                dispatch(actions.viewport.translate(offset_screen))
                set_active_item({
                    type:"none",
                    target_id:null,
                })
            }else{
                set_active_item({
                    type:"none",
                    target_id:null,
                })
            }
        }else if(e.type === "pointerover"){
            // TODO: pointer over
        }else if(e.type === "pointerout"){
            // TODO: pointer out
        }else{
            console.log(`Pointer event ${e.type} WHAT?`);
        }
    };

    const handle_canvas_pointer_move_event = (e:React.PointerEvent<HTMLCanvasElement>) => {
        e.preventDefault();

        const canvasRect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        let x = e.clientX - canvasRect.left;
        let y = e.clientY - canvasRect.top;
        let new_mouse_position = {x, y};

        set_mouse_position_screen(new_mouse_position);
        set_mouse_position_world(transform.screen_to_world(new_mouse_position));
    }
    const handle_wheel_event = (e:React.WheelEvent<HTMLCanvasElement>)=>{
        if(e.deltaY<0){
            dispatch(actions.viewport.zoom_in_to(mouse_position_world));
        }else if(e.deltaY>0){
            dispatch(actions.viewport.zoom_out_from(mouse_down_position_screen));
        }
    }

    const canvas_resize_callback = useCallback((canvas_host: HTMLDivElement | null) => {
        // const canvas = canvas_ref.current;
        // if(!canvas) return;
        if(canvas_host){
            resize_observer_ref.current = new ResizeObserver(entries => {
                const canvas = canvas_ref.current;
                if(!canvas) return; 
                if(entries?.[0]){
                    canvas.width  = entries[0].contentRect.width;
                    canvas.height = entries[0].contentRect.height;
                    // console.log(`Setting Canvas size to ${entries[0].contentRect.width.toFixed(3)}, ${entries[0].contentRect.height.toFixed(3)}`)
                }
                
                set_canvas_resize_counter(i => i + 1)
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
    }, [set_canvas_resize_counter]);

    // CANVAS RENDER
    if (canvas_ref.current) {
        const canvas = canvas_ref.current;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //let transform = new ViewportTransform(viewport.zoom, viewport.midpoint, {x:ctx.canvas.width, y:ctx.canvas.height});

        // DRAW GRID
        draw_grid(
            ctx,
            transform,
            {
                grid_spacing,
                color:"rgb(32, 28, 32)",
                line_width:1,
            }
        )

        // DRAW NODES
        for (const node of nodes) {
            const style = default_style(); 
            let is_active_item = active_item.target_id === node.id;
            let is_active        = is_active_item && active_item.type === "hover_node";
            let is_being_dragged = is_active_item && active_item.type === "drag_node";
            // todo: must record mouse position in world coordinates at mouse_down to avoid nonsense if
            // zooming while dragging at the same time


            if (is_active) {
                style.body.backgroundColor = style.body.highlight;
                style.border.color = style.body.highlight;
            }
            let node_position = node.position;
            if(is_being_dragged){
                node_position = Vector2.add(
                    node.position,
                    Vector2.sub(
                        transform.screen_to_world(mouse_position_screen),
                        mouse_down_position_world
                    )
                );
            }
            node_position = transform.world_to_screen(node_position)
            draw_node_body_and_title_bar(
                ctx,
                node_position,
                Vector2.scale(node.size, viewport.zoom),
                node.title,
                style
            )

        }
    }

    return <div className="n-canvas-root">
        <div className="n-canvas-controls">
            <button onClick={()=>dispatch(ActionCreators.undo())}>Undo</button>
            <button onClick={()=>dispatch(ActionCreators.redo())}>Redo</button>
            <button onClick={() => {
                const newNode: GraphNode = {
                    id: `node-${nodes.length + 1}`,
                    title: 'New Node',
                    position: mouse_position_screen,
                    size: { x: 150, y: 50 },
                    components: []
                }; // Example structure
                dispatch(actions.graph.add_node(newNode));
            }}>Add Node</button>
            
            <button onClick={()=>dispatch(actions.viewport.reset())}>Reset</button>
            <MouseToolModeControls mouse_tool_mode={mouse_tool_mode} set_mouse_tool_mode={set_mouse_tool_mode}/>
            <div className="grid grid-cols-2 gap-2 text-[0.8em] font-mono">
                <div>Mouse Screen      </div><div>{Vector2.toString(mouse_position_screen      )}</div>
                <div>Mouse Down Screen </div><div>{Vector2.toString(mouse_down_position_screen )}</div>
                <div>Mouse World       </div><div>{Vector2.toString(mouse_position_world       )}</div>
                <div>Mouse Down World  </div><div>{Vector2.toString(mouse_down_position_world  )}</div>
                <div>Mouse Down        </div><div>{mouse_down.toString()                        }</div>
            </div>
            <div>{nodes.map(item => `<Node:${item.id} ${item.title} ...>`).join("\n")}</div>
        </div>
        <div
            className="n-canvas-canvas-host"
            ref={canvas_resize_callback}
            style={{fontSize:`${viewport.zoom}em`}}
        >
            <canvas
                className="n-canvas-canvas rounded-md bg-level-1 w-full h-full select-none"
                ref={canvas_ref}
                onPointerMove={handle_canvas_pointer_move_event}
                onPointerDown={handle_canvas_pointer_event}
                onPointerUp={handle_canvas_pointer_event}
                onPointerOut={handle_canvas_pointer_event}
                onPointerOver={handle_canvas_pointer_event}
                onWheel={handle_wheel_event}
            />
            {/* {
                nodes.map(node=>{
                    let style = default_style();
                    let is_active_item   = active_item.target_id === node.id;
                    let is_active        = is_active_item && active_item.type === "hover_node";
                    let is_being_dragged = is_active_item && active_item.type === "drag_node";
                    let node_position = node.position;
                    if(is_being_dragged){
                        node_position = Vector2.add(
                            node.position,
                            Vector2.sub(
                                mouse_position_screen,
                                mouse_down_position_world
                            )
                        );
                    }
                    return <div
                        style={{
                            position: "absolute",
                            left: node_position.x + "px",
                            top : node_position.y+style.title.height + "px",
                            //backgroundColor:"#FF00FF99",
                            width:node.size.x+"px",
                            height:node.size.y-style.title.height+"px",
                            padding:"5px",
                        }}
                        key={node.id}
                    >node.title</div>
                })
            } */}
        </div>
    </div>
}
