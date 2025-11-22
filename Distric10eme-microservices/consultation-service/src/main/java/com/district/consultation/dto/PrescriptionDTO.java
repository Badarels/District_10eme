package com.district.consultation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDTO {
    private Long id;
    
    @NotNull(message = "L'ID de la consultation est requis")
    private Long consultationId;
    
    @NotBlank(message = "Le médicament est requis")
    private String medicament;
    
    private String posologie;
    private String duree;
}

