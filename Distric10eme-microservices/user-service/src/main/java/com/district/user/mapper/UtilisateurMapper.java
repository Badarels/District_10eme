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

    public Utilisateur toEntity(UtilisateurDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setId(dto.getId());
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setActif(dto.isActif());
        utilisateur.setDateCreation(dto.getDateCreation());
        utilisateur.setDateModification(dto.getDateModification());
        
        return utilisateur;
    }

    public void updateEntityFromDTO(UtilisateurDTO dto, Utilisateur utilisateur) {
        if (dto == null || utilisateur == null) {
            return;
        }
        
        if (dto.getNom() != null) utilisateur.setNom(dto.getNom());
        if (dto.getPrenom() != null) utilisateur.setPrenom(dto.getPrenom());
        if (dto.getEmail() != null) utilisateur.setEmail(dto.getEmail());
        utilisateur.setActif(dto.isActif());
    }
}
