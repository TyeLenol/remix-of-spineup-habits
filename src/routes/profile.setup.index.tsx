import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/setup/")({
  beforeLoad: () => {
    throw redirect({ to: "/profile/setup/$step", params: { step: "1" } });
  },
});