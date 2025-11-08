import ParsingJSON from './parsingJSON';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Rooms() {
    const [isLoading, setIsLoading] = useState(false);
    const [meetingsHtml, setMeetingsHtml] = useState('');
    const [meetingsHtmlTwo, setMeetingsHtmlTwo] = useState('');
    const [idRoom, setIdRoom] = useState(0);
    const [capabilityRoom, setCapabilityRoom] = useState(0);
    const [numerRoom, setNumerRoom] = useState(0);
    const navigate = useNavigate();
    const [floorRoom, setFloorRoom] = useState(1);
    const rightRef = useRef(null);

    // Обработчик кликов для кнопок
    useEffect(() => {
        const handleButtonClick = (e) => {
            if (e.target.id === 'buting' || e.target.classList.contains('booked')) {
                const roomId = e.target.dataset.roomId;
                setIdRoom(roomId);
                console.log('Кнопка нажата, установлен idRoom:', roomId);
            }
        };

        const rightElement = rightRef.current;
        if (rightElement) {
            rightElement.addEventListener('click', handleButtonClick);
            return () => {
                rightElement.removeEventListener('click', handleButtonClick);
            };
        }
    }, []);

    // Все комнаты
    useEffect(() => {
        let div = `<div id="roomsSchema">`;
        
        ParsingJSON('./rooms.json').then(result => {
            if (result.status == 'OK' || result.status == 'ОК') {
                let countRoom = 0;
                let one = 0;
                for (let i = 0; i < result.rooms.length; i++) {
                    if (result.rooms[i].floor == floorRoom) {
                        if (result.rooms[i].open) {
                            div += `<button id="buting" class="room" data-room-id="${result.rooms[i].id}">${result.rooms[i].number}</button>`;
                        } else {
                            div += `<button disabled class="blockRoom">${result.rooms[i].number}</button>`;
                        }

                        if (one == 0) {
                            setIdRoom(result.rooms[i].id);
                            setCapabilityRoom(result.rooms[i].capability);
                            setNumerRoom(result.rooms[i].number);
                            one += 1;
                        }
                        countRoom += 1;
                    }
                }

                if (countRoom == 0) {
                    setIdRoom(-1);
                    setCapabilityRoom(-1);
                    setNumerRoom(-1);
                }
            }
            div += `</div>`;
            setMeetingsHtml(div);
        }).catch(error => {
            console.error('Ошибка загрузки данных:', error);
            setMeetingsHtml('<div id="meetings">Ошибка загрузки данных</div>');
        });
    }, [floorRoom]);

    useEffect(() => {
        let divTwo = ``;
        ParsingJSON('./bronion.json').then(result => {
            if (result.status == 'OK' || result.status == 'ОК') {
                if (idRoom == -1) {
                    setMeetingsHtmlTwo('<div id="meetings">На данном этаже нету комнат</div>');
                }
                else {
                    for (let i = 0; i < result.bookings.length; i++) {
                        if (idRoom == result.bookings[i].roomId) {
                            divTwo += `<h2>Кабинет ${numerRoom}</h2>`;
                            divTwo += `<p>Вместимость: ${capabilityRoom}</p>`;
                            divTwo += `<div id="date"><p>Дата</p> <input type="date" /> </div>`;
        
                            divTwo += `<div><p>Время</p><div id="times">`;
        
                            for (let j = 0; j < result.bookings.length; j++) {
                                if (idRoom == result.bookings[j].roomId) {
                                    if (result.bookings[j].isFree) {
                                        divTwo += `<button className="booked chosen">${result.bookings[j].start}</button>`; // Использовать переменную для измеения класса
                                    } else {
                                        divTwo += `<button className="noBooked noChosen" disabled >${result.bookings[j].start}</button>`;
                                    }
                                }
                            }
                            divTwo += `</div></div>`;
                            break;
                        }
                    }
                }
            }
            setMeetingsHtmlTwo(divTwo);    
        }).catch(error => {
            console.error('Ошибка загрузки данных:', error);
            setMeetingsHtmlTwo('<div id="meetings">Ошибка загрузки данных</div>');
        });
    }, [numerRoom, capabilityRoom]);

    useEffect(() => { // Выбор комнаты
        ParsingJSON('./rooms.json').then(result => {
            if (result.status == 'OK' || result.status == 'ОК') {
                for (let i = 0; i < result.rooms.length; i++) {
                    if (result.rooms[i].id == idRoom) {
                        setIdRoom(result.rooms[i].id);
                        setCapabilityRoom(result.rooms[i].capability);
                        setNumerRoom(result.rooms[i].number);
                    }
                }
            }
        }).catch(error => {
            console.error('Ошибка загрузки данных:', error);
        });
    }, [idRoom]);


    const handleFloorChange = (e) => {
        setFloorRoom(parseInt(e.target.value));
    };

    return (
        <>
            <header>
                <img src="/icon.png" alt="icon" />
                <img src="/Profile.png" alt="profile" />
            </header>
            <main>
                <div className="left" ref={rightRef}>
                    <div>
                        <h3>Этаж</h3>
                        <select value={floorRoom} onChange={handleFloorChange}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </select>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: meetingsHtml }} />
                </div>

                <div className="right">
                    <div dangerouslySetInnerHTML={{ __html: meetingsHtmlTwo }} />

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