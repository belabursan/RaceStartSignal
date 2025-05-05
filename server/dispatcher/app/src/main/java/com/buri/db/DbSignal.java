package com.buri.db;

import java.time.LocalDateTime;

import com.buri.signal.SignalType;

/**
 * Class representing a signal in Db with a date and type.
 * Type is an enum
 * The date is formatted as "yyyy-MM-dd HH:mm:ss".
 */
public class DbSignal {
    private int id;
    private LocalDateTime date;
    private SignalType type;
    private int boatId;
    private String info;

    /**
     * Constructor for Signal class.
     * 
     * @param id       the id of the signal
     * @param dateTime the date of the signal
     * @param type     the type of the signal
     * @param boatId   the id of the boat
     * @param info     additional information about the signal
     */
    public DbSignal(int id, LocalDateTime dateTime, SignalType type, int boatId, String info) {
        this.id = id;
        this.date = dateTime;
        this.type = type;
        this.boatId = boatId;
        this.info = info;
    }

    /**
     * Constructor for Signal class.
     * 
     * @param id       the id of the signal
     * @param dateTime the date of the signal
     * @param type     the type of the signal
     * @param boatId   the id of the boat
     * @param info     additional information about the signal
     */
    public DbSignal(int id, LocalDateTime dateTime, String type, int boatId, String info) {
        this(id, dateTime, SignalType.fromString(type), boatId, info);
    }

    /**
     * Gets the ID of the signal.
     * 
     * @return the ID of the signal
     */
    public int getId() {
        return id;
    }

    /**
     * Gets the date of the signal.
     * 
     * @return the date of the signal
     */
    public LocalDateTime getDate() {
        return date;
    }

    /**
     * Gets the type of the signal.
     * 
     * @return the type of the signal
     */
    public SignalType getType() {
        return type;
    }

    /**
     * Gets the boat ID associated with the signal.
     * 
     * @return the boat ID
     */
    public int getBoatId() {
        return boatId;
    }

    /**
     * Gets additional information about the signal.
     * 
     * @return the additional information
     */
    public String getInfo() {
        return info;
    }

    /**
     * returns a string representation of the Signal object.
     */
    public String toString() {
        return "Signal{ " +
                "id=" + id +
                ", date=" + date.toString() +
                ", type=" + type +
                ", boatId=" + boatId +
                ", info='" + info + '\'' +
                " }";
    }

}
