-- 보고서 테이블 생성
CREATE TABLE IF NOT EXISTS reports (
    report_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_rank VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    
    INDEX idx_author_id (author_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_is_deleted (is_deleted)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 보고서 액세스 로그 테이블
CREATE TABLE IF NOT EXISTS report_access_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    access_type VARCHAR(50) NOT NULL,
    access_time TIMESTAMP NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,

    FOREIGN KEY (report_id) REFERENCES reports(report_id),
    INDEX idx_report_id (report_id),
    INDEX idx_user_id (user_id),
    INDEX idx_access_time (access_time)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 보고서 댓글 테이블
CREATE TABLE IF NOT EXISTS report_comments (
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL,
    author_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_rank VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    FOREIGN KEY (report_id) REFERENCES reports(report_id),
    INDEX idx_report_id (report_id),
    INDEX idx_author_id (author_id),
    INDEX idx_is_deleted (is_deleted)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS report_locations (
    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL,
    report_location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 보안 강화: 데이터베이스 이벤트 트리거
DELIMITER //
CREATE TRIGGER before_report_delete
BEFORE DELETE ON reports
FOR EACH ROW
BEGIN
    INSERT INTO report_audit_logs (report_id, action, action_time, user_id)
    VALUES (OLD.report_id, 'DELETE', NOW(), @current_user_id);
END //
DELIMITER ;

-- 보안 강화: 데이터베이스 감사 로그 테이블
CREATE TABLE IF NOT EXISTS report_audit_logs (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    action_time TIMESTAMP NOT NULL,
    user_id VARCHAR(255),

    INDEX idx_report_id (report_id),
    INDEX idx_action (action),
    INDEX idx_action_time (action_time)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
