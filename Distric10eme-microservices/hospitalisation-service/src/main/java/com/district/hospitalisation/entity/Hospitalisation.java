package com.district.hospitalisation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "hospitalisation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hospitalisation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @Column(name = "medecin_id", nullable = false)
    private Long medecinId;
    
    @Column(name = "lit_id", nullable = false)
    private Long litId;
    
    @Column(name = "date_admission", nullable = false)
    private LocalDate dateAdmission;
    
    @Column(name = "date_sortie")
    private LocalDate dateSortie;
    
    @Column(name = "motif_admission", columnDefinition = "TEXT")
    private String motifAdmission;
    
    @Column(columnDefinition = "TEXT")
    private String observations;
}

