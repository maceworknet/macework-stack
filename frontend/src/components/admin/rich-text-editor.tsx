"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  Bold,
  Code2,
  Eye,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
  Heading2,
  Heading3,
  Link2,
} from "lucide-react";

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
        active
          ? "border-macework bg-macework/10 text-macework"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

type EditorMode = "visual" | "code";

export function RichTextEditor({
  name,
  label,
  value = "",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  value?: string | null;
  placeholder?: string;
  required?: boolean;
}) {
  const initialContent = useMemo(() => value ?? "", [value]);
  const [html, setHtml] = useState(initialContent);
  const [mode, setMode] = useState<EditorMode>("visual");
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const didMountRef = useRef(false);
  const externalContentRef = useRef(initialContent);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-macework underline underline-offset-4",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "",
      }),
    ],
    content: initialContent,
    onUpdate({ editor: current }) {
      setHtml(current.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] rounded-b-lg bg-background px-4 py-3 text-sm leading-7 outline-none prose prose-sm max-w-none prose-headings:font-bold prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-a:text-macework",
      },
    },
  });

  useEffect(() => {
    if (!editor || externalContentRef.current === initialContent) return;

    externalContentRef.current = initialContent;
    editor.commands.setContent(initialContent || "<p></p>", { emitUpdate: false });
    setHtml(initialContent);
  }, [editor, initialContent]);

  function switchMode(nextMode: EditorMode) {
    if (nextMode === "visual") {
      editor?.commands.setContent(html || "<p></p>", { emitUpdate: false });
      window.setTimeout(() => editor?.commands.focus(), 0);
    }

    setMode(nextMode);
  }

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    hiddenInputRef.current?.dispatchEvent(new Event("change", { bubbles: true }));
  }, [html]);

  const isEmpty = !html || html === "<p></p>";

  return (
    <label className="space-y-1.5 md:col-span-2">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        value={isEmpty ? "" : html}
        required={required}
      />
      <div className="overflow-hidden rounded-lg border border-input bg-card">
        <div className="border-b border-border bg-muted/40 p-2">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex overflow-hidden rounded-md border border-border bg-background">
              <button
                type="button"
                onClick={() => switchMode("visual")}
                className={`inline-flex h-9 items-center gap-2 px-3 text-xs font-black transition-colors ${
                  mode === "visual"
                    ? "bg-macework text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Görsel
              </button>
              <button
                type="button"
                onClick={() => switchMode("code")}
                className={`inline-flex h-9 items-center gap-2 border-l border-border px-3 text-xs font-black transition-colors ${
                  mode === "code"
                    ? "bg-macework text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                HTML
              </button>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {mode === "visual" ? "Görsel düzenleme" : "HTML kod düzenleme"}
            </span>
          </div>

          {mode === "visual" ? (
            <div className="flex flex-wrap gap-2">
              <ToolbarButton
                title="Kal\u0131n"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                active={editor?.isActive("bold")}
              >
                <Bold className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="\u0130talik"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                active={editor?.isActive("italic")}
              >
                <Italic className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="\u00dcst\u00fc \u00e7izili"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                active={editor?.isActive("strike")}
              >
                <Strikethrough className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Ba\u015fl\u0131k 2"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor?.isActive("heading", { level: 2 })}
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Ba\u015fl\u0131k 3"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor?.isActive("heading", { level: 3 })}
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Madde listesi"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                active={editor?.isActive("bulletList")}
              >
                <List className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Numaral\u0131 liste"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                active={editor?.isActive("orderedList")}
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Al\u0131nt\u0131"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                active={editor?.isActive("blockquote")}
              >
                <Quote className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Ba\u011flant\u0131"
                onClick={() => {
                  const current = editor?.getAttributes("link").href as string | undefined;
                  const url = window.prompt("Ba\u011flant\u0131 URL", current ?? "https://");
                  if (url === null) return;
                  if (!url) {
                    editor?.chain().focus().unsetLink().run();
                    return;
                  }
                  editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                }}
                active={editor?.isActive("link")}
              >
                <Link2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton title="Geri al" onClick={() => editor?.chain().focus().undo().run()}>
                <Undo2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton title="Yinele" onClick={() => editor?.chain().focus().redo().run()}>
                <Redo2 className="h-4 w-4" />
              </ToolbarButton>
            </div>
          ) : null}
        </div>
        {mode === "visual" ? (
          <EditorContent editor={editor} />
        ) : (
          <textarea
            value={html}
            onChange={(event) => setHtml(event.target.value)}
            spellCheck={false}
            placeholder={"<h2>Başlık</h2>\n<p>HTML içeriğinizi buraya yazın.</p>"}
            className="min-h-[260px] w-full resize-y rounded-b-lg bg-background px-4 py-3 font-mono text-sm leading-7 outline-none"
          />
        )}
      </div>
    </label>
  );
}
