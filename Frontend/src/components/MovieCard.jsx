import React from "react";

export default function MovieCard({ title, genre, rating, image, badge, age }) {
  return (
    <div className="w-full sm:w-64 rounded-2xl overflow-hidden bg-blue-100 shadow-lg transition-all duration-300 hover:-translate-y-2 group">
      {/* Hình ảnh Poster & Badges */}
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badge Định dạng (2D/3D/IMAX) - Góc trên bên trái */}
        {badge && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md uppercase z-10">
            {badge}
          </div>
        )}
        {/* Badge Độ tuổi (C13, C18, P) - Góc trên bên phải */}
        {age && (
          <div
            className={`absolute top-3 right-3 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10
              ${age === "C18" ? "bg-red-500" : age === "C13" ? "bg-yellow-600" : "bg-green-600"}`}
          >
            {age}
          </div>
        )}
        {/* Lớp phủ gradient để làm nổi bật nội dung */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Nội dung bên dưới */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 truncate" title={title}>
          {title}
        </h3>

        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Thể loại:</span> {genre}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Rating:</span>{" "}
            <span className="text-yellow-600 font-bold">{rating}</span>/10
          </p>
        </div>

        {/* Nhóm nút bấm */}
        <div className="flex justify-between gap-3 mt-4">
          <button className="flex-1 bg-gray-800 text-white text-sm font-semibold py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Xem chi tiết
          </button>
          <button className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
}