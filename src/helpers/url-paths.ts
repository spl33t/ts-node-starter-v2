const patterns = {
    uuid: "[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}",
    email: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",

    // Паттерны для строк
    letters: '[a-zA-Z]+$',
    digits: '\\d+$',
    lettersAndDigits: '[a-zA-Z0-9]+$',

    any: "",
}

type RecursivelyExtractPathParams<T extends PropertyKey,
    TAcc extends null | Record<string, string>> = T extends `/:${infer PathParam}/${infer Right}`
    ? { [key in PathParam]: string } & RecursivelyExtractPathParams<Right, TAcc>
    : T extends `/:${infer PathParam}`
    ? { [key in PathParam]: string }
    : T extends `/${string}/${infer Right}`
    ? RecursivelyExtractPathParams<Right, TAcc>
    : T extends `/${string}`
    ? TAcc
    : T extends `:${infer PathParam}/${infer Right}`
    ? { [key in PathParam]: string } & RecursivelyExtractPathParams<Right, TAcc>
    : T extends `:${infer PathParam}`
    ? TAcc & { [key in PathParam]: string }
    : T extends `${string}/${infer Right}`
    ? RecursivelyExtractPathParams<Right, TAcc>
    : TAcc;


export type ParamsFromUrl<T extends PropertyKey> =
    [keyof RecursivelyExtractPathParams<T, {}>] extends [never] ? never : RecursivelyExtractPathParams<T, {}>

//const paramsFromUrlTest: ParamsFromUrl<"/:city/:user"> = { city: "msc", user: "Maxim" }

export function pathWithPattern<Path extends string>(path: Path, map: Partial<Record<keyof ParamsFromUrl<Path>, Array<keyof typeof patterns>>>) {
    Object.keys(map).forEach(paramName => {
        const paramIndex = path.indexOf(paramName);
        if (paramIndex !== -1) {
            const _patterns = Object.keys(map).length !== 0 ? map[paramName].map(s => patterns[s]) as Array<any> : []
            const pattern = `${_patterns.join("|")}`
            path = path.slice(0, paramIndex + paramName.length) + (pattern.length !== 0 ? `(${pattern})` : "") + path.slice(paramIndex + paramName.length) as Path
        }
    })
    return path
}

export const insertParamsIntoPath = <T extends string>({ path, params, }: {
    path: T;
    params: ParamsFromUrl<T> extends never ? {} : ParamsFromUrl<T>;
}) => {
    return path
        .replace(/:([^/]+)/g, (_, p) => {
            return (params as any)[p] || '';
        })
        .replace(/\/\//g, '/');
};
//const insertParamsIntoPathTest = insertParamsIntoPath({ path: "sas/:id/:nice", params: { id: "", nice: "" } })

