export const nextTick = (func: (value: void) => void): Promise<void> => Promise.resolve().then(func);
