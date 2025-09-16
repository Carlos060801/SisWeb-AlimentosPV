package service;

import java.util.List;

import dto.request.UserRequest;
import dto.response.UserResponse;

public interface IUserService {
    UserResponse create(UserRequest request);
    UserResponse update(Long id, UserRequest request);
    void delete(Long id);
    UserResponse findById(Long id);
    List<UserResponse> findAll();

}
