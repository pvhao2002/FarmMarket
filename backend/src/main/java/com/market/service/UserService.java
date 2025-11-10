package com.market.service;

import com.market.dto.admin.UpdateUserStatusRequest;
import com.market.dto.admin.UserResponse;
import com.market.dto.common.MessageResponse;
import com.market.dto.common.PagedResponse;
import com.market.dto.user.ChangePasswordRequest;
import com.market.dto.user.UpdateUserProfileRequest;
import com.market.dto.user.UserProfileResponse;

public interface UserService {

    PagedResponse<UserResponse> getAllUsers(int page, int size, String search);

    UserResponse updateUserStatus(Long userId, UpdateUserStatusRequest request);

    UserResponse getUserById(Long userId);

    UserProfileResponse getUserProfile(String userEmail);

    UserProfileResponse updateUserProfile(String userEmail, UpdateUserProfileRequest request);

    MessageResponse changePassword(String userEmail, ChangePasswordRequest request);
}