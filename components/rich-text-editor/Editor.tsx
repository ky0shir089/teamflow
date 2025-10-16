"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { editorExtension } from "./extension";
import MenuBar from "./MenuBar";
import { ReactNode } from "react";

interface iAppProps {
  field: any;
  sendButton: ReactNode;
  footerLeft?: ReactNode;
}

const RichTextEditor = ({ field, sendButton, footerLeft }: iAppProps) => {
  const editor = useEditor({
    extensions: editorExtension,
    content: (() => {
      if (!field?.value) return "";

      try {
        return JSON.parse(field.value);
      } catch {
        return "";
      }
    })(),
    onUpdate: ({ editor }) => {
      if (field?.onChange) {
        field.onChange(JSON.stringify(editor.getJSON()));
      }
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "max-w-none min-h-[125px] focus:outline-none p-4 !w-full !max-w-none prose dark:prose-invert marker:text-primary",
      },
    },
  });

  return (
    <div className="relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col">
      <MenuBar editor={editor} />

      <EditorContent
        editor={editor}
        className="max-h-[200px] overflow-y-auto"
      />

      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-input bg-card">
        <div className="min-h-8 flex items-center">{footerLeft}</div>

        <div className="shrin-0">{sendButton}</div>
      </div>
    </div>
  );
};

export default RichTextEditor;
