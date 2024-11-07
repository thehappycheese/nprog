import {
    //ReactNode,
    useCallback, useRef, useState
} from "react";
import { GraphEdge, GraphNode, Vector2 } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { addNode } from "./store/graph_slice";
import { ActionCreators } from "redux-undo";
import "./ncanvas.css";


function Vector2_toString(v:Vector2):string{
    return `{${v.x.toFixed(2)}, ${v.y.toFixed(2)}}`
}
function Vector2_add(a:Vector2, b:Vector2):Vector2{
    return {x:a.x+b.x, y:a.y+b.y}
}
function Vector2_sub(a:Vector2, b:Vector2):Vector2{
    return {x:a.x-b.x, y:a.y-b.y}
}
function Vector2_neg(a:Vector2):Vector2{
    return {x:-a.x, y:-a.y}
}
function Vector2_scale(a:Vector2, scalar:number):Vector2{
    return {x:a.x*scalar, y:a.y*scalar}
}
function Vector2_left(a:Vector2):Vector2{
    return {x:-a.y, y:a.x}
}


// interface ActiveItem {
//     type:"Node"|"Edge",
//     id:string,
//     mode:"Hover"|"Drag"
// }
type ActiveItem = {
    type:"hover_node",
    target_id:string
} | {
    type:"hover_edge",
    target_id:string
} | {
    type:"drag_node",
    target_id:string,
    mouse_down_coord:Vector2,
} | {
    type:"drag_edge",
    target_id:string,
    mouse_down_coord:Vector2,
}

interface CanvasState {
    active_item:ActiveItem | null,
    selection:Array<string>,
    mouse_position:Vector2,
    mouse_down_position:Vector2,
}


function render(
    canvas: HTMLCanvasElement,
    nodes: Array<GraphNode>,
    edges:Array<GraphEdge>,
    state: CanvasState,
) {
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (const node of nodes) {
        let node_body_color = "#333";
        if(state.active_item?.type==="hover_node" && state.active_item.target_id==node.id){
            node_body_color = "yellow";
        }
        ctx.fillStyle = node_body_color;
        ctx.fillRect(
            node.position.x,
            node.position.y,
            node.size.x,
            node.size.y
        )
    }
}

export function NCanvas() {//props:{children:ReactNode}){


    const [mouse_position, set_mouse_position] = useState<Vector2>({x:0,y:0});
    const [mouse_down_position, set_mouse_position_mouse_down] = useState<Vector2>({x:0,y:0});
    const canvas_ref                = useRef<HTMLCanvasElement | null>(null);
    const resize_observer_ref       = useRef<ResizeObserver | null>(null);
    const [dirty_counter, set_dirty_counter] = useState(0);



    const dispatch = useDispatch();
    const nodes = useSelector((state: RootState) => state.present.nodes);
    const edges = useSelector((state: RootState) => state.present.edges);

    const handleAddNode = () => {
        const newNode: GraphNode = {
            id: `node-${nodes.length + 1}`,
            title: 'New Node',
            position:{x:0,y:0},
            size:{x:150, y:50},
            components:[]
        }; // Example structure
        dispatch(addNode(newNode));
    };

    const handleUndo = () => {
        dispatch(ActionCreators.undo());
    };

    const handleRedo = () => {
        dispatch(ActionCreators.redo());
    };

    const handle_canvas_pointer_event = (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        
        const canvasRect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        let x = e.clientX - canvasRect.left;
        let y = e.clientY - canvasRect.top;
    
        set_mouse_position( { x, y } );
        console.log(`Pointer event ${e.type}`);

        if(e.type==="pointerdown"){
            set_mouse_position_mouse_down({x, y});
            
        }

    };

    const canvas_resize_callback = useCallback((canvas: HTMLCanvasElement | null) => {
        if (canvas !== null && canvas_ref.current !== null && canvas !== canvas_ref.current) {
            console.log("WTF Why pass different canvas then eh?")
        }
        canvas_ref.current = canvas
        if (canvas) {
            console.log("canvas mounted")
            resize_observer_ref.current = new ResizeObserver(entries => {
                canvas.width = canvas.offsetWidth
                canvas.height = canvas.offsetHeight
                set_dirty_counter(i => i + 1)
            });
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            resize_observer_ref.current.observe(canvas)
        } else {
            canvas_ref.current = null;
            if (resize_observer_ref.current) {
                resize_observer_ref.current.disconnect();
                resize_observer_ref.current = null;
            }
            console.log("canvas unmounted")
        }
    }, [set_dirty_counter]);

    if (canvas_ref.current){
        render(
            canvas_ref.current,
            nodes,
            edges,
            {
                active_item:null,
                selection:[],
                mouse_position,
                mouse_down_position,
            }
        )
    }

    return <div className="n-canvas-root">
        <div className="n-canvas-controls">
            <button onClick={handleUndo}>Undo</button>
            <button onClick={handleRedo}>Redo</button>
            <button onClick={handleAddNode}>Add Node</button>
            <div>{nodes.map(item => `<Node:${item.id} ${item.title} ...>`)}</div>
            <div>{dirty_counter}</div>
            <div>{Vector2_toString(mouse_position)}</div>
            <div>{Vector2_toString(mouse_down_position)}</div>
        </div>
        <div className="n-canvas-canvas-host">
            <canvas
                className="n-canvas-canvas"
                ref={canvas_resize_callback}
                onPointerMove={handle_canvas_pointer_event}
                onPointerDown={handle_canvas_pointer_event}
                onPointerUp={handle_canvas_pointer_event}
                onPointerOut={handle_canvas_pointer_event}
            />
        </div>
    </div>
}
