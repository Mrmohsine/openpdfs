"use client";

import { Provider } from "react-redux";
import store from "@/store/store";
import { ToastContainer } from "react-toastify/unstyled";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Provider store={store}>
        <ToastContainer />
        {children}
      </Provider>
    </div>
  );
}
