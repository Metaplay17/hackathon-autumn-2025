package com.example.security;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.dto.responses.DefaultResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    // Пути, которые не требуют токена (должны совпадать с теми, что в SecurityConfig)
    private static final String[] PUBLIC_URLS = {
        "/auth/**"
    };

    public JwtAuthenticationFilter(JwtService jwtService, ObjectMapper objectMapper) {
        this.jwtService = jwtService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Пропускаем публичные пути — не проверяем токен
        if (isPublicUrl(request.getServletPath())) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");
        String token = null;
        Integer userId = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // "Bearer " has 7 characters
            try {
                userId = jwtService.getUserIdFromToken(token);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId, null, java.util.Collections.emptyList());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                writeErrorResponse(response, HttpStatus.UNAUTHORIZED, "Токен не валиден");
                return;
            }
        }
        else {
            writeErrorResponse(response, HttpStatus.UNAUTHORIZED, "Требуется токен");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void writeErrorResponse(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        DefaultResponse errorResponse = new DefaultResponse(status, message);
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }

    private boolean isPublicUrl(String path) {
        for (String publicUrl : PUBLIC_URLS) {
            // Поддержка Ant-паттернов вручную (простой вариант)
            if (publicUrl.endsWith("/**")) {
                String prefix = publicUrl.substring(0, publicUrl.length() - 3);
                if (path.startsWith(prefix)) {
                    return true;
                }
            } else if (path.equals(publicUrl)) {
                return true;
            }
        }
        return false;
    }
}
