import { forwardRef, ForwardedRef, PointerEvent } from "react";
import { HandelReference, HandelType } from "../../graph_types.ts/HandelReference.ts";

export type PointerHandelHandler = (e: PointerEvent<HTMLDivElement>, handel_reference: HandelReference, handel_type: HandelType) => void;

export const Handle = forwardRef((props: {
    background_color: string;
    handel_type: HandelType,
    handel_reference: HandelReference;
    onPointerDown: PointerHandelHandler;
    onPointerUp: PointerHandelHandler;
}, ref: ForwardedRef<HTMLDivElement>) => {
    let hit_box_padding = 0.4;
    let width = 0.8;
    let height = 0.8;
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
            className="inner-handle bg-level-1 border-[2px] border-level-2 group-hover:bg-white" ></div>
    </div>;
});
