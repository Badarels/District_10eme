package com.district.hospitalisation.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalisationDTO {
    private Long id;
    
    @NotNull(message = "L'ID du patient est requis")
    private Long patientId;
    
    @NotNull(message = "L'ID du médecin est requis")
    private Long medecinId;
    
    @NotNull(message = "L'ID du lit est requis")
    private Long litId;
    
    @NotNull(message = "La date d'admission est requise")
    private LocalDate dateAdmission;
    
    private LocalDate dateSortie;
    private String motifAdmission;
    private String observations;
}

