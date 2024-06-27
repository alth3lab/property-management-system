"use client";
import { createContext, useContext, useState } from "react";
import { DisplayLoadingAndErrors } from "@/app/components/loading/DisplayLoadingAndErrors";
import "react-toastify/dist/ReactToastify.css";

export const ToastContext = createContext(null);
export default function ToastProvider({ children }) {
  const [loading, setLoading] = useState(false);
  return (
    <ToastContext.Provider value={{ setLoading }}>
      <DisplayLoadingAndErrors loading={loading} />
      {children}
    </ToastContext.Provider>
  );
}
export const useToastContext = () => {
  const context = useContext(ToastContext);
  return context;
};
