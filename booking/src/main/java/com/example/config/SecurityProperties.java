package com.example.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "security")
@Data
public class SecurityProperties {
    private String secretKey;
    private long jwtExpiration;
}
