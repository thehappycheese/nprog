import { HandleRefRegistry } from "../nodes/core/Handel";
import { NodeProps } from "../nodes/core/NodeProps";
import { NodeAdd } from "../nodes/NodeAdd";
import { NodeOutput } from "../nodes/NodeOutput";
import { NodeTau } from "../nodes/NodeTau";
import { NodeValue } from "../nodes/NodeValue";

export type RegisteredNodeType = "tau" | "output" | "add" | "value";

export const NodeRegistry: Record<
    RegisteredNodeType,
    React.ForwardRefExoticComponent<
        & NodeProps<any>
        & React.RefAttributes<HandleRefRegistry>
    >
> = {
    "tau": NodeTau,
    "output": NodeOutput,
    "add": NodeAdd,
    "value": NodeValue,
};
