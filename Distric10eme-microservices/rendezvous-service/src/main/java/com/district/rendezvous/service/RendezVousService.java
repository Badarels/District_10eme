package com.district.rendezvous.service;

import com.district.rendezvous.dto.RendezVousDTO;
import com.district.rendezvous.entity.RendezVous;
import com.district.rendezvous.entity.StatutRendezVous;
import com.district.rendezvous.event.RendezVousEvent;
import com.district.rendezvous.kafka.KafkaProducerService;
import com.district.rendezvous.mapper.RendezVousMapper;
import com.district.rendezvous.repository.RendezVousRepository;
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
public class RendezVousService {

    private static final Logger log = LoggerFactory.getLogger(RendezVousService.class);

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private RendezVousMapper rendezVousMapper;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private ObjectMapper objectMapper;
    
    public RendezVousDTO create(RendezVousDTO dto) {
        RendezVous rendezVous = rendezVousMapper.toEntity(dto);
        rendezVous = rendezVousRepository.save(rendezVous);
        RendezVousDTO result = rendezVousMapper.toDTO(rendezVous);
        publishRendezVousEvent(rendezVous, "CREATED");
        return result;
    }
    
    public List<RendezVousDTO> findAll() {
        return rendezVousRepository.findAll().stream()
                .map(rendezVousMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public RendezVousDTO findById(Long id) {
        RendezVous rendezVous = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));
        return rendezVousMapper.toDTO(rendezVous);
    }
    
    public List<RendezVousDTO> findByPatientId(Long patientId) {
        return rendezVousRepository.findByPatientId(patientId).stream()
                .map(rendezVousMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<RendezVousDTO> findByMedecinId(Long medecinId) {
        return rendezVousRepository.findByMedecinId(medecinId).stream()
                .map(rendezVousMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public RendezVousDTO update(Long id, RendezVousDTO dto) {
        RendezVous rendezVous = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));
        
        rendezVous.setPatientId(dto.getPatientId());
        rendezVous.setMedecinId(dto.getMedecinId());
        rendezVous.setDateHeure(dto.getDateHeure());
        rendezVous.setMotif(dto.getMotif());
        if (dto.getStatut() != null) {
            rendezVous.setStatut(dto.getStatut());
        }
        
        rendezVous = rendezVousRepository.save(rendezVous);
        RendezVousDTO result = rendezVousMapper.toDTO(rendezVous);
        // Determiner l'action selon le statut
        String action = (rendezVous.getStatut() != null && rendezVous.getStatut().name().equals("CONFIRME"))
                ? "CONFIRMED" : "UPDATED";
        publishRendezVousEvent(rendezVous, action);
        return result;
    }

    public void delete(Long id) {
        RendezVous rv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouve"));
        rendezVousRepository.deleteById(id);
        publishRendezVousEvent(rv, "CANCELLED");
    }

    /**
     * Publie un evenement RendezVous sur le topic Kafka appropriate.
     * Topics: rendezvous.created | rendezvous.confirmed | rendezvous.updated | rendezvous.cancelled
     */
    private void publishRendezVousEvent(RendezVous rv, String action) {
        try {
            RendezVousEvent event = new RendezVousEvent(
                    rv.getId(),
                    rv.getPatientId(),
                    rv.getMedecinId(),
                    rv.getMotif(),
                    rv.getStatut() != null ? rv.getStatut().name() : null,
                    rv.getDateHeure(),
                    action
            );
            String json = objectMapper.writeValueAsString(event);
            String topic = "rendezvous." + action.toLowerCase();
            kafkaProducerService.sendMessage(topic, json);
            log.info("[Kafka] Evenement publie sur '{}': {}", topic, json);
        } catch (Exception e) {
            log.error("[Kafka] Erreur publication rendezvous event: {}", e.getMessage());
        }
    }
}

