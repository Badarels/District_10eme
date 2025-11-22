package com.district.consultation.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationDTO {
    private Long id;
    
    @NotNull(message = "L'ID du patient est requis")
    private Long patientId;
    
    @NotNull(message = "L'ID du médecin est requis")
    private Long medecinId;
    
    @NotNull(message = "La date de consultation est requise")
    private LocalDateTime dateConsultation;
    
    private String motif;
    private String description;
}

