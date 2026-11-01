package com.district.consultation.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateConsultation;
    
    private String motif;
    private String description;

    @JsonProperty("prescriptions")
    @JsonAlias("prescription")
    private List<PrescriptionDTO> prescriptions = new ArrayList<>();
}
