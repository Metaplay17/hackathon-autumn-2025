-- 1. Как получить данные о свободных слотах или бронях комнат на этаже, имея floor и дату + время?
-- SELECT r.number,b.start
-- FROM rooms r
-- JOIN bookings b ON r.id = b.room_id;
-- 2. Как забронировать комнату, имея floor, number и нужное время + дату?

-- INSERT INTO bookings (user_id,room_id, start, duration_minutes)
-- SELECT 1, r.id, '2024-01-15 10:00:00', 120
-- FROM rooms r
-- WHERE r.floor = 2 and r.number = 205;
-- 3. Как отменить бронь, имея floor, number и нужное время + дату?

-- DELETE FROM bookings
-- WHERE room_id IN (
--     SELECT id FROM rooms
--     WHERE floor = 2 AND number = 205 AND start = '2024-01-15 10:00:00'
-- );

-- 4. Как отменить все текущие брони комнаты?
-- DELETE FROM bookings 
-- WHERE room_id IN (
--     SELECT id FROM rooms 
--     WHERE floor = 2 AND number = 205
-- );
