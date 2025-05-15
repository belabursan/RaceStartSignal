package com.buri.signal;

import java.time.LocalTime;

import com.buri.Arguments;
import com.buri.config.Config;
import com.buri.db.DbSignal;
import com.buri.hw.HwException;

public abstract class Signal {

    final DbSignal dbSignal;
    final Arguments args;
    final Config config;
    private boolean aborted;


    /**
     * Constructor for Signal class.
     * 
     * @param dbs the DbSignal object representing the signal
     */
    public Signal(DbSignal dbs, Arguments args, Config config) {
        this.dbSignal = dbs;
        this.args = args;
        this.config = config;
        this.aborted = false;
    }

    /**
     * Checks wether the signal is allowed to be executed
     * @return true if the signal is allowed, false otherwise
     */
    protected boolean allowed() {
        LocalTime signalTime = LocalTime.of(dbSignal.getDate().getHour(), dbSignal.getDate().getMinute(), dbSignal.getDate().getSecond());
        if (signalTime.isAfter(config.getRaceStart()) && signalTime.isBefore(config.getRaceEnd())) {
            return true;
        }
        return false;
    }


    /**
     * Returns a string representing the signal.
     */
    @Override
    public String toString() {
        return "Signal->{" + dbSignal.toString() + "}";
    }


    /**
     * Waits until it is time to execute the signal.
     * NOTE: The call to this method is blocing until it is time to execute the signal.
     * @throws InterruptedException
     */
    public synchronized void countDown() throws InterruptedException{
        long duration = dbSignal.getDurationMs();
        while (duration > 0 && !aborted) {
               wait(duration);
        }
    }

    /**
     * Aborts the countDown method.
     * This method should be called when the signal is no longer needed.
     */
    public synchronized void abort() {
        aborted = true;
        notifyAll();
    }


    /**
     * Executes the signal.
     * This method should be implemented by subclasses to define the specific behavior of the signal.
     * @throws InterruptedException
     * @throws HwException
     */
    public abstract void execute() throws InterruptedException, HwException;

}
