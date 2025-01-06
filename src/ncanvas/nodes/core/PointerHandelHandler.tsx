import { PointerEvent } from "react";
import { HandelReference } from "../../graph_types";
import { HandelType } from "../../graph_types/HandelReference";


export type PointerHandelHandler = (
    event: PointerEvent<HTMLDivElement>,
    handel_reference: HandelReference,
    handel_type: HandelType
) => void;
