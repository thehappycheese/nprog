import { forwardRef, ForwardedRef } from "react";


export const Handle = forwardRef((props: {
    background_color: string;
}, ref: ForwardedRef<HTMLDivElement>) => {
    const handle_size = 10;
    return <div
        ref={ref}
        style={{
            width: `${handle_size}px`,
            height: `${handle_size}px`,
            borderRadius: `${handle_size / 2}px`,
            backgroundColor: props.background_color,
            position: "absolute",
            left: `${-handle_size / 2}px`,
            top: `calc(50% - ${handle_size / 2}px)`,
        }}
    ></div>;
});
