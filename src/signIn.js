// import logo from './logo.svg';
// import './App.css';

import React, { useState } from 'react';

function SignIn() {
    const [formData, setFormData] = useState({email: '',password: ''});
    const [errors, setErrors] = useState({email: '',password: '',emptyFields: ''});

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
        }
    };

    return (
        <div className="signin-container">
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

                <button type="submit">Войти</button>
            </form>
        </div>
    );
}

export default SignIn;