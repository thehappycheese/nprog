import {
    //ReactNode,
    useCallback, useRef, useState
} from "react";
import { GraphNode } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { addNode } from "./store/graph_slice";
import { ActionCreators } from "redux-undo";



function render(
    canvas: HTMLCanvasElement,
    nodes: Array<GraphNode>
) {
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (const node of nodes) {
        ctx.fillRect(
            node.position.x,
            node.position.y,
            30,
            30
        )
    }
}

export function NCanvas() {//props:{children:ReactNode}){



    const canvas_ref = useRef<HTMLCanvasElement | null>(null);
    const resize_observer_ref = useRef<ResizeObserver | null>(null);
    const [dirty_counter, set_dirty_counter] = useState(0);



    const dispatch = useDispatch();
    const nodes = useSelector((state: RootState) => state.present.nodes);

    const handleAddNode = () => {
        const newNode: GraphNode = {
            id: `node-${nodes.length + 1}`,
            title: 'New Node',
            position:{x:0,y:0},
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
        console.log(`Pointer event ${e.type}`);
    }

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
        render(canvas_ref.current, nodes)
    }

    return <div className="n-canvas-root">
        <div>
            <button onClick={handleUndo}>Undo</button>
            <button onClick={handleRedo}>Redo</button>
            <br />
            <button onClick={handleAddNode}>Add Node</button>
        </div>
        <canvas
            style={{ backgroundColor: "grey", userSelect: "none" }}
            ref={canvas_resize_callback}
            onPointerMove={handle_canvas_pointer_event}
            onPointerDown={handle_canvas_pointer_event}
            onPointerUp={handle_canvas_pointer_event}
            onPointerOut={handle_canvas_pointer_event}
        />
        <div>{nodes.map(item=>item.toString())}</div>
        <div>{dirty_counter}</div>
    </div>
}