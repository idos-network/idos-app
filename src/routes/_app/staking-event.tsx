import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/staking-event")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/staking-event"!</div>;
}
