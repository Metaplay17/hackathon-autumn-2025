import { TModuleConfig } from "@/types/TModule";

export const AUTH_CONFIG = {
  MAX_ATTEMPTS_PER_DAY: 5,
  WAIT_TIME_MS: 300_000,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
} as const;

export const AUTH_MESSAGES = {
  WELCOME: 'Для получения всех возможностей бота войдите в ваш аккаунт, если он уже существует или сначалаы зарегистируйтесь',
  EMAIL_REQUEST: 'Пожалуйста, введите ваш email:',
  USERNAME_REQUEST: 'Введите имя пользователя (username):',
  PASSWORD_REQUEST: 'Введите пароль (минимум 8 символов, 1 цифра, 1 заглавная буква):',
  INVALID_EMAIL: 'Некорректный email. Пожалуйста, введите снова:',
  INVALID_USERNAME: 'Имя пользователя должно содержать только латинские буквы, цифры и символы _ . - и быть длиной от 3 до 30 символов. Пожалуйста, введите снова:',
  INVALID_PASSWORD: 'Пароль должен содержать не менее 8 символов, 1 цифру и 1 заглавную букву. Пожалуйста, введите снова:',
  TOO_MANY_ATTEMPTS: 'Превышено количество попыток входа за сегодня. Попробуйте завтра.',
  REGISTRATION_SUCCESS: 'Регистрация успешно завершена!',
  LOGIN_SUCCESS: 'Успешный вход в систему!',
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
  INVALID_CREDENTIALS: 'Неверный email или пароль. Попробуйте снова.',
  USERNAME_TAKEN: 'Имя пользователя уже занято. Пожалуйста, выберите другое.',
} as const;

export const authLogin: TModuleConfig = {
  commandName: 'login',
  commandDescription: 'Войти'
}

export const authRegister: TModuleConfig = {
  commandName: 'register',
  commandDescription: 'Зарегистрироваться'
}