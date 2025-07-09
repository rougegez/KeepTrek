import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";

import { EditorContent, useEditor } from "@tiptap/react";

// Extensions
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

import Heading from "@tiptap/extension-heading"
import Blockquote from "@tiptap/extension-blockquote";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

import { cn } from "@/lib/utils";
import styles from "./Blog.module.css"

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
    Eraser,
    CornerDownLeft,
    Palette,
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
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from "../ui/tooltip";

const MenuBar = ({ editor, disabledExtensions = [] }) => {
    // Normalize disabledExtensions to lowercase for case-insensitive comparison
    const disabledSet = new Set(disabledExtensions.map(e => e.toLowerCase()));

    const [hyperlink, setHyperLink] = useState(null);
    const [isLinkOpen, setIsLinkOpen] = useState(false);
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [imageLink, setImageLink] = useState(null);

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

    const setImage = () => {
        if (imageLink) {
            editor.chain().focus().setImage({ src: imageLink, alt: "/assets/dummy-image.jpg" }).run()
        }
    }

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap max-w-full gap-x-4 overflow-auto cursor-default" style={{ scrollbarWidth: 'none' }}>
            <div className="shrink-0">
                {/* Bold */}
                {!disabledSet.has('bold') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DataStatePropInterceptor>
                                <Toggle
                                    pressed={editor.isActive("bold")}
                                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                                    disabled={!editor.can().chain().focus().toggleBold().run()}
                                >
                                    <Bold />
                                </Toggle>
                            </DataStatePropInterceptor>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Bold (Ctrl + B)</span>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Italic */}
                {!disabledSet.has('italic') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DataStatePropInterceptor>
                                <Toggle
                                    pressed={editor.isActive("italic")}
                                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                                >
                                    <Italic />
                                </Toggle>
                            </DataStatePropInterceptor>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Italic (Ctrl + I)</span>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Strike */}
                {!disabledSet.has('strike') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DataStatePropInterceptor>
                                <Toggle
                                    pressed={editor.isActive("strike")}
                                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                                >
                                    <Strikethrough />
                                </Toggle>
                            </DataStatePropInterceptor>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Strikethrough (Ctrl + Shift + X)</span>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Underline */}
                {!disabledSet.has('underline') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DataStatePropInterceptor>
                                <Toggle
                                    pressed={editor.isActive("underline")}
                                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                                    disabled={!editor.can().chain().focus().toggleUnderline().run()}
                                >
                                    <UnderlineIcon />
                                </Toggle>
                            </DataStatePropInterceptor>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Underline (Ctrl + U)</span>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Superscript */}
                {!disabledSet.has('superscript') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DataStatePropInterceptor>
                                <Toggle
                                    pressed={editor.isActive("superscript")}
                                    onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
                                    disabled={!editor.can().chain().focus().toggleSuperscript().run()}
                                >
                                    <SuperscriptIcon />
                                </Toggle>
                            </DataStatePropInterceptor>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Superscript</span>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Subscript */}
                {!disabledSet.has('subscript') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DataStatePropInterceptor>
                                <Toggle
                                    pressed={editor.isActive("subscript")}
                                    onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
                                    disabled={!editor.can().chain().focus().toggleSubscript().run()}
                                >
                                    <SubscriptIcon />
                                </Toggle>
                            </DataStatePropInterceptor>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Subscript</span>
                        </TooltipContent>
                    </Tooltip>
                )}

            </div>

            <Separator orientation="vertical" className="min-h-0 h-8" />

            <div className="shrink-0">

                {/* Bullet List */}
                {!disabledSet.has('bulletlist') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DataStatePropInterceptor>
                                <Toggle
                                    pressed={editor.isActive("bulletList")}
                                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                                >
                                    <List />
                                </Toggle>
                            </DataStatePropInterceptor>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Bullet List</span>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Ordered List */}
                {!disabledSet.has('orderedlist') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DataStatePropInterceptor>
                                <Toggle
                                    pressed={editor.isActive("orderedList")}
                                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                                >
                                    <ListOrdered />
                                </Toggle>
                            </DataStatePropInterceptor>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Ordered List</span>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Blockquote */}
                {!disabledSet.has('blockquote') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DataStatePropInterceptor>
                                <Toggle
                                    pressed={editor.isActive("blockquote")}
                                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                                >
                                    <TextQuoteIcon />
                                </Toggle>
                            </DataStatePropInterceptor>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Blockquote</span>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>

            <Separator orientation="vertical" className="min-h-0 h-8" />

            {(!disabledSet.has('link') || !disabledSet.has('image')) && (
                <>
                    <div className="shrink-0">
                        {/* Link */}
                        {!disabledSet.has('link') && (
                            <Popover
                                open={isLinkOpen}
                                onOpenChange={(open) => {
                                    setIsLinkOpen(open)
                                    if (!open) {
                                        setLink()
                                    }
                                }}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DataStatePropInterceptor>
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
                                        </DataStatePropInterceptor>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span>Insert Link</span>
                                    </TooltipContent>
                                </Tooltip>
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
                        )}

                        {/* Image */}
                        {!disabledSet.has('image') && (
                            <Popover
                                open={isImageOpen}
                                onOpenChange={(open) => {
                                    setIsImageOpen(open)
                                    if (!open) {
                                        setImage()
                                    }
                                }}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DataStatePropInterceptor>
                                            <PopoverTrigger asChild >
                                                <DataStatePropInterceptor>
                                                    <Toggle
                                                        pressed={editor.isActive("image")}
                                                        onPressedChange={() => { setImageLink(editor.getAttributes("image").src) }}
                                                    >
                                                        <ImageIcon />
                                                    </Toggle>
                                                </DataStatePropInterceptor>
                                            </PopoverTrigger>
                                        </DataStatePropInterceptor>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span>Insert Image</span>
                                    </TooltipContent>

                                </Tooltip>
                                <PopoverContent>
                                    <div className="grid gap-2">
                                        <div className="flex justify-between">
                                            <h4 className="font-medium leading-none my-2">Insert Image</h4>
                                        </div>
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="imageto">Image source</Label>
                                            <Input
                                                id="image"
                                                defaultValue={imageLink}
                                                onChange={(e) => setImageLink(e.target.value)}
                                                className="col-span-2 h-8"
                                            />
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>

                    <Separator orientation="vertical" className="min-h-0 h-8" />
                </>
            )}

            {/* Headings */}
            {!disabledSet.has('heading') && (
                <>
                    <div className="shrink-0">
                        {/* Headings */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DataStatePropInterceptor>
                                    <Toggle
                                        pressed={editor.isActive("heading", { level: 1 })}
                                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                    >
                                        <Heading1 />
                                    </Toggle>
                                </DataStatePropInterceptor>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Heading 1</span>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DataStatePropInterceptor>
                                    <Toggle
                                        pressed={editor.isActive("heading", { level: 2 })}
                                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                    >
                                        <Heading2 />
                                    </Toggle>
                                </DataStatePropInterceptor>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Heading 2</span>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DataStatePropInterceptor>
                                    <Toggle
                                        pressed={editor.isActive("heading", { level: 3 })}
                                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                    >
                                        <Heading3 />
                                    </Toggle>
                                </DataStatePropInterceptor>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Heading 3</span>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DataStatePropInterceptor>
                                    <Toggle
                                        pressed={editor.isActive("heading", { level: 4 })}
                                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                                    >
                                        <Heading4 />
                                    </Toggle>
                                </DataStatePropInterceptor>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Heading 4</span>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DataStatePropInterceptor>
                                    <Toggle
                                        pressed={editor.isActive("paragraph")}
                                        onPressedChange={() => editor.chain().focus().setParagraph().run()}
                                    >
                                        <Pilcrow />
                                    </Toggle>
                                </DataStatePropInterceptor>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Paragraph</span>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <Separator orientation="vertical" className="min-h-0 h-8" />
                </>
            )}

            {!disabledSet.has('textalign') && (
                <>
                    <div className="shrink-0">
                        {/* Alignments */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DataStatePropInterceptor>
                                    <Toggle
                                        pressed={editor.isActive({ textAlign: "left" })}
                                        onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                                    >
                                        <AlignLeft />
                                    </Toggle>
                                </DataStatePropInterceptor>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Align Left</span>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DataStatePropInterceptor>
                                    <Toggle
                                        pressed={editor.isActive({ textAlign: "center" })}
                                        onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                                    >
                                        <AlignCenter />
                                    </Toggle>
                                </DataStatePropInterceptor>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Align Center</span>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DataStatePropInterceptor>
                                    <Toggle
                                        pressed={editor.isActive({ textAlign: "right" })}
                                        onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                                    >
                                        <AlignRight />
                                    </Toggle>
                                </DataStatePropInterceptor>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Align Right</span>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DataStatePropInterceptor>
                                    <Toggle
                                        pressed={editor.isActive({ textAlign: "justify" })}
                                        onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
                                    >
                                        <AlignJustify />
                                    </Toggle>
                                </DataStatePropInterceptor>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Align Justify</span>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <Separator orientation="vertical" className="min-h-0 h-8" />
                </>
            )}

            <div className="shrink-0">
                {/* Horizontal Rule */}
                {!disabledSet.has('horizontalrule') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DataStatePropInterceptor>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                                >
                                    <SeparatorHorizontal />
                                </Button>
                            </DataStatePropInterceptor>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Horizontal Rule</span>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Hard Break */}
                {!disabledSet.has('hardbreak') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DataStatePropInterceptor>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editor.chain().focus().setHardBreak().run()}
                                >
                                    <CornerDownLeft />
                                </Button>
                            </DataStatePropInterceptor>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Hard Break</span>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>

            <Separator orientation="vertical" className="min-h-0 h-8" />

            <div className="shrink-0">
                {/* Undo Redo */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DataStatePropInterceptor>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().chain().focus().undo().run()}
                            >
                                <RotateCcw />
                            </Button>
                        </DataStatePropInterceptor>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>Undo</span>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DataStatePropInterceptor>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().chain().focus().redo().run()}
                            >
                                <RotateCw />
                            </Button>
                        </DataStatePropInterceptor>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>Redo</span>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DataStatePropInterceptor>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    editor.chain().focus().clearNodes().run()
                                    editor.chain().focus().unsetAllMarks().run()
                                }}
                            >
                                <Eraser />
                            </Button>
                        </DataStatePropInterceptor>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>Clear Formatting</span>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
};

const extensions = [
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
    Heading.configure({
        levels: [1, 2, 3, 4],
    }),
    Blockquote,
    HardBreak,
    HorizontalRule,
    BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
        HTMLAttributes: {
            class: "marker:text-[#374151]",
        }
    }),
    OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
        HTMLAttributes: {
            class: "marker:text-[#374151]",
        }
    }),
    StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        horizontalRule: false,
        hardBreak: false,
        code: false,
        codeBlock: false,
    })
];

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
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

