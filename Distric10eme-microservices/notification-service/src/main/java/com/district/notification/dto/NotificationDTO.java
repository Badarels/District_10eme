package com.district.notification.dto;

import com.district.notification.entity.StatutNotification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private Long destinataireId;
    private String canal;
    private String message;
    private LocalDateTime dateEnvoi;
    private StatutNotification statut;
}

