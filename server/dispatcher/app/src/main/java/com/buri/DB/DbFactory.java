package com.buri.DB;

import java.sql.SQLException;

import com.buri.Arguments;

/**
 * DbFactory is a singleton class that provides a single instance of DbHandler.
 * It initializes the DbHandler with the provided arguments.
 */
public final class DbFactory {
    private static Db db = null;
    private static Arguments arguments = null;

    // Prevent instantiation
    private DbFactory() {
    }

    /**
     * Initialize the DbFactory with the provided arguments.
     * This method should be called once before using the DbFactory.
     * 
     * @param arguments Arguments object containing the necessary parameters
     * @throws IllegalStateException  if DbFactory is already initialized
     * @throws SQLException           if there is an error connecting to the
     *                                database
     * @throws ClassNotFoundException if the JDBC driver class is not found
     */
    public static void init(Arguments arguments) throws IllegalStateException, SQLException {
        DbFactory.arguments = arguments;
        initDbHandler();
    }

    /**
     * Get the singleton instance of DbHandler.
     * 
     * @return DbHandler instance as Db interface
     * @throws IllegalStateException if DbFactory is not initialized
     */
    public static Db getDb() {
        if (arguments == null) {
            throw new IllegalStateException("DbFactory not initialized. Call init() first.");
        }
        return DbFactory.db;
    }

    /**
     * Reset the DbFactory and close the existing DbHandler.
     * This method can be used to reinitialize the DbFactory with new arguments.
     */
    public static void reset() {
        DbFactory.arguments = null;
        if (DbFactory.db != null) {
            DbFactory.db.close();
        }
        DbFactory.db = null;
        System.out.println("DbFactory reset.");
    }

    /**
     * Initialize the DbHandler with the provided arguments.
     * This method is called internally by the init() method.
     * 
     * @throws SQLException           if there is an error connecting to the
     *                                database
     * @throws ClassNotFoundException if the JDBC driver class is not found
     * @throws IllegalStateException  if DbFactory is already initialized
     */
    private static void initDbHandler() throws SQLException {
        if (DbFactory.db == null) {
            DbHandler dbHandler = new DbHandler(DbFactory.arguments);
            dbHandler.connect();
            DbFactory.db = (Db) dbHandler;
            System.out.println("DbHandler initialized: " + dbHandler.toString());
        } else {
            throw new IllegalStateException("DbFactory already initialized. Call getDb() to get the instance.");
        }
    }

}
