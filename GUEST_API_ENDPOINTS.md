# CineHub - API Endpoints cho Guest Users (Khách chưa đăng nhập)

## Tổng Quan
Các endpoint này cho phép khách hàng chưa đăng nhập:
- ✅ Xem danh sách phim
- ✅ Xem chi tiết phim (mô tả, trailer, thời lượng, thể loại, rating...)
- ✅ Tìm kiếm phim theo tên / thể loại
- ✅ Đăng ký tài khoản mới

---

## 1. MOVIES - Quản lý Phim

### 1.1 Xem danh sách tất cả phim
**Endpoint:** `GET /api/movies`

**Mô tả:** Lấy danh sách tất cả các bộ phim có sẵn

**Request:**
```
GET http://localhost:8080/api/movies
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Avatar: The Way of Water",
    "description": "Câu chuyện tiếp theo của thế giới Pandora...",
    "genre": "Khoa học viễn tưởng",
    "duration": 192,
    "releaseDate": "2022-12-16",
    "posterUrl": "https://...",
    "trailerUrl": "https://youtube.com/...",
    "rating": 4.8,
    "createdAt": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "title": "Dune",
    "description": "Hành trình của Paul Atreides...",
    "genre": "Hành động",
    "duration": 166,
    "releaseDate": "2021-10-22",
    "posterUrl": "https://...",
    "trailerUrl": "https://youtube.com/...",
    "rating": 4.6,
    "createdAt": "2024-01-15T10:31:00"
  }
]
```

---

### 1.2 Xem chi tiết một phim
**Endpoint:** `GET /api/movies/{id}`

**Mô tả:** Lấy chi tiết đầy đủ của một bộ phim theo ID

**Request:**
```
GET http://localhost:8080/api/movies/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Avatar: The Way of Water",
  "description": "Khi sự sống và tiền lệ của giống người Na'vi bị đe dọa, Jake Sully phải đưa gia đình của mình vào cuộc chiến để bảo vệ hành tinh của họ...",
  "genre": "Khoa học viễn tưởng",
  "duration": 192,
  "releaseDate": "2022-12-16",
  "posterUrl": "https://example.com/poster.jpg",
  "trailerUrl": "https://youtube.com/watch?v=d9MyW72ELq0",
  "rating": 4.8,
  "createdAt": "2024-01-15T10:30:00"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Movie not found"
}
```

---

### 1.3 Tìm kiếm phim theo thể loại
**Endpoint:** `GET /api/movies/genre/{genre}`

**Mô tả:** Lấy danh sách phim theo thể loại

**Request:**
```
GET http://localhost:8080/api/movies/genre/Hành động
```

**Parameters:**
- `genre` (path param, required): Thể loại phim (VD: Hành động, Tình cảm, Kinh dị, Hài hước, Khoa học viễn tưởng...)

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "title": "Dune",
    "description": "...",
    "genre": "Hành động",
    "duration": 166,
    "releaseDate": "2021-10-22",
    "posterUrl": "https://...",
    "trailerUrl": "https://youtube.com/...",
    "rating": 4.6,
    "createdAt": "2024-01-15T10:31:00"
  }
]
```

---

### 1.4 Tìm kiếm phim theo tên
**Endpoint:** `GET /api/movies/search?title={tên phim}`

**Mô tả:** Tìm kiếm phim theo tên (không phân biệt hoa/thường, hỗ trợ tìm kiếm từng phần)

**Request:**
```
GET http://localhost:8080/api/movies/search?title=Avatar
```

**Parameters:**
- `title` (query param, required): Tên hoặc một phần tên của phim

**Response (200 OK):**
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
    "trailerUrl": "https://youtube.com/...",
    "rating": 4.8,
    "createdAt": "2024-01-15T10:30:00"
  },
  {
    "id": 3,
    "title": "Avatar",
    "description": "...",
    "genre": "Khoa học viễn tưởng",
    "duration": 162,
    "releaseDate": "2009-12-18",
    "posterUrl": "https://...",
    "trailerUrl": "https://youtube.com/...",
    "rating": 4.7,
    "createdAt": "2024-01-15T10:32:00"
  }
]
```

