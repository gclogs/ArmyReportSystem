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

-- 유저 토큰 테이블 생성 (리프레시 토큰 관리용)
CREATE TABLE IF NOT EXISTS user_tokens (
    user_id VARCHAR(30) PRIMARY KEY,
    refresh_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    INDEX idx_refresh_token (refresh_token),
    INDEX idx_is_active (is_active)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;