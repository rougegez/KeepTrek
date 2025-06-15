import { useState } from 'react'
import TipTap from '@/components/Blog/Tiptap'
import TopNavbar from '@/components/topNavBar/TopNavbar'
import CarouselEdit from './Carousel/CarouselEdit.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Button } from '@/components/ui/button.jsx'

import styles from './Blog.module.css'

const sample = `
<h1>
    Hi there,
</h1>
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏 HAHAHAHAHHAHAHAHA
  <br />
  — Mom
</blockquote>
`;

const BlogEditor = () => {

    const [previewMode, setPreviewMode] = useState(false)
    const [images, setImages] = useState([])
    const [content, setContent] = useState(sample)

    return (
        <>
            <TopNavbar />
            <CarouselEdit file={images} onFileChange={(file) => setImages(file)} preview={previewMode} />
            <div className="mx-48">
                <TipTap 
                    content={content} 
                    onContentChange={(setContent)}
                    editable={!previewMode}  />
                <Separator />
                <div className="flex justify-between items-center">
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
                    <div className="flex items-center gap-2 py-4">
                        <Button
                            variant="destructive"
                            onClick={() => alert('Blog discard!')}  > 
                            Discard
                        </Button>
                        <Button
                            onClick={() => console.log(content, images)}
                        >
                            Publish
                        </Button>
                    </div>
                </div>
                <Separator />
                {content}
                <Separator />
                <div className={styles.tiptap} dangerouslySetInnerHTML={{ __html: content }} />
            </div>  
        </>
    )
}

export default BlogEditor
