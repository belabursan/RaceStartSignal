package com.buri.signal;

import com.buri.Arguments;
import com.buri.db.DbSignal;
import com.buri.hw.HwException;

/**
 * This class represents a start signal in the system. No one minute signal, no yellow signal...
 */
public class SignalS extends Signal {

    /**
     * Constructor for SignalS class.
     * 
     * @param dbs the DbSignal object representing the signal
     */
    public SignalS(DbSignal dbs, Arguments args) {
        super(dbs, args);
    }

    @Override
    public void execute() throws InterruptedException, HwException{
        // Implementation for executing the start signal
        // This could involve sending a message to the system or updating a database
        System.out.println("Executing start signal...");
    }

}
