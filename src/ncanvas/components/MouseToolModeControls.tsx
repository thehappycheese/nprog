export interface MouseToolMode {
    type: "select" | "add" | "delete"
}

export function MouseToolModeControls(props:{ mouse_tool_mode:MouseToolMode, set_mouse_tool_mode:(new_mode:MouseToolMode)=>void }) {
    return <div className="grid grid-cols-3 gap-2">
        <button style={{backgroundColor: props.mouse_tool_mode.type!=="select" ? "grey" : "" }} onClick={() => props.set_mouse_tool_mode({type:"select"})}>Select</button>
        <button style={{backgroundColor: props.mouse_tool_mode.type!=="add"    ? "grey" : "" }} onClick={() => props.set_mouse_tool_mode({type:"add"})}>Add</button>
        <button style={{backgroundColor: props.mouse_tool_mode.type!=="delete" ? "grey" : "" }} onClick={() => props.set_mouse_tool_mode({type:"delete"})}>Remove</button>
    </div>
}