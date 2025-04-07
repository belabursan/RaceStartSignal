package com.buri.signal;

import java.util.Date;

/**
 * Class representing a signal with a date and type.
 * The date is formatted as "yyyy-MM-dd HH:mm:ss".
 */
public final class Signal {

    private int id;
    private int groupId;
    private Date date;
    private SignalType type;

    /**
     * Constructor for Signal class.
     * 
     * @param id       the id of the signal
     * @param groupId  the group id of the signal
     * @param dateTime the date of the signal
     * @param type     the type of the signal
     */
    public Signal(int id, int groupId, Date dateTime, SignalType type) {
        this.id = id;
        this.groupId = groupId;
        this.date = dateTime;
        this.type = type;
    }

    /**
     * Compare this signal with another signal based on the date.
     * 
     * @param other the other signal to compare with
     * @return a negative integer, zero, or a positive integer as this signal is
     *         less than, equal to, or greater than the specified signal
     * @throws NullPointerException if the other signal is null
     */
    public int compareTo(Signal other) {
        return this.date.toString().compareTo(other.date.toString());
    }

    /**
     * Get the date of the signal.
     * 
     * @return the date of the signal
     */
    public Date getDate() {
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

}
