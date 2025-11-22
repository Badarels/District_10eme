package com.district.patient.mapper;

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
}

