package com.district.personnel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "personnel_medical")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonnelMedical {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "numero_ordre", unique = true)
    private String numeroOrdre; // Numéro d'ordre pour les médecins
    
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false)
    private String prenom;
    
    @Column(nullable = false)
    private String sexe; // M/F
    
    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaissance;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String telephone;
    
    private String adresse;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type_personnel", nullable = false)
    private TypePersonnel typePersonnel;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "specialite_id")
    private Specialite specialite; // Pour les médecins
    
    @Column(name = "numero_licence")
    private String numeroLicence; // Pour les infirmiers, etc.
    
    @Column(name = "date_embauche")
    private LocalDate dateEmbauche;
    
    @Column(nullable = false)
    private boolean actif = true;
    
    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();
    
    @Column(name = "date_modification")
    private LocalDateTime dateModification;
}

