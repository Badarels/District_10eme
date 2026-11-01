package com.district.personnel.service;

import com.district.personnel.dto.PersonnelMedicalDTO;
import com.district.personnel.entity.PersonnelMedical;
import com.district.personnel.entity.Specialite;
import com.district.personnel.entity.TypePersonnel;
import com.district.personnel.exception.ConflictException;
import com.district.personnel.exception.EntityNotFoundException;
import com.district.personnel.mapper.PersonnelMedicalMapper;
import com.district.personnel.repository.PersonnelMedicalRepository;
import com.district.personnel.repository.SpecialiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PersonnelMedicalService {
    
    @Autowired
    private PersonnelMedicalRepository personnelRepository;
    
    @Autowired
    private SpecialiteRepository specialiteRepository;
    
    @Autowired
    private PersonnelMedicalMapper personnelMapper;
    
    private String cleanString(String s) {
        if (s == null || s.trim().isEmpty()) {
            return null;
        }
        return s.trim();
    }

    @jakarta.annotation.PostConstruct
    public void cleanExistingEmptyStrings() {
        try {
            personnelRepository.findAll().forEach(p -> {
                boolean changed = false;
                if (p.getNumeroOrdre() != null && p.getNumeroOrdre().trim().isEmpty()) {
                    p.setNumeroOrdre(null);
                    changed = true;
                }
                if (p.getNumeroLicence() != null && p.getNumeroLicence().trim().isEmpty()) {
                    p.setNumeroLicence(null);
                    changed = true;
                }
                if (changed) {
                    personnelRepository.save(p);
                }
            });
        } catch (Exception ignored) {
        }
    }

    public PersonnelMedicalDTO create(PersonnelMedicalDTO dto) {
        dto.setNumeroOrdre(cleanString(dto.getNumeroOrdre()));
        dto.setNumeroLicence(cleanString(dto.getNumeroLicence()));
        dto.setEmail(cleanString(dto.getEmail()));
        dto.setTelephone(cleanString(dto.getTelephone()));
        dto.setAdresse(cleanString(dto.getAdresse()));

        if (personnelRepository.existsByEmail(dto.getEmail())) {
            throw new ConflictException("Un personnel avec cet email existe déjà: " + dto.getEmail());
        }
        
        if (dto.getNumeroOrdre() != null && personnelRepository.existsByNumeroOrdre(dto.getNumeroOrdre())) {
            throw new ConflictException("Un personnel avec ce numéro d'ordre existe déjà: " + dto.getNumeroOrdre());
        }
        
        PersonnelMedical personnel = personnelMapper.toEntity(dto);
        personnel.setNumeroOrdre(dto.getNumeroOrdre());
        personnel.setNumeroLicence(dto.getNumeroLicence());
        
        if (dto.getSpecialiteId() != null) {
            Specialite specialite = specialiteRepository.findById(dto.getSpecialiteId())
                    .orElseThrow(() -> new EntityNotFoundException("Spécialité non trouvée avec l'id: " + dto.getSpecialiteId()));
            personnel.setSpecialite(specialite);
        } else {
            personnel.setSpecialite(null);
        }
        
        personnel = personnelRepository.save(personnel);
        return personnelMapper.toMedicalDTO(personnel);
    }
    
    public List<PersonnelMedicalDTO> findAll() {
        return personnelRepository.findAll().stream()
                .map(personnelMapper::toMedicalDTO)
                .collect(Collectors.toList());
    }
    
    public PersonnelMedicalDTO findById(Long id) {
        PersonnelMedical personnel = personnelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Personnel médical non trouvé avec l'id: " + id));
        return personnelMapper.toMedicalDTO(personnel);
    }
    
    public List<PersonnelMedicalDTO> findByTypePersonnel(TypePersonnel typePersonnel) {
        return personnelRepository.findByTypePersonnel(typePersonnel).stream()
                .map(personnelMapper::toMedicalDTO)
                .collect(Collectors.toList());
    }
    
    public List<PersonnelMedicalDTO> findMedecins() {
        return findByTypePersonnel(TypePersonnel.MEDECIN);
    }
    
    public List<PersonnelMedicalDTO> findInfirmiers() {
        return findByTypePersonnel(TypePersonnel.INFIRMIER);
    }
    
    public PersonnelMedicalDTO update(Long id, PersonnelMedicalDTO dto) {
        PersonnelMedical personnel = personnelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Personnel médical non trouvé avec l'id: " + id));
        
        dto.setNumeroOrdre(cleanString(dto.getNumeroOrdre()));
        dto.setNumeroLicence(cleanString(dto.getNumeroLicence()));
        dto.setEmail(cleanString(dto.getEmail()));
        dto.setTelephone(cleanString(dto.getTelephone()));
        dto.setAdresse(cleanString(dto.getAdresse()));

        if (!personnel.getEmail().equalsIgnoreCase(dto.getEmail()) &&
            personnelRepository.existsByEmail(dto.getEmail())) {
            throw new ConflictException("Un personnel avec cet email existe déjà: " + dto.getEmail());
        }
        
        if (dto.getNumeroOrdre() != null &&
            !dto.getNumeroOrdre().equals(personnel.getNumeroOrdre()) &&
            personnelRepository.existsByNumeroOrdre(dto.getNumeroOrdre())) {
            throw new ConflictException("Un personnel avec ce numéro d'ordre existe déjà: " + dto.getNumeroOrdre());
        }
        
        personnel.setNumeroOrdre(dto.getNumeroOrdre());
        personnel.setNom(dto.getNom());
        personnel.setPrenom(dto.getPrenom());
        personnel.setSexe(dto.getSexe());
        personnel.setDateNaissance(dto.getDateNaissance());
        personnel.setEmail(dto.getEmail());
        personnel.setTelephone(dto.getTelephone());
        personnel.setAdresse(dto.getAdresse());
        personnel.setTypePersonnel(dto.getTypePersonnel());
        personnel.setNumeroLicence(dto.getNumeroLicence());
        personnel.setDateEmbauche(dto.getDateEmbauche());
        personnel.setActif(dto.isActif());
        personnel.setDateModification(LocalDateTime.now());
        
        if (dto.getSpecialiteId() != null) {
            Specialite specialite = specialiteRepository.findById(dto.getSpecialiteId())
                    .orElseThrow(() -> new EntityNotFoundException("Spécialité non trouvée avec l'id: " + dto.getSpecialiteId()));
            personnel.setSpecialite(specialite);
        } else {
            personnel.setSpecialite(null);
        }
        
        personnel = personnelRepository.save(personnel);
        return personnelMapper.toMedicalDTO(personnel);
    }
    
    public void delete(Long id) {
        personnelRepository.deleteById(id);
    }
}

