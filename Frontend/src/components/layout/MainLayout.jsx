import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header"; // Dùng "./" để chỉ file cùng thư mục
import Footer from "./Footer";

export default function MainLayout() {
  return (
    // Màu nền gốc nên trùng với màu đậm nhất của HomePage
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Header />
      <main className="flex-grow">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}


