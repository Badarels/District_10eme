package com.district.patient.service;

import com.district.patient.dto.PatientDTO;
import com.district.patient.dto.PatientCreateDto;
import com.district.patient.dto.PatientSearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Interface de service pour la gestion des patients
 */
public interface PatientServiceInterface {
    
    /**
     * Créer un nouveau patient
     * @param patientCreateDto DTO du patient à créer
     * @return Patient créé
     */
    PatientDTO createPatient(PatientCreateDto patientCreateDto);
    
    /**
     * Mettre à jour un patient existant
     * @param id Identifiant du patient
     * @param patientDTO DTO avec les nouvelles informations
     * @return Patient mis à jour
     */
    PatientDTO updatePatient(Long id, PatientDTO patientDTO);
    
    /**
     * Supprimer un patient par son ID
     * @param id Identifiant du patient à supprimer
     */
    void deletePatient(Long id);
    
    /**
     * Récupérer un patient par son ID
     * @param id Identifiant du patient
     * @return Optional contenant le patient trouvé
     */
    Optional<PatientDTO> getPatientById(Long id);
    
    /**
     * Récupérer un patient par son numéro de dossier
     * @param numeroDossier Numéro de dossier du patient
     * @return Optional contenant le patient trouvé
     */
    Optional<PatientDTO> getPatientByNumeroDossier(String numeroDossier);
    
    /**
     * Récupérer tous les patients
     * @return Liste des patients
     */
    List<PatientDTO> getAllPatients();
    
    /**
     * Rechercher des patients par critères multiples
     * @param searchDto Critères de recherche
     * @return Page des patients correspondants
     */
    Page<PatientDTO> searchPatients(PatientSearchDto searchDto);
    
    /**
     * Vérifier si un patient existe par numéro de dossier
     * @param numeroDossier Numéro de dossier à vérifier
     * @return true si le patient existe, false sinon
     */
    boolean existsByNumeroDossier(String numeroDossier);
    
    /**
     * Compter le nombre total de patients
     * @return Nombre total de patients
     */
    long countPatients();
}
