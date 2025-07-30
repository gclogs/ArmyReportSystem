package com.gclogs.armyreportsystem.user.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.gclogs.armyreportsystem.user.domain.User;

@Mapper
public interface UserMapper {
    void insert(User user);
    User findByUserId(String userId);
    boolean existsByUserId(String userId);
}