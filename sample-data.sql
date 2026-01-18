-- ===================================================
-- CineHub - Sample Data for Testing Guest Features
-- ===================================================

-- Insert Sample Movies
INSERT INTO movies (title, description, genre, duration, release_date, poster_url, trailer_url, rating, created_at) VALUES
('Avatar: The Way of Water', 
 'Khi sự sống và tiền lệ của giống người Na''vi bị đe dọa, Jake Sully phải đưa gia đình của mình vào cuộc chiến để bảo vệ hành tinh của họ.', 
 'Khoa học viễn tưởng', 192, '2022-12-16', 
 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
 'https://www.youtube.com/embed/d9MyW72ELq0',
 4.8, NOW());

INSERT INTO movies (title, description, genre, duration, release_date, poster_url, trailer_url, rating, created_at) VALUES
('Dune', 
 'Hành trình của Paul Atreides đến hành tinh Arrakis để tìm hiểu về số phận của mình.', 
 'Hành động', 166, '2021-10-22', 
 'https://image.tmdb.org/t/p/w500/rzhxqLmZNB5lD6EFo7GZ2v5RYLU.jpg',
 'https://www.youtube.com/embed/n9xhJsAgZue',
 4.6, NOW());

INSERT INTO movies (title, description, genre, duration, release_date, poster_url, trailer_url, rating, created_at) VALUES
('Oppenheimer', 
 'Cuộc đời của J. Robert Oppenheimer, trưởng dự án Manhattan.', 
 'Tiểu sử', 180, '2023-07-21', 
 'https://image.tmdb.org/t/p/w500/8Gxv8kSQNOjV2Dr0nksN0Aicjzc.jpg',
 'https://www.youtube.com/embed/uYPbbksJxIE',
 4.7, NOW());

INSERT INTO movies (title, description, genre, duration, release_date, poster_url, trailer_url, rating, created_at) VALUES
('Barbie', 
 'Barbie và Ken khám phá thế giới thực trong cuộc phiêu lưu đầy màu sắc.', 
 'Hài hước', 114, '2023-07-21', 
 'https://image.tmdb.org/t/p/w500/iJFwW4cxKwXP0nkBA8UiKsrn9K8.jpg',
 'https://www.youtube.com/embed/FLZ1d5aLH-k',
 4.5, NOW());

INSERT INTO movies (title, description, genre, duration, release_date, poster_url, trailer_url, rating, created_at) VALUES
('Killers of the Flower Moon', 
 'Một câu chuyện về những tội ác nguy hiểm và âm mưu lừa dối.', 
 'Tội phạm', 206, '2023-10-27', 
 'https://image.tmdb.org/t/p/w500/f2TH7n1xJf5lqz5vYq8b74bfZyZ.jpg',
 'https://www.youtube.com/embed/VjxR5UJH3xA',
 4.6, NOW());

INSERT INTO movies (title, description, genre, duration, release_date, poster_url, trailer_url, rating, created_at) VALUES
('Avatar', 
 'Một cựu binh bị tê liệt được giao nhiệm vụ quân sự phức tạp nhất.', 
 'Khoa học viễn tưởng', 162, '2009-12-18', 
 'https://image.tmdb.org/t/p/w500/6ELCZlTA5bjGlJKUd8F2xUgMEIe.jpg',
 'https://www.youtube.com/embed/5PSNL1qE6VQ',
 4.7, NOW());

INSERT INTO movies (title, description, genre, duration, release_date, poster_url, trailer_url, rating, created_at) VALUES
('The Shawshank Redemption', 
 'Hai người tù có hy vọng, tình bạn, khát vọng sống.', 
 'Tâm lý', 142, '1994-10-14', 
 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmJy/ZmlsZS9wb3N0ZXJzLzE5OTQvcHNkLnBuZz9oZWlnaHQ9MzAwJnF1YWxpdHk9MjAmbV9zZW8=.jpg',
 'https://www.youtube.com/embed/6hB3S9bIaco',
 4.9, NOW());

INSERT INTO movies (title, description, genre, duration, release_date, poster_url, trailer_url, rating, created_at) VALUES
('Inception', 
 'Một kẻ trộm giỏi về các công cụ chia sẻ tinh thần bị giao một nhiệm vụ ngược lại.', 
 'Khoa học viễn tưởng', 148, '2010-07-16', 
 'https://image.tmdb.org/t/p/w500/9gk7adHYeDMNNGceKc6w524ZaQ5.jpg',
 'https://www.youtube.com/embed/8ZltVIy0ss0',
 4.8, NOW());

INSERT INTO movies (title, description, genre, duration, release_date, poster_url, trailer_url, rating, created_at) VALUES
('The Dark Knight', 
 'Khi mối đe dọa được gọi là Joker xuất hiện trên toàn thành phố.', 
 'Hành động', 152, '2008-07-18', 
 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haI0xvwi.jpg',
 'https://www.youtube.com/embed/EXeTwQWrcwY',
 4.9, NOW());

INSERT INTO movies (title, description, genre, duration, release_date, poster_url, trailer_url, rating, created_at) VALUES
('Forrest Gump', 
 'Lịch sử Hoa Kỳ qua mắt một người đàn ông với IQ thấp nhưng có trái tim lớn.', 
 'Tình cảm', 142, '1994-07-06', 
 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
 'https://www.youtube.com/embed/bIvzrx3B6vQ',
 4.8, NOW());

-- Insert Sample Users for Testing
INSERT INTO users (email, password, full_name, phone, is_admin, created_at) VALUES
('guest@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq', 'Guest User', '0123456789', false, NOW()),
('admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq', 'Admin User', '0987654321', true, NOW());

-- Note: Password hashed above is for password "12345" using bcrypt
-- For testing, you can use:
-- Email: guest@example.com
-- Password: 12345
--
-- Email: admin@example.com
-- Password: 12345

-- Verification Query
SELECT * FROM movies ORDER BY id;
SELECT * FROM users ORDER BY id;
