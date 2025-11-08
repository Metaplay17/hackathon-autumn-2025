package com.example.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bookings_logs")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingLog {

    public BookingLog(Booking booking, String operation, User actioner, User previousUser, User newUser) {
        this.booking = booking;
        this.operation = operation;
        this.actioner = actioner;
        this.previousUser = previousUser;
        this.newUser = newUser;
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(name = "operation_type")
    private String operation;

    @ManyToOne
    @JoinColumn(name = "actioner_id")
    private User actioner;

    @ManyToOne
    @JoinColumn(name = "previous_user_id")
    private User previousUser;

    @ManyToOne
    @JoinColumn(name = "new_user_id")
    private User newUser;

    @Column(name = "changed_at")
    private LocalDateTime changedAt = LocalDateTime.now();
}
