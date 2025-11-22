package com.district.reporting.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reporting")
@CrossOrigin(origins = "*")
public class ReportingController {
    
    @GetMapping("/statistiques")
    public ResponseEntity<Map<String, Object>> getStatistiques() {
        // TODO: Implémenter la logique de récupération des statistiques depuis les autres services
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", 0);
        stats.put("totalConsultations", 0);
        stats.put("totalHospitalisations", 0);
        return ResponseEntity.ok(stats);
    }
}

