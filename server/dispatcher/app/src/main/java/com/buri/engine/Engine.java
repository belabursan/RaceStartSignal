package com.buri.engine;

import java.sql.SQLException;
import java.time.LocalDateTime;

import com.buri.Arguments;
import com.buri.config.Config;
import com.buri.config.DbStatus;
import com.buri.db.Db;
import com.buri.db.DbFactory;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public final class Engine {

    private static final int DB_CHECK_FREQUENCY = 5000; // milliseconds
    private boolean alive;
    private Db db;
    private SignalRunner signalRunner;
    private final Arguments arguments;
    private DbStatus currentDbStatus;

    public Engine(Arguments arguments) throws SQLException {
        this.arguments = arguments;
        this.alive = false;
        this.db = DbFactory.getDb();
        currentDbStatus = new DbStatus(LocalDateTime.now(), LocalDateTime.now(), arguments.isDebug());
    }

    public void execute() throws SQLException, InterruptedException {
        try {
            this.alive = true;
            while (alive) {
                DbStatus newStatus = db.getDbStatus();
                if (currentDbStatus.isDbChanged(newStatus)) {
                    System.out.println("DB is changed");
                    currentDbStatus.update(newStatus);

                    // close runner and start new with the new list
                    if (signalRunner != null) {
                        System.out.println("Finishing old signalRunner");
                        signalRunner.close();
                        signalRunner.join();
                        signalRunner = null;
                        HwFactory.getHw().resetState();
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
                        System.out.println("Signal list is empty, not running signalRunner");
                    }
                }
                for (long i = 0; alive && i < DB_CHECK_FREQUENCY; i += 1000) {
                    Thread.sleep(1000);
                }
            }
        } catch (HwException h) {
            System.out.println("Hw exception when resetiing state in engine: " + h.getMessage());
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
