
import React from 'react';
import { Link } from 'react-router-dom'; // Если используете React Router

function History() {
    return (
        <>
            <header>
                <div className="rightHeader">
                    <img src="/icon.png" alt="icon" />
                </div>
                <div className="menu">
                    <Link to="/rooms">Бронирование</Link>
                    <Link to="/history">История</Link>
                    <Link to="/profile">Профиль</Link>
                </div>
                <div className="rightHeader">
                    <img src="/Profile.png" alt="profile" />
                    <button id="exit">Выход</button>
                </div>
            </header>
            <main>
                <div style={{ minHeight: '60vh' }} className="meetings" id="bookHistory">
                    <h2>История бронирования:</h2>
                    
                </div>
            </main>
            <footer>
                <p>@poluYangTeam, 2025</p>
            </footer>
        </>
    );
}

export default History;
