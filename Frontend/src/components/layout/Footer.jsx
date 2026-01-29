import React from "react";

export default function Footer() {

  const footerLinks = {
    "Dịch vụ": [
      "Đặt vé online",
      "Thẻ thành viên",
      "Combo bắp nước",
      "Gift voucher",
    ],
    "Thể loại phim": [
      "Phim hành động",
      "Phim kinh dị",
      "Phim tình cảm",
      "Phim hoạt hình",
      "Phim khoa học viễn tưởng",
      "Phim tài liệu",
    ],
    "Hỗ trợ": [
      "Câu hỏi thường gặp",
      "Hướng dẫn đặt vé",
      "Điều khoản sử dụng",
      "Chính sách bảo mật",
      "Hotline: 0123456789",
    ],
    "Liên hệ": [
      "123 Nguyễn Huệ, Q1, TP.HCM",
      "456 Hai Bà Trưng, Q3, TP.HCM",
    ],
  };

  return (
   <footer className="relative py-6 md:py-7 text-indigo-100 bg-[#0a1126] border-t border-white/5">

      {/* galaxy overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_top_right,#a855f780,transparent_70%)]"></div>
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_bottom_left,#6366f180,transparent_70%)]"></div>
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_60%_80%,#c026d380,transparent_80%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4">

        <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8 items-start">

          {/* logo + mô tả */}
          <div className="md:w-1/3 flex flex-col items-start">
            <img 
              src="/src/assets/cinehub.png" 
              alt="Cinehubs Logo" 
              className="h-24 w-24 md:h-28 md:w-28 object-contain mb-2"
              
            />
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              Hệ thống rạp chiếu phim hàng đầu Việt Nam với công nghệ hiện đại và dịch vụ chất lượng cao.
              Mang đến trải nghiệm điện ảnh tuyệt vời nhất cho khách hàng.
            </p>
          </div>

          {/* menu */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 flex-1 text-sm">
            {Object.entries(footerLinks).map(([title, items]) => (
              <div key={title}>
                <h3 className="mb-3 font-medium text-white">{title}</h3>
                <ul className="space-y-1 text-sm">
                  {items.map((item, i) => (
                    <li key={i} className="footer-item">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
  <div className="text-[11px] md:text-xs text-white/50 border-t border-white/10 pt-3 mt-6">
          © {new Date().getFullYear()} Cinehubs. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
