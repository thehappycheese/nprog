import { useDispatch, useSelector } from "react-redux";
import { actions, MouseToolMode } from "../store/mouse_tool_mode";
import { RootState } from "../store";

export function MouseToolModeControls() {
    const mouse_tool_mode = useSelector<RootState, MouseToolMode>(state => state.mouse_tool_mode);
    const dispatch = useDispatch();

    return <div>
        <button onClick={() => dispatch(actions.setMouseToolModeSelect())}>Select</button>
        <button onClick={() => dispatch(actions.setMouseToolModeAddNode())}>Add</button>
        <button onClick={() => dispatch(actions.setMouseToolModeDeleteNode())}>Remove</button>
        <div>{mouse_tool_mode.type}</div>
    </div>
}