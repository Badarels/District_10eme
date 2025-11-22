package com.district.patient.repository;

import com.district.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByNumeroDossier(String numeroDossier);
    boolean existsByNumeroDossier(String numeroDossier);
}

