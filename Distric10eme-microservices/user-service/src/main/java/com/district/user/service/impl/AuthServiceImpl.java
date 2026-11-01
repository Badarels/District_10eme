package com.district.user.service.impl;

import com.district.user.dto.AuthRequest;
import com.district.user.dto.AuthResponse;
import com.district.user.entity.Utilisateur;
import com.district.user.exception.EntityNotFoundException;
import com.district.user.exception.ValidationException;
import com.district.user.repository.UtilisateurRepository;
import com.district.user.service.AuthService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Implémentation du service d'authentification
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {
    
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${jwt.secret:mySecretKeyWithEnoughBitsForHS512AlgorithmRequirement123456}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration; // 24h en millisecondes
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    
    @Override
    @Transactional
    public AuthResponse authenticate(AuthRequest authRequest) {
        log.info("Tentative d'authentification pour l'email: {}", authRequest.getEmail());
        
        // Rechercher l'utilisateur par email
        Utilisateur utilisateur = utilisateurRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'email: " + authRequest.getEmail()));
        
        // Vérifier si l'utilisateur est actif
        if (!utilisateur.isActif()) {
            throw new ValidationException("Ce compte est désactivé");
        }
        
        // Vérifier le mot de passe
        if (!passwordEncoder.matches(authRequest.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new ValidationException("Mot de passe incorrect");
        }
        
        // Générer le token JWT
        String token = generateToken(utilisateur);
        
        log.info("Authentification réussie pour l'utilisateur: {}", utilisateur.getEmail());
        
        return AuthResponse.builder()
                .token(token)
                .userId(utilisateur.getId())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().getNom())
                .build();
    }
    
    @Override
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            log.warn("Token invalide: {}", e.getMessage());
            return false;
        }
    }
    
    @Override
    @Transactional
    public String refreshToken(String token) {
        if (!validateToken(token)) {
            throw new ValidationException("Token invalide ou expiré");
        }
        
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        
        String email = claims.getSubject();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé: " + email));
        
        if (!utilisateur.isActif()) {
            throw new ValidationException("Ce compte est désactivé");
        }
        
        return generateToken(utilisateur);
    }
    
    @Override
    @Transactional
    public void logout(String token) {
        // Dans une implémentation réelle, on pourrait ajouter le token à une liste noire
        // Pour l'instant, on se contente de logger la déconnexion
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        
        log.info("Déconnexion de l'utilisateur: {}", claims.getSubject());
    }
    
    private String generateToken(Utilisateur utilisateur) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
                .subject(utilisateur.getEmail())
                .issuedAt(now)
                .expiration(expiryDate)
                .claim("userId", utilisateur.getId())
                .claim("role", utilisateur.getRole().getNom())
                .signWith(getSigningKey())
                .compact();
    }
}
