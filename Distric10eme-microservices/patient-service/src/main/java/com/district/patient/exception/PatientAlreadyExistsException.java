package com.district.patient.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception levée lorsqu'un patient existe déjà
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class PatientAlreadyExistsException extends RuntimeException {
    
    public PatientAlreadyExistsException(String message) {
        super(message);
    }
    
    public PatientAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
