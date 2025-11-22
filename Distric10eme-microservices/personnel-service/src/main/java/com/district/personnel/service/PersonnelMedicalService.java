package com.district.personnel.service;

import com.district.personnel.dto.PersonnelMedicalDTO;
import com.district.personnel.entity.PersonnelMedical;
import com.district.personnel.entity.Specialite;
import com.district.personnel.entity.TypePersonnel;
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
    
    public PersonnelMedicalDTO create(PersonnelMedicalDTO dto) {
        if (personnelRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un personnel avec cet email existe déjà");
        }
        
        if (dto.getNumeroOrdre() != null && !dto.getNumeroOrdre().isEmpty() &&
            personnelRepository.existsByNumeroOrdre(dto.getNumeroOrdre())) {
            throw new RuntimeException("Un personnel avec ce numéro d'ordre existe déjà");
        }
        
        PersonnelMedical personnel = personnelMapper.toEntity(dto);
        
        if (dto.getSpecialiteId() != null) {
            Specialite specialite = specialiteRepository.findById(dto.getSpecialiteId())
                    .orElseThrow(() -> new RuntimeException("Spécialité non trouvée"));
            personnel.setSpecialite(specialite);
        }
        
        personnel = personnelRepository.save(personnel);
        return personnelMapper.toDTO(personnel);
    }
    
    public List<PersonnelMedicalDTO> findAll() {
        return personnelRepository.findAll().stream()
                .map(personnelMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public PersonnelMedicalDTO findById(Long id) {
        PersonnelMedical personnel = personnelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personnel médical non trouvé"));
        return personnelMapper.toDTO(personnel);
    }
    
    public List<PersonnelMedicalDTO> findByTypePersonnel(TypePersonnel typePersonnel) {
        return personnelRepository.findByTypePersonnel(typePersonnel).stream()
                .map(personnelMapper::toDTO)
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
                .orElseThrow(() -> new RuntimeException("Personnel médical non trouvé"));
        
        if (!personnel.getEmail().equals(dto.getEmail()) &&
            personnelRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un personnel avec cet email existe déjà");
        }
        
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
                    .orElseThrow(() -> new RuntimeException("Spécialité non trouvée"));
            personnel.setSpecialite(specialite);
        } else {
            personnel.setSpecialite(null);
        }
        
        personnel = personnelRepository.save(personnel);
        return personnelMapper.toDTO(personnel);
    }
    
    public void delete(Long id) {
        personnelRepository.deleteById(id);
    }
}

