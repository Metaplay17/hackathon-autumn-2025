import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ParsingJSON from './parsingJSON';

function Registration() {
    const [formData, setFormData] = useState({username: '', email: '', telegram_tag: '', password: '', secondPassword: ''});
    const [errors, setErrors] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev,[id]: value}));
        if (errors[id]) {
            setErrors(prev => ({...prev,[id]: ''}));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.username.length < 3 || formData.username.length > 50) {
            newErrors.username = 'Длина имени должна быть от 3 до 50 символов';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (formData.password) {
            if (formData.password.length < 8) {
                newErrors.password = 'Пароль должен содержать минимум 8 символов';
            } else if (!/\d/.test(formData.password)) {
                newErrors.password = 'Пароль должен содержать хотя бы одну цифру';
            } else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву';
            }
        }

        if (formData.password && formData.secondPassword && formData.password !== formData.secondPassword) {
            newErrors.secondPassword = 'Пароли не совпадают';
        }

        if (formData.telegram_tag.length < 5 || formData.telegram_tag.length > 12) {
            newErrors.telegram_tag = 'Длина телеграм ID должна быть от 5 до 12 символов';
        }

        if (formData.telegram_tag && !formData.telegram_tag.startsWith('@')) {
            newErrors.telegram_tag = 'Телеграм должен начинаться с @';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            alert('Регистрация успешна!');

            /*setIsLoading(true);

            try {
                // Подготовка данных для отправки
                const registrationData = {
                    email: formData.email,
                    password: formData.password,
                    username: formData.username,
                    telegramId: parseInt(formData.telegram_tag)
                };

                console.log('Отправляемые данные:', registrationData);

                // POST запрос через fetch
                const response = await fetch('', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(registrationData)
                });

                // Проверяем статус ответа
                if (!response.ok) {
                    // Пытаемся получить текст ошибки от сервера
                    let errorMessage = 'Ошибка регистрации';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (parseError) {
                        // Если не удалось распарсить JSON, используем статус
                        errorMessage = `HTTP error! status: ${response.status}`;
                    }
                    throw new Error(errorMessage);
                }

                // Парсим успешный ответ
                const result = await response.json(); // Парсинг json

                // ДОБАВИТЬ РАБОТУ С ДАННЫМИ
                
                console.log('Успешная регистрация:', result);
                alert('Регистрация успешна!');
                
                // Переход на страницу входа
                navigate('/signin');
                
            } catch (error) {
                console.error('Ошибка регистрации:', error);
                alert(`Ошибка регистрации: ${error.message}`);
            } finally {
                setIsLoading(false);
            }*/

            ParsingJSON('./sign.json').then(result => {
                if (result.status == 'OK' || result.status == 'ОК') {
                    navigate('/signIn');
                }
            });
        }
    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <h1>Регистрация</h1>
                
                {Object.keys(errors).length > 0 && (
                    <div className="warning" id="emptyFields">
                        Пожалуйста, заполните все поля правильно
                    </div>
                )}

                {errors.username && (
                    <div className="warning">{errors.username}</div>
                )}

                <p>Имя пользователя</p>
                <input 
                    type="text" 
                    id="username" 
                    placeholder="Businessman3000" 
                    value={formData.username}
                    onChange={handleChange}
                    required 
                />

                {errors.email && (
                    <div className="warning" id="wrongEmail">
                        {errors.email}
                    </div>
                )}

                <p>Почта</p>
                <input 
                    type="text" 
                    id="email" 
                    placeholder="abc@gmail.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                />

                {errors.telegram_tag && (
                    <div className="warning">{errors.telegram_tag}</div>
                )}

                <p>Телеграм ID</p>
                <input 
                    type="text" 
                    id="telegramID" 
                    placeholder="0000" 
                    value={formData.telegram_tag}
                    onChange={handleChange}
                    required 
                />

                {errors.password && (
                    <div className="warning" id="wrongPassword">
                        {errors.password}
                    </div>
                )}
                {errors.secondPassword && (
                    <div className="warning" id="doesntMatchPassword">
                        {errors.secondPassword}
                    </div>
                )}

                <p>Пароль</p>
                <input 
                    type="password" 
                    id="password" 
                    placeholder="Пароль" 
                    value={formData.password}
                    onChange={handleChange}
                    required 
                />

                <p>Повторите пароль</p>
                <input 
                    type="password" 
                    id="secondPassword" 
                    placeholder="Повторите пароль" 
                    value={formData.secondPassword}
                    onChange={handleChange}
                    required 
                />

                <button type="submit" id="button">Зарегистрироваться</button>
            </form>
            <Link to="/">Вход</Link>
        </main>
    );
}

export default Registration;