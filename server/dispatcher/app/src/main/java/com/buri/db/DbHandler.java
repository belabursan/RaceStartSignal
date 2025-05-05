package com.buri.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.buri.Arguments;
import com.buri.config.Config;
import com.buri.config.DbStatus;
import com.buri.signal.SignalGroupList;
import com.buri.signal.SignalList;
import com.buri.signal.SignalType;

/**
 * DbHandler is a class that implements the Db interface.
 * It handles the connection to the database and provides methods to interact
 * with it.
 */
class DbHandler implements Db {

    private static final String JDBC_DRIVER = "org.mariadb.jdbc.Driver";
    private final String DB_URL;
    private final String USER;
    private final String PASS;
    private Connection conn = null;
    private boolean debug;

    /**
     * Constructor for DbHandler class.
     * 
     * @param arguments Arguments object containing the necessary parameters
     * @throws ClassNotFoundException if the JDBC driver class is not found
     */
    public DbHandler(final Arguments arguments) {
        this.debug = arguments.isDebug();
        try {
            DB_URL = "jdbc:mariadb://" + arguments.getMysqlHost() + "/" + arguments.getMysqlDb();
            USER = arguments.getMysqlUser();
            PASS = arguments.getMysqlPass();
            Class.forName(JDBC_DRIVER);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            throw new RuntimeException("JDBC Driver not found");
        }
    }

    /**
     * Connects to the database.
     * This method establishes a connection to the database using the provided URL,
     * user, and password.
     * 
     * @throws SQLException if there is an error connecting to the database
     */
    void connect() throws SQLException {
        try {
            System.out.println("Connecting to a selected database...");
            conn = DriverManager.getConnection(DB_URL, USER, PASS);
        } catch (SQLException e) {
            System.out.println("Connection to database failed");
            throw e;
        }
    }

    @Override
    public SignalGroupList getSignalList() throws SQLException, IllegalArgumentException {
        final String query = "SELECT * FROM signals ORDER BY date_time ASC";
        SignalList list = new SignalList();
        Statement stmt = null;
        ResultSet rs = null;

        if (debug) {
            System.out.println("Reading db for signals");
        }

        try {
            stmt = conn.createStatement();
            rs = stmt.executeQuery(query);

            while (rs.next()) {
                LocalDateTime dateTime = rs.getObject("date_time", LocalDateTime.class);
                SignalType type = SignalType.fromInt(rs.getInt("signal_type"));
                int groupId = rs.getInt("group_id");
                int id = rs.getInt("id");
                DbSignal s = new DbSignal(id, groupId, dateTime, type);
                s.setDebug(debug);
                list.addSignal(s);
            }
        } catch (SQLException e) {
            System.out.println("Error executing query: " + e.getMessage());
            throw e;
        } catch (IllegalArgumentException i) {
            System.out.println("Illegal argument: " + i.getMessage());
            throw new SQLException(i.getMessage());
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (stmt != null) {
                stmt.close();
            }
        }
        return new SignalGroupList(list.sort());
    }

    @Override
    public void removeSignalGroup(final int groupId) throws SQLException {
        final Statement stmt = conn.createStatement();
        final String query = "DELETE FROM signals WHERE group_id = " + groupId;

        if (debug) {
            System.out.println("Removing signal group " + groupId + " from db");
        }

        try {
            int rowsAffected = stmt.executeUpdate(query);
            if (rowsAffected > 0) {
                System.out.println("Signal group with groupID " + groupId + " removed successfully.");
            } else {
                System.out.println("No signals found with groupID " + groupId);
            }
        } catch (SQLException e) {
            System.out.println("Error executing query: " + e.getMessage());
            throw e;
        } finally {
            stmt.close();
        }
    }

    /**
     * Closes the database connection.
     * This method should be called to release resources when done with the
     * database.
     */
    @Override
    public void close() {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                System.out.println("Error closing connection: " + e.getMessage());
            } finally {
                conn = null;
            }
        }
        System.out.println("Connection closed.");
    }

    @Override
    public DbStatus getDbStatus() throws SQLException {
        final String query = "SELECT list_changed, conf_changed FROM " + CONFIG_TABLE_NAME + " WHERE id = " + CONFIG_ID;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            stmt = conn.createStatement();
            rs = stmt.executeQuery(query);

            if (rs.next()) {
                LocalDateTime listChanged = rs.getObject("list_changed", LocalDateTime.class);
                LocalDateTime confChanged = rs.getObject("conf_changed", LocalDateTime.class);
                return new DbStatus(confChanged, listChanged, debug);
            }
        } catch (SQLException e) {
            System.out.println("Error executing query: " + e.getMessage());
            throw e;
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (stmt != null) {
                stmt.close();
            }
        }
        throw new SQLException("'config' table empty, this should not happen so something is wrong!!");
    }

    @Override
    public Config getConfig() throws SQLException {
        final String query = "SELECT * FROM " + CONFIG_TABLE_NAME + " WHERE id = " + CONFIG_ID;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            stmt = conn.createStatement();
            rs = stmt.executeQuery(query);

            if (rs.next()) {
                LocalDateTime listChanged = rs.getObject("list_changed", LocalDateTime.class);
                LocalDateTime confChanged = rs.getObject("conf_changed", LocalDateTime.class);
                boolean paused = rs.getBoolean("paused");
                boolean mute = rs.getBoolean("mute");
                LocalTime race_start = rs.getObject("race_start", LocalTime.class);
                LocalTime race_end = rs.getObject("race_end", LocalTime.class);
                return new Config(confChanged, listChanged, paused, mute, race_start, race_end);
            }
        } catch (SQLException e) {
            System.out.println("Error executing query: " + e.getMessage());
            throw e;
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (stmt != null) {
                stmt.close();
            }
        }
        throw new SQLException("'config' table empty, this should not happen so something is wrong!!");
    }

}
