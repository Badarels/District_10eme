package com.district.patient.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {
    private Long id;
    
    // Le numéro de dossier peut être fourni ou auto-généré par le backend
    private String numeroDossier;
    
    @NotBlank(message = "Le nom est requis")
    private String nom;
    
    @NotBlank(message = "Le prénom est requis")
    private String prenom;
    
    @NotBlank(message = "Le sexe est requis")
    private String sexe;
    
    @NotNull(message = "La date de naissance est requise")
    private LocalDate dateNaissance;
    
    private String telephone;
    private String email;
    private String adresse;
    private String groupeSanguin;
    private LocalDate dateEnregistrement;
}
