package com.gclogs.armyreportsystem.report.domain.enums;

/**
 * 보고서의 유형을 나타내는 열거형
 */
public enum ReportType {
    GENERAL("일반"),
    URGENT("긴급"),
    MAINTENANCE("유지보수"),
    INCIDENT("사고");

    private final String value;

    ReportType(String value) {
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
    public static ReportType fromValue(String value) {
        for (ReportType type : ReportType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        return null;
    }
}
