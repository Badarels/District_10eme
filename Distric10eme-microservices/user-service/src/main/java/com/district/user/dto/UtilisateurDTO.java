package com.district.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private boolean actif;
    private Long roleId;
    private String roleNom;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

