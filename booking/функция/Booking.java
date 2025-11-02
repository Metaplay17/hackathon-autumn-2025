package hahaton;

import java.time.*;

public class Booking {
    private String user;
    private LocalDateTime startTime;
    private int room;
    
    public String getUsername() {
        return user;
    }
    public void setUsername(String username) {
        this.user = username;
    }
    public LocalDateTime getTime() {
    	return startTime;
    }
    public void setTime(LocalDateTime startTime) {
    	this.startTime = startTime;
    }
    public int getRoom() {
    	return room;
    }
    public void setRoom(int room) {
    	this.room = room;
    }
	public String print() {
		return getRoom()+" "+getTime()+" "+getUsername();
	}
	public Booking(int room,LocalDateTime startTime,String user) {
		this.room = room;
		this.startTime = startTime;
		this.user = user;
	}
	
    
}
