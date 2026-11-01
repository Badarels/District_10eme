package com.district.patient.service;

import com.district.patient.dto.PatientDTO;
import com.district.patient.entity.Patient;
import com.district.patient.event.PatientEvent;
import com.district.patient.exception.EntityNotFoundException;
import com.district.patient.exception.PatientAlreadyExistsException;
import com.district.patient.mapper.PatientMapper;
import com.district.patient.repository.PatientRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PatientService {

    private static final Logger log = LoggerFactory.getLogger(PatientService.class);

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PatientMapper patientMapper;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private ObjectMapper objectMapper;
    
    public String generateUniqueNumeroDossier() {
        int year = Year.now().getValue();
        String prefix = "PAT-" + year + "-";
        long nextId = patientRepository.count() + 1;
        String candidate = String.format("%s%04d", prefix, nextId);
        while (patientRepository.existsByNumeroDossier(candidate)) {
            nextId++;
            candidate = String.format("%s%04d", prefix, nextId);
        }
        return candidate;
    }
    
    public PatientDTO create(PatientDTO dto) {
        // Si le numéro de dossier n'est pas fourni, le générer automatiquement
        if (dto.getNumeroDossier() == null || dto.getNumeroDossier().trim().isEmpty()) {
            dto.setNumeroDossier(generateUniqueNumeroDossier());
        } else {
            dto.setNumeroDossier(dto.getNumeroDossier().trim());
            if (patientRepository.existsByNumeroDossier(dto.getNumeroDossier())) {
                throw new PatientAlreadyExistsException("Un patient avec ce numéro de dossier existe déjà: " + dto.getNumeroDossier());
            }
        }
        
        Patient patient = patientMapper.toEntity(dto);
        if (patient.getDateEnregistrement() == null) {
            patient.setDateEnregistrement(LocalDate.now());
        }
        patient = patientRepository.save(patient);
        PatientDTO result = patientMapper.toDTO(patient);
        // Publier l'evenement Kafka
        publishPatientEvent(patient, "CREATED");
        return result;
    }
    
    public List<PatientDTO> findAll() {
        return patientRepository.findAll().stream()
                .map(patientMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public PatientDTO findById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Patient non trouvé avec l'id: " + id));
        return patientMapper.toDTO(patient);
    }
    
    public PatientDTO findByNumeroDossier(String numeroDossier) {
        Patient patient = patientRepository.findByNumeroDossier(numeroDossier)
                .orElseThrow(() -> new EntityNotFoundException("Patient non trouvé avec le numéro: " + numeroDossier));
        return patientMapper.toDTO(patient);
    }
    
    public PatientDTO update(Long id, PatientDTO dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Patient non trouvé avec l'id: " + id));
        
        if (dto.getNumeroDossier() != null && !dto.getNumeroDossier().trim().isEmpty()) {
            String newNum = dto.getNumeroDossier().trim();
            if (!newNum.equals(patient.getNumeroDossier()) && patientRepository.existsByNumeroDossier(newNum)) {
                throw new PatientAlreadyExistsException("Un patient avec ce numéro de dossier existe déjà: " + newNum);
            }
            patient.setNumeroDossier(newNum);
        }
        
        patient.setNom(dto.getNom());
        patient.setPrenom(dto.getPrenom());
        patient.setSexe(dto.getSexe());
        patient.setDateNaissance(dto.getDateNaissance());
        patient.setTelephone(dto.getTelephone());
        patient.setEmail(dto.getEmail());
        patient.setAdresse(dto.getAdresse());
        patient.setGroupeSanguin(dto.getGroupeSanguin());
        
        patient = patientRepository.save(patient);
        PatientDTO result = patientMapper.toDTO(patient);
        // Publier l'evenement Kafka
        publishPatientEvent(patient, "UPDATED");
        return result;
    }

    public void delete(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Patient non trouvé avec l'id: " + id));
        patientRepository.deleteById(id);
        // Publier l'evenement Kafka
        publishPatientEvent(patient, "DELETED");
    }

    /**
     * Serialise un PatientEvent en JSON et l'envoie sur le topic Kafka appropriate.
     * Format du topic: patient.created | patient.updated | patient.deleted
     */
    private void publishPatientEvent(Patient patient, String action) {
        try {
            com.district.patient.event.PatientEvent event = new com.district.patient.event.PatientEvent(
                    patient.getId(),
                    patient.getNumeroDossier(),
                    patient.getNom(),
                    patient.getPrenom(),
                    patient.getTelephone(),
                    patient.getEmail(),
                    action
            );
            String json = objectMapper.writeValueAsString(event);
            String topic = "patient." + action.toLowerCase();
            kafkaProducerService.sendMessage(topic, json);
            log.info("[Kafka] Evenement publie sur '{}': {}", topic, json);
        } catch (Exception e) {
            log.error("[Kafka] Erreur lors de la publication de l'evenement patient: {}", e.getMessage());
        }
    }
}
