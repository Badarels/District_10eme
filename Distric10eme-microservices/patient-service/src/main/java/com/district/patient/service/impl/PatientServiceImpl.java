package com.district.patient.service.impl;

import com.district.patient.dto.PatientDTO;
import com.district.patient.dto.PatientCreateDto;
import com.district.patient.dto.PatientSearchDto;
import com.district.patient.entity.Patient;
import com.district.patient.exception.ConflictException;
import com.district.patient.exception.EntityNotFoundException;
import com.district.patient.mapper.PatientMapper;
import com.district.patient.repository.PatientRepository;
import com.district.patient.service.PatientServiceInterface;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implémentation du service de gestion des patients
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PatientServiceImpl implements PatientServiceInterface {
    
    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;
    
    @Override
    public PatientDTO createPatient(PatientCreateDto patientCreateDto) {
        log.info("Création d'un nouveau patient: {}", patientCreateDto.getNumeroDossier());
        
        // Vérifier si le numéro de dossier existe déjà
        if (patientRepository.existsByNumeroDossier(patientCreateDto.getNumeroDossier())) {
            throw new ConflictException("Un patient avec ce numéro de dossier existe déjà: " + patientCreateDto.getNumeroDossier());
        }
        
        // Vérifier l'unicité par combinaison nom+dateNaissance+telephone si telephone est fourni
        if (patientCreateDto.getTelephone() != null && !patientCreateDto.getTelephone().isEmpty()) {
            Optional<Patient> existingPatient = patientRepository.findByNomAndDateNaissanceAndTelephone(
                    patientCreateDto.getNom(), 
                    patientCreateDto.getDateNaissance(), 
                    patientCreateDto.getTelephone()
            );
            if (existingPatient.isPresent()) {
                throw new ConflictException("Un patient avec ces informations (nom, date de naissance, téléphone) existe déjà");
            }
        }
        
        Patient patient = patientMapper.toEntityFromCreateDto(patientCreateDto);
        patient.setDateEnregistrement(LocalDate.now());
        
        Patient savedPatient = patientRepository.save(patient);
        log.info("Patient créé avec succès: ID {}", savedPatient.getId());
        
        return patientMapper.toDTO(savedPatient);
    }
    
    @Override
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        log.info("Mise à jour du patient ID: {}", id);
        
        Patient existingPatient = patientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Patient non trouvé avec l'ID: " + id));
        
        // Vérifier si le numéro de dossier est déjà utilisé par un autre patient
        if (!existingPatient.getNumeroDossier().equals(patientDTO.getNumeroDossier()) &&
            patientRepository.existsByNumeroDossier(patientDTO.getNumeroDossier())) {
            throw new ConflictException("Un patient avec ce numéro de dossier existe déjà: " + patientDTO.getNumeroDossier());
        }
        
        patientMapper.updateEntityFromDTO(patientDTO, existingPatient);
        
        Patient updatedPatient = patientRepository.save(existingPatient);
        log.info("Patient mis à jour avec succès: ID {}", updatedPatient.getId());
        
        return patientMapper.toDTO(updatedPatient);
    }
    
    @Override
    public void deletePatient(Long id) {
        log.info("Suppression du patient ID: {}", id);
        
        if (!patientRepository.existsById(id)) {
            throw new EntityNotFoundException("Patient non trouvé avec l'ID: " + id);
        }
        
        patientRepository.deleteById(id);
        log.info("Patient supprimé avec succès: ID {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<PatientDTO> getPatientById(Long id) {
        return patientRepository.findById(id)
                .map(patientMapper::toDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<PatientDTO> getPatientByNumeroDossier(String numeroDossier) {
        return patientRepository.findByNumeroDossier(numeroDossier)
                .map(patientMapper::toDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public java.util.List<PatientDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(patientMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<PatientDTO> searchPatients(PatientSearchDto searchDto) {
        log.info("Recherche de patients avec critères: {}", searchDto);
        
        // Créer la spécification de recherche dynamique
        Specification<Patient> spec = createSearchSpecification(searchDto);
        
        // Créer l'objet Pageable
        Sort sort = Sort.by(
                Sort.Direction.fromString(searchDto.getSortDirection()),
                searchDto.getSortBy()
        );
        Pageable pageable = PageRequest.of(searchDto.getPage(), searchDto.getSize(), sort);
        
        Page<Patient> patients = patientRepository.findAll(spec, pageable);
        
        return patients.map(patientMapper::toDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByNumeroDossier(String numeroDossier) {
        return patientRepository.existsByNumeroDossier(numeroDossier);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countPatients() {
        return patientRepository.count();
    }
    
    private Specification<Patient> createSearchSpecification(PatientSearchDto searchDto) {
        return (root, query, criteriaBuilder) -> {
            jakarta.persistence.criteria.Predicate predicate = criteriaBuilder.conjunction();
            
            if (searchDto.getNumeroDossier() != null && !searchDto.getNumeroDossier().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(root.get("numeroDossier"), "%" + searchDto.getNumeroDossier() + "%"));
            }
            
            if (searchDto.getNom() != null && !searchDto.getNom().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("nom")), "%" + searchDto.getNom().toLowerCase() + "%"));
            }
            
            if (searchDto.getPrenom() != null && !searchDto.getPrenom().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("prenom")), "%" + searchDto.getPrenom().toLowerCase() + "%"));
            }
            
            if (searchDto.getTelephone() != null && !searchDto.getTelephone().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(root.get("telephone"), "%" + searchDto.getTelephone() + "%"));
            }
            
            if (searchDto.getEmail() != null && !searchDto.getEmail().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), "%" + searchDto.getEmail().toLowerCase() + "%"));
            }
            
            if (searchDto.getGroupeSanguin() != null && !searchDto.getGroupeSanguin().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("groupeSanguin"), searchDto.getGroupeSanguin()));
            }
            
            if (searchDto.getDateNaissanceMin() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("dateNaissance"), searchDto.getDateNaissanceMin()));
            }
            
            if (searchDto.getDateNaissanceMax() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("dateNaissance"), searchDto.getDateNaissanceMax()));
            }
            
            if (searchDto.getDateEnregistrementMin() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("dateEnregistrement"), searchDto.getDateEnregistrementMin()));
            }
            
            if (searchDto.getDateEnregistrementMax() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("dateEnregistrement"), searchDto.getDateEnregistrementMax()));
            }
            
            return predicate;
        };
    }
}
