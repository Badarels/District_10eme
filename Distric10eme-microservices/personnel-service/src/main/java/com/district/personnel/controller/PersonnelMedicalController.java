package com.district.personnel.controller;

import com.district.personnel.dto.PersonnelMedicalDTO;
import com.district.personnel.entity.TypePersonnel;
import com.district.personnel.service.PersonnelMedicalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personnel")
@CrossOrigin(origins = "*")
public class PersonnelMedicalController {
    
    @Autowired
    private PersonnelMedicalService personnelService;
    
    @GetMapping
    public ResponseEntity<List<PersonnelMedicalDTO>> findAll() {
        return ResponseEntity.ok(personnelService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PersonnelMedicalDTO> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(personnelService.findById(id));
    }
    
    @GetMapping("/type/{typePersonnel}")
    public ResponseEntity<List<PersonnelMedicalDTO>> findByTypePersonnel(
            @PathVariable("typePersonnel") TypePersonnel typePersonnel) {
        return ResponseEntity.ok(personnelService.findByTypePersonnel(typePersonnel));
    }
    
    @GetMapping("/medecins")
    public ResponseEntity<List<PersonnelMedicalDTO>> findMedecins() {
        return ResponseEntity.ok(personnelService.findMedecins());
    }
    
    @GetMapping("/infirmiers")
    public ResponseEntity<List<PersonnelMedicalDTO>> findInfirmiers() {
        return ResponseEntity.ok(personnelService.findInfirmiers());
    }
    
    @PostMapping
    public ResponseEntity<PersonnelMedicalDTO> create(@Valid @RequestBody PersonnelMedicalDTO dto) {
        return new ResponseEntity<>(personnelService.create(dto), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PersonnelMedicalDTO> update(
            @PathVariable("id") Long id, 
            @Valid @RequestBody PersonnelMedicalDTO dto) {
        return ResponseEntity.ok(personnelService.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        personnelService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

