# Hướng Dẫn Thực Hiện Chức Năng Guest User

## 📋 Mục Tiêu
Thực hiện đầy đủ các yêu cầu cho Guest (Khách chưa đăng nhập):
- ✅ Xem danh sách phim
- ✅ Xem chi tiết phim (mô tả, trailer, thời lượng, thể loại, rating)
- ✅ Tìm kiếm phim theo tên
- ✅ Tìm kiếm phim theo thể loại
- ✅ Đăng ký tài khoản mới

---

## ✨ Những Cải Tiến Đã Thực Hiện

### 1. **Model Layer** (Backend/src/main/java/com/cinehub/model/)

#### Movie.java
**Thay đổi:**
- ✅ Thêm trường `trailerUrl` để lưu URL của trailer
- Trường này cho phép guest users xem trailer phim trước khi quyết định

```java
@Column(name = "trailer_url")
private String trailerUrl;
```

**Các trường có sẵn:**
- `id`: ID duy nhất của phim
- `title`: Tên phim
- `description`: Mô tả chi tiết phim
- `genre`: Thể loại phim
- `duration`: Thời lượng (phút)
- `releaseDate`: Ngày phát hành
- `posterUrl`: URL hình poster
- `trailerUrl`: URL trailer (MỚI)
- `rating`: Đánh giá (điểm)
- `createdAt`: Thời gian tạo

---

### 2. **Repository Layer** (Backend/src/main/java/com/cinehub/repository/)

#### MovieRepository.java
**Thay đổi:** Thêm các phương thức tìm kiếm nâng cao

```java
// Tìm kiếm theo tên (LIKE, không phân biệt hoa/thường)
@Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))")
List<Movie> searchByTitle(@Param("title") String title);

// Tìm kiếm theo thể loại (không phân biệt hoa/thường)
@Query("SELECT m FROM Movie m WHERE LOWER(m.genre) = LOWER(:genre)")
List<Movie> findByGenreIgnoreCase(@Param("genre") String genre);

// Tìm kiếm theo từ khóa (tên hoặc thể loại)
@Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.genre) LIKE LOWER(CONCAT('%', :keyword, '%'))")
List<Movie> searchByKeyword(@Param("keyword") String keyword);
```

**Lợi ích:**
- Tìm kiếm không phân biệt chữ hoa/thường
- Hỗ trợ tìm kiếm từng phần tên
- Query tối ưu hơn với `LIKE` thay vì `findByTitle`

---

### 3. **Service Layer** (Backend/src/main/java/com/cinehub/service/)

#### MovieService.java
**Thay đổi:** Thêm các phương thức service mới

```java
// Guest Methods - Xem danh sách phim
public List<Movie> getAllMovies()

// Guest Methods - Xem chi tiết phim
public Optional<Movie> getMovieById(Long id)

// Guest Methods - Tìm kiếm theo thể loại
public List<Movie> getMoviesByGenre(String genre)

// Guest Methods - Tìm kiếm theo tên phim
public List<Movie> searchMoviesByTitle(String title)

// Guest Methods - Tìm kiếm theo từ khóa
public List<Movie> searchMoviesByKeyword(String keyword)

// Admin Methods - Tạo phim mới
public Movie createMovie(Movie movie)

// Admin Methods - Cập nhật phim
public Movie updateMovie(Long id, Movie movieDetails)

// Admin Methods - Xóa phim
public void deleteMovie(Long id)
```

**Cập nhật updateMovie để hỗ trợ trailerUrl:**
```java
movie.setTrailerUrl(movieDetails.getTrailerUrl());
```

#### UserService.java
**Đã có sẵn:**
```java
public User registerUser(UserRegistrationDTO registrationDTO)
public Optional<User> findByEmail(String email)
```

**Chức năng:**
- Validate email không trùng
- Hash mật khẩu với PasswordEncoder
- Tạo user mới với isAdmin = false

---

### 4. **Controller Layer** (Backend/src/main/java/com/cinehub/controller/)

#### MovieController.java
**Thay đổi:** Thêm các endpoint cho Guest users + Javadoc chi tiết

**Các Endpoint:**

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/movies` | Lấy danh sách tất cả phim | ❌ |
| GET | `/api/movies/{id}` | Lấy chi tiết phim theo ID | ❌ |
| GET | `/api/movies/genre/{genre}` | Lấy phim theo thể loại | ❌ |
| GET | `/api/movies/search?title=...` | Tìm kiếm phim theo tên | ❌ |
| GET | `/api/movies/search-keyword?keyword=...` | Tìm kiếm theo từ khóa | ❌ |
| POST | `/api/movies` | Tạo phim mới | ✅ Admin |
| PUT | `/api/movies/{id}` | Cập nhật phim | ✅ Admin |
| DELETE | `/api/movies/{id}` | Xóa phim | ✅ Admin |

#### AuthController.java
**Đã có sẵn:**
```java
@PostMapping("/register")  // Đăng ký tài khoản mới
public ResponseEntity<AuthResponseDTO> register(...)

