package com.gclogs.armyreportsystem.mapper;

import com.gclogs.armyreportsystem.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    void insert(User user);
    User findByUserId(String userId);
    boolean existsByUserId(String userId);
}