import TipTap from '@/components/Blog/Tiptap'

const BlogEditor = () => {

    return (
        <>
        <div className="px-64">
            <TipTap editable={true}/>
        </div>
        </>
    )
}

export default BlogEditor
