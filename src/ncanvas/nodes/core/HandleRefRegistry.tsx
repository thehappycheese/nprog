
export type HandleRefRegistry = {
    [node_id: string]: {
        handles:{
            [handel_id: string]: HTMLDivElement;
        }
        node_div:HTMLDivElement
    };
};
