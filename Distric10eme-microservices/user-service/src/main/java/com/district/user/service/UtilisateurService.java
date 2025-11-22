package com.district.user.service;

import com.district.user.dto.LoginRequest;
import com.district.user.dto.LoginResponse;
import com.district.user.dto.UtilisateurDTO;
import com.district.user.entity.Role;
import com.district.user.entity.Utilisateur;
import com.district.user.mapper.UtilisateurMapper;
import com.district.user.repository.RoleRepository;
import com.district.user.repository.UtilisateurRepository;
import com.district.user.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UtilisateurService {
    
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UtilisateurMapper utilisateurMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
        
        if (!passwordEncoder.matches(request.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }
        
        if (!utilisateur.isActif()) {
            throw new RuntimeException("Compte désactivé");
        }
        
        String token = jwtUtil.generateToken(utilisateur.getEmail());
        UtilisateurDTO utilisateurDTO = utilisateurMapper.toDTO(utilisateur);
        
        return new LoginResponse(token, "Bearer", utilisateurDTO);
    }
    
    public UtilisateurDTO create(UtilisateurDTO dto) {
        if (utilisateurRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }
        
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode("password123")); // À changer
        utilisateur.setActif(dto.isActif());
        
        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé"));
        utilisateur.setRole(role);
        
        utilisateur = utilisateurRepository.save(utilisateur);
        return utilisateurMapper.toDTO(utilisateur);
    }
    
    public List<UtilisateurDTO> findAll() {
        return utilisateurRepository.findAll().stream()
                .map(utilisateurMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public UtilisateurDTO findById(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return utilisateurMapper.toDTO(utilisateur);
    }
    
    public UtilisateurDTO update(Long id, UtilisateurDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setActif(dto.isActif());
        
        if (dto.getRoleId() != null) {
            Role role = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Rôle non trouvé"));
            utilisateur.setRole(role);
        }
        
        utilisateur.setDateModification(java.time.LocalDateTime.now());
        utilisateur = utilisateurRepository.save(utilisateur);
        return utilisateurMapper.toDTO(utilisateur);
    }
    
    public void delete(Long id) {
        utilisateurRepository.deleteById(id);
    }
}

