import RichTextEditor from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { ImageIcon, Send } from "lucide-react";

interface iAppProps {
  value: any;
  onChange: (next: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const MessageComposer = ({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: iAppProps) => {
  return (
    <>
      <RichTextEditor
        field={{ value, onChange }}
        sendButton={
          <Button
            type="button"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            <Send className="size-4 mr-1" /> Send
          </Button>
        }
        footerLeft={
          <Button type="button" size="sm" variant="outline">
            <ImageIcon className="size-4 mr-1" /> Attach
          </Button>
        }
      />
    </>
  );
};

export default MessageComposer;
