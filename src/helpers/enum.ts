export function createEnum<T extends string[]>(...array: T) {
    const obj: { [key: string]: string } = Object.fromEntries(array.map(s => [s, s]))

    return {
        pick: <A extends T[number]>(value: A) => {
            const res = obj[value] as A
            const redFormattedError = `\x1b[31m${`Enum pick error. value not found, must be ${array}`}\x1b[0m`
            if (!res)
                throw new Error(redFormattedError)
            return res
        },
        array,
        enum: obj as { [Key in T[number]]: Key }
    }
}

export type EnumUnion<T extends ReturnType<typeof createEnum>> = ReturnType<T["pick"]>
export type EnumTuple<T extends ReturnType<typeof createEnum>> = T["array"]


