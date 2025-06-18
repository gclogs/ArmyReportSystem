package com.gclogs.armyreportsystem;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.gclogs.armyreportsystem.security.jwt")
@SpringBootApplication
public class ArmyReportSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(ArmyReportSystemApplication.class, args);
    }

}
