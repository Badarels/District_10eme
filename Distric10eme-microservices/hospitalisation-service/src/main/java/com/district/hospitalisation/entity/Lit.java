package com.district.hospitalisation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "chambre_id", nullable = false)
    private Long chambreId;
    
    @Column(nullable = false)
    private String numero;
    
    @Column(nullable = false)
    private boolean occupe = false;
}

