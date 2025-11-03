package hahaton;

import java.time.*;
import java.util.*;

public class main {

	public static List<Booking> generateBookings(LocalDateTime startTime, LocalDateTime endTime, int bookingDuration,
			List<Integer> rooms) {
		List<Booking> list = new ArrayList<>();
		List<LocalDateTime> listTimes = new ArrayList<>();
		LocalDateTime time = startTime;

		while (time.isBefore(endTime)) {
			listTimes.add(time);
			time = time.plusMinutes(bookingDuration);
		}
	    for (int i = 0; i < rooms.size(); i++) {
	    	for (int j = 0; j < listTimes.size(); j++) {
				Booking booking = new Booking(rooms.get(i),listTimes.get(j),"null");
				list.add(booking);
			}
	    	
	    }
		return list;
	}

	public static void main(String[] args) {

		List<Integer> rooms = Arrays.asList(101, 102, 103, 201, 202, 203, 301, 302, 303);
		List<Booking> list = generateBookings(LocalDateTime.of(2024, 1, 15, 10, 0), LocalDateTime.of(2024, 1, 15, 18, 0), 90, rooms);
		System.out.println("Room      Time      Username");
	    for (int i = 0; i < list.size(); i++) {
	    	System.out.println(list.get(i).print());
	    }
	}

}
