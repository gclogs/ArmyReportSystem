// AuthorityRole.java 파일
package com.gclogs.armyreportsystem.user.domain.enums;

public enum AuthorityRole {
    PRESIDENT(1),        // 대통령
    JOINT_CHIEF(2),      // 합참의장
    ARMY_CHIEF(3),       // 육군참모총장
    NAVY_CHIEF(3),       // 해군참모총장
    AIR_FORCE_CHIEF(3),  // 공군참모총장
    CORPS_COMMANDER(4),  // 군단장급
    DIVISION_COMMANDER(5), // 사단장급
    REGIMENT_COMMANDER(6), // 연대장급
    BATTALION_COMMANDER(7), // 대대장급
    COMPANY_COMMANDER(8),  // 중대장급
    PLATOON_LEADER(9),     // 소대장급
    NCO(10),               // 부사관
    SOLDIER(11);           // 병사

    private final int level;

    AuthorityRole(int level) {
        this.level = level;
    }

    public int getLevel() {
        return level;
    }

    public boolean hasAuthorityOver(AuthorityRole other) {
        return this.level < other.level;  // 레벨이 낮을수록 권한이 높음
    }
}