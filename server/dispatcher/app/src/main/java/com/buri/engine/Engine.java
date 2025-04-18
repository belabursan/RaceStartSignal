package com.buri.engine;

import java.sql.SQLException;

import com.buri.Arguments;
import com.buri.config.Config;
import com.buri.config.DbStatus;
import com.buri.db.Db;
import com.buri.db.DbFactory;
import com.buri.signal.SignalGroupList;

public final class Engine {

    private static final int DB_CHECK_FREQUENCY = 5000; // milliseconds
    private boolean alive;
    private Db db;
    private SignalRunner signalRunner;
    private final Arguments arguments;

    public Engine(Arguments arguments) throws SQLException {
        this.arguments = arguments;
        alive = false;
        db = DbFactory.getDb();
    }

    public void execute() throws SQLException, InterruptedException {
        try {
            this.alive = true;
            DbStatus currentDbStatus = null;

            while (alive) {
                DbStatus newStatus = db.getDbStatus();
                if (currentDbStatus == null || currentDbStatus.isDbChanged(newStatus)) {
                    System.out.println("DB is changed");
                    currentDbStatus = newStatus;

                    // close runner and start new with the new list
                    if (signalRunner != null) {
                        System.out.println("Finishing old signalRunner");
                        signalRunner.close();
                        signalRunner.join();
                        signalRunner = null;
                    }
                    System.out.println("Reading new list from Db");
                    SignalGroupList signalGroupList = db.getSignalList();
                    System.out.println("Got new list with size " + signalGroupList.size());
                    if (!signalGroupList.isEmpty()) {
                        Config config = db.getConfig();
                        config.setSignalTime(arguments.getShortSignal(), arguments.getLongSignal());
                        signalRunner = new SignalRunner(signalGroupList, config);
                        signalRunner.start();
                    } else {
                        System.out.println("list is empty, not running signalRunner");
                    }
                }
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
