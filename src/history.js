
import React from 'react';
import { Link } from 'react-router-dom'; // Если используете React Router

function History() {
    return (
        <body>
            <header>
                <div className="rightHeader">
                    <img src="/icon.png" alt="icon" />
                </div>
                <div className="menu">
                    <a>Бронирование</a>
                    <a>История</a>
                    <a>Профиль</a>
                </div>
                <div className="rightHeader">
                    <img src="/Profile.png" alt="profile" />
                    <button id="exit">Выход</button>
                </div>
                
            </header>
            <main>
                <div style={{ minHeight: '60vh' }} className="meetings" id="bookHistory">
                    <h2>История бронирования:</h2>
                    <p>12 декабря, кабинет 1-2, время: 17:30</p>
                </div>
            </main>
            <footer>
                <p>@poluYangTeam, 2025</p>
            </footer> 
        </body>
    );
}

export default History;
