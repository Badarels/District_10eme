package com.district.consultation.controller;

import com.district.consultation.dto.ConsultationDTO;
import com.district.consultation.service.ConsultationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "*")
public class ConsultationController {
    
    @Autowired
    private ConsultationService consultationService;
    
    @GetMapping
    public ResponseEntity<List<ConsultationDTO>> findAll() {
        return ResponseEntity.ok(consultationService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ConsultationDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(consultationService.findById(id));
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ConsultationDTO>> findByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(consultationService.findByPatientId(patientId));
    }
    
    @PostMapping
    public ResponseEntity<ConsultationDTO> create(@Valid @RequestBody ConsultationDTO dto) {
        return new ResponseEntity<>(consultationService.create(dto), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ConsultationDTO> update(@PathVariable Long id, @Valid @RequestBody ConsultationDTO dto) {
        return ResponseEntity.ok(consultationService.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        consultationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

