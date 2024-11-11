export function isJsonString(value: any) {
    if (typeof value !== "string") {
        return false
    }

    try {
        JSON.parse(value);
    } catch (e) {
        return false;
    }
    
    return true;
}