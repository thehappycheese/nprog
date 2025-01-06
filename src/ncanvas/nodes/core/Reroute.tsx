import { ForwardedRef, forwardRef, PointerEventHandler } from "react";
import { PointerHandelHandler } from "./PointerHandelHandler";
import { HandleRefRegistry } from "./HandleRefRegistry";
import { Handle } from "./Handel";
import { HandelType } from "../../graph_types/HandelReference";
import { Vector2 } from "../../Vector2";
import { ensureMutableRef } from "../ensureMutableRef";

// TODO: ok so this neeeeds to use NodeBody, and node body needs to get split up
//       and also this neeeeds to become a registered node type. 
//       unless the handlers for clicking implemented in NCanvas neeeed to be significantly different... and i dont think they diddly do.
export const Reroute = forwardRef((
        props: {
            node_id:string,
            onPointerDownHandle:PointerHandelHandler,
            onPointerUpHandle:PointerHandelHandler,
            onClick: PointerEventHandler<HTMLDivElement>
            onPointerDown: PointerEventHandler<HTMLDivElement>
            screen_position:Vector2
        },
        ref: ForwardedRef<HandleRefRegistry>
    ) => {
    return <div
            style={{
                transform: `translate(${props.screen_position.x}px, ${props.screen_position.y}px)`,
            }}
            className="absolute top-0 left-0"
            onPointerDown={props.onPointerDown}
            onClick={props.onClick}
            ref={node_div => {
                if(node_div===null) return;
                ensureMutableRef(ref);
                ref.current[props.node_id] = ref.current[props.node_id] ?? { handles: {}, node_div };
                ref.current[props.node_id].node_div = node_div;
            }}
        >
        <Handle
            background_color="green"
            node_id={props.node_id}
            handel_reference={{node_id:props.node_id, handel_id:"R0"}}
            handel_id="R0"
            handel_type={HandelType.reroute}
            onPointerDown={props.onPointerDownHandle}
            onPointerUp={props.onPointerUpHandle}
            ref={ref}
        />
    </div>;
});