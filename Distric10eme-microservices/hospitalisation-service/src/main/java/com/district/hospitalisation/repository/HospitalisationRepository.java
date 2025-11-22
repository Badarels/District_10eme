package com.district.hospitalisation.repository;

import com.district.hospitalisation.entity.Hospitalisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalisationRepository extends JpaRepository<Hospitalisation, Long> {
    List<Hospitalisation> findByPatientId(Long patientId);
    List<Hospitalisation> findByMedecinId(Long medecinId);
    List<Hospitalisation> findByDateSortieIsNull();
}

