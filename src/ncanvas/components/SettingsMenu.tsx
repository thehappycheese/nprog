import React, { useState } from "react";

interface SettingsMenuProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ children }) => {
    let [is_open, set_is_open] = useState(false);
    return <>
        <button
            onClick={() => set_is_open(!is_open)}
        >Settings</button>
        <dialog
            // className="fixed inset-0 z-50 w-full h-full bg-level-0 bg-opacity-90 flex justify-center items-center"
            className="fixed inset-0 z-50 w-full h-full bg-level-0 bg-opacity-90 flex justify-center items-center"
            open={is_open}
        // {...(is_open ? { open: true } : {})}
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
                    gap-3
                `}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="bg-brand-accent p-3 text-lg">
                    Settings
                    <button
                        className="absolute top-0 right-0 p-2 bg-none"
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

export default SettingsMenu;