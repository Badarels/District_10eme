package com.district.notification.controller;

import com.district.notification.dto.NotificationDTO;
import com.district.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @PostMapping("/email")
    public ResponseEntity<NotificationDTO> sendEmail(@RequestBody NotificationDTO dto) {
        return new ResponseEntity<>(notificationService.sendEmail(dto), HttpStatus.CREATED);
    }
    
    @GetMapping("/destinataire/{destinataireId}")
    public ResponseEntity<List<NotificationDTO>> findByDestinataireId(@PathVariable Long destinataireId) {
        return ResponseEntity.ok(notificationService.findByDestinataireId(destinataireId));
    }
}

