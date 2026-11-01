package com.district.consultation.service;

import com.district.consultation.dto.ConsultationDTO;
import com.district.consultation.dto.PrescriptionDTO;
import com.district.consultation.entity.Consultation;
import com.district.consultation.entity.Prescription;
import com.district.consultation.event.ConsultationEvent;
import com.district.consultation.kafka.KafkaProducerService;
import com.district.consultation.repository.ConsultationRepository;
import com.district.consultation.repository.PrescriptionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConsultationService {

    private static final Logger log = LoggerFactory.getLogger(ConsultationService.class);

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private ObjectMapper objectMapper;
    
    public ConsultationDTO create(ConsultationDTO dto) {
        Consultation consultation = new Consultation();
        consultation.setPatientId(dto.getPatientId());
        consultation.setMedecinId(dto.getMedecinId());
        consultation.setDateConsultation(dto.getDateConsultation());
        consultation.setMotif(dto.getMotif());
        consultation.setDescription(dto.getDescription());
        
        consultation = consultationRepository.save(consultation);

        if (dto.getPrescriptions() != null && !dto.getPrescriptions().isEmpty()) {
            final Long consultationId = consultation.getId();
            for (PrescriptionDTO pDto : dto.getPrescriptions()) {
                if (pDto.getMedicament() != null && !pDto.getMedicament().trim().isEmpty()) {
                    Prescription p = new Prescription();
                    p.setConsultationId(consultationId);
                    p.setMedicament(pDto.getMedicament().trim());
                    p.setPosologie(pDto.getPosologie());
                    p.setDuree(pDto.getDuree());
                    prescriptionRepository.save(p);
                }
            }
        }
        
        ConsultationDTO result = toDTO(consultation);
        publishConsultationEvent(consultation, "CREATED");
        return result;
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

        // Mise à jour des prescriptions
        prescriptionRepository.deleteByConsultationId(id);
        if (dto.getPrescriptions() != null && !dto.getPrescriptions().isEmpty()) {
            for (PrescriptionDTO pDto : dto.getPrescriptions()) {
                if (pDto.getMedicament() != null && !pDto.getMedicament().trim().isEmpty()) {
                    Prescription p = new Prescription();
                    p.setConsultationId(id);
                    p.setMedicament(pDto.getMedicament().trim());
                    p.setPosologie(pDto.getPosologie());
                    p.setDuree(pDto.getDuree());
                    prescriptionRepository.save(p);
                }
            }
        }
        
        ConsultationDTO result = toDTO(consultation);
        publishConsultationEvent(consultation, "UPDATED");
        return result;
    }
    
    public void delete(Long id) {
        prescriptionRepository.deleteByConsultationId(id);
        consultationRepository.deleteById(id);
        // Pas d'objet disponible apres suppression, on envoie juste l'id
        publishDeleteEvent(id);
    }

    /**
     * Publie un evenement de consultation sur le topic Kafka appropriate.
     */
    private void publishConsultationEvent(Consultation consultation, String action) {
        try {
            ConsultationEvent event = new ConsultationEvent(
                    consultation.getId(),
                    consultation.getPatientId(),
                    consultation.getMedecinId(),
                    consultation.getMotif(),
                    action
            );
            String json = objectMapper.writeValueAsString(event);
            String topic = "consultation." + action.toLowerCase();
            kafkaProducerService.sendMessage(topic, json);
            log.info("[Kafka] Evenement publie sur '{}': {}", topic, json);
        } catch (Exception e) {
            log.error("[Kafka] Erreur publication consultation event: {}", e.getMessage());
        }
    }

    private void publishDeleteEvent(Long id) {
        try {
            String json = "{\"consultationId\":" + id + ",\"action\":\"DELETED\"}";
            kafkaProducerService.sendMessage("consultation.deleted", json);
            log.info("[Kafka] Evenement publie sur 'consultation.deleted' pour id={}", id);
        } catch (Exception e) {
            log.error("[Kafka] Erreur publication delete event: {}", e.getMessage());
        }
    }
    
    private ConsultationDTO toDTO(Consultation consultation) {
        ConsultationDTO dto = new ConsultationDTO();
        dto.setId(consultation.getId());
        dto.setPatientId(consultation.getPatientId());
        dto.setMedecinId(consultation.getMedecinId());
        dto.setDateConsultation(consultation.getDateConsultation());
        dto.setMotif(consultation.getMotif());
        dto.setDescription(consultation.getDescription());

        List<Prescription> prescriptions = prescriptionRepository.findByConsultationId(consultation.getId());
        if (prescriptions != null && !prescriptions.isEmpty()) {
            dto.setPrescriptions(prescriptions.stream().map(p -> new PrescriptionDTO(
                    p.getId(),
                    p.getConsultationId(),
                    p.getMedicament(),
                    p.getPosologie(),
                    p.getDuree()
            )).collect(Collectors.toList()));
        } else {
            dto.setPrescriptions(new ArrayList<>());
        }
        return dto;
    }
}
