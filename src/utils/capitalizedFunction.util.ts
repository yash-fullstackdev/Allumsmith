import React from "react";

export const handleInputChange = (setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    const inputValue = target.value;
    const cursorPosition = target.selectionStart || 0;

    const uppercaseValue = inputValue
        .split(' ')
        .map(word => word.toUpperCase())
        .join(' ');

    // Use a ref to store and retrieve the cursor position
    const cursorPositionRef: any = React.createRef<HTMLTextAreaElement | HTMLInputElement>();
    cursorPositionRef.current = target;

    // Schedule a microtask to set the cursor position after the re-render
    Promise.resolve().then(() => {
        if (cursorPositionRef.current !== undefined) {
            cursorPositionRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
    });

    // Use setFieldValue to update the field value
    setFieldValue(fieldName, uppercaseValue);
};
