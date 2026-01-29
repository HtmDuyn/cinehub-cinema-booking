import React, { useState } from "react";
import Banner from "../components/Banner";
import MovieCard from "../components/MovieCard";
import Starfield from "../components/ui/Starfield";



// HomePage component with safer rendering and improved galaxy background
export default function HomePage() {
  const [activeTab, setActiveTab] = useState("now");

  const allMovies = [
    {
      id: 1, title: "Avatar: The Way of Water", genre: "Sci-Fi, Adventure",
      rating: "8.2", image: "https://th.bing.com/th/id/R.318bd44528339e69e9dc3f4ab641cf53?rik=Zhd%2fxCNqmQS3Tg&pid=ImgRaw&r=0",
      type: "now", badge: "3D IMAX", age: "C13"
    },

    {
      id: 2, title: "Quỷ Ăn Tạng", genre: "Sci-Fi, Adventure",
      rating: "8.2", image: "https://metiz.vn/media/poster_film/rsz_ty2-teaser-poster.jpg",
      type: "now", badge: "3D IMAX", age: "C13"
    },

    {
      id: 3, title: "Thiên Đường Máu", genre: "Sci-Fi, Adventure",
    rating: "8.2", image: "https://starlight.vn/Areas/Admin/Content/Fileuploads/images/Poster2024/thien-duong-mau.jpg",
      type: "now", badge: "3D IMAX", age: "C13"
    },

    {
      id: 4, title: "Đất Rừng Phương Nam", genre: "Hành động",
      rating: "8.2", image: "https://i.pinimg.com/736x/0e/bc/f7/0ebcf758cb5f6b3b419bf54461696654.jpg",
      type: "now", badge: "2D", age: "C18"
    },

    {
      id: 5, title: "Đất Rừng Phương Nam", genre: "Kinh dị",
      rating: "7.5", image: "https://i.pinimg.com/736x/0e/bc/f7/0ebcf758cb5f6b3b419bf54461696654.jpg",
      type: "soon", badge: "2D", age: "C18"
    },

    {
      id: 6, title: "Con Kể Ba Nghe", genre: "Tâm lý, Lịch sử",
      rating: "8.0", image: "https://th.bing.com/th?id=OIF.FbCl6eHvSr%2be1uYO8Jxc%2fQ&rs=1&pid=ImgDetMain&o=7&rm=3",
      type: "special", badge: "2D", age: "P"
    },

    {
      id: 7, title: "Phim: Mai", genre: "Tâm lý, Tình cảm",
      rating: "8.9", image: "https://images.fandango.com/ImageRenderer/820/0/redesign/static/img/default_poster.png/0/images/masterrepository/fandango/235371/MAI-Official-Poster-NA-EUR_1632x2388.jpg",
      type: "now", badge: "2D", age: "C18"
    },

    {
      id: 8, title: "Ant-Man", genre: "Sci-Fi, Hành động",
      rating: "7.8", image: "https://arena.fpt.edu.vn/wp-content/uploads/2021/04/poster-phim-ant-man.jpg",
      type: "soon", badge: "3D", age: "C13"
    },

    {
      id: 9, title: "Con Kể Ba Nghe", genre: "Sci-Fi Adventure",
      rating: "8.7", image: "https://th.bing.com/th?id=OIF.FbCl6eHvSr%2be1uYO8Jxc%2fQ&rs=1&pid=ImgDetMain&o=7&rm=3",
      type: "now", badge: "3D IMAX", age: "C13"
    },

    {
      id: 10, title: "Ant-Man", genre: "Sci-Fi Adventure",
      rating: "7.8", image: "https://arena.fpt.edu.vn/wp-content/uploads/2021/04/poster-phim-ant-man.jpg",
      type: "now", badge: "3D IMAX", age: "C13"
    },

    {
      id: 11, title: "Thiên Đường Máu", genre: "Sci-Fi, Adventure",
    rating: "8.2", image: "https://starlight.vn/Areas/Admin/Content/Fileuploads/images/Poster2024/thien-duong-mau.jpg",
      type: "soon", badge: "3D IMAX", age: "C13"
    },


    {
      id: 13, title: "Con Kể Ba Nghe", genre: "Sci-Fi Adventure",
      rating: "8.7", image: "https://th.bing.com/th?id=OIF.FbCl6eHvSr%2be1uYO8Jxc%2fQ&rs=1&pid=ImgDetMain&o=7&rm=3",
      type: "soon", badge: "3D IMAX", age: "C13"
    },

    {
      id: 14, title: "Nhà Bà Nữ", genre: "Tâm lý tình cảm",
      rating: "8.0", image: "https://mtg.1cdn.vn/2022/12/29/nbn_main-poster-fb-merged.jpg",
      type: "special", badge: "2D", age: "P"
    },
     {
      id: 15, title: "Đào Phở Và Piano", genre: "Lịch sử, Tâm lý tình cảm",
      rating: "7.8", image: "https://cdnmedia.baotintuc.vn/Upload/EqV5H9rWgvy9oNikwkHLXA/files/20022024-daophovapiano-1.jpg",
      type: "special", badge: "3D", age: "C13"
    },
  ];

  const filteredMovies = allMovies.filter((movie) => movie.type === activeTab);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 30% 20%, rgba(46,80,140,0.7) 0%, rgba(20,35,70,0.85) 35%, rgba(8,14,30,0.95) 65%, #02060F 100%) 0%, rgba(10,20,45,0.9) 40%, #030712 100%)",
      }}
    >
      <Starfield />
      {/* Galaxy Nebula Layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] rounded-full bg-blue-700/30 blur-[200px]" />
        <div className="absolute bottom-[0%] right-[0%] w-[500px] h-[500px] rounded-full bg-indigo-600/25 blur-[200px]" />
        <div className="absolute top-[40%] left-[60%] w-[350px] h-[350px] rounded-full bg-cyan-500/20 blur-[160px]" />

        {/* Một vài dải sáng mờ như tinh vân, tránh cảm giác "tuyết rơi" */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={`nebula-${i}`}
              className="absolute rounded-full blur-[120px]"
              style={{
                width: `${220 + Math.random() * 280}px`,
                height: `${140 + Math.random() * 220}px`,
                top: `${10 + Math.random() * 80}%`,
                left: `${-10 + Math.random() * 120}%`,
                background:
                  Math.random() > 0.5
                    ? "radial-gradient(circle, rgba(129,140,248,0.85), transparent)"
                    : "radial-gradient(circle, rgba(56,189,248,0.7), transparent)",
                opacity: 0.45,
                transform: `rotate(${Math.random() * 40 - 20}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <Banner />

        <section className="max-w-7xl mx-auto px-4 pt-16 pb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white uppercase tracking-wide">
              {activeTab === "now"
                ? "Phim đang chiếu"
                : activeTab === "soon"
                  ? "Phim sắp chiếu"
                  : "Suất chiếu đặc biệt"}
            </h2>

            <div className="flex justify-center gap-8 mt-6 text-sm font-semibold">
              {["now", "soon", "special"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-1 border-b-2 transition-all duration-300 uppercase tracking-tight ${activeTab === tab
                      ? "text-yellow-400 border-yellow-400"
                      : "text-gray-300 border-transparent hover:text-white"
                    }`}
                >
                  {tab === "now"
                    ? "Đang chiếu"
                    : tab === "soon"
                      ? "Sắp chiếu"
                      : "Suất đặc biệt"}
                </button>
              ))}
            </div>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-14 gap-x-8 justify-items-center">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  genre={movie.genre}
                  rating={movie.rating}
                  image={movie.image}
                  badge={movie.badge}
                  age={movie.age}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="text-gray-400 text-lg italic">
                Hiện tại chưa có phim trong mục này.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
