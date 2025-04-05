package com.buri.DB;

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
     * @param arguments Arguments object containing the necessary parameters
     */
    public static void init(Arguments arguments) {
        DbFactory.arguments = arguments;
        initDbHandler();
    }

    /**
     * Get the singleton instance of DbHandler.
     * @return DbHandler instance as Db interface
     * @throws IllegalStateException if DbFactory is not initialized
     */
    public static Db getDb() {
        if (arguments == null) {
            throw new IllegalStateException("DbFactory not initialized. Call init() first.");
        }
        return DbFactory.db;
    }


    private static void initDbHandler() {
        if (DbFactory.db == null) {
            DbHandler dbHandler = new DbHandler(DbFactory.arguments);
            dbHandler.connect();
            DbFactory.db = (Db)dbHandler;
            System.out.println("DbHandler initialized: " + dbHandler.toString());
        }
    }
    
}
