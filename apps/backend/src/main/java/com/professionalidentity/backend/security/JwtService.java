package com.professionalidentity.backend.security;

import com.professionalidentity.backend.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final SecretKey signingKey;
    private final long expirationMillis;

    public JwtService(JwtProperties jwtProperties) {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(jwtProperties.secret()));
        this.expirationMillis = jwtProperties.expiration().toMillis();
        if (expirationMillis <= 0) {
            throw new IllegalArgumentException("jwt.expiration must be positive");
        }
    }

    public String generateToken(UserDetails userDetails) {
        Date issuedAt = new Date();
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(issuedAt)
                .expiration(new Date(issuedAt.getTime() + expirationMillis))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String extractedUser = extractUsername(token);
            boolean usernameMatches = extractedUser.equals(userDetails.getUsername());
            boolean expired = isTokenExpired(token);
            boolean valid = usernameMatches && !expired;
            log.info("[AUTH-DEBUG] JwtService isTokenValid | usernameMatches: {} | tokenExpired: {} | finalResult: {}",
                    usernameMatches, expired, valid);
            return valid;
        } catch (Exception e) {
            log.error("[AUTH-DEBUG] JwtService isTokenValid Exception: {} | Message: {}",
                    e.getClass().getName(), e.getMessage());
            return false;
        }
    }

    public long getExpirationMillis() {
        return expirationMillis;
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            log.error("[AUTH-DEBUG] JwtService extractAllClaims Exception: {} | Message: {}",
                    e.getClass().getName(), e.getMessage());
            throw e;
        }
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }
}
