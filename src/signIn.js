// import logo from './logo.svg';
// import './App.css';
import ParsingJSON from './parsingJSON';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignIn() {
    const [formData, setFormData] = useState({email: '',password: ''});
    const [errors, setErrors] = useState({email: '',password: '',emptyFields: ''});

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev,[id]: value}));
        setErrors(prev => ({...prev,[id]: ''}));
    };

    const validateForm = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
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
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Форма отправлена:', formData);
            alert('Вход выполнен успешно!');
            // ДОБАВИТЬ ПРОВЕРКУ НА ПРИНАДЛЕЖНОСТЬ К БД
            // ДОБАВИТЬ ПЕРЕХОД НА ДРУГУЮ СТРАНИЦУ

            /*setIsLoading(true);

            try {
                // Подготовка данных для отправки
                const registrationData = {
                    email: formData.email,
                    password: formData.password
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
                    localStorage.setItem('email', formData.email);
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('privelege', result.privilegeLevel);
                    navigate('/profile');
                }
            });

        }
    };

    return (
        <main class="center">
            <form onSubmit={handleSubmit}>
                <h1>Вход</h1>

                {errors.emptyFields && (
                    <div class="warning" id="emptyFields">
                        {errors.emptyFields}
                    </div>
                )}

                {errors.email && (
                    <div class="warning" id="wrongEmail">
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

                {errors.password && (
                    <div class="warning" id="wrongPassword">
                        {errors.password}
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

                <button class="blueBtn" id="button" type="submit">Войти</button>
                <a href=""><Link to="/registration">Регистрация</Link></a>
            </form>
        </main>
    );
}

export default SignIn;