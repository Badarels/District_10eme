package com.district.personnel.mapper;

import com.district.personnel.dto.PersonnelCreateDto;
import com.district.personnel.dto.PersonnelDTO;
import com.district.personnel.dto.PersonnelMedicalDTO;
import com.district.personnel.dto.SpecialiteDTO;
import com.district.personnel.entity.PersonnelMedical;
import org.springframework.stereotype.Component;

@Component
public class PersonnelMedicalMapper {
    
    public PersonnelDTO toDTO(PersonnelMedical personnel) {
        if (personnel == null) {
            return null;
        }
        
        PersonnelDTO dto = new PersonnelDTO();
        dto.setId(personnel.getId());
        dto.setNumeroOrdre(personnel.getNumeroOrdre());
        dto.setMatricule(personnel.getNumeroOrdre());
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
            dto.setSpecialite(new SpecialiteDTO(personnel.getSpecialite().getId(), personnel.getSpecialite().getNom(), personnel.getSpecialite().getDescription()));
        }
        
        return dto;
    }

    public PersonnelMedicalDTO toMedicalDTO(PersonnelMedical personnel) {
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
    
    public PersonnelMedical toEntity(PersonnelDTO dto) {
        if (dto == null) {
            return null;
        }
        
        PersonnelMedical personnel = new PersonnelMedical();
        personnel.setId(dto.getId());
        personnel.setNumeroOrdre(dto.getNumeroOrdre() != null ? dto.getNumeroOrdre() : dto.getMatricule());
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

    public PersonnelMedical toEntity(PersonnelMedicalDTO dto) {
        if (dto == null) {
            return null;
        }
        
        PersonnelMedical personnel = new PersonnelMedical();
        personnel.setId(dto.getId());
        personnel.setNumeroOrdre(dto.getNumeroOrdre() != null && !dto.getNumeroOrdre().trim().isEmpty() ? dto.getNumeroOrdre().trim() : null);
        personnel.setNom(dto.getNom());
        personnel.setPrenom(dto.getPrenom());
        personnel.setSexe(dto.getSexe());
        personnel.setDateNaissance(dto.getDateNaissance());
        personnel.setEmail(dto.getEmail());
        personnel.setTelephone(dto.getTelephone());
        personnel.setAdresse(dto.getAdresse());
        personnel.setTypePersonnel(dto.getTypePersonnel());
        personnel.setNumeroLicence(dto.getNumeroLicence() != null && !dto.getNumeroLicence().trim().isEmpty() ? dto.getNumeroLicence().trim() : null);
        personnel.setDateEmbauche(dto.getDateEmbauche());
        personnel.setActif(dto.isActif());
        
        return personnel;
    }

    public PersonnelMedical toEntityFromCreateDto(PersonnelCreateDto dto) {
        if (dto == null) {
            return null;
        }
        
        PersonnelMedical personnel = new PersonnelMedical();
        personnel.setNumeroOrdre(dto.getMatricule());
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

    public void updateEntityFromDTO(PersonnelDTO dto, PersonnelMedical personnel) {
        if (dto == null || personnel == null) {
            return;
        }
        
        if (dto.getNom() != null) personnel.setNom(dto.getNom());
        if (dto.getPrenom() != null) personnel.setPrenom(dto.getPrenom());
        if (dto.getSexe() != null) personnel.setSexe(dto.getSexe());
        if (dto.getDateNaissance() != null) personnel.setDateNaissance(dto.getDateNaissance());
        if (dto.getEmail() != null) personnel.setEmail(dto.getEmail());
        if (dto.getTelephone() != null) personnel.setTelephone(dto.getTelephone());
        if (dto.getAdresse() != null) personnel.setAdresse(dto.getAdresse());
        if (dto.getTypePersonnel() != null) personnel.setTypePersonnel(dto.getTypePersonnel());
        if (dto.getNumeroLicence() != null) personnel.setNumeroLicence(dto.getNumeroLicence());
        if (dto.getDateEmbauche() != null) personnel.setDateEmbauche(dto.getDateEmbauche());
        personnel.setActif(dto.isActif());
    }
}
