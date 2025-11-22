package com.district.personnel.service;

import com.district.personnel.dto.SpecialiteDTO;
import com.district.personnel.entity.Specialite;
import com.district.personnel.repository.SpecialiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SpecialiteService {
    
    @Autowired
    private SpecialiteRepository specialiteRepository;
    
    public SpecialiteDTO create(SpecialiteDTO dto) {
        if (specialiteRepository.existsByNom(dto.getNom())) {
            throw new RuntimeException("Une spécialité avec ce nom existe déjà");
        }
        
        Specialite specialite = new Specialite();
        specialite.setNom(dto.getNom());
        specialite.setDescription(dto.getDescription());
        
        specialite = specialiteRepository.save(specialite);
        return toDTO(specialite);
    }
    
    public List<SpecialiteDTO> findAll() {
        return specialiteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public SpecialiteDTO findById(Long id) {
        Specialite specialite = specialiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spécialité non trouvée"));
        return toDTO(specialite);
    }
    
    public SpecialiteDTO update(Long id, SpecialiteDTO dto) {
        Specialite specialite = specialiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spécialité non trouvée"));
        
        if (!specialite.getNom().equals(dto.getNom()) &&
            specialiteRepository.existsByNom(dto.getNom())) {
            throw new RuntimeException("Une spécialité avec ce nom existe déjà");
        }
        
        specialite.setNom(dto.getNom());
        specialite.setDescription(dto.getDescription());
        
        specialite = specialiteRepository.save(specialite);
        return toDTO(specialite);
    }
    
    public void delete(Long id) {
        specialiteRepository.deleteById(id);
    }
    
    private SpecialiteDTO toDTO(Specialite specialite) {
        SpecialiteDTO dto = new SpecialiteDTO();
        dto.setId(specialite.getId());
        dto.setNom(specialite.getNom());
        dto.setDescription(specialite.getDescription());
        return dto;
    }
}

