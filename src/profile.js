import ParsingJSON from './parsingJSON';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {

    const [isLoading, setIsLoading] = useState(false);
    const [meetingsHtml, setMeetingsHtml] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

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
    
    useEffect(() => {
        let div = `<div id="meetings">`;

        ParsingJSON('./profile.json').then(result => {
            for (let i = 0; i < result.dates.length; i++) {
                div += `<div>${result.dates[i]} ${result.cab[i]}</div>`;            
            }
            div += `</div>`;
            setMeetingsHtml(div);
        }).catch(error => {
            console.error('Ошибка загрузки данных:', error);
            setMeetingsHtml('<div id="meetings">Ошибка загрузки данных</div>');
        });
    }, []);



    return (
        <div>
            <header>
                <img src="/icon.png" alt="icon" />
                <img src="/Profile.png" alt="profile" />
            </header>
            <main>
                <div className="left">
                    <img src="/Profile.png" alt="icon" />
                    <h3>Забронировать переговорную комнату</h3>
                    <button id="btnSite">На сайте</button>
                    <button id="btnTg">В Телеграм</button>
                </div>
                <div className="right">
                    <h2 id="username">{email}</h2>
                    <h3>Будущие встречи:</h3>
                    <div dangerouslySetInnerHTML={{ __html: meetingsHtml }} />
                </div>
            </main>
            <footer>
                <p>@poluYangTeam, 2025</p>
            </footer>
        </div>
    );
}

export default Profile;