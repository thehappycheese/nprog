
import "./NJson.css";


// TODO: the depth parameter on almost all the functions below is unused/redundant.

const intersperse = <T, U>(value: (index: number) => T, array: U[]) => array.flatMap((item, index, arr) =>
    index < arr.length - 1 ? [item, value(index)] : [item]
);


const short_num_string = (num: number) => {
    let a = num.toString();
    let b = num.toFixed(3)
    if (a.length < b.length) {
        return a;
    } else {
        return b;
    }
}


interface RenderType<T> {
    value: T,
    postfix?: React.ReactNode
    depth: number;
}

const JsonString: React.FC<RenderType<string>> = ({ value, postfix, depth }) =>
    <span className="n-json-string" style={{ marginLeft: `${depth}em` }}>
        {[`"${value}"`, postfix]}
    </span>;

const JsonBoolean: React.FC<RenderType<boolean>> = ({ value, postfix, depth }) =>
    <span className="n-json-boolean" style={{ marginLeft: `${depth}em` }}>
        {[`"${value}"`, postfix]}
    </span>;

const JsonNumber: React.FC<RenderType<number>> = ({ value, postfix, depth }) =>
    <span className="n-json-number" style={{ marginLeft: `${depth}em` }}>
        {[short_num_string(value), postfix]}
    </span>;

const JsonNull: React.FC<RenderType<null>> = ({ postfix, depth }) =>
    <span className="n-json-null" style={{ marginLeft: `${depth}em` }}>null{postfix}</span>;

const JsonUnknown: React.FC<RenderType<string>> = ({ value, postfix, depth }) =>
    <span className="n-json-null" style={{ marginLeft: `${depth}em` }}>
        {value}{postfix}
    </span>;

const JsonArray: React.FC<RenderType<any[]>> = ({ value, postfix }) => <>
    <span key="a1" className="n-json-paren">{"["}<br /></span>
    {
        value.map((value, index) =>
            <div key={"arr-"+index} style={{ marginLeft: `${1}em` }}>
                <JsonInner
                    key={"array-inner-"+index}
                    value={value}
                    postfix={<><span className="n-json-delim"  key={"inner-post-s-"+index}>,</span><br key={"inner-post-b-"+index}/></>}
                    depth={1}
                />
            </div>
        )
    }
    <span key="a2" className="n-json-paren">{"]"}{postfix}</span>
</>;

const JsonObject: React.FC<RenderType<object>> = ({ value, postfix }) => {
    let entries = Object.entries(value).map(
        ([key, value]) => [key, (typeof value === "number") ? short_num_string(value) : value]
    );

    if (entries.length < 5) {
        if (entries.every(([_, b]) => ["number", "boolean", "string"].includes(typeof b) || b === null || b === "undefined")) {
            if (JSON.stringify(Object.fromEntries(entries)).length < 40) {
                // MARK: Short Object
                return <>
                    <span className="n-json-paren">{"{"}</span>
                    {
                        intersperse(
                            key => <span key={key + entries.length} className="n-json-delim">,&nbsp;</span>,
                            entries.map(([key, value], index) =>
                                <span key={"outer-" + index} >
                                    <span className="n-json-object-key">{key}</span>
                                    <span className="n-json-delim">:&nbsp;</span>
                                    <JsonInner key={"short-object-inner-" + index} value={value} depth={0} />
                                </span>
                            )
                        )
                    }
                    <span className="n-json-paren">{"}"}{postfix}</span>
                </>

            }
        }
    }
    // MARK: Long Object
    return <>
        <span className="n-json-paren">{"{"}</span>
        {
            entries.map(([key, value], index) =>
                <div key={"outer-" + index} style={{ marginLeft: `${1}em` }}>
                    <span className="n-json-object-key">{key}</span>
                    <span className="n-json-delim">:&nbsp;</span>
                    <JsonInner key={"long-object-inner-" + index} value={value} postfix={<span className="n-json-delim" key={"inner-post-"+index}>,</span>} depth={0} />
                </div>
            )
        }
        <div className="n-json-paren">{"}"}{postfix}</div>
    </>
};


export const JsonInner: React.FC<RenderType<any> & {key?:string}> = ({ value, postfix, depth, key}) => {
    switch (typeof value) {
        case "number":
            return <JsonNumber value={value} depth={depth} postfix={postfix} key={key} />
        case "boolean":
            return <JsonBoolean value={value} depth={depth} postfix={postfix} key={key} />
        case "string":
            return <JsonString value={value} depth={depth} postfix={postfix} key={key} />
        case "object":
            if (Array.isArray(value)) {
                return <JsonArray value={value} depth={depth} postfix={postfix} key={key} />
            } else if (value === null) {
                return <JsonNull value={null} depth={depth} postfix={postfix} key={key} />
            } else {
                return <JsonObject value={value} depth={depth} postfix={postfix} key={key} />
            }
        default:
            return <JsonUnknown value={`ERR/${value}/${typeof value}`} depth={depth} key={key} />
    }
}


export const NJson: React.FC<RenderType<any> & { font_size?: number }> = ({ value, font_size: font_size_em = 1 }) => {
    return <div className="font-mono whitespace-nowrap" style={{ fontSize: `${font_size_em}em` }}>
        {
            <JsonInner value={value} depth={1} key="moog" />
        }
    </div>
}
