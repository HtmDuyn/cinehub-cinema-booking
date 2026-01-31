import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(
    () => localStorage.getItem("avatarUrl") || ""
  );
  const fileInputRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleGoProfile = () => {
    setIsMenuOpen(false);
    navigate("/profile");
  };

  const handleGoMembership = () => {
    setIsMenuOpen(false);
    navigate("/membership");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                className="px-4 py-1.5 rounded-md text-sm font-semibold text-slate-950 bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 shadow-md transition-all duration-200 hover:from-emerald-300 hover:via-cyan-300 hover:to-sky-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              >
                Đăng Ký
              </Link>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-md text-sm font-semibold text-slate-950 bg-gradient-to-r from-sky-200 via-blue-300 to-indigo-300 shadow-md transition-all duration-200 hover:from-indigo-300 hover:via-blue-300 hover:to-sky-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-300"
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
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-indigo-100 max-w-[150px] truncate hover:text-white"
                >
                  <span className="truncate">
                    {user?.fullName || user?.username || "Thành viên"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-950/95 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.75)] py-1 text-sm text-slate-100">
                    <button
                      type="button"
                      onClick={handleGoProfile}
                      className="w-full px-3 py-2 text-left hover:bg-white/5"
                    >
                      Hồ sơ cá nhân
                    </button>
                    <button
                      type="button"
                      onClick={handleGoMembership}
                      className="w-full px-3 py-2 text-left hover:bg-white/5"
                    >
                      Thẻ thành viên
                    </button>
                    <div className="my-1 border-t border-white/10" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-red-300 hover:bg-red-500/10 hover:text-red-200"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
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