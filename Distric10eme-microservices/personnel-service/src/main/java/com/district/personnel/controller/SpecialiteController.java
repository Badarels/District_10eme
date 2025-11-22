package com.district.personnel.controller;

import com.district.personnel.dto.SpecialiteDTO;
import com.district.personnel.service.SpecialiteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialites")
@CrossOrigin(origins = "*")
public class SpecialiteController {
    
    @Autowired
    private SpecialiteService specialiteService;
    
    @GetMapping
    public ResponseEntity<List<SpecialiteDTO>> findAll() {
        return ResponseEntity.ok(specialiteService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SpecialiteDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(specialiteService.findById(id));
    }
    
    @PostMapping
    public ResponseEntity<SpecialiteDTO> create(@Valid @RequestBody SpecialiteDTO dto) {
        return new ResponseEntity<>(specialiteService.create(dto), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SpecialiteDTO> update(
            @PathVariable Long id, 
            @Valid @RequestBody SpecialiteDTO dto) {
        return ResponseEntity.ok(specialiteService.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        specialiteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

