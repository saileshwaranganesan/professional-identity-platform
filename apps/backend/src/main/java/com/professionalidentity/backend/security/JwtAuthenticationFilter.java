package com.professionalidentity.backend.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService customUserDetailsService
    ) {
        this.jwtService = jwtService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String uri = request.getRequestURI();
        boolean cookiesNull = (request.getCookies() == null);

        if (cookiesNull) {
            log.info("[AUTH-DEBUG] Request URI: {} | cookiesNull: true | cookieNames: [] | jwtCookieFound: false", uri);
        } else {
            String cookieNames = Arrays.stream(request.getCookies())
                    .map(Cookie::getName)
                    .collect(Collectors.joining(", "));
            boolean jwtCookieFound = Arrays.stream(request.getCookies())
                    .anyMatch(c -> JwtCookieUtil.COOKIE_NAME.equals(c.getName()));
            log.info("[AUTH-DEBUG] Request URI: {} | cookiesNull: false | cookieNames: [{}] | jwtCookieFound: {}",
                    uri, cookieNames, jwtCookieFound);
        }

        String token = extractTokenFromCookie(request);

        if (token == null) {
            String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);
            if (authorizationHeader != null && authorizationHeader.startsWith(BEARER_PREFIX)) {
                token = authorizationHeader.substring(BEARER_PREFIX.length());
            }
        }

        if (token == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String maskedToken = (token.length() > 20) ? token.substring(0, 20) + "..." : token;
        log.info("[AUTH-DEBUG] Request URI: {} | tokenPrefix: {} | Executing jwtService.extractUsername()", uri, maskedToken);

        try {
            String email = jwtService.extractUsername(token);
            log.info("[AUTH-DEBUG] Request URI: {} | extractedEmail: {} | Executing loadUserByUsername()", uri, email);

            if (email != null) {
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
                log.info("[AUTH-DEBUG] Request URI: {} | loadUserByUsername SUCCEEDED for email: {}", uri, email);

                boolean valid = jwtService.isTokenValid(token, userDetails);
                log.info("[AUTH-DEBUG] Request URI: {} | userDetails.isEnabled(): {} | jwtService.isTokenValid(): {}",
                        uri, userDetails.isEnabled(), valid);

                if (userDetails.isEnabled() && valid) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("[AUTH-DEBUG] Request URI: {} | SecurityContextHolder.setAuthentication() EXECUTED successfully for principal: {}",
                            uri, userDetails.getUsername());
                } else {
                    log.warn("[AUTH-DEBUG] Request URI: {} | SecurityContextHolder.setAuthentication() SKIPPED (isEnabled: {}, valid: {})",
                            uri, userDetails.isEnabled(), valid);
                }
            }
        } catch (JwtException | IllegalArgumentException | UsernameNotFoundException e) {
            log.error("[AUTH-DEBUG] Request URI: {} | Exception during JWT processing: {} | Message: {}",
                    uri, e.getClass().getName(), e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        for (Cookie cookie : request.getCookies()) {
            if (JwtCookieUtil.COOKIE_NAME.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}

