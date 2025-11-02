package com.example.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Класс для безопасного хэширования и проверки паролей с использованием bcrypt.
 */
@Component
public class PasswordHasher {

    private final PasswordEncoder passwordEncoder;

    /**
     * Конструктор с настройкой силы хэширования (cost factor).
     * Рекомендуемое значение: 10–12.
     * По умолчанию используется 10.
     */
    public PasswordHasher() {
        this(10);
    }

    public PasswordHasher(int strength) {
        this.passwordEncoder = new BCryptPasswordEncoder(strength);
    }

    /**
     * Хэширует пароль.
     *
     * @param rawPassword исходный пароль в открытом виде
     * @return хэшированный пароль (включает соль и алгоритм)
     * @throws IllegalArgumentException если пароль null или пустой
     */
    public String hashPassword(String rawPassword) {
        if (rawPassword == null || rawPassword.isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * Проверяет, соответствует ли введённый пароль хэшированному значению.
     *
     * @param rawPassword     введённый пользователем пароль
     * @param hashedPassword  хэш, сохранённый в БД
     * @return true, если пароли совпадают
     */
    public boolean checkPassword(String rawPassword, String hashedPassword) {
        if (rawPassword == null || hashedPassword == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}
