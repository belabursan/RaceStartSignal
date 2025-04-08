package com.buri.db;

import java.sql.SQLException;
import com.buri.config.Config;
import com.buri.config.ConfigStatus;
import com.buri.signal.SignalList;

/**
 * Database interface for handling signals.
 * This interface defines the methods for interacting with the database.
 */
public interface Db {

     /**
     * Checks if the config and lis in the database has changed
     * @return ConfigStatus object
     * @throws SQLException if there is an error reading the database
     */
    public ConfigStatus getDbStatus() throws SQLException;

    /**
     * Returns the current configuration
     * @return configuration
     * @throws SQLException if there is an error reading the database
     */
    public Config getConfig() throws SQLException;

    /**
     * Returns all the signals from the database
     * @return List of signals sorted by date or empty list if db is empty
     * @throws SQLException
     */
    public SignalList getSignalList() throws SQLException;

    /**
     * Removes a signal from the database
     * 
     * @param id the id of the signal to be removed
     * @throws SQLException if there is an error removing the signal
     */
    public void removeSignal(int id) throws SQLException;

    /**
     * Closes the database connection
     */
    public void close();

}
