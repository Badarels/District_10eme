package com.district.consultation.repository;

import com.district.consultation.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByConsultationId(Long consultationId);
    void deleteByConsultationId(Long consultationId);
}
