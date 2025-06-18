package com.gclogs.armyreportsystem.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String user_id;
    private String password;
    private String rank;
    private String role;
    private String name;
    private String unit_name;
    private String phone_number;
    private String email;
    private LocalDateTime created_at;
    private boolean status;
}
