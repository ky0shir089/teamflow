"use client";

import { buttonVariants } from "@/components/ui/button";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Hash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const ChannelList = () => {
  const {
    data: { channels },
  } = useSuspenseQuery(orpc.channel.list.queryOptions());
  const { workspaceId, channelId } = useParams<{
    workspaceId: string;
    channelId: string;
  }>();

  return (
    <div className="space-y-0.5 py-1">
      {channels.map((channel) => {
        const isActive = channel.id === channelId;

        return (
          <Link
            key={channel.id}
            href={`/workspaces/${workspaceId}/channel/${channel.id}`}
            className={buttonVariants({
              variant: "ghost",
              className: cn(
                "w-full justify-start px-2 py-1 h-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent",
                isActive && "bg-accent text-accent-foreground"
              ),
            })}
          >
            <Hash className="size-4" />
            <span className="truncate">{channel.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default ChannelList;
