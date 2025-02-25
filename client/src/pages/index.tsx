import { useLayoutEffect } from "react";
import { Outlet } from "react-router";

export function RootLayout() {
  useLayoutEffect(() => {
    setTheme();
  }, []);

  // function handleToggleTheme() {
  //   if (!("theme" in localStorage) || localStorage.theme === "dark") {
  //     localStorage.theme = "light";
  //   } else {
  //     localStorage.theme = "dark";
  //   }

  //   setTheme();
  // }

  function setTheme() {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
    );
  }

  return (
    <div>
      {/* <div>Root</div>
      <button onClick={handleToggleTheme}>Toggle Theme</button> */}

      <Outlet />
    </div>
  );
}
