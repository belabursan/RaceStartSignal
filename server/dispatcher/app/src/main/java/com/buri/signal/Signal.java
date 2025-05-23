package com.buri.signal;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.buri.config.Config;
import com.buri.hw.HwException;

/**
 * Class representing a signal with a date and type.
 * The date is formatted as "yyyy-MM-dd HH:mm:ss".
 */
public class Signal implements Comparable<Signal> {
    @SuppressWarnings("unused")
    private static final long serialVersionUID = 1971L;
    private Object EXEC = new Object();
    private boolean aborted;
    private boolean debug;
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
        this.aborted = false;
        this.debug = false;
    }

    public void setDebug(boolean debug){
        this.debug = debug;
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
        return (obj instanceof Signal) && (this.date.equals(((Signal) obj).getDate()));
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

    protected boolean allowed(Config config) {
        LocalTime signalTime = LocalTime.of(date.getHour(), date.getMinute(), date.getSecond());
        if (signalTime.isAfter(config.getRaceStart()) && signalTime.isBefore(config.getRaceEnd())) {
            return true;
        }
        return false;
    }

    boolean countDown(Config config) throws HwException, InterruptedException {
        LocalDateTime now = LocalDateTime.now();
        if(debug) {
            System.out.println("-----signaltime:   " + this.getDate());
            System.out.println("-----Now:          " + now);
        }
        Duration duration = Duration.between(now, this.getDate());

        if (duration.isNegative()) {
            System.out.println("Old signal, skipping this");
            return false;
        }
        while (!aborted) {
            synchronized (EXEC) {
                if (duration.isZero() || duration.isNegative()) {
                    if (allowed(config)) {
                        return true;
                    }
                    System.out.println("Not allowed, time is out of range");
                    break;
                }
                long durationMillis = duration.toMillis();
                if (durationMillis > 3600000) {
                    if (debug) {
                        System.out.println("It seems that I have to wait for a while...");
                    }
                    System.out.println("Seconds left to wait from now (" + now + 
                    "): " + durationMillis / 1000 + "," + (durationMillis - ((durationMillis / 1000)) * 1000));
                    EXEC.wait(duration.minusSeconds(3600-6).toMillis()); // wait until 1h befor signal
                } else if (durationMillis > 5000) {
                    System.out.println("Seconds left to wait: " + durationMillis / 1000 + "," + 
                    (durationMillis - ((durationMillis / 1000)) * 1000));
                    EXEC.wait(duration.minusSeconds(5).toMillis()); // wait until 5 seconds befor signal
                    if(debug) System.out.println("Less then 6 seconds to signal");
                } else if (durationMillis  > 1000) {
                    EXEC.wait(900);
                } else {
                    EXEC.wait(100);
                }
                duration = Duration.between(LocalDateTime.now(), this.getDate());
            }
        }
        return false;
    }

    public void abort() {
        if(!aborted) {
            System.out.println("Aborting Signal!!");
            aborted = true;
            synchronized (EXEC) {
                this.notifyAll();
            }
        }
    }

}
