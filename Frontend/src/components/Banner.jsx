import React from "react";

export default function Banner() {
  return (
    <section className="relative w-full">
      <div
        className="relative overflow-hidden py-12 md:py-16 text-white"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, #1e40afee 0%, transparent 65%),
            radial-gradient(ellipse at 80% 60%, #7c3aedee 0%, transparent 70%),
            linear-gradient(120deg, #0a1126 0%, #181c3a 60%, #1e1b4b 100%)
          `
        }}
      >
        {/* Galaxy smoke & animated stars overlay */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Galaxy smoke */}
          <div className="galaxy-smoke" />
          {/* Animated stars */}
          <div className="absolute inset-0 z-20 animate-pulse">
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white opacity-80"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: `blur(${Math.random() * 1.5}px)`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 z-30">
          {/* Content */}
          <div className="flex-1">
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-medium">
              Phim nổi bật
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold mt-3 leading-tight drop-shadow-lg">
              Avatar: The Way of Water
            </h1>

            <p className="mt-4 text-indigo-100 max-w-md leading-relaxed text-sm md:text-base">
              Trải nghiệm điện ảnh đỉnh cao với công nghệ IMAX 3D & âm thanh sống động.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 font-semibold shadow-xl hover:scale-[1.03] transition-transform">
                Đặt vé ngay
              </button>

              <input
                className="bg-white/10 placeholder-indigo-200 text-white rounded-lg px-4 py-3 w-full sm:w-72 outline-none border border-white/10 focus:border-indigo-400 transition"
                placeholder="Tìm phim, rạp, suất chiếu..."
              />
            </div>
          </div>

          {/* Poster */}
          <div className="relative w-56 md:w-72 aspect-[3/4] rounded-xl overflow-hidden shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6)] border border-white/10">
            <img
              src="https://image.tmdb.org/t/p/original/8Y7WrRK1iQHEX7UIftBeBMjPjWD.jpg"
              alt="avatar poster"
              className="w-full h-full object-cover"
            />
            {/* gradient dưới poster */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
