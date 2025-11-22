package com.district.personnel.mapper;

import com.district.personnel.dto.PersonnelMedicalDTO;
import com.district.personnel.entity.PersonnelMedical;
import org.springframework.stereotype.Component;

@Component
public class PersonnelMedicalMapper {
    
    public PersonnelMedicalDTO toDTO(PersonnelMedical personnel) {
        if (personnel == null) {
            return null;
        }
        
        PersonnelMedicalDTO dto = new PersonnelMedicalDTO();
        dto.setId(personnel.getId());
        dto.setNumeroOrdre(personnel.getNumeroOrdre());
        dto.setNom(personnel.getNom());
        dto.setPrenom(personnel.getPrenom());
        dto.setSexe(personnel.getSexe());
        dto.setDateNaissance(personnel.getDateNaissance());
        dto.setEmail(personnel.getEmail());
        dto.setTelephone(personnel.getTelephone());
        dto.setAdresse(personnel.getAdresse());
        dto.setTypePersonnel(personnel.getTypePersonnel());
        dto.setNumeroLicence(personnel.getNumeroLicence());
        dto.setDateEmbauche(personnel.getDateEmbauche());
        dto.setActif(personnel.isActif());
        dto.setDateCreation(personnel.getDateCreation());
        dto.setDateModification(personnel.getDateModification());
        
        if (personnel.getSpecialite() != null) {
            dto.setSpecialiteId(personnel.getSpecialite().getId());
            dto.setSpecialiteNom(personnel.getSpecialite().getNom());
        }
        
        return dto;
    }
    
    public PersonnelMedical toEntity(PersonnelMedicalDTO dto) {
        if (dto == null) {
            return null;
        }
        
        PersonnelMedical personnel = new PersonnelMedical();
        personnel.setId(dto.getId());
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
        
        return personnel;
    }
}

