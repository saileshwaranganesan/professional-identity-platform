package com.professionalidentity.backend.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service for emitting structured administrative and security audit logs.
 */
@Service
public class AuditLogService {

    private static final Logger auditLog = LoggerFactory.getLogger("AUDIT_LOG");

    public void logAuthAction(String action, String userEmail, String ipAddress, boolean success, String details) {
        auditLog.info("AUDIT [AUTH] Action: {} | User: {} | IP: {} | Success: {} | Details: {}",
                action, userEmail, ipAddress, success, details);
    }

    public void logAdminOperation(String domain, String operation, String entityId, String actorEmail, String details) {
        auditLog.info("AUDIT [RESOURCE] Domain: {} | Operation: {} | ID: {} | Actor: {} | Details: {}",
                domain, operation, entityId, actorEmail, details);
    }
}
