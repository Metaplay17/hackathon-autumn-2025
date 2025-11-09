import { useEffect, useState } from "react";
import SchemeBlock from "./SchemeBlock";
import RoomBookingComponent from "./RoomBlock";
import icon from './icon.png'
import profileImage from './Profile.png'
import pr0fileImage from './Pr0file.png'
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('privilegeLevel') == 5;

    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [floors, setFloors] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(1);

    useEffect(() => {
        async function fetchRooms() {
            try {
                const response = await fetch(`${API_URL}/rooms/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status == 401) {
                    navigate("/login");
                    return;
                }

                const json = await response.json();

                if (!response.ok) {
                    alert(json.message);
                    return;
                }

                setRooms(json.rooms.sort((a, b) => a.number - b.number));

                const floorsSet = new Set();
                json.rooms.forEach(room => {
                    floorsSet.add(room.floor);
                });
                setFloors(Array.from(floorsSet).sort((a, b) => a - b)); // Сортируем этажи
            } catch (err) {
                setIsError(true);
                setErrorMessage(err.message);
            }
        }

        async function fetchBookings() {
            try {
                const response = await fetch(`${API_URL}${isAdmin ? "/admin" : ""}/bookings/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const json = await response.json();

                if (response.status == 401) {
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    alert(json.message);
                    return;
                }
                setBookings(json.bookings);
            } catch (err) {
                setIsError(true);
                setErrorMessage(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRooms();
        fetchBookings();
    }, [API_URL, token]);

    function selectRoomCallBack(roomId) {
        const room = rooms.find(r => r.id === roomId);
        if (room) {
            setSelectedRoom(room);
        }
    }

    const handleFloorChange = (e) => {
        setSelectedFloor(e.target.value);
    };

    if (isLoading) {
        return <h1>LOADING</h1>;
    }

    if (isError) {
        return <h1>Ошибка: {errorMessage}</h1>;
    }

    const filteredRooms = selectedFloor ? rooms.filter(room => room.floor === parseInt(selectedFloor)) : rooms;

    return (
        <div className="body-clone">
            <header>
                <div className="rightHeader">
                    <img src={icon} alt="icon" />
                </div>
                <div class="menu">
                    <a><Link to="/rooms">Бронирование</Link></a>
                    <a><Link to="/history">История</Link></a>
                    <a><Link to="/profile">Профиль</Link></a>
                </div>
                <div className="rightHeader">
                    <img src={profileImage} alt="profile" />
                    <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('username'); localStorage.removeItem('privilegeLevel'); navigate('/login'); } } id="exit">Выход</button>
                </div>
            </header>
            <main className="row">
                <div className="leftInd">
                    <div className="row">
                        <h3>Этаж</h3>
                        <select id="selectFloor" value={selectedFloor} onChange={handleFloorChange}>
                            {floors.map(floor => (
                                <option key={floor} value={floor}>{floor}</option>
                            ))}
                        </select>
                    </div>
                    <SchemeBlock rooms={filteredRooms} selectRoomCallBack={selectRoomCallBack} />
                </div>
                <div className="rightInd">
                    {selectedRoom ? (
                        <RoomBookingComponent
                            key={selectedRoom.id}
                            roomId={selectedRoom.id}
                            number={selectedRoom.number}
                            capacity={selectedRoom.capability}
                            bookings={bookings}
                        />
                    ) : (
                        <p>Комната не выбрана</p>
                    )}
                </div>
                
                <div className={`roomImg ${selectedRoom == null ? "closed" : ""}`} id="roomImg">
                    <img src={selectedRoom != null ? selectedRoom.photo : null} alt="У комнаты нет фото" />
                </div>
                
            </main>
            <footer>
                <p>@poluYangTeam, 2025</p>
            </footer>
        </div>
    );
}

export default HomePage;