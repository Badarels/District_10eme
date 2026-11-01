package com.district.user.controller;

import com.district.user.dto.UtilisateurDTO;
import com.district.user.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UtilisateurController {
    
    @Autowired
    private UtilisateurService utilisateurService;
    
    @GetMapping
    public ResponseEntity<List<UtilisateurDTO>> findAll() {
        return ResponseEntity.ok(utilisateurService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UtilisateurDTO> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(utilisateurService.findById(id));
    }
    
    @PostMapping
    public ResponseEntity<UtilisateurDTO> create(@Valid @RequestBody UtilisateurDTO dto) {
        return new ResponseEntity<>(utilisateurService.create(dto), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UtilisateurDTO> update(@PathVariable("id") Long id, @Valid @RequestBody UtilisateurDTO dto) {
        return ResponseEntity.ok(utilisateurService.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        utilisateurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

