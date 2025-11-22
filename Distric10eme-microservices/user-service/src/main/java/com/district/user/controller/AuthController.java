package com.district.user.controller;

import com.district.user.dto.LoginRequest;
import com.district.user.dto.LoginResponse;
import com.district.user.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UtilisateurService utilisateurService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = utilisateurService.login(request);
        return ResponseEntity.ok(response);
    }
}

