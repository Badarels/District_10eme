package com.district.rendezvous.dto;

import com.district.rendezvous.entity.StatutRendezVous;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousDTO {
    private Long id;
    
    @NotNull(message = "L'ID du patient est requis")
    private Long patientId;
    
    @NotNull(message = "L'ID du médecin est requis")
    private Long medecinId;
    
    @NotNull(message = "La date et l'heure sont requises")
    private LocalDateTime dateHeure;
    
    private String motif;
    private StatutRendezVous statut;
    private LocalDateTime dateCreation;
}

