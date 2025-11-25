import { toast, ToastOptions } from 'react-toastify';

export default function customToastAlert(
  text: string,
  type: "error" | "success" | "warning" = "error",
  timeOutMs: number = 5000,
) {
  
  const data: ToastOptions = {
    position: "top-right",
    autoClose: timeOutMs,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  }

  switch(type) {
    case "error":
        return toast.error(text, data);
      case "success":
        return toast.success(text, data);
      default:
        return toast.warn(text, data);
  }
}