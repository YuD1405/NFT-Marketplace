import React, { useEffect, useState } from "react";
import "./Toast.css";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let addToastExternally: (toast: Omit<Toast, "id">) => void = () => {};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToastExternally = (toast) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, ...toast }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
  }, []);

  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "📢";
      default:
        return "";
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span className="toast-icon">{getIcon(toast.type)}</span>
          <span className="toast-message">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

// Cho phép gọi từ bên ngoài
export function showToast(message: string, type: "success" | "error" | "info" = "success") {
  addToastExternally({ message, type });
}
