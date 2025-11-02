package com.example.security;

import org.springframework.stereotype.Service;

import com.example.config.SecurityProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long jwtExpirationMs;
    private final SecurityProperties securityProperties;


    public JwtService(SecurityProperties securityProperties) {
        this.securityProperties = securityProperties;
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(this.securityProperties.getSecretKey()));
        this.jwtExpirationMs = securityProperties.getJwtExpiration();
    }

    /**
     * Генерирует JWT токен с userId и privilegeLevel
     */
    public String generateToken(Integer userId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(userId.toString())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(jwtExpirationMs, ChronoUnit.MILLIS)))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Валидирует токен: проверяет подпись, срок действия и наличие обязательных полей
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // Любая ошибка — недействительный токен
            return false;
        }
    }

    /**
     * Извлекает userId из токена
     */
    public Integer getUserIdFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return Integer.parseInt(claims.getSubject());
    }

    /**
     * Вспомогательный метод для извлечения Claims
     */
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
