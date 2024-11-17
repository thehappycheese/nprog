import { useState } from "react";

export const useConstrainedNumber = (
    initialValue: number,
    range: [number, number]
) => {
    const [lower_limit, uppe_limit] = range;
    const [state, set_state] = useState(initialValue);

    const set_state_wrapper = (newValue: number | ((currentValue: number) => number)) => {
        set_state((currentValue) => {
            const updatedValue = typeof newValue === "function"
                ? (newValue as (current: number) => number)(currentValue)
                : newValue;
            return Math.max(lower_limit, Math.min(uppe_limit, updatedValue));
        });
    };

    return [state, set_state_wrapper] as [number, typeof set_state_wrapper];
};
