import { ReactNode } from "react";
import WorkspaceList from "./workspaces/_components/WorkspaceList";
import CreateWorkspace from "./workspaces/_components/CreateWorkspace";
import UserNav from "./workspaces/_components/UserNav";

const WorkspaceLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full h-screen">
      <div className="flex h-full w-16 flex-col items-center bg-secondary py-3 px-2 border-r border-border">
        <WorkspaceList />

        <div className="mt-4">
          <CreateWorkspace />
        </div>

        <div className="mt-auto">
          <UserNav />
        </div>
      </div>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default WorkspaceLayout;
