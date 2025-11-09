// package com.example.repositories;

// import com.example.models.User;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
// import org.springframework.test.context.TestPropertySource;

// import static org.assertj.core.api.Assertions.assertThat;
// import static org.junit.jupiter.api.Assertions.assertFalse;
// import static org.junit.jupiter.api.Assertions.assertTrue;

// import java.util.Optional;

// @DataJpaTest
// @TestPropertySource(properties = {
//     "spring.jpa.hibernate.ddl-auto=create-drop"
// })
// class UserRepositoryTest {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager entityManager;

//     private static final String EMAIL = "test@example.com";
//     private static final String USERNAME = "testuser";
//     private static final String PASSWORD_HASH = "hashedpassword123";
//     private static final Long TELEGRAM_ID = Long.valueOf(123456789);

//     @Test
//     void shouldSaveAndFindUserById() {
//         User user = new User(EMAIL, USERNAME, PASSWORD_HASH, TELEGRAM_ID);
//         entityManager.persistAndFlush(user);

//         assertThat(user.getId()).isNotNull();

//         User found = userRepository.findById(user.getId()).orElse(null);
//         assertThat(found).isNotNull();
//         assertThat(found.getEmail()).isEqualTo(EMAIL);
//         assertThat(found.getUsername()).isEqualTo(USERNAME);
//     }

//     @Test
//     void shouldFindByEmail() {
//         User user = new User(EMAIL, USERNAME, PASSWORD_HASH, TELEGRAM_ID);
//         entityManager.persistAndFlush(user);

//         User found = userRepository.findByEmail(EMAIL).orElse(null);
//         assertThat(found).isNotNull();
//         assertThat(found.getEmail()).isEqualTo(EMAIL);
//     }

//     @Test
//     void shouldFindByUsername() {
//         User user = new User(EMAIL, USERNAME, PASSWORD_HASH, TELEGRAM_ID);
//         entityManager.persistAndFlush(user);

//         User found = userRepository.findByUsername(USERNAME).orElse(null);
//         assertThat(found).isNotNull();
//         assertThat(found.getUsername()).isEqualTo(USERNAME);
//     }

//     @Test
//     void shouldFindUserByEmailAndPasswordHash() {
//         User user = new User(EMAIL, USERNAME, PASSWORD_HASH, TELEGRAM_ID);
//         entityManager.persistAndFlush(user);

//         User found = userRepository.findByEmailAndPasswordHash(EMAIL, PASSWORD_HASH).orElse(null);
//         assertThat(found).isNotNull();
//         assertThat(found.getEmail()).isEqualTo(EMAIL);
//         assertThat(found.getPasswordHash()).isEqualTo(PASSWORD_HASH);
//     }

//     @Test
//     void shouldNotFindUserWithWrongPasswordHash() {
//         User user = new User(EMAIL, USERNAME, PASSWORD_HASH, TELEGRAM_ID);
//         entityManager.persistAndFlush(user);

//         Optional<User> found = userRepository.findByEmailAndPasswordHash(EMAIL, "wronghash");
//         assertThat(found).isEmpty();
//     }

//     @Test
//     void shouldCheckEmailExists() {
//         User user = new User(EMAIL, USERNAME, PASSWORD_HASH, TELEGRAM_ID);
//         entityManager.persistAndFlush(user);

//         assertTrue(userRepository.existsByEmail(EMAIL));
//         assertFalse(userRepository.existsByEmail("nonexistent@example.com"));
//     }

//     @Test
//     void shouldCheckUsernameExists() {
//         User user = new User(EMAIL, USERNAME, PASSWORD_HASH, TELEGRAM_ID);
//         entityManager.persistAndFlush(user);

//         assertTrue(userRepository.existsByUsername(USERNAME));
//         assertFalse(userRepository.existsByUsername("nonexistentuser"));
//     }

//     @Test
//     void shouldEnforceUniqueEmailConstraint() {
//         User user1 = new User("duplicate@example.com", "user1", PASSWORD_HASH, TELEGRAM_ID);
//         User user2 = new User("duplicate@example.com", "user2", "anotherhash", TELEGRAM_ID - 1);
//         userRepository.save(user1);

//         org.junit.jupiter.api.Assertions.assertThrows(
//             org.springframework.dao.DataIntegrityViolationException.class,
//             () -> {
//                 userRepository.saveAndFlush(user2);
//             }
//         );
//     }

//     @Test
//     void shouldEnforceUniqueUsernameConstraint() {
//         User user1 = new User("user1@example.com", "duplicatename", PASSWORD_HASH, TELEGRAM_ID);
//         userRepository.save(user1);

//         User user2 = new User("user2@example.com", "duplicatename", "anotherhash", TELEGRAM_ID - 1);

//         org.junit.jupiter.api.Assertions.assertThrows(
//             org.springframework.dao.DataIntegrityViolationException.class,
//             () -> userRepository.saveAndFlush(user2)
//         );
//     }

//     @Test
//     void shouldEnforceUniqueTelegranIdConstraint() {
//         User user1 = new User("user1@example.com", "name1", PASSWORD_HASH, TELEGRAM_ID);
//         userRepository.save(user1);

//         User user2 = new User("user2@example.com", "name2", "anotherhash", TELEGRAM_ID);

//         org.junit.jupiter.api.Assertions.assertThrows(
//             org.springframework.dao.DataIntegrityViolationException.class,
//             () -> userRepository.saveAndFlush(user2)
//         );
//     }
// }
