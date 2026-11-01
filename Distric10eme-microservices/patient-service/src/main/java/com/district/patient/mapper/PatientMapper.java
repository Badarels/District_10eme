package com.district.patient.mapper;

import com.district.patient.dto.PatientCreateDto;
import com.district.patient.dto.PatientDTO;
import com.district.patient.entity.Patient;
import org.springframework.stereotype.Component;

@Component
public class PatientMapper {
    
    public PatientDTO toDTO(Patient patient) {
        if (patient == null) {
            return null;
        }
        
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setNumeroDossier(patient.getNumeroDossier());
        dto.setNom(patient.getNom());
        dto.setPrenom(patient.getPrenom());
        dto.setSexe(patient.getSexe());
        dto.setDateNaissance(patient.getDateNaissance());
        dto.setTelephone(patient.getTelephone());
        dto.setEmail(patient.getEmail());
        dto.setAdresse(patient.getAdresse());
        dto.setGroupeSanguin(patient.getGroupeSanguin());
        dto.setDateEnregistrement(patient.getDateEnregistrement());
        
        return dto;
    }
    
    public Patient toEntity(PatientDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Patient patient = new Patient();
        patient.setId(dto.getId());
        patient.setNumeroDossier(dto.getNumeroDossier());
        patient.setNom(dto.getNom());
        patient.setPrenom(dto.getPrenom());
        patient.setSexe(dto.getSexe());
        patient.setDateNaissance(dto.getDateNaissance());
        patient.setTelephone(dto.getTelephone());
        patient.setEmail(dto.getEmail());
        patient.setAdresse(dto.getAdresse());
        patient.setGroupeSanguin(dto.getGroupeSanguin());
        patient.setDateEnregistrement(dto.getDateEnregistrement());
        
        return patient;
    }

    public Patient toEntityFromCreateDto(PatientCreateDto dto) {
        if (dto == null) {
            return null;
        }
        
        Patient patient = new Patient();
        patient.setNumeroDossier(dto.getNumeroDossier());
        patient.setNom(dto.getNom());
        patient.setPrenom(dto.getPrenom());
        patient.setSexe(dto.getSexe());
        patient.setDateNaissance(dto.getDateNaissance());
        patient.setTelephone(dto.getTelephone());
        patient.setEmail(dto.getEmail());
        patient.setAdresse(dto.getAdresse());
        patient.setGroupeSanguin(dto.getGroupeSanguin());
        
        return patient;
    }

    public void updateEntityFromDTO(PatientDTO dto, Patient patient) {
        if (dto == null || patient == null) {
            return;
        }
        
        if (dto.getNumeroDossier() != null) patient.setNumeroDossier(dto.getNumeroDossier());
        if (dto.getNom() != null) patient.setNom(dto.getNom());
        if (dto.getPrenom() != null) patient.setPrenom(dto.getPrenom());
        if (dto.getSexe() != null) patient.setSexe(dto.getSexe());
        if (dto.getDateNaissance() != null) patient.setDateNaissance(dto.getDateNaissance());
        if (dto.getTelephone() != null) patient.setTelephone(dto.getTelephone());
        if (dto.getEmail() != null) patient.setEmail(dto.getEmail());
        if (dto.getAdresse() != null) patient.setAdresse(dto.getAdresse());
        if (dto.getGroupeSanguin() != null) patient.setGroupeSanguin(dto.getGroupeSanguin());
    }
}

