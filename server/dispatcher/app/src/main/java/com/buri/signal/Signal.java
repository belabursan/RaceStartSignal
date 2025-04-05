package com.buri.signal;

import java.util.Date;

public final class Signal {

    private Date date;
    private SignalType type;

    /**
     * Constructor for Signal class.
     * @param date the date of the signal
     * @param time the time of the signal
     * @param type the type of the signal
     */
    public Signal(String dateTime, SignalType type) {
        this.date = new Date();
        // TODO parse deateTime
        this.type = type;
    }
    


   // compare
}
