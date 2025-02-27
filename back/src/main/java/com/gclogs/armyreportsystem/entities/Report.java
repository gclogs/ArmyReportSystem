package com.gclogs.armyreportsystem.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String title;
    private String content;
    private String priority;
    private String status;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL)
    private List<Attachment> attchments;
}

@Getter
@Setter
/**
 * 파일 정보를 데이터베이스에 저장
 * 실제 파일은 파일 시스템이나 클라우드에 저장
 * Report와의 관계를 관리
 */
class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "report_id")
    private Report report;

    private String fileName;    // 원본 파일명
    private String storedPath; // 저장된 경로
    private String fileType;   // 파일 타입
    private Long fileSize;     // 파일 크기
    private LocalDateTime uploadedAt; // 업로드 시간
}