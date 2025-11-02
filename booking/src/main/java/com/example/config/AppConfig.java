package com.example.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@ComponentScan
@EnableConfigurationProperties(SecurityProperties.class)
@PropertySource("classpath:application.properties")
public class AppConfig {
    
}
