package com.district.rendezvous.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rendez_vous")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RendezVous {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @Column(name = "medecin_id", nullable = false)
    private Long medecinId;
    
    @Column(name = "date_heure", nullable = false)
    private LocalDateTime dateHeure;
    
    private String motif;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutRendezVous statut = StatutRendezVous.PLANIFIE;
    
    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();
}

