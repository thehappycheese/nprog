import React, { useState } from "react";

export interface ModalDialogProps {
    title: string;
    children: React.ReactNode;
}

const ModalDialog: React.FC<ModalDialogProps> = ({ title, children }) => {
    let [is_open, set_is_open] = useState(false);
    return <>
        <button
            onClick={() => set_is_open(!is_open)}
        >{title}</button>
        <dialog
            className="fixed inset-0 z-50 w-full h-full bg-level-0 bg-opacity-90 flex justify-center items-center select-none"
            open={is_open}
            onPointerUp={e => {
                if (e.currentTarget === e.target) {
                    set_is_open(false)
                }
            }}
        >
            <div
                className={`
                    bg-level-1
                    rounded-lg
                    shadow-lg
                    overflow-hidden
                    w-4/5
                    max-w-lg
                    relative
                    text-primary-1
                    grid
                    grid-rows-[auto_1fr]
                    select-text
                `}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="bg-brand-accent text-lg grid grid-cols-[1fr_2em]">
                    <div
                        className="align-center p-2 select-none"
                    >{title}</div>
                    <button
                        aria-label="Close Settings"
                        onClick={() => set_is_open(false)}
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </dialog>
    </>;
};

export default ModalDialog;