@PostMapping("/login")     // Đăng nhập
public ResponseEntity<AuthResponseDTO> login(...)
```

---

## 🚀 Cách Sử Dụng API

### Bước 1: Guest Xem Danh Sách Phim
```bash
curl -X GET "http://localhost:8080/api/movies"
```

### Bước 2: Guest Xem Chi Tiết Phim (Kể cả Trailer)
```bash
curl -X GET "http://localhost:8080/api/movies/1"
```

**Response:**
```json
{
  "id": 1,
  "title": "Avatar: The Way of Water",
  "description": "...",
  "genre": "Khoa học viễn tưởng",
  "duration": 192,
  "releaseDate": "2022-12-16",
  "posterUrl": "https://...",
  "trailerUrl": "https://youtube.com/watch?v=...",
  "rating": 4.8,
  "createdAt": "2024-01-15T10:30:00"
}
```

### Bước 3: Guest Tìm Kiếm Phim
```bash
# Tìm theo tên
curl -X GET "http://localhost:8080/api/movies/search?title=Avatar"

# Tìm theo thể loại
curl -X GET "http://localhost:8080/api/movies/genre/Hành%20động"

# Tìm theo từ khóa
curl -X GET "http://localhost:8080/api/movies/search-keyword?keyword=Sci-Fi"
```

### Bước 4: Guest Đăng Ký Tài Khoản
```bash
curl -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "MyPassword123",
    "fullName": "John Doe",
    "phone": "0123456789"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

### Bước 5: Người Dùng Đăng Nhập
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "MyPassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📁 Cấu Trúc File Thay Đổi

```
Backend/
  src/main/java/com/cinehub/
    ├── model/
    │   └── Movie.java                    [✏️ Cập nhật: +trailerUrl]
    ├── repository/
    │   └── MovieRepository.java          [✏️ Cập nhật: +3 methods]
    ├── service/
    │   ├── MovieService.java             [✏️ Cập nhật: +comments, +trailerUrl]
    │   └── UserService.java              [✅ Đã có sẵn]
    └── controller/
        ├── MovieController.java          [✏️ Cập nhật: +1 endpoint, +Javadoc]
        └── AuthController.java           [✅ Đã có sẵn]
```

---

## 🔐 Bảo Mật

### Guest Users (Không Xác Thực)
- ✅ Có thể xem danh sách phim
- ✅ Có thể xem chi tiết phim
- ✅ Có thể tìm kiếm phim
- ❌ Không thể tạo/cập nhật/xóa phim
- ❌ Không thể đặt vé

### Registered Users (Đã Đăng Ký)
- ✅ Tất cả quyền của Guest
- ✅ Có thể đặt vé
- ❌ Không thể tạo/cập nhật/xóa phim

### Admin Users
- ✅ Tất cả quyền
- ✅ Có thể tạo/cập nhật/xóa phim
- ✅ Có thể quản lý phim

---

## 🧪 Testing với Postman

1. **Import Collection:** Tạo folder "Guest Features"
2. **Tạo các request:**
   - GET /api/movies
   - GET /api/movies/1
   - GET /api/movies/genre/Hành động
   - GET /api/movies/search?title=Avatar
   - POST /api/auth/register
   - POST /api/auth/login

3. **Variables:**
   - `base_url` = `http://localhost:8080`
   - `jwt_token` = Lưu token từ login response

---

## 📝 Database Schema Mới (nếu cần migration)

```sql
-- Thêm cột trailerUrl nếu chưa có
ALTER TABLE movies ADD COLUMN trailer_url VARCHAR(500);
```

---

## ✅ Checklist Hoàn Thành

- ✅ Model Movie có trailerUrl
- ✅ Repository có searchByTitle, findByGenreIgnoreCase, searchByKeyword
- ✅ Service có tất cả guest methods
- ✅ Controller có tất cả guest endpoints
- ✅ AuthController hỗ trợ đăng ký
- ✅ API Documentation đầy đủ
- ✅ Javadoc trong code

---

## 🎯 Những Yêu Cầu Đã Thực Hiện

| Yêu Cầu | Trạng Thái | Endpoint |
|---------|-----------|----------|
| Xem danh sách phim | ✅ | GET /api/movies |
| Xem chi tiết phim | ✅ | GET /api/movies/{id} |
| Tìm kiếm theo tên | ✅ | GET /api/movies/search?title=... |
| Tìm kiếm theo thể loại | ✅ | GET /api/movies/genre/{genre} |
| Tìm kiếm theo từ khóa | ✅ | GET /api/movies/search-keyword?keyword=... |
| Xem trailer | ✅ | GET /api/movies/{id} (trailerUrl) |
| Đăng ký tài khoản | ✅ | POST /api/auth/register |

