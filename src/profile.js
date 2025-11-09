import ParsingJSON from './parsingJSON';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
    const API_URL = process.env.REACT_APP_API_URL;

    const [meetings, setMeetings] = useState([]);
    const navigate = useNavigate();

    const username = localStorage.getItem('username');

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch(`${API_URL}/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.status == 401) {
                    navigate("/login");
                    return;
                }

                // Парсим успешный ответ
                const result = await response.json(); // Парсинг json

                if (!response.ok) {
                    alert(result.message);
                    return;
                }
                setMeetings(result.bookings);               
            } catch (error) {
                console.error('Ошибка регистрации:', error);
                alert(`Ошибка: ${error.message}`);
            } finally {

            }
        }

        fetchProfile();
    }, [])
    
    function signOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('privilegeLevel');
        navigate('/login');
    }



    return (
        <div className="body-clone">
            <header>
                <div className="rightHeader">
                    <img src="/icon.png" alt="icon" />
                </div>
                <div className="menu">
                    <a><Link to="/rooms">Бронирование</Link></a>
                    <a><Link to="/history">История</Link></a>
                    <a><Link to="/profile">Профиль</Link></a>
                </div>
                <div className="rightHeader">
                    <img src="/Profile.png" alt="profile" />
                    <button id="exit" onClick={signOut}>Выход</button>
                </div>
                
            </header>
            <main className="row_pr">
                <div className="left">
                    <img src="../Pr0file.png" alt="icon" />
                    <h3>Забронировать переговорную комнату</h3>
                    <button onClick={() => { navigate('/rooms'); } } className="darkBlueBtn" id="btnSite">На сайте</button>
                    <button className="blueBtn" id="btnTg">В Телеграм</button>
                </div>
                <div className="right">
                    <h1 id="username">{username}</h1>
                    <h2>Будущие встречи:</h2>
                    <div className= "meetings" id="meetings">
                        {
                            meetings.map(booking => {
                                return (
                                    <p>{new Date(booking.start).toLocaleString()} {booking.roomName}</p>
                                )
                            })
                        }
                    </div>
                </div>
            </main>
            <footer>
                <p>@poluYangTeam, 2025</p>
            </footer>
        </div>
    );
}

export default Profile;