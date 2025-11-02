package com.example.services;

import java.time.LocalTime;
import java.util.ArrayList;

import org.springframework.stereotype.Component;

import com.example.exceptions.IncorrectStartEndTimeException;
import com.example.models.BookingTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class BookingTimeGenerator {
    private int bookingDurationMinutes;
    private LocalTime startTime;
    private LocalTime endTime;

    public ArrayList<BookingTime> generate() {
        if (startTime.isBefore(endTime)) {
            throw new IncorrectStartEndTimeException("Время начала не может быть меньше времени конца");
        }
        int minutes = (startTime.getHour() - endTime.getHour()) * 60 + (startTime.getMinute() - endTime.getMinute());
        if (minutes % bookingDurationMinutes != 0) {
            throw new IncorrectStartEndTimeException("Невозможно распределить целое количество броней");
        }

        ArrayList<BookingTime> bookings = new ArrayList<BookingTime>();
        LocalTime st = startTime;
        while (st.isBefore(endTime)) {
            bookings.add(new BookingTime(st, st.plusMinutes(bookingDurationMinutes)));
            st = st.plusMinutes(bookingDurationMinutes);
        }
        return bookings;
    }
}
