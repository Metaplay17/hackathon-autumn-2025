// package com.example.repositories;

// import com.example.models.Booking;
// import com.example.models.Room;
// import com.example.models.User;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
// import org.springframework.test.context.TestPropertySource;

// import java.time.LocalDateTime;
// import java.util.List;

// import static org.assertj.core.api.Assertions.assertThat;

// @DataJpaTest
// @TestPropertySource(properties = {
//     "spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL;DATABASE_TO_UPPER=false",
//     "spring.jpa.hibernate.ddl-auto=create-drop",
//     "spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect"
// })
// class BookingRepositoryTest {

//     @Autowired
//     private BookingRepository bookingRepository;

//     @Autowired
//     private org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager entityManager;

//     private User user;
//     private Room room;

//     @BeforeEach
//     void setUp() {
//         // Создаём пользователя
//         user = new User("test@example.com", "testuser", "hash", 123456789L);
//         entityManager.persistAndFlush(user);

//         // Создаём комнату
//         room = new Room();
//         room.setNumber(101);
//         room.setCapability(4);
//         room.setFloor(1);
//         room.setIsOpen(true);
//         entityManager.persistAndFlush(room);
//     }

//     @Test
//     void shouldSaveAndFindBookingById() {
//         LocalDateTime start = LocalDateTime.now().plusDays(1);
//         Booking booking = new Booking(user, room, start, 60);
//         entityManager.persistAndFlush(booking);

//         Booking found = bookingRepository.findById(booking.getId()).orElse(null);
//         assertThat(found).isNotNull();
//         assertThat(found.getUser().getId()).isEqualTo(user.getId());
//         assertThat(found.getRoom().getId()).isEqualTo(room.getId());
//         assertThat(found.getStart()).isEqualTo(start);
//         assertThat(found.getDurationMinutes()).isEqualTo(60);
//     }

//     @Test
//     void shouldFindBookingsByUser() {
//         LocalDateTime start1 = LocalDateTime.now().plusDays(1);
//         LocalDateTime start2 = LocalDateTime.now().plusDays(2);

//         bookingRepository.save(new Booking(user, room, start1, 30));
//         bookingRepository.save(new Booking(user, room, start2, 45));

//         List<Booking> userBookings = bookingRepository.findByUser(user);
//         assertThat(userBookings).hasSize(2);
//     }

//     @Test
//     void shouldFindBookingsByRoom() {
//         Room room2 = new Room();
//         room2.setNumber(102);
//         room2.setCapability(2);
//         room2.setFloor(1);
//         room2.setIsOpen(true);
//         entityManager.persistAndFlush(room2);

//         LocalDateTime start = LocalDateTime.now().plusDays(1);
//         bookingRepository.save(new Booking(user, room, start, 60));
//         bookingRepository.save(new Booking(user, room2, start, 60));

//         List<Booking> roomBookings = bookingRepository.findByRoom(room);
//         assertThat(roomBookings).hasSize(1);
//         assertThat(roomBookings.get(0).getRoom().getId()).isEqualTo(room.getId());
//     }

//     @Test
//     void shouldFindBookingsByRoomIdAndActiveDate() {
//         LocalDateTime past = LocalDateTime.now().minusDays(2);
//         LocalDateTime future = LocalDateTime.now().plusDays(1);

//         // Бронирование в прошлом — не должно попасть
//         bookingRepository.save(new Booking(user, room, past, 60));
//         // Бронирование в будущем — должно попасть
//         bookingRepository.save(new Booking(user, room, future, 60));

//         List<Booking> active = bookingRepository.findByRoomIdAndActiveDate(room.getId());
//         assertThat(active).hasSize(1);
//         assertThat(active.get(0).getStart()).isEqualTo(future);
//     }

//     @Test
//     void shouldFindBookingsByFloorAndActiveDate() {
//         Room room2 = new Room();
//         room2.setNumber(201);
//         room2.setCapability(2);
//         room2.setFloor(2);
//         room2.setIsOpen(true);
//         entityManager.persistAndFlush(room2);

//         LocalDateTime future = LocalDateTime.now().plusDays(1);
//         bookingRepository.save(new Booking(user, room, future, 60));      // floor 1
//         bookingRepository.save(new Booking(user, room2, future, 60));    // floor 2

//         List<Booking> floor1Active = bookingRepository.findByFloorAndActiveDate(1);
//         assertThat(floor1Active).hasSize(1);
//         assertThat(floor1Active.get(0).getRoom().getFloor()).isEqualTo(1);
//     }

//     // @Test
//     // void shouldInsertOnlyIfNotExistsDueToUniqueConstraint() {
//     //     LocalDateTime start = LocalDateTime.now().plusHours(1);
//     //     Integer userId = user.getId();
//     //     Integer roomId = room.getId();

//     //     // Первый INSERT — должен пройти
//     //     bookingRepository.insertIfNotExists(userId, roomId, start, 60);

//     //     // Второй INSERT с теми же (room_id, start) — должен проигнорироваться
//     //     bookingRepository.insertIfNotExists(userId, roomId, start, 90);

//     //     // Должна быть только одна запись
//     //     List<Booking> bookings = bookingRepository.findByRoom(room);
//     //     assertThat(bookings).hasSize(1);
//     //     assertThat(bookings.get(0).getDurationMinutes()).isEqualTo(60); // не 90!
//     // }

//     @Test
//     void shouldFindActiveUserBookings() {
//         LocalDateTime now = LocalDateTime.now();
//         LocalDateTime inPast = now.minusMinutes(30);    // уже завершилось
//         LocalDateTime inFuture = now.plusMinutes(30);   // ещё активно

//         // Бронирование, которое ещё активно (start + duration > now)
//         bookingRepository.save(new Booking(user, room, inFuture.minusMinutes(10), 60)); // активно
//         // Бронирование, которое уже завершилось
//         bookingRepository.save(new Booking(user, room, inPast.minusMinutes(60), 30));  // не активно

//         List<Booking> active = bookingRepository.findActiveUserBookings(user.getId());
//         assertThat(active).hasSize(1);
//         assertThat(active.get(0).getStart()).isAfter(inPast);
//     }

//     @Test
//     void shouldDeleteActiveBookingsByRoomId() {
//         LocalDateTime past = LocalDateTime.now().minusDays(1);
//         LocalDateTime future = LocalDateTime.now().plusDays(1);

//         bookingRepository.save(new Booking(user, room, past, 60));    // не активное
//         bookingRepository.save(new Booking(user, room, future, 60));  // активное

//         bookingRepository.deleteActiveBookingsByRoomId(room.getId());

//         // Должно остаться только прошлое бронирование
//         List<Booking> all = bookingRepository.findByRoom(room);
//         assertThat(all).hasSize(1);
//         assertThat(all.get(0).getStart()).isEqualTo(past);
//     }
// }