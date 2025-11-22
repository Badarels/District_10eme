package com.district.consultation.service;

import com.district.consultation.dto.ConsultationDTO;
import com.district.consultation.entity.Consultation;
import com.district.consultation.repository.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConsultationService {
    
    @Autowired
    private ConsultationRepository consultationRepository;
    
    public ConsultationDTO create(ConsultationDTO dto) {
        Consultation consultation = new Consultation();
        consultation.setPatientId(dto.getPatientId());
        consultation.setMedecinId(dto.getMedecinId());
        consultation.setDateConsultation(dto.getDateConsultation());
        consultation.setMotif(dto.getMotif());
        consultation.setDescription(dto.getDescription());
        
        consultation = consultationRepository.save(consultation);
        return toDTO(consultation);
    }
    
    public List<ConsultationDTO> findAll() {
        return consultationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public ConsultationDTO findById(Long id) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));
        return toDTO(consultation);
    }
    
    public List<ConsultationDTO> findByPatientId(Long patientId) {
        return consultationRepository.findByPatientId(patientId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public ConsultationDTO update(Long id, ConsultationDTO dto) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));
        
        consultation.setPatientId(dto.getPatientId());
        consultation.setMedecinId(dto.getMedecinId());
        consultation.setDateConsultation(dto.getDateConsultation());
        consultation.setMotif(dto.getMotif());
        consultation.setDescription(dto.getDescription());
        
        consultation = consultationRepository.save(consultation);
        return toDTO(consultation);
    }
    
    public void delete(Long id) {
        consultationRepository.deleteById(id);
    }
    
    private ConsultationDTO toDTO(Consultation consultation) {
        ConsultationDTO dto = new ConsultationDTO();
        dto.setId(consultation.getId());
        dto.setPatientId(consultation.getPatientId());
        dto.setMedecinId(consultation.getMedecinId());
        dto.setDateConsultation(consultation.getDateConsultation());
        dto.setMotif(consultation.getMotif());
        dto.setDescription(consultation.getDescription());
        return dto;
    }
}

