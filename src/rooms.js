

function Rooms() {
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
                    <div id="roomsSchema">
                        
                    </div>
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