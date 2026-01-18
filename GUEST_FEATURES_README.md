# 🎬 CineHub - Guest User Features (Chức Năng Khách Không Đăng Nhập)

## 📋 Tổng Quan Tính Năng

Các chức năng dưới đây cho phép khách hàng **chưa đăng nhập** (Guest Users) khám phá dịch vụ cinema:

### ✅ Đã Thực Hiện

| # | Chức Năng | Endpoint | HTTP Method | Yêu Cầu Auth |
|---|-----------|----------|-------------|-------------|
| 1 | Xem danh sách phim | `/api/movies` | GET | ❌ |
| 2 | Xem chi tiết phim (kèm trailer) | `/api/movies/{id}` | GET | ❌ |
| 3 | Tìm kiếm theo tên phim | `/api/movies/search?title=...` | GET | ❌ |
| 4 | Tìm kiếm theo thể loại | `/api/movies/genre/{genre}` | GET | ❌ |
| 5 | Tìm kiếm theo từ khóa | `/api/movies/search-keyword?keyword=...` | GET | ❌ |
| 6 | Đăng ký tài khoản | `/api/auth/register` | POST | ❌ |
| 7 | Đăng nhập | `/api/auth/login` | POST | ❌ |

---

## 🔧 Chi Tiết Kỹ Thuật

### Backend Stack
- **Framework:** Spring Boot 3.x
- **Language:** Java 17+
- **Database:** JPA/Hibernate
- **Security:** JWT Token
- **API:** RESTful

### Files Thay Đổi
```
Backend/
├── src/main/java/com/cinehub/
│   ├── model/
│   │   └── Movie.java                    [✏️ +trailerUrl]
│   ├── repository/
│   │   └── MovieRepository.java          [✏️ +3 custom queries]
│   ├── service/
│   │   ├── MovieService.java             [✏️ +searchByKeyword]
│   │   └── UserService.java              [✅ registerUser]
│   └── controller/
│       ├── MovieController.java          [✏️ +search-keyword]
│       └── AuthController.java           [✅ register, login]
│
├── GUEST_API_ENDPOINTS.md                [🆕 API Documentation]
├── IMPLEMENTATION_GUIDE.md               [🆕 Implementation Guide]
├── CineHub-Guest-Features.postman_collection.json  [🆕 Postman Collection]
└── sample-data.sql                       [🆕 Sample Data]
```

---

## 🚀 Hướng Dẫn Sử Dụng

### Yêu Cầu
- Java 17 hoặc cao hơn
- Maven 3.6+
- PostgreSQL (hoặc MySQL)

### Cài Đặt & Chạy

```bash
# 1. Clone repository
git clone <repository-url>
cd cinehub-cinema-booking

# 2. Cấu hình database
# Sửa file: Backend/src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cinehub
spring.datasource.username=your_username
spring.datasource.password=your_password

# 3. Chạy sample data (optional)
psql -U your_username -d cinehub -f sample-data.sql

# 4. Build & Run
cd Backend
mvn clean package
mvn spring-boot:run

# Server sẽ chạy tại: http://localhost:8080
```

---

## 📚 API Examples

### 1️⃣ Xem Danh Sách Phim
```bash
curl -X GET "http://localhost:8080/api/movies" \
  -H "Accept: application/json"
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Avatar: The Way of Water",
    "description": "...",
    "genre": "Khoa học viễn tưởng",
    "duration": 192,
    "releaseDate": "2022-12-16",
    "posterUrl": "https://...",
    "trailerUrl": "https://youtube.com/watch?v=d9MyW72ELq0",
    "rating": 4.8,
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

### 2️⃣ Xem Chi Tiết Phim (Kèm Trailer)
```bash
curl -X GET "http://localhost:8080/api/movies/1" \
  -H "Accept: application/json"
```

### 3️⃣ Tìm Kiếm Theo Tên
```bash
curl -X GET "http://localhost:8080/api/movies/search?title=Avatar" \
  -H "Accept: application/json"
```

### 4️⃣ Tìm Kiếm Theo Thể Loại
```bash
curl -X GET "http://localhost:8080/api/movies/genre/Hành%20động" \
  -H "Accept: application/json"
```

### 5️⃣ Đăng Ký Tài Khoản
```bash
curl -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
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

### 6️⃣ Đăng Nhập
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
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

## 🧪 Testing

