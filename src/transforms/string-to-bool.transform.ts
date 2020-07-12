export const StringToBoolTransform = (value: string | boolean): boolean => {
    return value === "true" || value === true
};