package com.district.rendezvous.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/**
 * Evenement Kafka publie par le rendezvous-service.
 * Contient les informations essentielles d'un rendez-vous.
 */
public class RendezVousEvent {

    private Long rendezVousId;
    private Long patientId;
    private Long medecinId;
    private String motif;
    private String statut; // PLANIFIE | CONFIRME | ANNULE
    private String action; // CREATED | CONFIRMED | CANCELLED | UPDATED

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateHeure;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    public RendezVousEvent() {}

    public RendezVousEvent(Long rendezVousId, Long patientId, Long medecinId,
                           String motif, String statut, LocalDateTime dateHeure, String action) {
        this.rendezVousId = rendezVousId;
        this.patientId = patientId;
        this.medecinId = medecinId;
        this.motif = motif;
        this.statut = statut;
        this.dateHeure = dateHeure;
        this.action = action;
        this.timestamp = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getRendezVousId() { return rendezVousId; }
    public void setRendezVousId(Long rendezVousId) { this.rendezVousId = rendezVousId; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getMedecinId() { return medecinId; }
    public void setMedecinId(Long medecinId) { this.medecinId = medecinId; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public LocalDateTime getDateHeure() { return dateHeure; }
    public void setDateHeure(LocalDateTime dateHeure) { this.dateHeure = dateHeure; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
