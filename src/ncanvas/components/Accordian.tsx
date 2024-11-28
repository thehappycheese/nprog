import React, { useState } from "react";

interface AccordionItemProps {
    title: string;
    content: string;
    collapsed: boolean;
    onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, collapsed, onToggle }) => {
    return (
        <div>
            <h3 onClick={onToggle} style={{ cursor: "pointer" }}>
                {title}
            </h3>
            {!collapsed && <p>{content}</p>}
        </div>
    );
};

interface AccordionProps {
    items: { title: string; content: string }[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
    const [collapsedStates, setCollapsedStates] = useState<boolean[]>(
        items.map(() => true) // Initialize all items as collapsed
    );

    const toggleItem = (index: number) => {
        setCollapsedStates((prev) =>
            prev.map((collapsed, i) => (i === index ? !collapsed : collapsed))
        );
    };

    return (
        <div>
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