import React, { useState, useRef } from "react";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";

function EditableText({
    initialValue,
    placeholder,
    onSave,
    classNames = {
        container: null,
        textArea: null,
        text: null,
        placeholder: null
    },
    ...props
}) {
    const [editMode, setEditMode] = useState(false);
    const [value, setValue] = useState(initialValue || "");
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    // Focus input when entering edit mode
    React.useEffect(() => {
        if (editMode && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editMode]);

    // Exit edit mode on blur
    const handleBlur = (e) => {
        if (!containerRef.current.contains(e.relatedTarget)) {
            setEditMode(false);
            if (onSave) onSave(value);
        }
    };

    // Save on Enter or Escape
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "Escape") {
            setEditMode(false);
            if (onSave) onSave(value);
        }
    };

    return (
        <div
            ref={containerRef}
            className={classNames.container}
            tabIndex={-1}
            onBlur={handleBlur}
            {...props}
        >
            {editMode ? (
                <Textarea
                    ref={inputRef}
                    className={cn("border rounded px-2 py-1 w-full", classNames.textArea)}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ overflow: "hidden", resize: "none" }}
                />
            ) : (
                <span
                    className={cn("cursor-pointer inline-block w-full", classNames.text)}
                    onDoubleClick={() => setEditMode(true)}
                >
                    {(!value || value.trim() === "") ? (
                        <span className={cn("text-[#666666] italic pointer-events-none select-none", classNames.placeholder)}>
                            {placeholder || "Double-click to edit..."}
                        </span>
                    ) : (
                        value
                    )}
                </span>
            )}
        </div>
    );
}

export default EditableText;
