
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Если используете React Router

function History() {
    const [bookings, setBookings] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await fetch(`/api/user/booking-history`, {
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
                setBookings(result.bookingDtos);
            } catch (error) {
                console.error('Ошибка регистрации:', error);
                alert(`Ошибка: ${error.message}`);
            } finally {

            }
        }

        fetchHistory();
    }, [])


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
                    <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('username'); localStorage.removeItem('privilegeLevel'); navigate('/login'); } } id="exit">Выход</button>
                </div>
                
            </header>
            <main>
                <div style={{ minHeight: '60vh' }} className="meetings" id="bookHistory">
                    <h2>История бронирования:</h2>
                    { bookings.length == 0 ? <p>История пуста</p> : ""}
                    {
                        bookings.map(booking => {
                            return (
                                <p>Дата и время: {new Date(booking.start).toLocaleString()} Кабинет: {booking.roomName}</p>
                            )
                        })
                    }
                </div>
            </main>
            <footer>
                <p>@poluYangTeam, 2025</p>
            </footer> 
        </div>
    );
}

export default History;
