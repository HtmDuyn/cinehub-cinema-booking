import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(
    () => localStorage.getItem("avatarUrl") || ""
  );
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setAvatarUrl(result);
        localStorage.setItem("avatarUrl", result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className="site-header sticky top-0 z-40 backdrop-blur-md bg-[rgba(10,8,25,0.45)] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo bên trái */}
        <div className="logo flex items-center gap-2">
          <img 
            src="/src/assets/cinehub.png" 
            alt="Cinehubs Logo" 
            className="h-26 w-20 object-contain"
          />
        </div>

        {/* Menu ra giữa */}
        <nav className="hidden md:flex gap-14 text-sm text-indigo-100">
          {[
            { label: "Mua vé", href: "#" },
            { label: "Phim", href: "#" },
            { label: "Giá vé", href: "#" },
            { label: "Dịch vụ", href: "#" },
            { label: "Giới thiệu", href: "#" }
          ].map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              className="relative hover:text-white transition after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-indigo-400 after:transition-all after:duration-200 hover:after:w-full"
              style={{ paddingBottom: 2 }}
            >
              {item.label}
            </a>
          ))}
        </nav>

    {/* Login / User bên phải */}
  <div className="flex items-center gap-3">
    {!isAuthenticated ? (
      <>
        <Link
          to="/register"
        className="px-4 py-1.5 rounded-md text-sm font-semibold text-slate-950 bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 shadow-md transition-all duration-200
          hover:from-emerald-300 hover:via-cyan-300 hover:to-sky-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          Đăng Ký
        </Link>
        <Link
          to="/login"
          className="px-4 py-1.5 rounded-md text-sm font-semibold text-slate-950 bg-gradient-to-r from-sky-200 via-blue-300 to-indigo-300 shadow-md transition-all duration-200
            hover:from-indigo-300 hover:via-blue-300 hover:to-sky-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          Đăng nhập
        </Link>
      </>
    ) : (
      <>
        <button
          type="button"
          onClick={handleAvatarClick}
          className="relative h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-fuchsia-400 overflow-hidden"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <span>
              {(user?.fullName || user?.username || "")
                .charAt(0)
                .toUpperCase() || "U"}
            </span>
          )}
        </button>
        <span className="hidden sm:inline-block text-sm font-semibold text-indigo-100 max-w-[120px] truncate">
          {user?.fullName || user?.username || "Thành viên"}
        </span>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          className="hidden"
        />
      </>
    )}
  </div>
      </div>
    </header>
  );
}