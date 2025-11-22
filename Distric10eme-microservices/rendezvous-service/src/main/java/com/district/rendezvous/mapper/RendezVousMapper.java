package com.district.rendezvous.mapper;

import com.district.rendezvous.dto.RendezVousDTO;
import com.district.rendezvous.entity.RendezVous;
import org.springframework.stereotype.Component;

@Component
public class RendezVousMapper {
    
    public RendezVousDTO toDTO(RendezVous rendezVous) {
        if (rendezVous == null) {
            return null;
        }
        
        RendezVousDTO dto = new RendezVousDTO();
        dto.setId(rendezVous.getId());
        dto.setPatientId(rendezVous.getPatientId());
        dto.setMedecinId(rendezVous.getMedecinId());
        dto.setDateHeure(rendezVous.getDateHeure());
        dto.setMotif(rendezVous.getMotif());
        dto.setStatut(rendezVous.getStatut());
        dto.setDateCreation(rendezVous.getDateCreation());
        
        return dto;
    }
    
    public RendezVous toEntity(RendezVousDTO dto) {
        if (dto == null) {
            return null;
        }
        
        RendezVous rendezVous = new RendezVous();
        rendezVous.setId(dto.getId());
        rendezVous.setPatientId(dto.getPatientId());
        rendezVous.setMedecinId(dto.getMedecinId());
        rendezVous.setDateHeure(dto.getDateHeure());
        rendezVous.setMotif(dto.getMotif());
        rendezVous.setStatut(dto.getStatut() != null ? dto.getStatut() : com.district.rendezvous.entity.StatutRendezVous.PLANIFIE);
        
        return rendezVous;
    }
}

