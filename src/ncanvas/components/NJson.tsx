
import "./NJson.css";

interface RenderType<T> {
    value: T,
    postfix?: React.ReactNode
    depth: number;
}

const JsonString: React.FC<RenderType<string>> = ({ value, postfix, depth }) => <span className={`n-json-string n-json-depth-${depth}`}>
    {[`"${value}"`, postfix]}
</span>;

const JsonBoolean: React.FC<RenderType<boolean>> = ({ value, postfix, depth }) => <span className={`n-json-boolean n-json-depth-${depth}`}>
    {[`"${value}"`, postfix]}
</span>;

const JsonNumber: React.FC<RenderType<number>> = ({ value, postfix, depth }) => <span className={`n-json-number n-json-depth-${depth}`}>
    {[value.toString(), postfix]}
</span>;

const JsonArray: React.FC<RenderType<any[]>> = ({ value, postfix, depth }) => <>
    <span className="n-json-paren">{"["}<br /></span>
    {
        value.map((value, index) => <span key={index}>
            <JsonInner value={value} postfix={<><span className="n-json-delim">,</span><br /></>} depth={depth + 1} />
        </span>)
    }
    <span className="n-json-paren">{"]"}{postfix}</span>
</>;

const JsonNull: React.FC<RenderType<null>> = ({ postfix, depth }) => <span className={`n-json-null n-json-depth-${depth}`}>null{postfix}</span>;

const JsonUnknown: React.FC<RenderType<string>> = ({ value, postfix, depth }) => <span className={`n-json-null n-json-depth-${depth}`}>{value}{postfix}</span>;

const JsonObject: React.FC<RenderType<object>> = ({ value, postfix }) => <>
    <span className={`n-json-paren n-json-depth-${0}`}>{"{"}</span>
    {
        Object.entries(value).map(([key, value], index) =>
            <div key={index} className={`n-json-depth-${1}`}>
                <span className="n-json-object-key">{key}</span>
                <span className="n-json-delim">:</span>
                <JsonInner value={value} postfix={<span className="n-json-delim">,</span>} depth={0} />
            </div>)
    }
    <div className={`n-json-paren n-json-depth-${0}`}>{"}"}{postfix}</div>
</>;



const get_thing = ({ value, depth, postfix }: { value: any, depth: number, postfix: React.ReactNode }) => {
    switch (typeof value) {
        case "number":
            return <JsonNumber value={value} depth={depth} postfix={postfix} />
        case "boolean":
            return <JsonBoolean value={value} depth={depth} postfix={postfix} />
        case "string":
            return <JsonString value={value} depth={depth} postfix={postfix} />
        case "object":
            if (Array.isArray(value)) {
                return <JsonArray value={value} depth={depth} postfix={postfix} />
            } else if (value === null) {
                return <JsonNull value={null} depth={depth} postfix={postfix} />
            } else {
                return <JsonObject value={value} depth={depth} postfix={postfix} />
            }
        // case "bigint":
        // case "function":
        // case "symbol":
        // case "undefined":
        default:
            return <JsonUnknown value={`ERR/${value}/${typeof value}`} depth={depth} />
    }
}

export const JsonInner: React.FC<RenderType<any>> = ({ value, postfix, depth }) => {
    return <>
        {
            get_thing({ value, depth, postfix })
        }
    </>
}

export const NJson: React.FC<RenderType<any>> = ({ value }) => {
    return <div className="n-json-host">
        {
            <JsonInner value={value} depth={1} />
        }
    </div>
}