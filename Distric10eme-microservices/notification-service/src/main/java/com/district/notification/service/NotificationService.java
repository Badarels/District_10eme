package com.district.notification.service;

import com.district.notification.dto.NotificationDTO;
import com.district.notification.entity.Notification;
import com.district.notification.entity.StatutNotification;
import com.district.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    public NotificationDTO sendEmail(NotificationDTO dto) {
        Notification notification = new Notification();
        notification.setDestinataireId(dto.getDestinataireId());
        notification.setCanal("EMAIL");
        notification.setMessage(dto.getMessage());
        notification.setDateEnvoi(LocalDateTime.now());
        
        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo("patient@example.com"); // À récupérer depuis user-service
                message.setSubject("Notification SIH");
                message.setText(dto.getMessage());
                mailSender.send(message);
                notification.setStatut(StatutNotification.ENVOYEE);
            } else {
                notification.setStatut(StatutNotification.EN_ATTENTE);
            }
        } catch (Exception e) {
            notification.setStatut(StatutNotification.ECHEC);
        }
        
        notification = notificationRepository.save(notification);
        return toDTO(notification);
    }
    
    public List<NotificationDTO> findByDestinataireId(Long destinataireId) {
        return notificationRepository.findByDestinataireId(destinataireId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    private NotificationDTO toDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setDestinataireId(notification.getDestinataireId());
        dto.setCanal(notification.getCanal());
        dto.setMessage(notification.getMessage());
        dto.setDateEnvoi(notification.getDateEnvoi());
        dto.setStatut(notification.getStatut());
        return dto;
    }
}

