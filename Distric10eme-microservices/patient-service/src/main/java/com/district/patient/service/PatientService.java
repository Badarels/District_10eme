package com.district.patient.service;

import com.district.patient.dto.PatientDTO;
import com.district.patient.entity.Patient;
import com.district.patient.mapper.PatientMapper;
import com.district.patient.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PatientService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private PatientMapper patientMapper;
    
    public PatientDTO create(PatientDTO dto) {
        if (patientRepository.existsByNumeroDossier(dto.getNumeroDossier())) {
            throw new RuntimeException("Un patient avec ce numéro de dossier existe déjà");
        }
        
        Patient patient = patientMapper.toEntity(dto);
        patient = patientRepository.save(patient);
        return patientMapper.toDTO(patient);
    }
    
    public List<PatientDTO> findAll() {
        return patientRepository.findAll().stream()
                .map(patientMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public PatientDTO findById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));
        return patientMapper.toDTO(patient);
    }
    
    public PatientDTO findByNumeroDossier(String numeroDossier) {
        Patient patient = patientRepository.findByNumeroDossier(numeroDossier)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));
        return patientMapper.toDTO(patient);
    }
    
    public PatientDTO update(Long id, PatientDTO dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));
        
        if (!patient.getNumeroDossier().equals(dto.getNumeroDossier()) &&
            patientRepository.existsByNumeroDossier(dto.getNumeroDossier())) {
            throw new RuntimeException("Un patient avec ce numéro de dossier existe déjà");
        }
        
        patient.setNumeroDossier(dto.getNumeroDossier());
        patient.setNom(dto.getNom());
        patient.setPrenom(dto.getPrenom());
        patient.setSexe(dto.getSexe());
        patient.setDateNaissance(dto.getDateNaissance());
        patient.setTelephone(dto.getTelephone());
        patient.setEmail(dto.getEmail());
        patient.setAdresse(dto.getAdresse());
        patient.setGroupeSanguin(dto.getGroupeSanguin());
        
        patient = patientRepository.save(patient);
        return patientMapper.toDTO(patient);
    }
    
    public void delete(Long id) {
        patientRepository.deleteById(id);
    }
}

