package com.district.rendezvous.service;

import com.district.rendezvous.dto.RendezVousDTO;
import com.district.rendezvous.entity.RendezVous;
import com.district.rendezvous.entity.StatutRendezVous;
import com.district.rendezvous.mapper.RendezVousMapper;
import com.district.rendezvous.repository.RendezVousRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RendezVousService {
    
    @Autowired
    private RendezVousRepository rendezVousRepository;
    
    @Autowired
    private RendezVousMapper rendezVousMapper;
    
    public RendezVousDTO create(RendezVousDTO dto) {
        RendezVous rendezVous = rendezVousMapper.toEntity(dto);
        rendezVous = rendezVousRepository.save(rendezVous);
        return rendezVousMapper.toDTO(rendezVous);
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
        return rendezVousMapper.toDTO(rendezVous);
    }
    
    public void delete(Long id) {
        rendezVousRepository.deleteById(id);
    }
}

