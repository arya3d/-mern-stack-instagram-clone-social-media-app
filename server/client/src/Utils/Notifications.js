import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export const standardNotification = (notify, type) => {
  toast(notify, {
    type,
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 4000,
  });
};