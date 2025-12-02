import { useTheme } from "@/context/ThemeContext";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, setAppTheme } = useTheme();

  const isDark = theme == "dark";

  return (
    <Button size="icon" onClick={() => setAppTheme(isDark ? "light" : "dark")}>
      {isDark ? (
        <Moon className="h-1.5 w-1.5"></Moon>
      ) : (
        <Sun className="h-1.5 w-1.5"></Sun>
      )}
    </Button>
  );
};
