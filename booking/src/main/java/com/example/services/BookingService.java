package com.example.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dto.BookingDto;
import com.example.dto.admin.AdminBookingDto;
import com.example.dto.admin.UpdateBookingRequest;
import com.example.dto.requests.CancelBookingRequest;
import com.example.dto.requests.MakeBookingRequest;
import com.example.exceptions.AccessDeniedException;
import com.example.exceptions.BookingAlreadyUsedException;
import com.example.exceptions.BookingNotFoundException;
import com.example.exceptions.IncorrectStartEndTimeException;
import com.example.exceptions.UserNotFoundException;
import com.example.models.Booking;
import com.example.models.BookingLog;
import com.example.models.User;
import com.example.repositories.BookingLogRepository;
import com.example.repositories.BookingRepository;
import com.example.repositories.RoomRepository;
import com.example.repositories.UserRepository;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final BookingLogRepository bookingLogRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository, BookingLogRepository bookingLogRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.bookingLogRepository = bookingLogRepository;
        this.userRepository = userRepository;
    }

    public List<BookingDto> getBookingsByFloor(Integer floor, Integer userId) {
        List<Booking> bookings = bookingRepository.findByFloorAndActiveDate(floor);
        List<BookingDto> bookingDtos = new ArrayList<BookingDto>();
        for (Booking b : bookings) {
            Boolean isOwner = b.getUser() != null && b.getUser().getId().equals(userId);
            bookingDtos.add(new BookingDto(b.getId(), isOwner, b.getUser() == null, b.getRoom().getId(), b.getStart(), b.getDurationMinutes()));
        }
        return bookingDtos;
    }

    public List<BookingDto> getAllBookings(Integer userId) {
        List<Booking> bookings = bookingRepository.findByActiveDate();
        List<BookingDto> bookingDtos = new ArrayList<BookingDto>();
        for (Booking b : bookings) {
            Boolean isOwner = b.getUser() != null && b.getUser().getId().equals(userId);
            bookingDtos.add(new BookingDto(b.getId(), isOwner, b.getUser() == null, b.getRoom().getId(), b.getStart(), b.getDurationMinutes()));
        }
        return bookingDtos;
    }

    public List<AdminBookingDto> getAdminBookingsByFloor(Integer floor, Integer userId) {
        List<Booking> bookings = bookingRepository.findByFloorAndActiveDate(floor);
        List<AdminBookingDto> bookingDtos = new ArrayList<AdminBookingDto>();
        for (Booking b : bookings) {
            String username = null;
            if (b.getUser() != null) {
                username = b.getUser().getUsername();
            }
            bookingDtos.add(new AdminBookingDto(b.getId(), username, username != null && b.getUser().getId().equals(userId), b.getUser() == null, b.getRoom().getId(), b.getStart(), b.getDurationMinutes()));
        }
        return bookingDtos;
    }

    public List<AdminBookingDto> getAllAdminBookings(Integer userId) {
        List<Booking> bookings = bookingRepository.findByActiveDate();
        List<AdminBookingDto> bookingDtos = new ArrayList<AdminBookingDto>();
        for (Booking b : bookings) {
            String username = null;
            if (b.getUser() != null) {
                username = b.getUser().getUsername();
            }
            bookingDtos.add(new AdminBookingDto(b.getId(), username, username != null && b.getUser().getId().equals(userId), b.getUser() == null, b.getRoom().getId(), b.getStart(), b.getDurationMinutes()));
        }
        return bookingDtos;
    }

    public void updateBooking(Integer actionerId, UpdateBookingRequest request, Optional<User> newUser) {
        if (!newUser.isPresent()) {
            throw new UserNotFoundException("Пользователь с таким username не существует");
        }
        User user = newUser.get();
        Optional<Booking> bookingOptional = bookingRepository.findById(request.getBookingId());
        if (bookingOptional.isPresent()) {
            Booking booking = bookingOptional.get();

            User oldUser = booking.getUser();
            User actioner = userRepository.getReferenceById(actionerId);

            if (request.getIsBlocked()) {
                bookingRepository.deleteById(request.getBookingId());
                return;
            }

            booking.setUser(user);
            bookingRepository.save(booking);
            BookingLog log = new BookingLog(booking, "UPDATE", actioner, oldUser, user);
            bookingLogRepository.save(log);
        }
        else {
            throw new BookingNotFoundException("Бронь с id = " + request.getBookingId() + " не найдена");
        }
    }

    public void makeBooking(User user, MakeBookingRequest request) {
        Optional<Booking> bookingOptional = bookingRepository.findById(request.getBookingId());
        if (bookingOptional.isPresent()) {
            Booking booking = bookingOptional.get();
            if (booking.getUser() != null) {
                throw new BookingAlreadyUsedException("Бронь уже занята");
            }
            if (booking.getStart().plusMinutes(booking.getDurationMinutes()).isBefore(LocalDateTime.now())) {
                throw new AccessDeniedException("Бронь уже не актуальна");
            }
            booking.setUser(user);
            bookingRepository.save(booking);
            BookingLog log = new BookingLog(booking, "BOOK", user, null, user);
            bookingLogRepository.save(log);
        }
        else {
            throw new BookingNotFoundException("Бронь с id = " + request.getBookingId() + " не найдена");
        }
    }

    public void cancelBooking(User user, CancelBookingRequest request) {
        Optional<Booking> bookingOptional = bookingRepository.findById(request.getBookingId());
        if (bookingOptional.isPresent()) {
            Booking booking = bookingOptional.get();
            if (booking.getUser() != user) {
                throw new AccessDeniedException("Бронь не является вашей");
            }
            booking.setUser(null);
            bookingRepository.save(booking);
            BookingLog log = new BookingLog(booking, "CANCEL", user, user, null);
            bookingLogRepository.save(log);
        }
        else {
            throw new BookingNotFoundException("Бронь с id = " + request.getBookingId() + " не найдена");
        }
    }

    @Transactional
    public void generateBookings(LocalDate startDate, LocalDate endDate, LocalTime startDayTime, LocalTime endDayTime, int bookingDuration) {
        if (endDayTime.isBefore(startDayTime) || endDate.isBefore(startDate)) {
            throw new IncorrectStartEndTimeException("Время/дата начала не может быть меньше времени/даты конца");
        }
        int minutes = (startDayTime.getHour() - endDayTime.getHour()) * 60 + (startDayTime.getMinute() - endDayTime.getMinute());
        if (minutes % bookingDuration != 0) {
            throw new IncorrectStartEndTimeException("Невозможно распределить целое количество броней");
        }

		List<LocalDateTime> listTimes = new ArrayList<>();
        List<Integer> rooms = roomRepository.findAllOpenId();

		LocalDate date = startDate;
        while (date.isBefore(endDate)) {
            LocalTime time = startDayTime;
            while (time.isBefore(endDayTime)) {
                listTimes.add(LocalDateTime.of(date, time));
                time = time.plusMinutes(bookingDuration);
            }
            date = date.plusDays(1);
        }

	    for (int i = 0; i < rooms.size(); i++) {
	    	for (int j = 0; j < listTimes.size(); j++) {
				bookingRepository.insertIfNotExists(null, rooms.get(i), listTimes.get((j)), bookingDuration);
			}
	    }
	}

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void generateBookingsInit() {
        this.generateBookings(LocalDate.now(), LocalDate.now().plusDays(7), LocalTime.of(9, 0), LocalTime.of(18, 0), 90);
	}

    @Transactional
    public void cancelRoomBookings(Integer roomId) {
        bookingRepository.deleteActiveBookingsByRoomId(roomId);
    }
}
