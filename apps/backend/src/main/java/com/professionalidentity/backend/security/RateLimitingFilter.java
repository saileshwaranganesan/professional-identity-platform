package com.professionalidentity.backend.security;

import com.professionalidentity.backend.response.ApiError;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Lightweight, production-grade sliding-window rate limiter for sensitive public endpoints.
 * Defends /api/v1/auth/login (10 req/min) and /api/v1/contact (5 req/min) against brute force and spam.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    private final Map<String, Deque<Long>> loginRequests = new ConcurrentHashMap<>();
    private final Map<String, Deque<Long>> contactRequests = new ConcurrentHashMap<>();

    private static final int LOGIN_LIMIT_PER_MINUTE = 10;
    private static final int CONTACT_LIMIT_PER_MINUTE = 5;
    private static final long ONE_MINUTE_MS = 60_000L;

    public RateLimitingFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        String clientIp = getClientIp(request);
        long now = System.currentTimeMillis();

        if (path.endsWith("/api/v1/auth/login") && "POST".equalsIgnoreCase(request.getMethod())) {
            if (isRateLimited(clientIp, loginRequests, LOGIN_LIMIT_PER_MINUTE, now)) {
                sendRateLimitError(response, "Too many login attempts. Please try again in a minute.");
                return;
            }
        } else if (path.endsWith("/api/v1/contact") && "POST".equalsIgnoreCase(request.getMethod())) {
            if (isRateLimited(clientIp, contactRequests, CONTACT_LIMIT_PER_MINUTE, now)) {
                sendRateLimitError(response, "Too many message submissions. Please try again in a minute.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private synchronized boolean isRateLimited(String ip, Map<String, Deque<Long>> requestStore, int maxLimit, long now) {
        Deque<Long> timestamps = requestStore.computeIfAbsent(ip, k -> new ArrayDeque<>());

        // Evict entries older than 1 minute
        while (!timestamps.isEmpty() && (now - timestamps.peekFirst()) > ONE_MINUTE_MS) {
            timestamps.pollFirst();
        }

        if (timestamps.size() >= maxLimit) {
            return true;
        }

        timestamps.addLast(now);
        return false;
    }

    private void sendRateLimitError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), ApiError.builder()
                .status(HttpStatus.TOO_MANY_REQUESTS.value())
                .error(HttpStatus.TOO_MANY_REQUESTS.getReasonPhrase())
                .message(message)
                .timestamp(LocalDateTime.now())
                .build());
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
