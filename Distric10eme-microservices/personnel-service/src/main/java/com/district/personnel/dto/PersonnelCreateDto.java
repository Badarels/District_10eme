package com.district.personnel.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO pour la création d'un personnel médical
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonnelCreateDto {
    
    @NotBlank(message = "La matricule est requise")
    private String matricule;
    
    @NotBlank(message = "Le nom est requis")
    private String nom;
    
    @NotBlank(message = "Le prénom est requis")
    private String prenom;
    
    @NotBlank(message = "Le sexe est requis")
    private String sexe;
    
    @NotNull(message = "La date de naissance est requise")
    private LocalDate dateNaissance;
    
    @NotBlank(message = "L'email est requis")
    @Email(message = "L'email doit être valide")
    private String email;
    
    private String telephone;
    private String adresse;
    
    @NotNull(message = "Le type de personnel est requis")
    private com.district.personnel.entity.TypePersonnel typePersonnel;
    
    private Long specialiteId; // Pour les médecins
    
    private String numeroLicence; // Pour les infirmiers, etc.
    
    private LocalDate dateEmbauche;
    private boolean actif = true;
}
