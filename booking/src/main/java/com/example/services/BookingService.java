package com.example.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.dto.BookingDto;
import com.example.dto.admin.UpdateBookingRequest;
import com.example.exceptions.BookingNotFoundException;
import com.example.exceptions.UserNotFoundException;
import com.example.models.Booking;
import com.example.models.User;
import com.example.repositories.BookingRepository;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<BookingDto> getBookingsByFloor(Integer floor) {
        List<Booking> bookings = bookingRepository.findByFloorAndActiveDate(floor);
        List<BookingDto> bookingDtos = new ArrayList<BookingDto>();
        for (Booking b : bookings) {
            bookingDtos.add(new BookingDto(b.getId(), b.getUser().getUsername(), b.getRoom().getId(), b.getStart(), b.getDurationMinutes()));
        }
        return bookingDtos;
    }

    public void updateBooking(UpdateBookingRequest request, Optional<User> newUser) {
        if (!newUser.isPresent()) {
            throw new UserNotFoundException("Пользователь с username не существует");
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
}
