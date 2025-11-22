package com.district.notification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "destinataire_id", nullable = false)
    private Long destinataireId;
    
    @Column(nullable = false)
    private String canal; // EMAIL / SMS
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Column(name = "date_envoi")
    private LocalDateTime dateEnvoi;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutNotification statut = StatutNotification.EN_ATTENTE;
}

