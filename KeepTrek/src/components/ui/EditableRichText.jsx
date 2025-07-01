import React, { useState, useRef } from "react";
import Tiptap from "@/components/Blog/Tiptap.jsx";
import styles from "@/components/Blog/Blog.module.css";

function EditableRichText({ initialContent, placeholder, disabledExtensions = [], onSave, className }) {
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
      className={className}
      tabIndex={-1}
      onBlur={handleBlur}
    >
      {editMode ? (
        <Tiptap
          content={content}
          onContentChange={setContent}
          editable={true}
          showMenuBar={true}
          className="cursor-text"
          disabledExtensions={disabledExtensions}
        />
            ) : (
              <div
                className={`${styles.tiptap} cursor-pointer`}
                onClick={() => setEditMode(true)}
              >
                {(!content || content === "<p></p>" || content.trim() === "") ? (
                  <span className="text-[#666666] italic pointer-events-none select-none">
                    {placeholder || "Click to edit..."}
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