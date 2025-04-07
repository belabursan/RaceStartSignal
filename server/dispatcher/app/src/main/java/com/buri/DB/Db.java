package com.buri.DB;

import java.sql.SQLException;
import com.buri.signal.Signal;

/**
 * Database interface for handling signals.
 * This interface defines the methods for interacting with the database.
 */
public interface Db {

    /**
     * Return the next signal from the database based on time
     * @return the next signal as Signal object
     * @throws SQLException if there is an error retrieving the signal
     * @throws IllegalArgumentException if the signal type is not valid
     */
    public Signal getNextSignal() throws SQLException, IllegalArgumentException;


    /**
     * Removes a signal from the database
     * @param id the id of the signal to be removed
     * @throws SQLException if there is an error removing the signal
     */
    public void removeSignal(int id) throws SQLException;

/* 
    public boolean hasListChanged() throws SQLException;
    public boolean hasConfigChanged() throws SQLException;
    public boolean yellowFlag() throws SQLException;
    public void setYellowFlagOff() throws SQLException;
*/


    /**
     * Closes the database  connection
     */
    public void close();

}
