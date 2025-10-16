import { convertJsonToHtml } from "@/lib/json-to-html";
import { JSONContent } from "@tiptap/react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

interface iAppProps {
  content: JSONContent;
  className?: string;
}

const SafeContent = ({ content, className }: iAppProps) => {
  const html = convertJsonToHtml(content);
  const clean = DOMPurify.sanitize(html);

  return <div className={className}>{parse(clean)}</div>;
};

export default SafeContent;
