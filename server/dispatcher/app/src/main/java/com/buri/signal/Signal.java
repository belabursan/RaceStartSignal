package com.buri.signal;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.buri.Arguments;
import com.buri.config.Config;
import com.buri.db.DbSignal;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public abstract class Signal {

    final DbSignal dbSignal;
    final Arguments args;
    final Config config;
    boolean aborted;

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
     * 
     * @return true if the signal is allowed, false otherwise
     */
    private boolean timeAllowed() {
        LocalTime signalTime = LocalTime.of(dbSignal.getDate().getHour(), dbSignal.getDate().getMinute(),
                dbSignal.getDate().getSecond());
        if (signalTime.isAfter(config.getRaceStart()) && signalTime.isBefore(config.getRaceEnd())) {
            return true;
        }
        System.out.println("Signal not allowed: " + signalTime + " is not between " + config.getRaceStart() + " and "
                + config.getRaceEnd());
        return false;
    }

    /**
     * Checks if the signal is allowed to be executed
     * 
     * @return true if the signal is allowed, false otherwise
     */
    protected boolean isAllowed() {
        if (timeAllowed()) {
            if (!config.isPaused()) {
                return true;
            } else {
                System.out.println("Signaling is paused");
            }
        }
        return true;
    }

    /**
     * Sets the horn on for a given duration.
     * 
     * @param duration time in milliseconds
     * @throws HwException          in case of hardware error
     * @throws InterruptedException if execution is interrupted
     */
    protected void hornOn(long duration) throws HwException, InterruptedException {
        if (!config.isMute()) {
            HwFactory.getHw().hornOn(duration);
        } else {
            System.out.println("Signal: Mute is on");
        }
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
     * NOTE: The call to this method is blocing until it is time to execute the
     * signal.
     * 
     * @return true if the signal is not aborted, false otherwise
     * 
     * @throws InterruptedException
     */
    protected synchronized boolean countDown(LocalDateTime time) throws InterruptedException {
        long duration = Duration.between(LocalDateTime.now(), time).toMillis();
        while (duration > 0 && !aborted) {
            System.out.println("Waiting for " + duration + " ms");
            wait(duration);
        }
        return !aborted;
    }

    /**
     * Resets the hardware flags.
     * This method should be called when the signal is aborted or when the
     * execution is finished by an exception
     * 
     * @throws HwException
     */
    protected void resetHw() {
        try {
            HwFactory.getHw().hwClassFlagOff();
            HwFactory.getHw().hwYellowFlagOff();
            HwFactory.getHw().hwPFlagOff();
        } catch (HwException e) {
            System.out.println("Error resetting hardware flags: " + e.getMessage());
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
     * This method should be implemented by subclasses to define the specific
     * behavior of the signal.
     * 
     * @throws InterruptedException
     * @throws HwException
     */
    public abstract void execute() throws InterruptedException, HwException;

}
