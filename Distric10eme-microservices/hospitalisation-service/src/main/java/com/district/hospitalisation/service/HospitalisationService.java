package com.district.hospitalisation.service;

import com.district.hospitalisation.dto.HospitalisationDTO;
import com.district.hospitalisation.entity.Hospitalisation;
import com.district.hospitalisation.event.HospitalisationEvent;
import com.district.hospitalisation.kafka.KafkaProducerService;
import com.district.hospitalisation.repository.HospitalisationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HospitalisationService {
    
    private static final Logger log = LoggerFactory.getLogger(HospitalisationService.class);
    
    @Autowired
    private HospitalisationRepository hospitalisationRepository;
    
    @Autowired
    private KafkaProducerService kafkaProducerService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public HospitalisationDTO create(HospitalisationDTO dto) {
        Hospitalisation hospitalisation = new Hospitalisation();
        hospitalisation.setPatientId(dto.getPatientId());
        hospitalisation.setMedecinId(dto.getMedecinId());
        hospitalisation.setLitId(dto.getLitId());
        hospitalisation.setDateAdmission(dto.getDateAdmission());
        hospitalisation.setDateSortie(dto.getDateSortie());
        hospitalisation.setMotifAdmission(dto.getMotifAdmission());
        hospitalisation.setObservations(dto.getObservations());
        
        hospitalisation = hospitalisationRepository.save(hospitalisation);
        HospitalisationDTO result = toDTO(hospitalisation);
        publishHospitalisationEvent(hospitalisation, "CREATED");
        return result;
    }
    
    public List<HospitalisationDTO> findAll() {
        return hospitalisationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public HospitalisationDTO findById(Long id) {
        Hospitalisation hospitalisation = hospitalisationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospitalisation non trouvée"));
        return toDTO(hospitalisation);
    }
    
    public List<HospitalisationDTO> findByPatientId(Long patientId) {
        return hospitalisationRepository.findByPatientId(patientId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public HospitalisationDTO update(Long id, HospitalisationDTO dto) {
        Hospitalisation hospitalisation = hospitalisationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospitalisation non trouvée"));
        
        hospitalisation.setPatientId(dto.getPatientId());
        hospitalisation.setMedecinId(dto.getMedecinId());
        hospitalisation.setLitId(dto.getLitId());
        hospitalisation.setDateAdmission(dto.getDateAdmission());
        hospitalisation.setDateSortie(dto.getDateSortie());
        hospitalisation.setMotifAdmission(dto.getMotifAdmission());
        hospitalisation.setObservations(dto.getObservations());
        
        hospitalisation = hospitalisationRepository.save(hospitalisation);
        HospitalisationDTO result = toDTO(hospitalisation);
        publishHospitalisationEvent(hospitalisation, "UPDATED");
        return result;
    }
    
    public void delete(Long id) {
        hospitalisationRepository.deleteById(id);
    }
    
    private void publishHospitalisationEvent(Hospitalisation hospitalisation, String action) {
        try {
            HospitalisationEvent event = new HospitalisationEvent(
                    hospitalisation.getId(),
                    hospitalisation.getPatientId(),
                    hospitalisation.getMedecinId(),
                    hospitalisation.getLitId(),
                    hospitalisation.getMotifAdmission(),
                    action
            );
            String json = objectMapper.writeValueAsString(event);
            String key = hospitalisation.getPatientId() != null ? hospitalisation.getPatientId().toString() : String.valueOf(hospitalisation.getId());
            kafkaProducerService.sendMessage("hospitalisation.cree", key, json);
        } catch (Exception e) {
            log.error("Erreur lors de la publication de l'evenement Kafka Hospitalisation: {}", e.getMessage(), e);
        }
    }
    
    private HospitalisationDTO toDTO(Hospitalisation hospitalisation) {
        HospitalisationDTO dto = new HospitalisationDTO();
        dto.setId(hospitalisation.getId());
        dto.setPatientId(hospitalisation.getPatientId());
        dto.setMedecinId(hospitalisation.getMedecinId());
        dto.setLitId(hospitalisation.getLitId());
        dto.setDateAdmission(hospitalisation.getDateAdmission());
        dto.setDateSortie(hospitalisation.getDateSortie());
        dto.setMotifAdmission(hospitalisation.getMotifAdmission());
        dto.setObservations(hospitalisation.getObservations());
        return dto;
    }
}

