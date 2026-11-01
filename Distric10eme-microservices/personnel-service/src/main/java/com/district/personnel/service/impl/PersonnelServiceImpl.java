package com.district.personnel.service.impl;

import com.district.personnel.dto.PersonnelDTO;
import com.district.personnel.dto.PersonnelCreateDto;
import com.district.personnel.entity.PersonnelMedical;
import com.district.personnel.entity.Specialite;
import com.district.personnel.entity.TypePersonnel;
import com.district.personnel.exception.ConflictException;
import com.district.personnel.exception.EntityNotFoundException;
import com.district.personnel.mapper.PersonnelMedicalMapper;
import com.district.personnel.repository.PersonnelMedicalRepository;
import com.district.personnel.repository.SpecialiteRepository;
import com.district.personnel.service.PersonnelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implémentation du service de gestion du personnel médical
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PersonnelServiceImpl implements PersonnelService {
    
    private final PersonnelMedicalRepository personnelRepository;
    private final SpecialiteRepository specialiteRepository;
    private final PersonnelMedicalMapper personnelMapper;
    
    @Override
    public PersonnelDTO createPersonnel(PersonnelCreateDto personnelCreateDto) {
        log.info("Création d'un nouveau personnel: {}", personnelCreateDto.getEmail());
        
        // Vérifier si l'email existe déjà
        if (personnelRepository.existsByEmail(personnelCreateDto.getEmail())) {
            throw new ConflictException("Un personnel avec cet email existe déjà: " + personnelCreateDto.getEmail());
        }
        
        // Vérifier si la matricule existe déjà
        if (personnelRepository.existsByNumeroOrdre(personnelCreateDto.getMatricule())) {
            throw new ConflictException("Un personnel avec cette matricule existe déjà: " + personnelCreateDto.getMatricule());
        }
        
        PersonnelMedical personnel = personnelMapper.toEntityFromCreateDto(personnelCreateDto);
        
        // Gérer la spécialité pour les médecins
        if (TypePersonnel.MEDECIN.equals(personnelCreateDto.getTypePersonnel()) && personnelCreateDto.getSpecialiteId() != null) {
            Specialite specialite = specialiteRepository.findById(personnelCreateDto.getSpecialiteId())
                    .orElseThrow(() -> new EntityNotFoundException("Spécialité non trouvée avec l'ID: " + personnelCreateDto.getSpecialiteId()));
            personnel.setSpecialite(specialite);
        }
        
        personnel.setDateCreation(LocalDateTime.now());
        personnel.setActif(true);
        
        PersonnelMedical savedPersonnel = personnelRepository.save(personnel);
        log.info("Personnel créé avec succès: ID {}", savedPersonnel.getId());
        
        return personnelMapper.toDTO(savedPersonnel);
    }
    
    @Override
    public PersonnelDTO updatePersonnel(Long id, PersonnelDTO personnelDTO) {
        log.info("Mise à jour du personnel ID: {}", id);
        
        PersonnelMedical existingPersonnel = personnelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Personnel non trouvé avec l'ID: " + id));
        
        // Vérifier si l'email est déjà utilisé par un autre personnel
        if (!existingPersonnel.getEmail().equals(personnelDTO.getEmail()) &&
            personnelRepository.existsByEmail(personnelDTO.getEmail())) {
            throw new ConflictException("Un personnel avec cet email existe déjà: " + personnelDTO.getEmail());
        }
        
        // Gérer la spécialité pour les médecins
        if (TypePersonnel.MEDECIN.equals(existingPersonnel.getTypePersonnel()) && personnelDTO.getSpecialite() != null) {
            if (personnelDTO.getSpecialite().getId() != null) {
                Specialite specialite = specialiteRepository.findById(personnelDTO.getSpecialite().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Spécialité non trouvée avec l'ID: " + personnelDTO.getSpecialite().getId()));
                existingPersonnel.setSpecialite(specialite);
            }
        }
        
        personnelMapper.updateEntityFromDTO(personnelDTO, existingPersonnel);
        existingPersonnel.setDateModification(LocalDateTime.now());
        
        PersonnelMedical updatedPersonnel = personnelRepository.save(existingPersonnel);
        log.info("Personnel mis à jour avec succès: ID {}", updatedPersonnel.getId());
        
        return personnelMapper.toDTO(updatedPersonnel);
    }
    
    @Override
    public void deletePersonnel(Long id) {
        log.info("Suppression du personnel ID: {}", id);
        
        if (!personnelRepository.existsById(id)) {
            throw new EntityNotFoundException("Personnel non trouvé avec l'ID: " + id);
        }
        
        personnelRepository.deleteById(id);
        log.info("Personnel supprimé avec succès: ID {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<PersonnelDTO> getPersonnelById(Long id) {
        return personnelRepository.findById(id)
                .map(personnelMapper::toDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<PersonnelDTO> getPersonnelByMatricule(String matricule) {
        return personnelRepository.findByNumeroOrdre(matricule)
                .map(personnelMapper::toDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<PersonnelDTO> getPersonnelByEmail(String email) {
        return personnelRepository.findByEmail(email)
                .map(personnelMapper::toDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PersonnelDTO> getAllPersonnel() {
        return personnelRepository.findAll()
                .stream()
                .map(personnelMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PersonnelDTO> getPersonnelByType(TypePersonnel typePersonnel) {
        return personnelRepository.findByTypePersonnel(typePersonnel)
                .stream()
                .map(personnelMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PersonnelDTO> getMedecinsBySpecialite(Long specialiteId) {
        return personnelRepository.findByTypePersonnelAndSpecialiteId(TypePersonnel.MEDECIN, specialiteId)
                .stream()
                .map(personnelMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PersonnelDTO> getMedecinsActifs() {
        return personnelRepository.findByTypePersonnelAndActif(TypePersonnel.MEDECIN, true)
                .stream()
                .map(personnelMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public PersonnelDTO toggleActif(Long id, boolean actif) {
        log.info("Changement de statut pour le personnel ID: {} - actif: {}", id, actif);
        
        PersonnelMedical personnel = personnelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Personnel non trouvé avec l'ID: " + id));
        
        personnel.setActif(actif);
        personnel.setDateModification(LocalDateTime.now());
        
        PersonnelMedical updatedPersonnel = personnelRepository.save(personnel);
        log.info("Statut du personnel modifié avec succès: ID {}", updatedPersonnel.getId());
        
        return personnelMapper.toDTO(updatedPersonnel);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return personnelRepository.existsByEmail(email);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByType(TypePersonnel typePersonnel) {
        return personnelRepository.countByTypePersonnel(typePersonnel);
    }
}
