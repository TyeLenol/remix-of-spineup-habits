import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingLayout,
});

function OnboardingLayout() {
  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col overflow-hidden">
      <Outlet />
    </div>
  );
}
