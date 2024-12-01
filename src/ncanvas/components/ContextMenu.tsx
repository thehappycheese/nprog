import { forwardRef, useState } from "react"
import { Vector2 } from "../Vector2"

export type ContextMenuRef = {
    open_at: (position: Vector2.Vector2) => void;
}

export const ContextMenu: React.ForwardRefExoticComponent<{
    children: React.ReactNode;
} & React.RefAttributes<ContextMenuRef>> = forwardRef(({ children }, ref) => {
    const [is_open, set_open] = useState(false);
    const [position, set_position] = useState<Vector2.Vector2>({ x: 0, y: 0 })

    if (typeof ref === "function") {
        throw new Error("don't know how to handle yet...")
    } else if (ref !== null) {
        //ref(ref => ref.current = { x: "hey" });
        ref.current = {
            open_at: (position: Vector2.Vector2) => {
                console.log("eh??", is_open, position);
                set_open(true)
                set_position(position)
            }
        }
    }

    return <dialog
        className="fixed inset-0 z-50 w-full h-full bg-level--1 bg-opacity-10 select-none text-primary-1"
        onPointerDown={e => e.target === e.currentTarget && set_open(false)}
        onContextMenu={e => e.preventDefault()}
        open={is_open}
    >
        <div
            className="fixed bg-level-0 p-3 border-2 border-brand-accent rounded-md shadow-lg overflow-hidden"
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`
            }}
        >
            {children}
        </div>
    </dialog>
});