import { ForwardedRef, forwardRef } from "react";
import { GraphNode } from "../graph_types.tsx";
import { Vector2 } from "../Vector2.tsx";
import { Handle, NodeBody } from "./basics.tsx";


// // Utility function
// export const assign_forward_ref = <T,Q>(
//     forward_ref:ForwardedRef<T>,
//     local_ref: Q | null,
//     get_value: (ref:React.MutableRefObject<Q|null>) => T | null
// ) => {
//     if (local_ref===null) return;

//     const value = get_value(local_ref);
//     if (typeof forward_ref === "function") {
//         forward_ref(value);
//     } else if (forward_ref && typeof forward_ref === "object") {
//         forward_ref.current = value;
//     }
// }

export const NodeOutput = forwardRef(
    (
        props: {
            node: GraphNode;
            screen_position: Vector2.Vector2;
            screen_size: Vector2.Vector2;
            screen_padding: Vector2.Vector2;
            font_scale:number;
        },
        ref:ForwardedRef<Record<string,Record<string, HTMLDivElement>>>
    ) => {
    
    return <NodeBody
        screen_padding={props.screen_padding}
        screen_size={props.screen_size}
        screen_position={props.screen_position}
        font_scale={props.font_scale}
    >
        <div
            className="grid grid-cols-[auto_1fr_auto] gap-3 pt-2 pb-2 ml-[-2px] mr-[-2px]"
        >
            <div className="relative">
                <Handle
                    background_color="green"
                    // ref={ r=> {
                    //     if (r===null) return;
                    //     if (ref===null) return;
                    //     if (typeof ref === "function") {
                    //         ref
                    //     }else{
                    //         ref.current = ref.current ?? {}
                    //         ref.current = {
                    //             ...ref.current,
                    //             [props.node.id]:{
                    //                 ...(ref.current[props.node.id] ?? {}),
                    //                 HANDLE1:r
                    //             }
                    //         }
                    //     }
                    // }}
                    ref = {
                        f(ref,props.node.id, "H1")
                    }
            /></div>
            <div className="text-end">Output</div>
            <div className="relative"></div>
        </div>
    </NodeBody>
});


const f = (
    outer_ref:ForwardedRef<Record<string,Record<string, HTMLDivElement>>>,
    node_id:string,
    handel_id:string,
)=>(handel_div:HTMLDivElement|null)=>{
    if (outer_ref===null) return;

    if (typeof outer_ref === "function") {
        // TODO: unhandled
        throw new Error("Not sure how to handel this callback ref")
    }else{
        outer_ref.current = outer_ref.current ?? {}
        outer_ref.current = {
            ...outer_ref.current,
            [node_id]:{
                ...(outer_ref.current[node_id] ?? {}),
                ...(handel_div?{[handel_id]:handel_div}:{})
            }
        }
    }
}