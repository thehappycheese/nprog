export const default_style = () => ({
    fontSize:15,
    fontFamily:"sans-serif",
    title:{
        backgroundColor:"#be2840",
        height:19,
    },
    body:{
        backgroundColor:"#333",
        highlight:"#555",
    },
    border:{
        color:"rgb(117, 102, 98)",
        thickness:2,
    },
    radius:5,
    padding:2,
});
export type NodeRenderStyle = ReturnType<typeof default_style>;