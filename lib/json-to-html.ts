import { baseExtension } from "@/components/rich-text-editor/extension";
import { generateHTML, JSONContent } from "@tiptap/react";

export function convertJsonToHtml(jsonContent: JSONContent): string {
  try {
    const content =
      typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;

    return generateHTML(content, baseExtension);
  } catch (error) {
    console.log("Error converting JSON to HTML:", error);
    return "";
  }
}
