import React, { useState } from "react";

interface AccordionItemProps {
    title: string;
    content: React.ReactNode;
    collapsed: boolean;
    onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, collapsed, onToggle }) => <div>
    <div
        onClick={onToggle}
        className="bg-brand-accent max-h-[80vh] overflow-y-auto p-1 cursor-pointer rounded-md hover:mix-blend-plus-lighter select-none"
        style={{
            borderEndEndRadius: collapsed ? undefined : 0,
            borderEndStartRadius: collapsed ? undefined : 0,
        }}
    >
        {title}
    </div>
    {!collapsed && <div className="bg-level-0 rounded-ee-md rounded-es-md p-2">
        {content}
    </div>}
</div>;

interface AccordionProps {
    items: Pick<AccordionItemProps, "content" | "title">[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
    const [collapsedStates, setCollapsedStates] = useState<boolean[]>(
        items.map(() => true) // Initialize all items as collapsed
    );

    const toggleItem = (index: number) => {
        setCollapsedStates((prev) =>
            prev.map((collapsed, i) => i !== index || !collapsed)
        );
    };

    return (
        <div className="grid gap-2">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    content={item.content}
                    collapsed={collapsedStates[index]}
                    onToggle={() => toggleItem(index)}
                />
            ))}
        </div>
    );
};
