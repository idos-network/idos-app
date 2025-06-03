import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/idos-profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/idos-profile"!</div>;
}
