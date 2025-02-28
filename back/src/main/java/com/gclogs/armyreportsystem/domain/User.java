package com.gclogs.armyreportsystem.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String userId;
    private String password;
    private String rank;
    private String role;
    private String name;
    private String unitName;
    private String phoneNumber;
    private String email;
    private LocalDateTime createdAt;
    private boolean status;
}
