package com.district.user.mapper;

import com.district.user.dto.UtilisateurDTO;
import com.district.user.entity.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class UtilisateurMapper {
    
    public UtilisateurDTO toDTO(Utilisateur utilisateur) {
        if (utilisateur == null) {
            return null;
        }
        
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId(utilisateur.getId());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        dto.setEmail(utilisateur.getEmail());
        dto.setActif(utilisateur.isActif());
        dto.setDateCreation(utilisateur.getDateCreation());
        dto.setDateModification(utilisateur.getDateModification());
        
        if (utilisateur.getRole() != null) {
            dto.setRoleId(utilisateur.getRole().getId());
            dto.setRoleNom(utilisateur.getRole().getNom());
        }
        
        return dto;
    }
}

