package com.buri.engine;

import java.sql.SQLException;

import com.buri.config.Config;
import com.buri.config.DbStatus;
import com.buri.db.Db;
import com.buri.db.DbFactory;
import com.buri.signal.SignalGroupList;

public final class Engine {

    private static final int DB_CHECK_FREQUENCY = 5000; // milliseconds
    private boolean alive;
    private Db db;
    private DbStatus dbStatus;
    private SignalGroupList signalGroupList;
    private SignalRunner signalRunner;
    private Config config;

    public Engine() throws SQLException {
        alive = false;
        db = DbFactory.getDb();
        config = db.getConfig();
        dbStatus = db.getDbStatus();
    }

    public void execute() throws SQLException, InterruptedException {
        signalGroupList = db.getSignalList();
        signalRunner = new SignalRunner(signalGroupList, config);
        signalRunner.start();
        try {
            this.alive = true;
            while (alive) {
                DbStatus newStatus = db.getDbStatus();
                if (dbStatus.isDbChanged(newStatus)) {
                    System.out.println("DB is changed");
                    if (dbStatus.isListChanged(newStatus)) {
                        System.out.println("List is changed");
                        if (dbStatus.isConfigChanged(newStatus)) {
                            System.out.println("Also config");
                            // if both config and list is changed get new config
                            this.config = db.getConfig();
                        }
                        // close runner and start new with the new list
                        signalGroupList = db.getSignalList();
                        signalRunner.close();
                        signalRunner.join();
                        signalRunner = null;
                        signalRunner = new SignalRunner(signalGroupList, config);
                        signalRunner.start();
                    } else {
                        System.out.println("Config is changed");
                        this.config = db.getConfig();
                        signalRunner.setNewConfig(this.config);
                    }
                }
                newStatus = null;
                for (int i = 0; alive && i < DB_CHECK_FREQUENCY; i += 1000) {
                    Thread.sleep(1000);
                }
            }
        } catch (InterruptedException i) {
            System.out.println("Engine interrupted");
            if (signalRunner != null) {
                signalRunner.close();
            }
        }
        System.out.println("Engine run out");
    }

    /**
     * Closes the engine
     */
    public void close() {
        alive = false;
        if (signalRunner != null) {
            signalRunner.close();
            try {
                signalRunner.join();
            } catch (InterruptedException e) {
                System.out.println("Interrupted when joining signal runner");
            }
            signalRunner = null;
        }
        System.out.println("Engine closed");
    }

}
