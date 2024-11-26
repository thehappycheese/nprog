import { forwardRef, ForwardedRef, PointerEvent } from "react";
import { HandelReference } from "../../graph_types";

export type PointerHandelHandler = (e: PointerEvent<HTMLDivElement>, handel_reference: HandelReference) => void;

export const Handle = forwardRef((props: {
    background_color: string;
    handel_reference: HandelReference;
    onPointerDown: PointerHandelHandler;
    onPointerUp: PointerHandelHandler;
    tall?: boolean;
}, ref: ForwardedRef<HTMLDivElement>) => {
    let hit_box_padding = 0.4;
    let width = 0.8;
    let height = width * (props.tall ? 2.5 : 1);
    return <div
        ref={ref}
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
            props.onPointerDown(e, props.handel_reference)
        }}
        onPointerUp={e => {
            props.onPointerUp(e, props.handel_reference)
        }}
    >
        <div
            style={{
                width: `${width}rem`,
                height: `${height}rem`,
                borderRadius: `${Math.min(width, height) / 2}rem`,
            }}
            className="inner-handle bg-level-1 border-[2px] border-level-2 group-hover:bg-white" ></div>
    </div>;
});
