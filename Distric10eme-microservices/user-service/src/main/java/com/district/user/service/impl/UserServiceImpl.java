package com.district.user.service.impl;

import com.district.user.dto.UtilisateurDTO;
import com.district.user.entity.Utilisateur;
import com.district.user.exception.EntityNotFoundException;
import com.district.user.exception.ConflictException;
import com.district.user.mapper.UtilisateurMapper;
import com.district.user.repository.UtilisateurRepository;
import com.district.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implémentation du service de gestion des utilisateurs
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UtilisateurRepository utilisateurRepository;
    private final UtilisateurMapper utilisateurMapper;
    
    @Override
    public UtilisateurDTO createUtilisateur(UtilisateurDTO utilisateurDTO) {
        log.info("Création d'un nouvel utilisateur: {}", utilisateurDTO.getEmail());
        
        // Vérifier si l'email existe déjà
        if (utilisateurRepository.existsByEmail(utilisateurDTO.getEmail())) {
            throw new ConflictException("Un utilisateur avec cet email existe déjà: " + utilisateurDTO.getEmail());
        }
        
        Utilisateur utilisateur = utilisateurMapper.toEntity(utilisateurDTO);
        utilisateur.setDateCreation(LocalDateTime.now());
        utilisateur.setActif(true);
        
        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);
        log.info("Utilisateur créé avec succès: ID {}", savedUtilisateur.getId());
        
        return utilisateurMapper.toDTO(savedUtilisateur);
    }
    
    @Override
    public UtilisateurDTO updateUtilisateur(Long id, UtilisateurDTO utilisateurDTO) {
        log.info("Mise à jour de l'utilisateur ID: {}", id);
        
        Utilisateur existingUtilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + id));
        
        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (!existingUtilisateur.getEmail().equals(utilisateurDTO.getEmail()) &&
            utilisateurRepository.existsByEmail(utilisateurDTO.getEmail())) {
            throw new ConflictException("Un utilisateur avec cet email existe déjà: " + utilisateurDTO.getEmail());
        }
        
        utilisateurMapper.updateEntityFromDTO(utilisateurDTO, existingUtilisateur);
        existingUtilisateur.setDateModification(LocalDateTime.now());
        
        Utilisateur updatedUtilisateur = utilisateurRepository.save(existingUtilisateur);
        log.info("Utilisateur mis à jour avec succès: ID {}", updatedUtilisateur.getId());
        
        return utilisateurMapper.toDTO(updatedUtilisateur);
    }
    
    @Override
    public void deleteUtilisateur(Long id) {
        log.info("Suppression de l'utilisateur ID: {}", id);
        
        if (!utilisateurRepository.existsById(id)) {
            throw new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + id);
        }
        
        utilisateurRepository.deleteById(id);
        log.info("Utilisateur supprimé avec succès: ID {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<UtilisateurDTO> getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id)
                .map(utilisateurMapper::toDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<UtilisateurDTO> getUtilisateurByEmail(String email) {
        return utilisateurRepository.findByEmail(email)
                .map(utilisateurMapper::toDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UtilisateurDTO> getAllUtilisateurs() {
        return utilisateurRepository.findAll()
                .stream()
                .map(utilisateurMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public UtilisateurDTO toggleActif(Long id, boolean actif) {
        log.info("Changement de statut pour l'utilisateur ID: {} - actif: {}", id, actif);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + id));
        
        utilisateur.setActif(actif);
        utilisateur.setDateModification(LocalDateTime.now());
        
        Utilisateur updatedUtilisateur = utilisateurRepository.save(utilisateur);
        log.info("Statut de l'utilisateur modifié avec succès: ID {}", updatedUtilisateur.getId());
        
        return utilisateurMapper.toDTO(updatedUtilisateur);
    }
}
