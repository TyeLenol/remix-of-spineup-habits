import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/setup")({
  component: ProfileSetupLayout,
});

function ProfileSetupLayout() {
  return (
    <div
      className="relative mx-auto flex min-h-dvh max-w-md flex-col overflow-hidden"
      style={{ background: "var(--warm-bg)", color: "var(--warm-ink)" }}
    >
      <Outlet />
    </div>
  );
}