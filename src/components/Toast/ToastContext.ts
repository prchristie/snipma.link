import { createContext, useContext } from "react";

type ToastContextType = {
  create: (message: string, severity: "success" | "error") => void;
  close: (id: number) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export const useToast = () => useContext(ToastContext);
