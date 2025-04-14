package com.buri.db;

import java.sql.SQLException;

import com.buri.config.Config;
import com.buri.config.DbStatus;
import com.buri.signal.SignalGroupList;

/**
 * Database interface for handling signals.
 * This interface defines the methods for interacting with the database.
 */
public interface Db {

    static final String CONFIG_TABLE_NAME = "app_config";
    static final int CONFIG_ID = 1;

     /**
     * Checks if the config and the list in the database has changed
     * @return ConfigStatus object
     * @throws SQLException if there is an error reading the database
     */
    public DbStatus getDbStatus() throws SQLException;

    /**
     * Returns the current configuration
     * @return configuration
     * @throws SQLException if there is an error reading the database
     */
    public Config getConfig() throws SQLException;

    /**
     * Returns all the signals from the database
     * @return List of signals sorted by date and grouped by group id, or empty list if db is empty
     * @throws SQLException
     */
    public SignalGroupList getSignalList() throws SQLException;

    /**
     * Removes a signal from the database
     * 
     * @param groupId the group id of the signals to be removed
     * @throws SQLException if there is an error removing the signals
     */
    public void removeSignalGroup(int groupId) throws SQLException;

    /**
     * Closes the database connection
     */
    public void close();

}
