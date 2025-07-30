package com.gclogs.armyreportsystem.report.domain.enums;

/**
 * 보고서의 처리 상태를 나타내는 열거형
 */
public enum ReportStatus {
    NEW("신규"),
    IN_PROGRESS("진행중"),
    RESOLVED("해결됨"),
    REJECTED("반려");

    private final String value;

    ReportStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    /**
     * 문자열 값에 해당하는 enum 상수를 반환
     * @param value 찾을 문자열 값
     * @return 해당하는 enum 상수, 없을 경우 null
     */
    public static ReportStatus fromValue(String value) {
        for (ReportStatus status : ReportStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        return null;
    }
}
