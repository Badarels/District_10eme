package com.district.patient.controller;

import com.district.patient.dto.PatientDTO;
import com.district.patient.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {
    
    @Autowired
    private PatientService patientService;
    
    @GetMapping
    public ResponseEntity<List<PatientDTO>> findAll() {
        return ResponseEntity.ok(patientService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.findById(id));
    }
    
    @GetMapping("/numero/{numeroDossier}")
    public ResponseEntity<PatientDTO> findByNumeroDossier(@PathVariable String numeroDossier) {
        return ResponseEntity.ok(patientService.findByNumeroDossier(numeroDossier));
    }
    
    @PostMapping
    public ResponseEntity<PatientDTO> create(@Valid @RequestBody PatientDTO dto) {
        return new ResponseEntity<>(patientService.create(dto), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> update(@PathVariable Long id, @Valid @RequestBody PatientDTO dto) {
        return ResponseEntity.ok(patientService.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

