import { type FC, type ReactNode, useState } from "react";
import { ToastContext } from "./ToastContext";
import Toast from "./Toast";

interface ToastProviderProps {
  children: ReactNode;
}

type ToastType = {
  message: string;
  id: number;
  severity: "success" | "error";
};

const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  return (
    <ToastContext.Provider
      value={{
        close(id) {
          setToasts((t) => t.filter((v) => v.id !== id));
        },
        create(message, severity) {
          const id = Date.now();
          setToasts(toasts.concat({ id, message, severity }));
          setTimeout(() => this.close(id), 3000);
        },
      }}
    >
      {children}
      <div className="absolute bottom-0 right-0 flex flex-col gap-1">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            severity={t.severity}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
