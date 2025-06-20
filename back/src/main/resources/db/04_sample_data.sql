-- 샘플 유저 데이터 추가
INSERT INTO user (user_id, password, rank, role, name, unit_name, phone_number, email, created_at, status)
VALUES 
('admin123', '$2a$10$9tRQuFGKFUGXKk9k8pyKAe5PFzeZKNixBN36k9cenGYLAFp.v0qKO', '대령', 'ADMIN', '관리자', '본부', '010-1234-5678', 'admin@army.mil.kr', NOW(), TRUE),
('101', '$2a$10$9tRQuFGKFUGXKk9k8pyKAe5PFzeZKNixBN36k9cenGYLAFp.v0qKO', '대위', 'OFFICER', '김대위', '제2보급대', '010-9876-5432', 'kim@army.mil.kr', NOW(), TRUE),
('102', '$2a$10$9tRQuFGKFUGXKk9k8pyKAe5PFzeZKNixBN36k9cenGYLAFp.v0qKO', '중사', 'SOLDIER', '이중사', '훈련부대', '010-1122-3344', 'lee@army.mil.kr', NOW(), TRUE),
('103', '$2a$10$9tRQuFGKFUGXKk9k8pyKAe5PFzeZKNixBN36k9cenGYLAFp.v0qKO', '대령', 'OFFICER', '박대령', '사령부', '010-5566-7788', 'park@army.mil.kr', NOW(), TRUE),
('104', '$2a$10$9tRQuFGKFUGXKk9k8pyKAe5PFzeZKNixBN36k9cenGYLAFp.v0qKO', '상사', 'SOLDIER', '최상사', '의무대', '010-9900-1122', 'choi@army.mil.kr', NOW(), TRUE);

-- 샘플 보고서 데이터 추가
INSERT INTO reports (report_id, author_id, author_name, author_rank, type, title, content, priority, status, created_at, updated_at)
VALUES 
(1, '101', '김대위', '대위', 'emergency', '긴급: 장비 고장 보고', '전차 엔진 고장으로 인한 긴급 수리 요청입니다. 부품 교체가 필요합니다.', 'urgent', 'new', DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, '102', '이중사', '중사', 'normal', '주간 훈련 결과 보고', '이번 주 훈련 결과를 보고드립니다. 전반적으로 만족스러운 성과를 거두었습니다.', 'medium', 'in_progress', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, '103', '박대령', '대령', 'incident', '보안 위협 사항 보고', '네트워크 시스템에 대한 외부 접근 시도가 감지되었습니다. 보안 강화가 필요합니다.', 'high', 'resolved', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, '104', '최상사', '상사', 'maintenance', '물자 보급 요청', '식량 및 의약품 보급이 필요합니다. 현재 재고가 20% 미만입니다.', 'low', 'new', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- 보고서 위치 정보 추가 (보고서 위치 정보를 위한 테이블이 없으므로 생성)
CREATE TABLE IF NOT EXISTS report_locations (
    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (report_id) REFERENCES reports(report_id),
    INDEX idx_report_id (report_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 보고서 위치 샘플 데이터 추가
INSERT INTO report_locations (report_id, latitude, longitude, description)
VALUES 
(1, 37.5665, 126.9780, '제2보급창고'),
(2, 37.5665, 126.9780, '훈련장 A'),
(3, 37.5665, 126.9780, '본부 통신실'),
(4, 37.5665, 126.9780, '의무대');

-- 보고서 조회 기록 샘플 데이터 추가
INSERT INTO report_access_logs (report_id, user_id, access_type, access_time, ip_address)
VALUES 
(1, '103', 'VIEW', DATE_SUB(NOW(), INTERVAL 30 MINUTE), '192.168.1.100'),
(2, '103', 'VIEW', DATE_SUB(NOW(), INTERVAL 1 DAY), '192.168.1.100'),
(3, '101', 'VIEW', DATE_SUB(NOW(), INTERVAL 2 DAY), '192.168.1.101'),
(4, '103', 'VIEW', DATE_SUB(NOW(), INTERVAL 5 DAY), '192.168.1.100');

-- 보고서 댓글 샘플 데이터 추가
INSERT INTO report_comments (report_id, author_id, author_name, author_rank, content, created_at, updated_at)
VALUES 
(1, '103', '박대령', '대령', '즉시 수리팀을 파견하겠습니다. 세부 사항을 더 알려주세요.', DATE_SUB(NOW(), INTERVAL 45 MINUTE), DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
(2, '103', '박대령', '대령', '훈련 결과가 좋네요. 다음 주 계획도 함께 보고해 주세요.', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, '103', '박대령', '대령', '보안 조치 완료 확인했습니다. 추가 모니터링 계속해주세요.', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, '101', '김대위', '대위', '네, 모니터링 계속하고 있습니다. 이상 없습니다.', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 감사 로그는 트리거에 의해 자동 생성되므로 직접 추가하지 않음
