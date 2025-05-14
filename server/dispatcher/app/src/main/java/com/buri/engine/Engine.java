package com.buri.engine;

import java.sql.SQLException;
import java.time.LocalDateTime;

import com.buri.Arguments;
import com.buri.config.DbStatus;
import com.buri.db.Db;
import com.buri.db.DbFactory;
import com.buri.db.DbSignal;
import com.buri.hw.HwException;
import com.buri.signal.SignalR5;
import com.buri.signal.SignalR5Y;
import com.buri.signal.SignalS;

public final class Engine {

    private static final int DB_CHECK_FREQUENCY = 500; // milliseconds
    private boolean alive;

    private SignalRunner signalRunner;
    private final Arguments arguments;
    private DbStatus currentDbStatus;

    public Engine(Arguments arguments) throws SQLException {
        this.arguments = arguments;
        this.alive = false;
        currentDbStatus = new DbStatus(LocalDateTime.now(), LocalDateTime.now(), arguments.isDebug());
    }

    public void execute() throws SQLException, InterruptedException {
        try {
            this.alive = true;
            while (alive) {
                Db db = DbFactory.getDb();
                DbStatus newStatus = db.getDbStatus();
                if (currentDbStatus.isDbChanged(newStatus)) {
                    System.out.println("DB is changed");
                    currentDbStatus.update(newStatus);
                }
                DbSignal dbs = db.getSignal();
                LocalDateTime now = LocalDateTime.now();
                if (dbs.isValid(now)) {
                    if(dbs.isTimeToExecute(now)) {
                        switch (dbs.getType()) {
                            case START:
                                new SignalS(dbs, arguments).execute();
                                break;
                            case RACE_5:
                                new SignalR5(dbs, arguments).execute();
                                break;
                            case RACE_5Y:
                                new SignalR5Y(dbs, arguments).execute();
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
            if (signalRunner != null) {
                signalRunner.close();
            }
        }
        System.out.println("Engine run out");
    }

    private boolean validateDbSignalTime(DbSignal dbs) {

        return false;
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
