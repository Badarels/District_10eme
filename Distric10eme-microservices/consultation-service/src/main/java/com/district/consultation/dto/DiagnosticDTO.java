package com.district.consultation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiagnosticDTO {
    private Long id;
    
    @NotNull(message = "L'ID de la consultation est requis")
    private Long consultationId;
    
    @NotBlank(message = "Le diagnostic est requis")
    private String diagnostic;
    
    private String observation;
}

