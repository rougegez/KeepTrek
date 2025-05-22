import { useState } from 'react'
import TipTap from '@/components/Blog/Tiptap'
import TopNavbar from '@/components/topNavBar/TopNavbar'
import CarouselEdit from './Carousel/CarouselEdit.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Label } from '../ui/label.jsx'

const BlogEditor = () => {

    const [previewMode, setPreviewMode] = useState(false)

    return (
        <>
            <div>
                <TopNavbar />
                <CarouselEdit preview={previewMode}/>
                <div className="mx-48">
                    <div className="flex items-center gap-2 py-4">
                        <Switch
                            id="previewMode"
                            checked={previewMode}
                            onCheckedChange={setPreviewMode}
                        />
                        <Label
                            htmlFor="previewMode">
                            Preview Mode
                        </Label>
                    </div>
                    <TipTap editable={!previewMode} />
                </div>
            </div>
        </>
    )
}

export default BlogEditor
