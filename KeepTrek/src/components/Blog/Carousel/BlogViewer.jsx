import TipTap from '@/components/Blog/Tiptap'
import TopNavbar from '@/components/topNavBar/TopNavbar'
import CarouselView from './CarouselView.jsx'

const BlogViewer = () => {

    // fetch content and images from backend

    return (
        <>
            <TopNavbar />
            <CarouselView
                images={images}
                classNames={
                    {
                        item: "md:basis-1/2 lg:basis-1/3",
                    }
                } />
            <div className="mx-48">
                <TipTap
                    content={content}
                    editable={false} />
            </div>
        </>
    )
}

export default BlogEditor
