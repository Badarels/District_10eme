package com.district.personnel.repository;

import com.district.personnel.entity.PersonnelMedical;
import com.district.personnel.entity.TypePersonnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonnelMedicalRepository extends JpaRepository<PersonnelMedical, Long> {
    Optional<PersonnelMedical> findByEmail(String email);
    Optional<PersonnelMedical> findByNumeroOrdre(String numeroOrdre);
    boolean existsByEmail(String email);
    boolean existsByNumeroOrdre(String numeroOrdre);
    List<PersonnelMedical> findByTypePersonnel(TypePersonnel typePersonnel);
    List<PersonnelMedical> findByActif(boolean actif);
    List<PersonnelMedical> findByTypePersonnelAndActif(TypePersonnel typePersonnel, boolean actif);
    List<PersonnelMedical> findByTypePersonnelAndSpecialiteId(TypePersonnel typePersonnel, Long specialiteId);
    long countByTypePersonnel(TypePersonnel typePersonnel);
}

