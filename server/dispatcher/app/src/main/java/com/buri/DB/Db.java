package com.buri.DB;

import com.buri.signal.Signal;

/**
 * Database interface for handling signals.
 * This interface defines the methods for interacting with the database.
 */
public interface Db {

    /**
     * Return the next signal from the database based on time
     * @return the next signal as Signal object
     */
    public Signal getNextSignal();

    /**
     * Closes the database  connection
     */
    public void close();

}
