
export type NodeRenderStyle = {
    fontSize: number;
    fontFamily: string;
    title: {
        backgroundColor: string;
        height: number;
    };
    body: {
        backgroundColor: string;
        highlight: string;
    };
    border: {
        color: string;
        thickness: number;
    };
    radius: number;
    padding: number;
}

export const default_node_style: () => NodeRenderStyle = () => ({
    fontSize: 16,
    fontFamily: "sans-serif",
    title: {
        backgroundColor: "#be2840",
        height: 25,
    },
    body: {
        backgroundColor: "#333",
        highlight: "#555",
    },
    border: {
        color: "rgb(117, 102, 98)",
        thickness: 2,
    },
    radius: 5,
    padding: 2,
});
