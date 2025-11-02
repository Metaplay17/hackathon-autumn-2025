package com.example.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.dto.BookingDto;
import com.example.models.Booking;
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
}