### Sử Dụng Postman
1. Import file: `CineHub-Guest-Features.postman_collection.json`
2. Đặt `base_url` variable: `http://localhost:8080`
3. Chạy từng request để test

### Sử Dụng cURL
Xem examples trên

### Sử Dụng Browser
Chỉ có thể test các GET request:
```
http://localhost:8080/api/movies
http://localhost:8080/api/movies/1
http://localhost:8080/api/movies/search?title=Avatar
http://localhost:8080/api/movies/genre/Hành%20động
```

---

## 📊 Database Schema

### movies table
```sql
CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100) NOT NULL,
    duration DOUBLE PRECISION NOT NULL,
    release_date VARCHAR(20) NOT NULL,
    poster_url VARCHAR(500) NOT NULL,
    trailer_url VARCHAR(500),  -- ✅ New field
    rating DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### users table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Bảo Mật

### Guest Users (Không Xác Thực)
- ✅ Xem danh sách & chi tiết phim
- ✅ Tìm kiếm phim
- ✅ Đăng ký tài khoản
- ❌ Đặt vé, cập nhật thông tin, quản lý phim

### Registered Users (Đã Đăng Ký)
- ✅ Mọi quyền của Guest
- ✅ Đặt vé, xem lịch sử đặt vé
- ❌ Tạo/cập nhật/xóa phim (Admin only)

### Admin Users
- ✅ Tất cả quyền
- ✅ Quản lý phim (CRUD)
- ✅ Quản lý showings, theaters
- ✅ Quản lý users

---

## 📝 HTTP Status Codes

| Code | Ý Nghĩa | Ví Dụ |
|------|---------|-------|
| **200** | OK | Lấy phim thành công |
| **201** | Created | Đăng ký/tạo thành công |
| **400** | Bad Request | Email đã tồn tại |
| **401** | Unauthorized | Sai mật khẩu |
| **404** | Not Found | Phim không tồn tại |
| **500** | Server Error | Lỗi máy chủ |

---

## 🎯 Functional Requirements vs Implementation

| Requirement | Implementation | Status |
|-------------|-----------------|--------|
| Xem danh sách phim | GET /api/movies | ✅ |
| Xem chi tiết phim | GET /api/movies/{id} | ✅ |
| Mô tả phim | Movie.description | ✅ |
| Trailer phim | Movie.trailerUrl | ✅ |
| Thời lượng | Movie.duration | ✅ |
| Thể loại | Movie.genre | ✅ |
| Tìm theo tên | GET /api/movies/search | ✅ |
| Tìm theo thể loại | GET /api/movies/genre/{genre} | ✅ |
| Đăng ký tài khoản | POST /api/auth/register | ✅ |

---

## 📂 Tài Liệu Bổ Sung

| File | Mô Tả |
|------|-------|
| [GUEST_API_ENDPOINTS.md](./GUEST_API_ENDPOINTS.md) | API documentation chi tiết |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Hướng dẫn thực hiện |
| [CineHub-Guest-Features.postman_collection.json](./CineHub-Guest-Features.postman_collection.json) | Postman collection |
| [sample-data.sql](./sample-data.sql) | Sample data để test |

---

## 🐛 Troubleshooting

### Lỗi: "Database connection refused"
- Kiểm tra MySQL/PostgreSQL đang chạy
- Sửa credentials trong `application.properties`

### Lỗi: "Email already exists"
- Email đã được đăng ký
- Sử dụng email khác

### Lỗi: "Invalid password"
- Kiểm tra mật khẩu nhập đúng
- Password phải tối thiểu 6 ký tự

### Lỗi: "404 Not Found"
- URL có thể sai
- Movie ID không tồn tại
- Kiểm tra lại endpoint

---

## 🚦 Next Steps

### Tính Năng Tiếp Theo (Registered Users)
- [ ] Xem lịch chiếu (Showings)
- [ ] Đặt vé (Bookings)
- [ ] Thanh toán
- [ ] Lịch sử đặt vé
- [ ] Review phim

### Tính Năng Quản Trị (Admin)
- [ ] Quản lý phim (CRUD)
- [ ] Quản lý rạp chiếu (Theaters)
- [ ] Quản lý lịch chiếu (Showings)
- [ ] Quản lý users
- [ ] Dashboard thống kê

---

## 👥 Contributors

- Backend Team
- Frontend Team
- Database Team

---

## 📞 Support

Liên hệ: support@cinehub.local

---

**Last Updated:** 18/01/2026
**Version:** 1.0.0
