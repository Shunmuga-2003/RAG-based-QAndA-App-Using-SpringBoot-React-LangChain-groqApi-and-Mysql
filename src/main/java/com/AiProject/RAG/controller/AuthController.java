package com.AiProject.RAG.controller;

import com.AiProject.RAG.dto.AuthRequest;
import com.AiProject.RAG.dto.AuthResponse;
import com.AiProject.RAG.model.User;
import com.AiProject.RAG.security.JwtUtil;
import com.AiProject.RAG.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody AuthRequest request) {
        try {
            User user = userService.registerUser(
                    request.getEmail(),
                    request.getPassword(),
                    request.getName()
            );
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(
                    new AuthResponse(
                            token,
                            user.getEmail(),
                            user.getName()
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            User user = userService.findByEmail(request.getEmail());
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(
                    new AuthResponse(
                            token,
                            user.getEmail(),
                            user.getName()
                    )
            );
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401)
                    .body("Invalid email or password!");
        }
    }
}
