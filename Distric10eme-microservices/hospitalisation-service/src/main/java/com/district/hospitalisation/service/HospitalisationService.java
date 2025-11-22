package com.district.hospitalisation.service;

import com.district.hospitalisation.dto.HospitalisationDTO;
import com.district.hospitalisation.entity.Hospitalisation;
import com.district.hospitalisation.repository.HospitalisationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HospitalisationService {
    
    @Autowired
    private HospitalisationRepository hospitalisationRepository;
    
    public HospitalisationDTO create(HospitalisationDTO dto) {
        Hospitalisation hospitalisation = new Hospitalisation();
        hospitalisation.setPatientId(dto.getPatientId());
        hospitalisation.setMedecinId(dto.getMedecinId());
        hospitalisation.setLitId(dto.getLitId());
        hospitalisation.setDateAdmission(dto.getDateAdmission());
        hospitalisation.setDateSortie(dto.getDateSortie());
        hospitalisation.setMotifAdmission(dto.getMotifAdmission());
        hospitalisation.setObservations(dto.getObservations());
        
        hospitalisation = hospitalisationRepository.save(hospitalisation);
        return toDTO(hospitalisation);
    }
    
    public List<HospitalisationDTO> findAll() {
        return hospitalisationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public HospitalisationDTO findById(Long id) {
        Hospitalisation hospitalisation = hospitalisationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospitalisation non trouvée"));
        return toDTO(hospitalisation);
    }
    
    public List<HospitalisationDTO> findByPatientId(Long patientId) {
        return hospitalisationRepository.findByPatientId(patientId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public HospitalisationDTO update(Long id, HospitalisationDTO dto) {
        Hospitalisation hospitalisation = hospitalisationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospitalisation non trouvée"));
        
        hospitalisation.setPatientId(dto.getPatientId());
        hospitalisation.setMedecinId(dto.getMedecinId());
        hospitalisation.setLitId(dto.getLitId());
        hospitalisation.setDateAdmission(dto.getDateAdmission());
        hospitalisation.setDateSortie(dto.getDateSortie());
        hospitalisation.setMotifAdmission(dto.getMotifAdmission());
        hospitalisation.setObservations(dto.getObservations());
        
        hospitalisation = hospitalisationRepository.save(hospitalisation);
        return toDTO(hospitalisation);
    }
    
    public void delete(Long id) {
        hospitalisationRepository.deleteById(id);
    }
    
    private HospitalisationDTO toDTO(Hospitalisation hospitalisation) {
        HospitalisationDTO dto = new HospitalisationDTO();
        dto.setId(hospitalisation.getId());
        dto.setPatientId(hospitalisation.getPatientId());
        dto.setMedecinId(hospitalisation.getMedecinId());
        dto.setLitId(hospitalisation.getLitId());
        dto.setDateAdmission(hospitalisation.getDateAdmission());
        dto.setDateSortie(hospitalisation.getDateSortie());
        dto.setMotifAdmission(hospitalisation.getMotifAdmission());
        dto.setObservations(hospitalisation.getObservations());
        return dto;
    }
}

