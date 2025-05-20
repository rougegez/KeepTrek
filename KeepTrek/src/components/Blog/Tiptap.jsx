import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";

import { EditorProvider, useCurrentEditor } from "@tiptap/react";

// Extensions
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";

import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Pilcrow,
    List,
    ListOrdered,
    TextQuoteIcon,
    SeparatorHorizontal,
    RotateCcw,
    RotateCw,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Image as ImageIcon,
    Link as LinkIcon,
    Underline as UnderlineIcon,
    Superscript as SuperscriptIcon,
    Subscript as SubscriptIcon,
    Trash,
} from "lucide-react";

import {
    Popover,
    PopoverTrigger,
    PopoverContent
}
    from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataStatePropInterceptor } from "@/utils/DataStatePropInterceptor";

const MenuBar = () => {
    const { editor } = useCurrentEditor();

    const [hyperlink, setHyperLink] = useState(null);
    const [isLinkOpen, setIsLinkOpen] = useState(false);

    const setLink = () => {
        const parsedUrl = hyperlink.includes(':') ? new URL(hyperlink).href : new URL(`https://${hyperlink}`).href
        // cancelled
        if (parsedUrl === null) {
            return
        }

        // empty
        if (parsedUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()

            return
        }

        // update link
        try {
            editor.chain().focus().extendMarkRange('link').setLink({ href: parsedUrl })
                .run()
        } catch (e) {
            toast.error(e.message)
        }
    }

    if (!editor) {
        return null;
    }

    return (
        <>
            {/* Bold */}
            <Toggle
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
            >
                <Bold />
            </Toggle>

            {/* Italic */}
            <Toggle
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
                <Italic />
            </Toggle>

            {/* Strike */}
            <Toggle
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
            >
                <Strikethrough />
            </Toggle>

            {/* Underline */}
            <Toggle
                pressed={editor.isActive("underline")}
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
            >
                <UnderlineIcon />
            </Toggle>

            {/* Superscript */}
            <Toggle
                pressed={editor.isActive("superscript")}
                onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
                disabled={!editor.can().chain().focus().toggleSuperscript().run()}
            >
                <SuperscriptIcon />
            </Toggle>

            {/* Subscript */}
            <Toggle
                pressed={editor.isActive("subscript")}
                onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
                disabled={!editor.can().chain().focus().toggleSubscript().run()}
            >
                <SubscriptIcon />
            </Toggle>

            {/* Headings */}
            <Toggle
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                <Heading1 />
            </Toggle>
            <Toggle
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <Heading2 />
            </Toggle>
            <Toggle
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
                <Heading3 />
            </Toggle>
            <Toggle
                pressed={editor.isActive("heading", { level: 4 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            >
                <Heading4 />
            </Toggle>
            <Toggle
                pressed={editor.isActive("paragraph")}
                onPressedChange={() => editor.chain().focus().setParagraph().run()}
            >
                <Pilcrow />
            </Toggle>

            {/* Alignments */}
            <Toggle
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
            >
                <AlignLeft />
            </Toggle>

            <Toggle
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
            >
                <AlignCenter />
            </Toggle>

            <Toggle
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
            >
                <AlignRight />
            </Toggle>

            <Toggle
                pressed={editor.isActive({ textAlign: "justify" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
            >
                <AlignJustify />
            </Toggle>

            {/* Bullet List */}
            <Toggle
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List />
            </Toggle>

            {/* Ordered List */}
            <Toggle
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered />
            </Toggle>

            {/* Blockquote */}
            <Toggle
                pressed={editor.isActive("blockquote")}
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <TextQuoteIcon />
            </Toggle>

            <Popover
                open={isLinkOpen}
                onOpenChange={(open) => {
                    setIsLinkOpen(open)
                    if (!open) {
                        setLink()
                    }
                }}
            >
                <PopoverTrigger asChild >
                    <DataStatePropInterceptor>
                        <Toggle
                            pressed={editor.isActive("link")}
                            onPressedChange={() => { setHyperLink(editor.getAttributes('link').href) }}
                        >
                            <LinkIcon />
                        </Toggle>
                    </DataStatePropInterceptor>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="grid gap-2">
                        <div className="flex justify-between">
                            <h4 className="font-medium leading-none items-center my-auto">Insert Link</h4>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { editor.chain().focus().unsetLink().run(); setIsLinkOpen(false); }}
                            >
                                <Trash color="#ef4444" />
                            </Button>
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="linkto">Link to</Label>
                            <Input
                                id="linkto"
                                defaultValue={hyperlink}
                                onChange={(e) => setHyperLink(e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>



            {/* Horizontal Rule */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
                <SeparatorHorizontal />
            </Button>

            {/* Hard Break */}
            <Button
                variant="ghost"
                onClick={() => editor.chain().focus().setHardBreak().run()}
            >
                Hard Break
            </Button>

            {/* Undo Redo */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <RotateCcw />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                <RotateCw />
            </Button>

            {/* Purple Color */}
            <Toggle
                pressed={editor.isActive("textStyle", { color: "#958DF1" })}
                onPressedChange={() => editor.chain().focus().setColor("#958DF1").run()}
            >
                Purple
            </Toggle>

            {/* Clear Marks */}
            <Button
                variant="ghost"
                onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                clear marks
            </Button>

            {/* Clear Nodes */}
            <Button
                variant="ghost"
                onClick={() => editor.chain().focus().clearNodes().run()}>
                clear nodes
            </Button>

            <Button
                variant="ghost"
                onClick={() => {
                    editor.chain().focus().clearNodes().run()
                    editor.chain().focus().unsetAllMarks().run()
                }}
            >
                Clear Formatting
            </Button>
        </>
    );
};

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Typography,
    Image,
    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
            try {
                // construct URL
                const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                // use default validation
                if (!ctx.defaultValidate(parsedUrl.href)) {
                    return false
                }

                // disallowed protocols
                const disallowedProtocols = ['ftp', 'file', 'mailto']
                const protocol = parsedUrl.protocol.replace(':', '')

                if (disallowedProtocols.includes(protocol)) {
                    return false
                }

                // only allow protocols specified in ctx.protocols
                const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

                if (!allowedProtocols.includes(protocol)) {
                    return false
                }

                // disallowed domains
                const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                const domain = parsedUrl.hostname

                if (disallowedDomains.includes(domain)) {
                    return false
                }

                // all checks have passed
                return true
            } catch {
                return false
            }
        },
        shouldAutoLink: url => {
            try {
                // construct URL
                const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

                // only auto-link if the domain is not in the disallowed list
                const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                const domain = parsedUrl.hostname

                return !disallowedDomains.includes(domain)
            } catch {
                return false
            }
        },
        HTMLAttributes: {
            class: "text-blue-500 hover:text-blue-700 cursor-pointer",
        }
    }),
    Underline,
    Superscript,
    Subscript,
    Placeholder.configure({
        placeholder: 'Write something ...',
    }),
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3, 4],
        },
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
            HTMLAttributes: {
                class: "marker:text-[#374151]",
            }
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
            HTMLAttributes: {
                class: "marker:text-[#374151]",
            }
        },
    })
];

const content = `
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
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

export const Tiptap = () => {
    return (
        <EditorProvider
            slotBefore={<MenuBar />}
            extensions={extensions}
            content={content}
            editorProps={{ attributes: { class: "prose prose-sm sm:prose-sm m-5 focus:outline-none" } }} // ORIGINAL: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none"
        ></EditorProvider>
    );
};

export default Tiptap;
