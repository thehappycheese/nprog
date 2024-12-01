import { KeyIcon } from "./KeyIcon"
import ModalDialog from "./ModalDialog"
import { MouseIcon } from "./MouseIcon"

export const HelpControls = () => {
    return <ModalDialog title="Help: Controls">
        <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
                <div>Cut Edges</div><div><KeyIcon>Ctrl</KeyIcon>+<MouseIcon button="right" /> Drag</div>
                <div>Pan</div><div><MouseIcon button="middle" /> Drag</div>
                <div>Move Nodes /<br />Grab Handles to Create Edges</div><div><MouseIcon button="left" /> Drag</div>
                <div>Zoom In / Out</div><div><MouseIcon button="scroll" /> Scroll</div>
                <div>Context Menu /<br/> Add Nodes</div><div><MouseIcon button="right" /> Scroll</div>
            </div>
        </div>
    </ModalDialog>
}