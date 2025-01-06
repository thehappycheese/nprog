import { ForwardedRef, MutableRefObject } from "react";

export function ensureMutableRef<T>(ref: ForwardedRef<T>): asserts ref is MutableRefObject<T> {
    if (!ref ||
        typeof ref !== 'object' ||
        !('current' in ref)) {
        throw new Error("Ref must be a MutableRefObject<T>.");
    }
}
