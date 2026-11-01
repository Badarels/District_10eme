package com.district.user.service;

import com.district.user.dto.AuthRequest;
import com.district.user.dto.AuthResponse;

/**
 * Interface de service pour l'authentification
 */
public interface AuthService {
    
    /**
     * Authentifier un utilisateur et générer un token JWT
     * @param authRequest Requête d'authentification
     * @return Réponse avec le token JWT
     */
    AuthResponse authenticate(AuthRequest authRequest);
    
    /**
     * Valider un token JWT
     * @param token Token JWT à valider
     * @return true si le token est valide, false sinon
     */
    boolean validateToken(String token);
    
    /**
     * Rafraîchir un token JWT
     * @param token Token à rafraîchir
     * @return Nouveau token JWT
     */
    String refreshToken(String token);
    
    /**
     * Déconnecter un utilisateur (révoquer le token)
     * @param token Token à révoquer
     */
    void logout(String token);
}
