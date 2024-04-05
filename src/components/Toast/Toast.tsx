import { type FC } from "react";

interface ToastProps {
  id: number;
  message: string;
  severity: "success" | "error";
}

const Toast: FC<ToastProps> = ({ message, severity }) => {
  const color =
    severity == "error"
      ? "bg-destructive text-destructive-foreground"
      : "bg-primary text-primary-foreground";
  return (
    <div className={`w-96 rounded p-3 ${color} border-border border`}>
      {message}
    </div>
  );
};

export default Toast;
