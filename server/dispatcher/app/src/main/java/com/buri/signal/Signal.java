package com.buri.signal;

import com.buri.Arguments;
import com.buri.db.DbSignal;
import com.buri.hw.HwException;

public abstract class Signal {

    final DbSignal dbSignal;
    final Arguments args;


    /**
     * Constructor for Signal class.
     * 
     * @param dbs the DbSignal object representing the signal
     */
    public Signal(DbSignal dbs, Arguments args) {
        this.dbSignal = dbs;
        this.args = args;
    }


    @Override
    public String toString() {
        return "Signal->{" + dbSignal.toString() + "}";
    }

    public abstract void execute() throws InterruptedException, HwException;

}
