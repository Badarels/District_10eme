package com.district.patient.controller;

import com.district.patient.dto.PatientDTO;
import com.district.patient.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<PatientDTO> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(patientService.findById(id));
    }
    
    @GetMapping("/numero/{numeroDossier}")
    public ResponseEntity<PatientDTO> findByNumeroDossier(@PathVariable("numeroDossier") String numeroDossier) {
        return ResponseEntity.ok(patientService.findByNumeroDossier(numeroDossier));
    }

    @GetMapping("/generate-numero-dossier")
    public ResponseEntity<Map<String, String>> generateNumeroDossier() {
        String num = patientService.generateUniqueNumeroDossier();
        return ResponseEntity.ok(Collections.singletonMap("numeroDossier", num));
    }
    
    @PostMapping
    public ResponseEntity<PatientDTO> create(@Valid @RequestBody PatientDTO dto) {
        return new ResponseEntity<>(patientService.create(dto), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> update(@PathVariable("id") Long id, @Valid @RequestBody PatientDTO dto) {
        return ResponseEntity.ok(patientService.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
