package com.district.rendezvous.repository;

import com.district.rendezvous.entity.RendezVous;
import com.district.rendezvous.entity.StatutRendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    List<RendezVous> findByPatientId(Long patientId);
    List<RendezVous> findByMedecinId(Long medecinId);
    List<RendezVous> findByStatut(StatutRendezVous statut);
    List<RendezVous> findByDateHeureBetween(LocalDateTime start, LocalDateTime end);
}

