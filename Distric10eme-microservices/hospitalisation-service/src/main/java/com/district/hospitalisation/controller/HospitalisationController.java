package com.district.hospitalisation.controller;

import com.district.hospitalisation.dto.HospitalisationDTO;
import com.district.hospitalisation.service.HospitalisationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitalisations")
@CrossOrigin(origins = "*")
public class HospitalisationController {
    
    @Autowired
    private HospitalisationService hospitalisationService;
    
    @GetMapping
    public ResponseEntity<List<HospitalisationDTO>> findAll() {
        return ResponseEntity.ok(hospitalisationService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<HospitalisationDTO> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(hospitalisationService.findById(id));
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<HospitalisationDTO>> findByPatientId(@PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(hospitalisationService.findByPatientId(patientId));
    }
    
    @PostMapping
    public ResponseEntity<HospitalisationDTO> create(@Valid @RequestBody HospitalisationDTO dto) {
        return new ResponseEntity<>(hospitalisationService.create(dto), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<HospitalisationDTO> update(@PathVariable("id") Long id, @Valid @RequestBody HospitalisationDTO dto) {
        return ResponseEntity.ok(hospitalisationService.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        hospitalisationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

