import "./MouseIcon.css";
export const MouseIcon: React.FC<{ button?: "left" | "middle" | "right" | "scroll" }> = ({ button }) => {
    return <div className="inline-block align-middle rounded-[30%] border border-primary-1 bg-level-0 w-[1.4em] h-[1.5em] overflow-hidden">
        <div className="relative grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_1.5fr] h-full w-full">
            <div style={{ backgroundColor: button === "left" ? "#BBB" : undefined }}></div>
            <div className="w-[1px] bg-primary-1"></div>
            <div style={{ backgroundColor: button === "right" ? "#BBB" : undefined }}></div>
            <div className="col-span-3 border-t"></div>
            <div className={`
                absolute
                top-[40%]
                left-[50%]
                translate-x-[-50%]
                translate-y-[-50%]
                border
                rounded-[0.2em]
                w-[0.4em]
                h-[0.6em]
                bg-level-0
                ${button === "scroll" ? "scrolling-gradient" : ""}
            `} style={{ backgroundColor: button === "middle" ? "#BBB" : undefined }}></div>
        </div>
    </div>
}