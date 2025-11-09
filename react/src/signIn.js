// import logo from './logo.svg';
// import './App.css';
import ParsingJSON from './parsingJSON';

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignIn() {
    const API_URL = process.env.REACT_APP_API_URL;

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

    useEffect(() => {
        async function testRequest() {
            const response = await fetch(`/user/profile`, {
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
            // ДОБАВИТЬ ПРОВЕРКУ НА ПРИНАДЛЕЖНОСТЬ К БД
            // ДОБАВИТЬ ПЕРЕХОД НА ДРУГУЮ СТРАНИЦУ

            setIsLoading(true);

            try {
                // Подготовка данных для отправки
                const loginData = {
                    email: formData.email,
                    password: formData.password
                };

                console.log('Отправляемые данные:', loginData);

                // POST запрос через fetch
                const response = await fetch(`/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData)
                });

                // Парсим успешный ответ
                const result = await response.json(); // Парсинг json

                if (!response.ok) {
                    alert(result.message);
                    return;
                }


                localStorage.setItem('username', result.username);
                localStorage.setItem('token', result.token);
                localStorage.setItem('privilegeLevel', result.privilegeLevel);
                
                navigate('/rooms');
                
            } catch (error) {
                console.error('Ошибка входа:', error);
                alert(`Ошибка входа: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <main className="center">
            <form onSubmit={handleSubmit}>
                <h1>Вход</h1>

                {errors.emptyFields && (
                    <div className="warning" id="emptyFields">
                        {errors.emptyFields}
                    </div>
                )}

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

                {errors.password && (
                    <div className="warning" id="wrongPassword">
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

                <button className="blueBtn" id="button" type="submit">Войти</button>
                <a href=""><Link to="/registration">Регистрация</Link></a>
            </form>
        </main>
    );
}

export default SignIn;