import { WorkspaceClient } from "./workspace-client";

export const metadata = {
  title: "Workspace — MyVenue",
  description: "Design and manage your venue layouts",
};

export default function WorkspacePage() {
  return <WorkspaceClient />;
}
