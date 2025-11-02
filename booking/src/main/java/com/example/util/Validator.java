package com.example.util;

public class Validator {
        /**
     * Проверяет пароль на соответствие требованиям:
     * - не менее 8 символов
     * - содержит хотя бы одну цифру
     * - содержит хотя бы одну заглавную букву
     *
     * @param password пароль для проверки
     * @return true, если пароль соответствует всем требованиям, иначе false
     */
    public static boolean validatePassword(String password) {
        // Проверка на null или недостаточную длину
        if (password == null || password.length() < 8) {
            return false;
        }

        boolean hasDigit = false;
        boolean hasUppercase = false;

        for (char c : password.toCharArray()) {
            if (Character.isDigit(c)) {
                hasDigit = true;
            } else if (Character.isUpperCase(c)) {
                hasUppercase = true;
            }

            // Ранний выход, если все условия уже выполнены
            if (hasDigit && hasUppercase) {
                return true;
            }
        }

        return hasDigit && hasUppercase;
    }
}
