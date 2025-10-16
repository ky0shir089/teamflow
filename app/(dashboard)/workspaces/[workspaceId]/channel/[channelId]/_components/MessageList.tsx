"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import MessageItem from "./message/MessageItem";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const MessageList = () => {
  const { channelId } = useParams<{ channelId: string }>();

  const [hasInitialScroll, setHasInitialScroll] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [newMessages, setNewMessages] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastItemIdRef = useRef<string | undefined>(undefined);

  const infinteOptions = orpc.message.list.infiniteOptions({
    input: (pageParams: string | undefined) => ({
      channelId,
      cursor: pageParams,
      limit: 7,
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => ({
      pages: [...data.pages]
        .map((page) => ({ ...page, items: [...page.items].reverse() }))
        .reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    ...infinteOptions,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!hasInitialScroll && data?.pages.length) {
      const el = scrollRef.current;

      if (el) {
        el.scrollTop = el.scrollHeight;
        setHasInitialScroll(true);
        setIsAtBottom(true);
      }
    }
  }, [hasInitialScroll, data?.pages.length]);

  const isNearBottom = (el: HTMLDivElement) =>
    el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

  const handleScroll = () => {
    const el = scrollRef.current;

    if (!el) return;

    if (el.scrollTop <= 80 && hasNextPage && !isFetching) {
      const prevScrollHeight = el.scrollHeight;
      const prevScrollTop = el.scrollTop;

      fetchNextPage().then(() => {
        const newScrollHeight = el.scrollHeight;
        el.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
      });
    }

    setIsAtBottom(isNearBottom(el));
  };

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  useEffect(() => {
    if (!items.length) return;

    const lastId = items[items.length - 1].id;

    const prevLastId = lastItemIdRef.current;

    const el = scrollRef.current;

    if (prevLastId && lastId !== prevLastId) {
      if (el && isNearBottom(el)) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });

        setNewMessages(false);
        setIsAtBottom(true);
      } else {
        setNewMessages(true);
      }
    }

    lastItemIdRef.current = lastId;
  }, [items]);

  const scrollToBottom = () => {
    const el = scrollRef.current;

    if (!el) return;

    el.scrollTop = el.scrollHeight;

    setNewMessages(false);
    setIsAtBottom(true);
  };

  return (
    <div className="relative h-full ">
      <div
        className="h-full overflow-auto px-4"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {items.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        <div ref={bottomRef} />

        {newMessages && !isAtBottom ? (
          <Button
            className="absolute bottom-4 right-8 rounded-full"
            onClick={scrollToBottom}
          >
            New Message
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default MessageList;
