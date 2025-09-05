import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme); // "dark" or "light"

  useEffect(() => {
    // Apply theme class to <body>
    document.body.classList.remove("dark", "light");
    document.body.classList.add(theme || "dark"); // default = dark (Wednesday vibe)
  }, [theme]);

  return <>{children}</>;
}
