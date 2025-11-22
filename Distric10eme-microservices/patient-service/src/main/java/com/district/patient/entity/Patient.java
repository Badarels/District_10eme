package com.district.patient.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "numero_dossier", nullable = false, unique = true)
    private String numeroDossier;
    
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false)
    private String prenom;
    
    @Column(nullable = false)
    private String sexe; // M/F
    
    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaissance;
    
    private String telephone;
    
    private String email;
    
    private String adresse;
    
    @Column(name = "groupe_sanguin")
    private String groupeSanguin; // O+, A-, etc.
    
    @Column(name = "date_enregistrement")
    private LocalDate dateEnregistrement = LocalDate.now();
}

