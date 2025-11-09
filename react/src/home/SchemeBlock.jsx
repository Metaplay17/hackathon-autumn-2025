import { useState } from "react";

function SchemeBlock({ rooms, selectRoomCallBack }) {
    const isAdmin = localStorage.getItem('privilegeLevel') == 5;

    const [selectedRoomId, setSelectedRoomId] = useState(null);

    const handleClick = (room) => {
        setSelectedRoomId(room.id);
        selectRoomCallBack(room.id);
    };

    return (
        <div id="roomsSchema">
            {rooms.map(room => (
                <button
                    key={room.id} // Используем id вместо indexOf
                    onClick={() => handleClick(room)}
                    className={`room${rooms.indexOf(room) + 1} ${
                        room.id === selectedRoomId ? "activeRoom" : ""
                    } ${room.open ? "" : "blockRoom"}`} disabled={room.open || isAdmin ? false : true}
                >
                    {room.number}
                </button>
            ))}
        </div>
    );
}

export default SchemeBlock;