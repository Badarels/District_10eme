package com.district.patient.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO pour la création d'un patient
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientCreateDto {
    
    @NotBlank(message = "Le numéro de dossier est requis")
    private String numeroDossier;
    
    @NotBlank(message = "Le nom est requis")
    private String nom;
    
    @NotBlank(message = "Le prénom est requis")
    private String prenom;
    
    @NotBlank(message = "Le sexe est requis")
    @Pattern(regexp = "^[MF]$", message = "Le sexe doit être M ou F")
    private String sexe;
    
    @NotNull(message = "La date de naissance est requise")
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;
    
    @Pattern(regexp = "^(\\+\\d{1,3}[- ]?)?\\d{10}$", message = "Le numéro de téléphone n'est pas valide")
    private String telephone;
    
    @jakarta.validation.constraints.Email(message = "L'email doit être valide")
    private String email;
    
    private String adresse;
    
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Le groupe sanguin doit être de format A+, A-, B+, B-, AB+, AB-, O+, O-")
    private String groupeSanguin;
}