---

### 1.5 Tìm kiếm phim theo từ khóa (tên hoặc thể loại)
**Endpoint:** `GET /api/movies/search-keyword?keyword={từ khóa}`

**Mô tả:** Tìm kiếm phim theo từ khóa trong tên hoặc thể loại

**Request:**
```
GET http://localhost:8080/api/movies/search-keyword?keyword=Sci-Fi
```

**Parameters:**
- `keyword` (query param, required): Từ khóa tìm kiếm trong tên hoặc thể loại

**Response (200 OK):**
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
    "trailerUrl": "https://youtube.com/...",
    "rating": 4.8,
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

---

## 2. AUTHENTICATION - Xác thực & Đăng ký

### 2.1 Đăng ký tài khoản mới
**Endpoint:** `POST /api/auth/register`

**Mô tả:** Cho phép khách hàng tạo tài khoản mới

**Request:**
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "phoneNumber": "0123456789"
}
```

**Request Body Parameters:**
- `email` (string, required): Email của người dùng (phải là định dạng email hợp lệ)
- `password` (string, required): Mật khẩu (tối thiểu 6 ký tự, nên có chữ hoa, chữ thường và số)
- `fullName` (string, required): Họ tên đầy đủ
- `phoneNumber` (string, optional): Số điện thoại liên lạc

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": null
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email already exists" 
}
```

**Các lỗi có thể xảy ra:**
- `"Email already exists"` - Email đã được sử dụng bởi tài khoản khác
- `"Invalid email format"` - Định dạng email không hợp lệ
- `"Password too short"` - Mật khẩu quá ngắn
- `"Full name is required"` - Thiếu thông tin họ tên

---

### 2.2 Đăng nhập
**Endpoint:** `POST /api/auth/login`

**Mô tả:** Cho phép người dùng đăng nhập để lấy JWT token

**Request:**
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Request Body Parameters:**
- `email` (string, required): Email đã đăng ký
- `password` (string, required): Mật khẩu

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "User not found"
}
```

hoặc

```json
{
  "success": false,
  "message": "Invalid password"
}
```

---

## Testing với Postman/cURL

### Example 1: Lấy danh sách phim
```bash
curl -X GET "http://localhost:8080/api/movies" \
  -H "Accept: application/json"
```

### Example 2: Tìm kiếm phim theo tên
```bash
curl -X GET "http://localhost:8080/api/movies/search?title=Avatar" \
  -H "Accept: application/json"
```

### Example 3: Tìm kiếm theo thể loại
```bash
curl -X GET "http://localhost:8080/api/movies/genre/Hành%20động" \
  -H "Accept: application/json"
```

### Example 4: Đăng ký tài khoản
```bash
curl -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "MyPassword123",
    "fullName": "Jane Doe",
    "phoneNumber": "0987654321"
  }'
```

### Example 5: Đăng nhập
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

## HTTP Status Codes

| Code | Mô tả |
|------|-------|
| 200 | OK - Yêu cầu thành công |
| 201 | Created - Tài nguyên được tạo thành công |
| 400 | Bad Request - Yêu cầu không hợp lệ |
| 401 | Unauthorized - Xác thực thất bại |
| 404 | Not Found - Tài nguyên không tìm thấy |
| 500 | Internal Server Error - Lỗi máy chủ |

---

## Ghi chú bảo mật

⚠️ **Quan trọng:**
- Luôn sử dụng HTTPS trong production
- Không gửi mật khẩu dưới dạng query parameter
- JWT token nên được lưu trữ an toàn trên client
- Đặt expiration time cho JWT token
- Validate dữ liệu input ở cả frontend và backend
