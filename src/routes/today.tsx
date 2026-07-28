import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/today")({
  component: TodayLayout,
});

function TodayLayout() {
  return (
    <div className="min-h-dvh bg-warm-bg">
      <div className="mx-auto w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
