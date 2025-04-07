package com.buri.signal;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Class representing a signal with a date and type.
 * The date is formatted as "yyyy-MM-dd HH:mm:ss".
 */
public final class Signal {

    private Date date;
    private SignalType type;

    /**
     * Constructor for Signal class.
     * 
     * @param date the date of the signal from the database
     * @param type the type of the signal from the database
     *             throws IllegalArgumentException if the date is null or empty or
     *             cannot be parsed
     */
    public Signal(String dateTime, SignalType type) throws IllegalArgumentException {
        if (dateTime == null || dateTime.isEmpty()) {
            throw new IllegalArgumentException("Date cannot be null or empty");
        }
        try {
            this.date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(dateTime);
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid date format: " + dateTime, e);
        }
        this.type = type;
    }

    /**
     * Constructor for Signal class.
     * 
     * @param date the date of the signal from the database
     * @param type the type of the signal from the database
     */
    public Signal(String dateTime, int type) {
        this(dateTime, SignalType.fromInt(type));
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

}
