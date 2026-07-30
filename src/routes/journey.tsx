import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/journey")({
  component: JourneyLayout,
});

function JourneyLayout() {
  return (
    <div className="min-h-dvh bg-warm-bg">
      <div className="mx-auto w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
