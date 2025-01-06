import { forwardRef, ForwardedRef } from "react";
import { HandelReference, HandelType } from "../../graph_types/HandelReference.ts";
import { PointerHandelHandler } from "./PointerHandelHandler.tsx";
import { HandleRefRegistry } from "./HandleRefRegistry.tsx";
import { ensureMutableRef } from "../ensureMutableRef.tsx";

export const Handle = forwardRef((props: {
    background_color: string;
    handel_type: HandelType,
    handel_reference: HandelReference;
    node_id:string,
    handel_id:string,
    onPointerDown: PointerHandelHandler;
    onPointerUp: PointerHandelHandler;
}, ref: ForwardedRef<HandleRefRegistry>) => {
    let hit_box_padding = 0.4;
    let width = 0.8;
    let height = 0.8;
    return <div
        ref={handel_div=>{
            if(handel_div===null) return;
            ensureMutableRef(ref)
            ref.current[props.node_id] = ref.current[props.node_id] ?? {
                handles: {[props.handel_id]:handel_div},
                node_div: null 
            };
            ref.current[props.node_id].handles[props.handel_id] = handel_div;
        }}
        style={{
            padding: `${hit_box_padding}rem`,
            borderRadius: `${hit_box_padding}rem`,
            marginLeft: `${-hit_box_padding}rem`,
            marginTop: `${-hit_box_padding}rem`,
            left: `${-0.5 * width}rem`,
            top: `calc(50% - 0.5 * ${height}rem)`,
        }}
        className="absolute group"
        onPointerDown={e => {
            props.onPointerDown(e, props.handel_reference, props.handel_type);
        }}
        onPointerUp={e => {
            props.onPointerUp(e, props.handel_reference, props.handel_type);
        }}
    >
        <div
            style={{
                width: `${width}rem`,
                height: `${height}rem`,
                borderRadius: `${Math.min(width, height) / 2}rem`,
            }}
            className="inner-handle bg-level-1 border-[2px] border-level-2 group-hover:bg-white"
        ></div>
    </div>;
});
