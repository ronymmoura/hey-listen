import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div>
      <div>Root</div>

      <Outlet />
    </div>
  );
}
