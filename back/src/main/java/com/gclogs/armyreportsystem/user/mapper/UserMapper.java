package com.gclogs.armyreportsystem.user.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.gclogs.armyreportsystem.user.domain.User;

@Mapper
public interface UserMapper {
    void insert(User user);
    User findByUserId(@Param("user_id") String userId);
    boolean existsByUserId(@Param("user_id") String userId);
}