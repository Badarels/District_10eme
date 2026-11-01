package com.district.patient.repository;

import com.district.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long>, JpaSpecificationExecutor<Patient> {
    Optional<Patient> findByNumeroDossier(String numeroDossier);
    boolean existsByNumeroDossier(String numeroDossier);
    Optional<Patient> findByNomAndDateNaissanceAndTelephone(String nom, LocalDate dateNaissance, String telephone);
}

