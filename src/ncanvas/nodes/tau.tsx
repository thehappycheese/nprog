import React from "react";
import { GraphNode } from "../graph_types.tsx";
import { Vector2 } from "../Vector2.tsx";



export function NodeBody(props: {
    children: React.ReactNode;
    screen_position: Vector2.Vector2;
    screen_size: Vector2.Vector2;
    screen_padding: Vector2.Vector2;
}) {
    return <div
        style={{
            display: (props.screen_size.x < 50 || props.screen_size.y < 50) ? "none" : "block",
            position: "absolute",
            left: 0,
            top: 0,
            width: (props.screen_size.x+4) + "px",
            //height: props.screen_size.y + "px",
            padding: `${props.screen_padding.x}px ${props.screen_padding.y}px`,
            //pointerEvents: "none",
            transform: `translate(${props.screen_position.x-2}px, ${props.screen_position.y}px)`,
            border: "2px solid rgb(117, 102, 98)",
            backgroundColor:"#333",
            borderTop:"none",
            borderRadius: "0 0 5px 5px",
        }}
    >
        {props.children}
    </div>
}

export function Handle() {
    const handle_size = 10;
    return <div
        style={{
            width: `${handle_size}px`,
            height: `${handle_size}px`,
            borderRadius: `${handle_size/2}px`,
            backgroundColor: "white",
            position: "absolute",
            left: `${-handle_size/2}px`,
            top:`calc(50% - ${handle_size/2}px)`,
        }}
    ></div>
}





export function NodeTau(props: {
    node: GraphNode;
    screen_position: Vector2.Vector2;
    screen_size: Vector2.Vector2;
    screen_padding: Vector2.Vector2;

}) {
    return <NodeBody
        screen_padding={props.screen_padding}
        screen_size={props.screen_size}
        screen_position={props.screen_position}
    >
        <div
            className="grid grid-cols-[auto_1fr_auto] gap-3 pt-2 pb-2 ml-[-2px] mr-[-2px]"
        >
            <div className="relative"><Handle/></div>
            <div>Tau</div>
            <div
                className="relative"
            ><Handle /></div>
        </div>
        <div
            className="grid grid-cols-[auto_1fr_auto] gap-3"
        >
            <div className="relative"><Handle/></div>
            <div>Tau</div>
            <div
                className="relative"
            ><Handle /></div>
        </div>
    </NodeBody>
}

