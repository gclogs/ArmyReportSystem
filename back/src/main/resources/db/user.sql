-- 유저 테이블 생성
CREATE TABLE IF NOT EXISTS user (
    user_id VARCHAR(30) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    rank VARCHAR(16) NOT NULL,
    role VARCHAR(16) NOT NULL,
    name VARCHAR(16) NOT NULL,
    unit_name VARCHAR(30) NOT NULL,
    phone_number VARCHAR(16) NOT NULL,
    email VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    
    INDEX idx_rank (rank),
    INDEX idx_role (role),
    INDEX idx_status (status)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;