package com.district.personnel.dto;

import com.district.personnel.entity.TypePersonnel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonnelMedicalDTO {
    private Long id;
    
    private String numeroOrdre;
    
    @NotBlank(message = "Le nom est requis")
    private String nom;
    
    @NotBlank(message = "Le prénom est requis")
    private String prenom;
    
    @NotBlank(message = "Le sexe est requis")
    private String sexe;
    
    @NotNull(message = "La date de naissance est requise")
    private LocalDate dateNaissance;
    
    @NotBlank(message = "L'email est requis")
    @Email(message = "Email invalide")
    private String email;
    
    private String telephone;
    private String adresse;
    
    @NotNull(message = "Le type de personnel est requis")
    private TypePersonnel typePersonnel;
    
    private Long specialiteId;
    private String specialiteNom;
    
    private String numeroLicence;
    private LocalDate dateEmbauche;
    private boolean actif = true;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

