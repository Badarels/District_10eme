package com.district.consultation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "diagnostic")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Diagnostic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "consultation_id", nullable = false)
    private Long consultationId;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String diagnostic;
    
    @Column(columnDefinition = "TEXT")
    private String observation;
}

