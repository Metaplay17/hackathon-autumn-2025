import React, { useState, useEffect } from 'react';

const RoomBookingComponent = ({ roomId, number, capacity, bookings }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [currentUserBooking, setCurrentUserBooking] = useState(null);
  
  const isAdmin = localStorage.getItem('privilegeLevel') == 5;

  const [isOpenChangeRoom, setIsOpenChangeRoom] = useState(false);
  const [isOpenChangeBooking, setIsOpenChangeBooking] = useState(false);

  const [selectedUsername, setSelectedUsername] = useState("");
  const [isBookingBlocked, setIsBookingBlocked] = useState(false);

  const [selectedCapability, setSelectedCapability] = useState(null);
  const [isRoomClosed, setIsRoomClosed] = useState(false);

  // Фильтрация слотов для выбранной даты
  useEffect(() => {
    const selectedDateObj = new Date(selectedDate);
    const day = selectedDateObj.getDate();
    const month = selectedDateObj.getMonth() + 1;
    const year = selectedDateObj.getFullYear();

    // Фильтруем бронирования на выбранную дату
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.start);
      return (
        bookingDate.getDate() === day &&
        bookingDate.getMonth() + 1 === month &&
        bookingDate.getFullYear() === year &&
        booking.roomId === roomId
      );
    });

    // Сортируем по времени начала
    filteredBookings.sort((a, b) => new Date(a.start) - new Date(b.start));

    // Находим бронирование текущего пользователя
    const userBooking = filteredBookings.find(booking => booking.isOwner);
    setCurrentUserBooking(userBooking);

    // Преобразуем в формат для отображения
    const allSlots = filteredBookings.map(booking => {
      const startTime = new Date(booking.start);
      const formattedTime = `${startTime.getHours()}:${String(startTime.getMinutes()).padStart(2, '0')}`;

      return {
        time: formattedTime,
        id: booking.id,
        isFree: booking.isFree,
        isOwner: booking.isOwner,
        roomId: booking.roomId,
        start: booking.start,
        durationMinutes: booking.durationMinutes,
        username: booking.username
      };
    });

    setSlots(allSlots);
  }, [selectedDate, bookings, roomId]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null); // Сбрасываем выбранное время при смене даты
  };

  const handleTimeSelect = (slot) => {
    if (slot.isFree || slot.isOwner || isAdmin) {
      setSelectedSlot(slot);
      if (isAdmin) {
          setSelectedUsername(slot.username == null ? "" : slot.username);
          setSelectedCapability(capacity);
      }

    }
  };

  const handleBook = async () => {
    if (selectedSlot) {
      const response = await fetch(`/api/bookings/make`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookingId: selectedSlot.id })
      });

      if (!response.ok) {
        alert((await response.json()).message);
      }
      else {
        window.location.reload();
      }
    } else {
      alert('Пожалуйста, выберите доступное время');
    }
  };

  const handleCancelBooking = async () => {
    if (selectedSlot) {
      const response = await fetch(`/api/bookings/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookingId: selectedSlot.id })
      });

      if (!response.ok) {
        alert((await response.json()).message);
      }
      else {
        window.location.reload();
      }
    }
  };

  const handleTelegramBook = () => {
    window.location.href="https://t.me/cloudcom_booking_room_bot";
  };

  const handleTelegramCancel = () => {
    window.location.href="https://t.me/cloudcom_booking_room_bot";
  };

  const handleSaveBooking = async () => {
    if (selectedSlot) {
      const response = await fetch(`/api/admin/booking/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: selectedSlot.id,
          username: isBookingBlocked == "on" ? localStorage.getItem('username') : selectedUsername,
          isBlocked: isBookingBlocked == "on"
        })
      });

      if (!response.ok) {
        alert((await response.json()).message);
      }
      else {
        window.location.reload();
      }
    }
  };

  const handleSaveRoom = async () => {
      const response = await fetch(`/api/admin/room/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          roomId: roomId,
          capability: selectedCapability,
          isOpen: isRoomClosed != "on"
        })
      });

      if (!response.ok) {
        alert((await response.json()).message);
      }
      else {
        window.location.reload();
      }
  };

  return (
    <div>
      <div className="rightInd">
        <h2>Кабинет {number}</h2>
        <p>Вместимость: {capacity}</p>
        <div className="rowCenter" id="date">
          <p>Дата</p>
          <input type="date" value={selectedDate} onChange={handleDateChange} />
        </div>
        <div>
          <p>Время</p>
          <div id="times">
            {slots.map(slot => (
              <button
                key={slot.id}
                onClick={() => handleTimeSelect(slot)}
                className={`${slot.isFree || slot.isOwner ? "" : "booked"} ${selectedSlot?.id === slot.id ? "chosen" : ""} ${slot?.isOwner ? "greenBtn" : ""}`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="bookButtons">
        <button className={`greenBtn ${selectedSlot != null && selectedSlot.isFree ? "" : "closed"}`} id="userBook" onClick={handleBook}>Забронировать</button>
        <a id="userBookTg" href="#" onClick={(e) => { e.preventDefault(); handleTelegramBook(); }}>Забронировать в Телеграм</a>


        <>
          <button onClick={handleCancelBooking} className={`redBtn ${selectedSlot != null && selectedSlot.isOwner ? "" : "closed"}`} id="userDelBook">Отменить бронь</button>
          <a id="userDelBookTg" className={`${selectedSlot != null && selectedSlot.isOwner ? "" : "closed"}`} href="#" onClick={(e) => e.preventDefault()}>Отменить бронь в Телеграм</a>
        </>

        <button onClick={() => setIsOpenChangeBooking(true)} className={`greenBtn ${isAdmin && selectedSlot != null ? "" : "closed"}`} id="adminChangeBook">Редактировать бронь</button>
        <button onClick={() => {setIsOpenChangeRoom(true); setSelectedCapability(capacity); }} className={`greenBtn ${isAdmin ? "" : "closed"}`} id="adminChangeRoom">Редактировать комнату</button>
      </div>


      <section className={`${isOpenChangeBooking ? "" : "closed"}`} id="changeBookPopup">
            <div className="changePopup">
                <div className="rowIn">
                    <p>Имя пользователя</p>
                    <input type="text" placeholder="Username" value={selectedUsername} onChange={(e) => setSelectedUsername(e.target.value)}/>
                    <p><input type="checkbox" id="blockTime" onChange={(e) => setIsBookingBlocked(e.target.value)}/><span>Заблокировать время</span></p>
                </div>
                <div className="rowBtn">
                    <button onClick={() => setIsOpenChangeBooking(false)} className="blueBtn" id="cancelChangeBook">Отмена</button>
                    <button onClick={() => handleSaveBooking()} className="greenBtn" id="saveChangeBook">Сохранить</button>
                </div>
            </div>
        </section>
        <section className={`${isOpenChangeRoom ? "" : "closed"}`} id="changeRoomPopup">
            <div className="changePopup">
                <div className="rowIn">
                    <p>Вместимость</p>
                    <input type="number" min="0" value={selectedCapability} onChange={(e) => setSelectedCapability(e.target.value)}/>
                    <p><input type="checkbox" id="blockRoom" onChange={(e) => setIsRoomClosed(e.target.value)} /><span>Заблокировать комнату</span></p>
                </div>
                <div className="rowBtn">
                    <button onClick={() => { setIsOpenChangeRoom(false) }} className="blueBtn" id="cancelChangeRoom">Отмена</button>
                    <button onClick={handleSaveRoom} className="greenBtn" id="saveChangeRoom">Сохранить</button>
                </div>
            </div>
        </section>
    </div>
  );
};

export default RoomBookingComponent;