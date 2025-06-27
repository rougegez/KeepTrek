import React, { useState, useRef } from "react";
import Tiptap from "@/components/Blog/Tiptap.jsx";
import styles from "@/components/Blog/Blog.module.css";
import { cn } from "@/lib/utils";

function EditableRichText({
  initialContent,
  placeholder,
  disabledExtensions = [],
  onSave,
  classNames = {
    container: null,
    editor: null,
    text: null,
    placeholder: null
  },
  ...props
}) {
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(initialContent);
  const containerRef = useRef(null);

  // Exit edit mode on blur (optional: add save logic)
  const handleBlur = (e) => {
    // Only exit if focus leaves the editor area
    if (!containerRef.current.contains(e.relatedTarget)) {
      setEditMode(false);
      if (onSave) onSave(content);
    }
  };

  return (
    <div
      ref={containerRef}
      className={classNames.containerClassName}
      tabIndex={-1}
      onBlur={handleBlur}
      {...props}
    >
      {editMode ? (
        <Tiptap
          content={content}
          onContentChange={setContent}
          editable={true}
          showMenuBar={true}
          className={cn("cursor-text", classNames.editorClassName)}
          disabledExtensions={disabledExtensions}
        />
      ) : (
        <div
          className={cn(styles.tiptap, "cursor-pointer", classNames.textClassName)}
          onDoubleClick={() => setEditMode(true)}
        >
          {(!content || content === "<p></p>" || content.trim() === "") ? (
            <span className={cn("text-[#666666] italic pointer-events-none select-none", classNames.placeholderClassName)}>
              {placeholder ? placeholder : "Write something..."}
            </span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      )}
    </div>
  );
}

export default EditableRichText;