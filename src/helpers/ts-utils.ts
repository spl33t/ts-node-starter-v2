
// Object
export type RequiredDepth<T extends Record<any, any> | Array<any>> = {
    [K in keyof T]-?: T[K] extends Record<any, any> ? RequiredDepth<T[K]> :
    T[K] extends Array<any> ? RequiredDepth<T[K][number]> :
    T[K]
}

export type PartialDepth<T extends Record<any, any> | Array<any>> = {
    [K in keyof T]?: T[K] extends Record<any, any> ? PartialDepth<T[K]> :
    T[K] extends Array<any> ? PartialDepth<T[K][number]> :
    T[K]
}

export type PickByType<T, Value> = {
    [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P]
}

export type OmitByType<T, Value> = {
    [K in keyof T as T[K] extends Value ? never : K]: T[K]
}

export type IsEmptyObject<Obj> =
    [keyof Obj] extends [never] ? true : false


// Characters
export type UpperCaseCharacter =
    'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z';
export type LowercaseCharacter = Lowercase<UpperCaseCharacter>;
export type Character = UpperCaseCharacter | LowercaseCharacter