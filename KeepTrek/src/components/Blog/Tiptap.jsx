import { EditorContent, EditorProvider, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from './Blog.module.css'

// define your extension array
const extensions = [StarterKit]

const content = '<p>Hello World!</p>'

const Tiptap = () => {

    return (
        <>
        <EditorProvider
            extensions={extensions}
            content={content}
            // slotBefore={<div>Slot Before</div>}
            // slotAfter={<div>Slot After</div>}
            editorProps={{attributes: { 
                class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl"}}}
            editorContainerProps={{class: styles.markdownBody}}
        >
            <FloatingMenu editor={null}>
                This is the floating menu
            </FloatingMenu>
            <BubbleMenu editor={null}>
                This is the bubble menu
            </BubbleMenu>
        </EditorProvider>
        </>
    )
}

export default Tiptap
