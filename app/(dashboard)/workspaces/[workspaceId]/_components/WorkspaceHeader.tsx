"use client";

import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";

const WorkspaceHeader = () => {
  const {
    data: { currentWorkspace },
  } = useSuspenseQuery(orpc.channel.list.queryOptions());

  return <h2 className="text-lg font-semibold">{currentWorkspace.orgName}</h2>;
};

export default WorkspaceHeader;
