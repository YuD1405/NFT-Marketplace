// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn lên top mỗi lần path thay đổi
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Không render gì cả
}
