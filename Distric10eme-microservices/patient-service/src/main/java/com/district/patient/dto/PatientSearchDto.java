package com.district.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO pour la recherche multicritère de patients
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientSearchDto {
    
    private String numeroDossier;
    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String groupeSanguin;
    private LocalDate dateNaissanceMin;
    private LocalDate dateNaissanceMax;
    private LocalDate dateEnregistrementMin;
    private LocalDate dateEnregistrementMax;
    
    // Paramètres de pagination
    private Integer page = 0;
    private Integer size = 20;
    private String sortBy = "nom";
    private String sortDirection = "asc";
}
