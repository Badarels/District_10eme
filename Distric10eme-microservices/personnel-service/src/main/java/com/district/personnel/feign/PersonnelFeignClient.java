package com.district.personnel.feign;

import com.district.personnel.dto.PersonnelDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Client Feign pour les appels inter-services vers personnel-service
 */
@FeignClient(name = "personnel-service", path = "/api/personnel")
public interface PersonnelFeignClient {
    
    /**
     * Récupérer un personnel par son ID
     * @param id Identifiant du personnel
     * @return Personnel trouvé
     */
    @GetMapping("/{id}")
    PersonnelDTO getPersonnelById(@PathVariable("id") Long id);
    
    /**
     * Récupérer un personnel par son email
     * @param email Email du personnel
     * @return Personnel trouvé
     */
    @GetMapping("/by-email")
    PersonnelDTO getPersonnelByEmail(@RequestParam("email") String email);
    
    /**
     * Récupérer les médecins actifs
     * @return Liste des médecins actifs
     */
    @GetMapping("/medecins-actifs")
    List<PersonnelDTO> getMedecinsActifs();
    
    /**
     * Récupérer les médecins par spécialité
     * @param specialiteId Identifiant de la spécialité
     * @return Liste des médecins de la spécialité
     */
    @GetMapping("/medecins-by-specialite/{specialiteId}")
    List<PersonnelDTO> getMedecinsBySpecialite(@PathVariable("specialiteId") Long specialiteId);
    
    /**
     * Vérifier si un personnel existe par ID
     * @param id Identifiant du personnel
     * @return true si le personnel existe, false sinon
     */
    @GetMapping("/{id}/exists")
    boolean existsById(@PathVariable("id") Long id);
}
