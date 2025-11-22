package com.district.rendezvous.controller;

import com.district.rendezvous.dto.RendezVousDTO;
import com.district.rendezvous.service.RendezVousService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rendezvous")
@CrossOrigin(origins = "*")
public class RendezVousController {
    
    @Autowired
    private RendezVousService rendezVousService;
    
    @GetMapping
    public ResponseEntity<List<RendezVousDTO>> findAll() {
        return ResponseEntity.ok(rendezVousService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RendezVousDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(rendezVousService.findById(id));
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<RendezVousDTO>> findByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(rendezVousService.findByPatientId(patientId));
    }
    
    @GetMapping("/medecin/{medecinId}")
    public ResponseEntity<List<RendezVousDTO>> findByMedecinId(@PathVariable Long medecinId) {
        return ResponseEntity.ok(rendezVousService.findByMedecinId(medecinId));
    }
    
    @PostMapping
    public ResponseEntity<RendezVousDTO> create(@Valid @RequestBody RendezVousDTO dto) {
        return new ResponseEntity<>(rendezVousService.create(dto), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RendezVousDTO> update(@PathVariable Long id, @Valid @RequestBody RendezVousDTO dto) {
        return ResponseEntity.ok(rendezVousService.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        rendezVousService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

