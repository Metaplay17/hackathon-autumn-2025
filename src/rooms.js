import ParsingJSON from './parsingJSON';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Rooms() {

    const [isLoading, setIsLoading] = useState(false);

    const [meetingsHtml, setMeetingsHtml] = useState('');
    const [meetingsHtmlTwo, setMeetingsHtmlTwo] = useState('');

    const [idRoom, setIdRoom] = useState(0);
    const navigate = useNavigate();

     /*setIsLoading(true);
     
     try {
         const response = await fetch('', {
             method: 'POST',
             headers: {'Content-Type': 'application/json',}
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

    // Все комнаты
    useEffect(() => {
        let divTwo = ``;

        ParsingJSON('./bronion.json').then(result => {
            if (result.status == 'OK' || result.status == 'ОК') {
                for (let i = 0; i < result.bookings.length; i++) {
                    
                }
            }
            
        }).catch(error => {
            
        });
    }, []);

    // Выбор первого бронирования
    useEffect(() => {
        let div = `<div id="roomsSchema">`;

        ParsingJSON('./rooms.json').then(result => {
            if (result.status == 'OK' || result.status == 'ОК') {
                for (let i = 0; i < result.rooms.length; i++) {
                    if (result.rooms[i].open) {
                        div += `<button class="room">${result.rooms[i].number}</button>`; // Переменовать в activRoom когда активированно
                    }
                    else {
                        div += `<button disabled class="blockRoom">${result.rooms[i].number}</button>`;
                    }

                    if (i == 0) {
                        setIdRoom(result.rooms[i].id)
                    }
                }
            }
            div += `</div>`;
            setMeetingsHtml(div);
        }).catch(error => {
            console.error('Ошибка загрузки данных:', error);
            setMeetingsHtml('<div id="meetings">Ошибка загрузки данных</div>');
        });
    }, []);


    return (
        <>
            <header>
                <img src="img/icon.png" alt="icon" />
                <img src="img/Profile.png" alt="profile" />
            </header>
            <main>
                <div className="left">
                    <div>
                        <h3>Этаж</h3>
                        <select>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </select>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: meetingsHtml }} />
                </div>

                <div className="right">
                    <h2>Кабинет</h2>
                    <p>Вместимость: </p>
                    <div id="date">
                        <p>Дата</p>
                        <input type="date" />
                    </div>

                    <div>
                        <p>Время</p>
                        <div id="times">
                            <button className="noBooked noChosen">9:00</button>
                            <button className="booked chosen">10:40</button>
                        </div>
                    </div>

                    <div className="bookButtons">
                        <button id="userBook">Забронировать</button>
                        <a href="#">Забронировать в Телеграм</a>

                        <button className="closed" id="userDelBook">Отменить бронь</button>
                        <a className="closed" href="#">Отменить бронь в Телеграм</a>

                        <button className="closed" id="adminChangeBook">Редактировать бронь</button>
                        <button className="closed" id="adminChangeRoom">Редактировать комнату</button>
                    </div>

                    <div className="changeBookPopup closed">
                        <div>
                            <p>Имя пользователя</p>
                            <input type="text" placeholder="Username" />
                            <p><input type="checkbox" id="blockTime" /><span>Заблокировать время</span></p>
                        </div>
                        <div>
                            <button id="cancelChangeBook">Отмена</button>
                            <button id="saveChangeBook">Сохранить</button>
                        </div>
                    </div>

                    <div className="changeRoomPopup closed">
                        <div>
                            <p>Вместимость</p>
                            <input type="number" min="0" />
                            <p><input type="checkbox" id="blockRoom" /><span>Заблокировать комнату</span></p>
                        </div>
                        <div>
                            <button id="cancelChangeRoom">Отмена</button>
                            <button id="saveChangeRoom">Сохранить</button>
                        </div>
                    </div>
                </div>
            </main>
            <footer>
                <p>@poluYangTeam, 2025</p>
            </footer>
        </>
    );
}

export default Rooms;