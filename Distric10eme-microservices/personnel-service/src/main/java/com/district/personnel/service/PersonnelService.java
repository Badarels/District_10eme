package com.district.personnel.service;

import com.district.personnel.dto.PersonnelDTO;
import com.district.personnel.dto.PersonnelCreateDto;
import com.district.personnel.entity.TypePersonnel;

import java.util.List;
import java.util.Optional;

/**
 * Interface de service pour la gestion du personnel médical
 */
public interface PersonnelService {
    
    /**
     * Créer un nouveau personnel médical
     * @param personnelCreateDto DTO du personnel à créer
     * @return Personnel créé
     */
    PersonnelDTO createPersonnel(PersonnelCreateDto personnelCreateDto);
    
    /**
     * Mettre à jour un personnel existant
     * @param id Identifiant du personnel
     * @param personnelDTO DTO avec les nouvelles informations
     * @return Personnel mis à jour
     */
    PersonnelDTO updatePersonnel(Long id, PersonnelDTO personnelDTO);
    
    /**
     * Supprimer un personnel par son ID
     * @param id Identifiant du personnel à supprimer
     */
    void deletePersonnel(Long id);
    
    /**
     * Récupérer un personnel par son ID
     * @param id Identifiant du personnel
     * @return Optional contenant le personnel trouvé
     */
    Optional<PersonnelDTO> getPersonnelById(Long id);
    
    /**
     * Récupérer un personnel par sa matricule
     * @param matricule Matricule du personnel
     * @return Optional contenant le personnel trouvé
     */
    Optional<PersonnelDTO> getPersonnelByMatricule(String matricule);
    
    /**
     * Récupérer un personnel par son email
     * @param email Email du personnel
     * @return Optional contenant le personnel trouvé
     */
    Optional<PersonnelDTO> getPersonnelByEmail(String email);
    
    /**
     * Récupérer tout le personnel
     * @return Liste du personnel
     */
    List<PersonnelDTO> getAllPersonnel();
    
    /**
     * Récupérer le personnel par type
     * @param typePersonnel Type de personnel
     * @return Liste du personnel du type spécifié
     */
    List<PersonnelDTO> getPersonnelByType(TypePersonnel typePersonnel);
    
    /**
     * Récupérer les médecins par spécialité
     * @param specialiteId Identifiant de la spécialité
     * @return Liste des médecins de la spécialité
     */
    List<PersonnelDTO> getMedecinsBySpecialite(Long specialiteId);
    
    /**
     * Récupérer les médecins actifs
     * @return Liste des médecins actifs
     */
    List<PersonnelDTO> getMedecinsActifs();
    
    /**
     * Activer/Désactiver un personnel
     * @param id Identifiant du personnel
     * @param actif État à définir
     * @return Personnel mis à jour
     */
    PersonnelDTO toggleActif(Long id, boolean actif);
    
    /**
     * Vérifier si un personnel existe par email
     * @param email Email à vérifier
     * @return true si le personnel existe, false sinon
     */
    boolean existsByEmail(String email);
    
    /**
     * Compter le nombre de personnel par type
     * @param typePersonnel Type de personnel
     * @return Nombre de personnel du type spécifié
     */
    long countByType(TypePersonnel typePersonnel);
}
