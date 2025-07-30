package com.gclogs.armyreportsystem.report.domain.enums;

/**
 * 보고서의 우선순위를 나타내는 열거형
 */
public enum ReportPriority {
    LOW("낮음"),
    MEDIUM("중간"),
    HIGH("높음"),
    URGENT("긴급");

    private final String value;

    ReportPriority(String value) {
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
    public static ReportPriority fromValue(String value) {
        for (ReportPriority priority : ReportPriority.values()) {
            if (priority.value.equals(value)) {
                return priority;
            }
        }
        return null;
    }
}
