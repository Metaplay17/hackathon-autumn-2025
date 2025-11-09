import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ParsingJSON from './parsingJSON';

function Registration() {
    const API_URL = process.env.REACT_APP_API_URL;

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        async function testRequest() {
            const response = await fetch(`${API_URL}/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

            if (response.status == 200) {
                navigate("/rooms");
                return;
            }
        }

        testRequest();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {

            setIsLoading(true);

            try {
                // Подготовка данных для отправки
                const registrationData = {
                    email: formData.email,
                    password: formData.password,
                    username: formData.username,
                };

                console.log('Отправляемые данные:', registrationData);

                // POST запрос через fetch
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(registrationData)
                });

                // Парсим успешный ответ
                const result = await response.json(); // Парсинг json

                if (!response.ok) {
                    alert(result.message);
                    return;
                }
                
                // Переход на страницу входа
                navigate('/login');
                
            } catch (error) {
                console.error('Ошибка регистрации:', error);
                alert(`Ошибка регистрации: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <main class="center">
            <form onSubmit={handleSubmit}>
                <h1>Регистрация</h1>
                
                {Object.keys(errors).length > 0 && (
                    <div class="warning" id="emptyFields">
                        Пожалуйста, заполните все поля правильно
                    </div>
                )}

                {errors.username && (
                    <div class="warning">{errors.username}</div>
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

                {errors.telegram_tag && (
                    <div class="warning">{errors.telegram_tag}</div>
                )}

                {errors.password && (
                    <div class="warning" id="wrongPassword">
                        {errors.password}
                    </div>
                )}
                {errors.secondPassword && (
                    <div class="warning" id="doesntMatchPassword">
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

                <button type="submit" id="button" className="blueBtn">Зарегистрироваться</button>
                <a href=""><Link to="/">Вход</Link></a>
            </form>
        </main>
    );
}

export default Registration;