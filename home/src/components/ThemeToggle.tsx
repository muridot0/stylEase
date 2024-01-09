import { useEffect, useState } from "preact/hooks";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");

  const handleClick = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button class="mr-8 flex items-center" onClick={handleClick}>
      {theme === "light" ? (
        <>
          <span class="material-symbols-rounded mr-2 text-base">
            dark_mode
          </span>
          Dark mode
        </>
      ) : (
        <>
          <span class="material-symbols-rounded mr-2 text-base">
            light_mode
          </span>
          Light mode
        </>
      )}
    </button>
  );
}
