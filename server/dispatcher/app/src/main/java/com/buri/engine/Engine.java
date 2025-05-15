package com.buri.engine;

import java.sql.SQLException;
import java.time.LocalDateTime;

import com.buri.Arguments;
import com.buri.config.Config;
import com.buri.config.DbStatus;
import com.buri.db.Db;
import com.buri.db.DbFactory;
import com.buri.db.DbSignal;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;
import com.buri.signal.SignalR5;
import com.buri.signal.SignalR5Y;
import com.buri.signal.SignalS;

public final class Engine {

    private static final int DB_CHECK_FREQUENCY = 500; // milliseconds
    private final Arguments arguments;
    private DbStatus currentDbStatus;
    private boolean alive;
    private Config config;

    public Engine(Arguments arguments) throws SQLException {
        this.arguments = arguments;
        this.alive = false;
        this.config = null;
        currentDbStatus = new DbStatus(LocalDateTime.now(), LocalDateTime.now(), arguments.isDebug());
    }

    public void execute() throws SQLException, InterruptedException {
        try {
            Db db = DbFactory.getDb();
            config = db.getConfig();
            this.alive = true;
            System.out.println("Engine started");

            while (alive) {
                DbStatus newStatus = db.getDbStatus();
                if (currentDbStatus.isDbChanged(newStatus)) {
                    System.out.println("DB is changed");
                    currentDbStatus.update(newStatus);
                    config = db.getConfig();
                }
                DbSignal dbs = db.getSignal();
                long duration = dbs.getDurationMs();
                if (duration >= 0) { // should we use -100 so a slightly negative value is also ok?
                    if (duration < 1000) {
                        switch (dbs.getType()) {
                            case START:
                                new SignalS(dbs, arguments, config).execute();
                                break;
                            case RACE_5:
                                new SignalR5(dbs, arguments, config).execute();
                                break;
                            case RACE_5Y:
                                new SignalR5Y(dbs, arguments, config).execute();
                                break;
                            default:
                                System.out.println("WARNING: Unknown signal type: " + dbs.getType());
                        }
                        db.removeSignal(dbs.getId());
                        System.out.println("Signal(" + dbs.getDate().toString() + "), handled");
                    } else {
                        System.out.println("Signal(" + dbs.getDate().toString() + "), not yet time to execute");
                        Thread.sleep(DB_CHECK_FREQUENCY);
                    }
                } else {
                    System.out.println("Old signal(" + dbs.getDate().toString() + "), removing it");
                    db.removeSignal(dbs.getId());
                }
            }
        } catch (HwException h) {
            System.out.println("Hw exception when resetiing state in engine: " + h.getMessage());
        } catch (InterruptedException i) {
            System.out.println("Engine interrupted");
        } catch (SQLException s) {
            System.out.println("SQL exception in engine: " + s.getMessage());
            System.out.println("Should we restart the app?");
            // System.exit(-9); ??
            System.exit(-9);
        } finally {
            try {
                HwFactory.getHw().resetState(); // just to be sure...
            } catch (HwException h) {
                System.out.println("Hw exception when resetiing state in engine: " + h.getMessage());
            }

        }
        System.out.println("Engine run out");
    }

    /**
     * Closes the engine
     */
    public void close() {
        alive = false;
        System.out.println("Engine closed");
    }

}
