import { useToast } from "../store/useToast";

export default function ToastContainer() {
  const toasts = useToast((s) => s.toasts);
  const removeToast = useToast((s) => s.removeToast);

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`
            min-w-[250px] max-w-[320px] px-4 py-3 rounded-lg shadow-lg cursor-pointer
            text-white animate-slide-in
            ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : toast.type === "warning"
                ? "bg-yellow-500"
                : "bg-gray-800"
            }
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
