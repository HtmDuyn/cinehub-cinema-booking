import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout"; // Dòng này sẽ hết lỗi nếu file đã tồn tại
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ResetPassword from "../pages/ResetPassword";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      { path: "/", element: <HomePage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />, // trang đăng nhập riêng, không có header/footer
  },
  {
    path: "/register",
    element: <RegisterPage />, // trang đăng ký riêng, không có header/footer
  },
  {
    path: "/reset-password",
    element: <ResetPassword />, // trang đặt lại mật khẩu từ link email
  },
]);

export default routes;