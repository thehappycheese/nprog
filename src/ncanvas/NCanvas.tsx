import { useCallback, useRef, useState } from "react";
import { GraphNode } from "./graph_types";
import { useDispatch, useSelector } from "react-redux";
import { RootState, actions } from "./store";
import { ActionCreators } from "redux-undo";
import * as Vector2 from "./Vector2";
import { MouseToolModeControls } from "./components/MouseToolModeControls";
import { hit_test_nodes } from "./util";
import { default_style } from "./draw/style";
import { draw_node_body_and_title_bar } from "./draw/node_body_and_title_bar";


type ActiveItem = {
    type: "none",
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

    // LOCAL STATE OBJECTS
    const [canvas_resize_counter, set_canvas_resize_counter] = useState(Number.MIN_SAFE_INTEGER);

    const [mouse_position, set_mouse_position] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_down_position, set_mouse_position_mouse_down] = useState<Vector2.Vector2>({ x: 0, y: 0 });
    const [mouse_down, set_mouse_down] = useState(false);
    const [mouse_just_down, set_mouse_just_down] = useState(false);

    const [active_item, set_active_item] = useState<ActiveItem>({ type: "none" , target_id:null});
    const [selected_items, set_selected_items] = useState<
        Array<{
            type:"node",
            id:string,
        }>
    >([
        {
            type:"node",
            id:"node-0",
        }
    ])

    // DOM REFS
    const canvas_ref = useRef<HTMLCanvasElement | null>(null);
    const canvas_host_ref = useRef<HTMLDivElement | null>(null);
    const resize_observer_ref = useRef<ResizeObserver | null>(null);

    const handleAddNode = () => {
        const newNode: GraphNode = {
            id: `node-${nodes.length + 1}`,
            title: 'New Node',
            position: mouse_position,
            size: { x: 150, y: 50 },
            components: []
        }; // Example structure
        dispatch(actions.graph.add_node(newNode));
    };

    const handleUndo = () => {
        dispatch(ActionCreators.undo());
    };

    const handleRedo = () => {
        dispatch(ActionCreators.redo());
    };

    const handleClear = () => {
        dispatch(ActionCreators.clearHistory());
    };

    const handle_canvas_pointer_event = (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.preventDefault();

        const canvasRect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        let x = e.clientX - canvasRect.left;
        let y = e.clientY - canvasRect.top;
        let new_position = {x, y};

        set_mouse_position(new_position);
        console.log(`Pointer event ${e.type}`);

        if (e.type === "pointerdown") {
            set_mouse_just_down(true);
            set_mouse_down(true);
            set_mouse_position_mouse_down(new_position);

            // Handle drag node?
            // TODO: abstract somehow? 
            let result = hit_test_nodes(nodes, mouse_position);
            if (result){
                set_active_item({
                    type:"drag_node",
                    mouse_down_coord:mouse_down_position,
                    target_id:result.id
                })
            }

            
        } else {
            set_mouse_just_down(false);
        }
        if(e.type === "pointerup"){
            set_mouse_down(false);
            if(active_item.type==="drag_node"){
                dispatch(actions.graph.offset_node({
                    id:active_item.target_id,
                    offset:Vector2.sub(mouse_position, mouse_down_position)
                }))
                set_active_item( {
                    type:"hover_node",
                    target_id:active_item.target_id,
                })
            }else{
                set_active_item({
                    type:"none",
                    target_id:null,
                })
            }
        }

    };

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
        for (const node of nodes) {
            const style = default_style(); 
            let is_active_item = active_item.target_id === node.id;
            let is_active        = is_active_item && active_item.type === "hover_node";
            let is_being_dragged = is_active_item && active_item.type === "drag_node";


            if (is_active) {
                style.body.backgroundColor = style.body.highlight;
                style.border.color = style.body.highlight;
            }
            let node_position = node.position;
            if(is_being_dragged){
                node_position = Vector2.add(
                    node.position,
                    Vector2.sub(
                        mouse_position,
                        mouse_down_position
                    )
                );
            }
            draw_node_body_and_title_bar(
                ctx,
                node_position,
                node.size,
                node.title,
                style
            )



        }
    }

    return <div className="n-canvas-root">
        <div className="n-canvas-controls">
            <button onClick={handleUndo}>Undo</button>
            <button onClick={handleRedo}>Redo</button>
            <button onClick={handleClear}>Clear</button>
            <button onClick={handleAddNode}>Add Node</button>
            <div>{nodes.map(item => `<Node:${item.id} ${item.title} ...>`)}</div>
            <div>Mouse Position {Vector2.toString(mouse_position)}</div>
            <div>Mouse Down: {mouse_down.toString()}</div>
            <div>Mouse Down Position {Vector2.toString(mouse_down_position)}</div>
            <div>Mouse Just Down: {mouse_just_down.toString()}</div>
            <MouseToolModeControls />
        </div>
        <div
            className="n-canvas-canvas-host"
            ref={canvas_resize_callback}
        >
            <canvas
                className="n-canvas-canvas rounded-md"
                ref={canvas_ref}
                onPointerMove={handle_canvas_pointer_event}
                onPointerDown={handle_canvas_pointer_event}
                onPointerUp={handle_canvas_pointer_event}
                onPointerOut={handle_canvas_pointer_event}
            />
            {
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
                                mouse_position,
                                mouse_down_position
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
                            padding:"5px"
                        }}
                        key={node.id}
                    >node.title</div>
                })
            }
        </div>
    </div>
}
