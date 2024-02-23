const isEmptyObject = (obj: any): boolean => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const deepEqual = (obj1: any, obj2: any) => {
    // Check if both objects are empty
    if (isEmptyObject(obj1) && isEmptyObject(obj2)) {
        return true;
    }

    if (obj1 === obj2) {
        return true;
    }

    if (
        typeof obj1 !== 'object' ||
        obj1 === null ||
        typeof obj2 !== 'object' ||
        obj2 === null
    ) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        if (typeof val1 === 'object' || typeof val2 === 'object') {
            if (!deepEqual(val1, val2)) {
                return false;
            }
        } else if (val1 !== val2) {
            return false;
        }
    }

    return true;
};


