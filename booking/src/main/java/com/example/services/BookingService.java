package com.example.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dto.BookingDto;
import com.example.dto.RoomDto;
import com.example.dto.admin.UpdateBookingRequest;
import com.example.dto.requests.MakeBookingRequest;
import com.example.exceptions.BookingAlreadyUsedException;
import com.example.exceptions.BookingNotFoundException;
import com.example.exceptions.IncorrectStartEndTimeException;
import com.example.exceptions.UserNotFoundException;
import com.example.models.Booking;
import com.example.models.User;
import com.example.repositories.BookingRepository;
import com.example.repositories.RoomRepository;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    public List<BookingDto> getBookingsByFloor(Integer floor) {
        List<Booking> bookings = bookingRepository.findByFloorAndActiveDate(floor);
        List<BookingDto> bookingDtos = new ArrayList<BookingDto>();
        for (Booking b : bookings) {
            String username = null;
            if (b.getUser() != null) {
                username = b.getUser().getUsername();
            }
            RoomDto room = new RoomDto(
                b.getRoom().getId(), 
                b.getRoom().getNumber(), 
                b.getRoom().getCapability(),
                 b.getRoom().getFloor(), 
                 b.getRoom().getIsOpen()
            );
            bookingDtos.add(new BookingDto(b.getId(), username, room, b.getStart(), b.getDurationMinutes()));
        }
        return bookingDtos;
    }

    public void updateBooking(UpdateBookingRequest request, Optional<User> newUser) {
        if (!newUser.isPresent()) {
            throw new UserNotFoundException("Пользователь с таким username не существует");
        }
        User user = newUser.get();
        Optional<Booking> bookingOptional = bookingRepository.findById(request.getBookingId());
        if (bookingOptional.isPresent()) {
            Booking booking = bookingOptional.get();
            booking.setUser(user);
            bookingRepository.saveAndFlush(booking);
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
            booking.setUser(user);
            bookingRepository.saveAndFlush(booking);
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
}
