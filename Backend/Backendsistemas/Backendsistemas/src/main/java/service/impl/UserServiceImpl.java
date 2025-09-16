package service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
import dto.request.UserRequest;
import dto.response.UserResponse;
import lombok.*;
import repository.IUserRepository;
import service.IUserService;
import entity.User; 


@Service
@RequiredArgsConstructor

public class UserServiceImpl implements IUserService{

    private final IUserRepository userRepository;
    
    private User toEntity(UserRequest req) {
        return User.builder()
               
                .name(req.getName())
                .password(req.getPassword())
                .email(req.getEmail())
                .rol(req.getRol())
                .build();
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .rol(user.getRol())
                .account_status(user.getAccount_status())
                .build();
    }

    public UserResponse create(UserRequest request){
        User user = toEntity(request);
        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    public UserResponse update(Long id, UserRequest request){
        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRol(request.getRol());
        User updatedUser = userRepository.save(user);
        return toResponse(updatedUser);
    }

    public void delete(Long id){
        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public UserResponse findById(Long id){
        return userRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(()-> new RuntimeException("User not found"));
    }

    public List<UserResponse> findAll(){
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

}
