package com.buri.signal;

import java.time.LocalDateTime;
import java.time.LocalTime;

import com.buri.config.Config;

/**
 * Class representing a signal with a date and type.
 * The date is formatted as "yyyy-MM-dd HH:mm:ss".
 */
public class Signal implements Comparable<Signal> {
    @SuppressWarnings("unused")
    private static final long serialVersionUID = 1971L;

    private int id;
    private int groupId;
    private LocalDateTime date;
    private SignalType type;

    /**
     * Constructor for Signal class.
     * 
     * @param id       the id of the signal
     * @param groupId  the group id of the signal
     * @param dateTime the date of the signal
     * @param type     the type of the signal
     */
    public Signal(int id, int groupId, LocalDateTime dateTime, SignalType type) {
        this.id = id;
        this.groupId = groupId;
        this.date = dateTime;
        this.type = type;
    }

    /**
     * Compare this signal with another signal based on the date.
     * 
     * @param other the other signal to compare with
     * @return true if the objects are equal, false otherwise
     * @throws NullPointerException if the other signal is null
     */
    @Override
    public boolean equals(Object obj) {
        return (obj instanceof Signal) && (this.date.equals(((Signal)obj).getDate()));
    }

    @Override
    public int compareTo(Signal other) {
        return this.date.compareTo(other.date);
    }

    /**
     * Get the date and time of the signal.
     * 
     * @return the date of the signal
     */
    public LocalDateTime getDate() {
        return date;
    }

    /**
     * Get the type of the signal.
     * 
     * @return the type of the signal
     */
    public SignalType getType() {
        return type;
    }

    /**
     * Get the id of the signal.
     * 
     * @return the id of the signal
     */
    public int getId() {
        return id;
    }

    /**
     * Get the group id of the signal.
     * 
     * @return the group id of the signal
     */
    public int getGroupId() {
        return groupId;
    }

    /**
     * returns a string representation of the Signal object.
     */
    public String toString() {
        return "Signal{ " +
                "id=" + id +
                ", groupId=" + groupId +
                ", date=" + date.toString() +
                ", type=" + type +
                " }";
    }

    public boolean allowed(Config config) {
        LocalTime signalTime = LocalTime.of(date.getHour(), date.getMinute(), date.getSecond());
        if(signalTime.isAfter(config.getRaceStart()) && signalTime.isBefore(config.getRaceEnd())) {
            return true;
        }
        return false;
    }

}
