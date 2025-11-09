package com.example.models;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "number", nullable = false)
    private Integer number;

    @Column(name = "description", nullable = true)
    private String description;

    @Column(name = "capability", nullable = false)
    private Integer capability;

    @Column(name = "floor", nullable = false)
    private Integer floor;

    @Column(name = "is_open", nullable = false)
    private Boolean isOpen = true;

    @Column(name = "photo", nullable = true)
    private String photo;

    @OneToMany(mappedBy = "room")
    private List<Booking> bookings;
}
