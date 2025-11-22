package com.district.consultation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "consultation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @Column(name = "medecin_id", nullable = false)
    private Long medecinId;
    
    @Column(name = "date_consultation", nullable = false)
    private LocalDateTime dateConsultation;
    
    private String motif;
    
    @Column(columnDefinition = "TEXT")
    private String description;
}

