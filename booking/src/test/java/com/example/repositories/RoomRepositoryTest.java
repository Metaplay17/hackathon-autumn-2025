// package com.example.repositories;

// import com.example.models.Room;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
// import org.springframework.test.context.TestPropertySource;

// import java.util.List;

// import static org.assertj.core.api.Assertions.assertThat;
// import static org.junit.jupiter.api.Assertions.assertThrows;

// @DataJpaTest
// @TestPropertySource(properties = {
//     "spring.jpa.hibernate.ddl-auto=create-drop"
// })
// class RoomRepositoryTest {

//     @Autowired
//     private RoomRepository roomRepository;

//     @Autowired
//     private org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager entityManager;

//     @Test
//     void shouldSaveAndFindRoomById() {
//         Room room = new Room();
//         room.setNumber(101);
//         room.setCapability(4);
//         room.setFloor(1);
//         room.setIsOpen(true);

//         entityManager.persistAndFlush(room);

//         assertThat(room.getId()).isNotNull();

//         Room found = roomRepository.findById(room.getId()).orElse(null);
//         assertThat(found).isNotNull();
//         assertThat(found.getNumber()).isEqualTo(101);
//         assertThat(found.getCapability()).isEqualTo(4);
//         assertThat(found.getFloor()).isEqualTo(1);
//         assertThat(found.getIsOpen()).isTrue();
//     }

//     @Test
//     void shouldFindByFloor() {
//         Room room1 = new Room();
//         room1.setNumber(101);
//         room1.setCapability(2);
//         room1.setFloor(1);
//         room1.setIsOpen(true);

//         Room room2 = new Room();
//         room2.setNumber(201);
//         room2.setCapability(3);
//         room2.setFloor(2);
//         room2.setIsOpen(true);

//         Room room3 = new Room();
//         room3.setNumber(102);
//         room3.setCapability(4);
//         room3.setFloor(1);
//         room3.setIsOpen(false);

//         entityManager.persistAndFlush(room1);
//         entityManager.persistAndFlush(room2);
//         entityManager.persistAndFlush(room3);

//         List<Room> floor1Rooms = roomRepository.findByFloor(1);
//         assertThat(floor1Rooms).hasSize(2);
//         assertThat(floor1Rooms).extracting(Room::getNumber).containsExactlyInAnyOrder(101, 102);

//         List<Room> floor2Rooms = roomRepository.findByFloor(2);
//         assertThat(floor2Rooms).hasSize(1);
//         assertThat(floor2Rooms.get(0).getNumber()).isEqualTo(201);
//     }

//     @Test
//     void shouldFindAllOpenRoomIds() {
//         Room room1 = new Room();
//         room1.setNumber(101);
//         room1.setCapability(2);
//         room1.setFloor(1);
//         room1.setIsOpen(true);

//         Room room2 = new Room();
//         room2.setNumber(201);
//         room2.setCapability(3);
//         room2.setFloor(2);
//         room2.setIsOpen(false);

//         Room room3 = new Room();
//         room3.setNumber(102);
//         room3.setCapability(4);
//         room3.setFloor(1);
//         room3.setIsOpen(true);

//         entityManager.persistAndFlush(room1);
//         entityManager.persistAndFlush(room2);
//         entityManager.persistAndFlush(room3);

//         List<Integer> openRoomIds = roomRepository.findAllOpenId();

//         assertThat(openRoomIds).hasSize(2);
//         assertThat(openRoomIds).contains(room1.getId(), room3.getId());
//     }

//     @Test
//     void shouldEnforceNotNullConstraints() {
//         Room room = new Room();
//         // Все поля null — должно упасть

//         assertThrows(
//             org.springframework.dao.DataIntegrityViolationException.class,
//             () -> roomRepository.saveAndFlush(room)
//         );
//     }

//     @Test
//     void shouldAllowSavingWithIsOpenTrueByDefault() {
//         Room room = new Room();
//         room.setNumber(301);
//         room.setCapability(2);
//         room.setFloor(3);

//         Room saved = roomRepository.saveAndFlush(room);
//         assertThat(saved.getIsOpen()).isTrue();
//     }
// }
