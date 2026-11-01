package com.district.user.service;

import com.district.user.dto.UtilisateurDTO;
import java.util.List;
import java.util.Optional;

/**
 * Interface de service pour la gestion des utilisateurs
 */
public interface UserService {
    
    /**
     * Créer un nouvel utilisateur
     * @param utilisateurDTO DTO de l'utilisateur à créer
     * @return Utilisateur créé
     */
    UtilisateurDTO createUtilisateur(UtilisateurDTO utilisateurDTO);
    
    /**
     * Mettre à jour un utilisateur existant
     * @param id Identifiant de l'utilisateur
     * @param utilisateurDTO DTO avec les nouvelles informations
     * @return Utilisateur mis à jour
     */
    UtilisateurDTO updateUtilisateur(Long id, UtilisateurDTO utilisateurDTO);
    
    /**
     * Supprimer un utilisateur par son ID
     * @param id Identifiant de l'utilisateur à supprimer
     */
    void deleteUtilisateur(Long id);
    
    /**
     * Récupérer un utilisateur par son ID
     * @param id Identifiant de l'utilisateur
     * @return Optional contenant l'utilisateur trouvé
     */
    Optional<UtilisateurDTO> getUtilisateurById(Long id);
    
    /**
     * Récupérer un utilisateur par son email
     * @param email Email de l'utilisateur
     * @return Optional contenant l'utilisateur trouvé
     */
    Optional<UtilisateurDTO> getUtilisateurByEmail(String email);
    
    /**
     * Récupérer tous les utilisateurs
     * @return Liste des utilisateurs
     */
    List<UtilisateurDTO> getAllUtilisateurs();
    
    /**
     * Activer/Désactiver un utilisateur
     * @param id Identifiant de l'utilisateur
     * @param actif État à définir
     * @return Utilisateur mis à jour
     */
    UtilisateurDTO toggleActif(Long id, boolean actif);
}