export const Tiptap = ({ content = sample, onContentChange, editable = true, showMenuBar = true, className, disabledExtensions = [] }) => {
    // Normalize disabledExtensions to lowercase for case-insensitive comparison
    const disabledSet = new Set(disabledExtensions.map(e => e.toLowerCase()));
    const filteredExtensions = extensions.filter(ext => {
        // Always keep StarterKit
        if (ext.constructor && ext.constructor.name === 'StarterKit') return true;
        // Get extension name (prefer .name, fallback to constructor name)
        const extName = (ext.name || (ext.constructor && ext.constructor.name) || '').toLowerCase();
        return !disabledSet.has(extName);
    });

    const editor = useEditor({
        editable,
        content: content,
        extensions: filteredExtensions,
        editorProps: {
            attributes: {
                class: `${styles.tiptap} focus:outline-none min-w-full`, // prose prose-sm sm:prose-sm lg:prose-lg xl:prose-xl m-5
            },
        },
    })

    useEffect(() => {
        if (!editor) return undefined

        const updateHandler = () => {
            // Export the content as HTML
            const html = editor.getHTML();
            if (typeof onContentChange === "function") {
                onContentChange(html);
            }
        };

        // Listen for content updates
        editor.on('update', updateHandler);

        // Cleanup the listener on unmount or change
        return () => {
            editor.off('update', updateHandler);
        }
    }, [editor, editable, onContentChange]);

    return (
        <div className={cn("flex-shrink min-w-60 w-full", className)}>
            {(editable && showMenuBar) &&
                <MenuBar editor={editor} disabledExtensions={disabledExtensions} />}
            <EditorContent editor={editor} />
        </div>
    );
};

export default Tiptap;
