package com.district.personnel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpecialiteDTO {
    private Long id;
    
    @NotBlank(message = "Le nom de la spécialité est requis")
    private String nom;
    
    private String description;
}

