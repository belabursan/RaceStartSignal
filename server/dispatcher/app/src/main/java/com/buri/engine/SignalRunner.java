package com.buri.engine;

import java.sql.SQLException;

import com.buri.config.Config;
import com.buri.db.DbFactory;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;
import com.buri.signal.SignalGroup;
import com.buri.signal.SignalGroupList;

/**
 * 
 */
public final class SignalRunner extends Thread {
    private boolean alive;
    private Config config;
    private SignalGroupList signalGroupList;

    public SignalRunner(SignalGroupList signalGroupList, Config config) {
        this.alive = false;
        this.signalGroupList = signalGroupList;
        this.config = config;
    }

    @Override
    public void run() {
        alive = true;
        SignalGroup group = null;
        try {
            while (alive) {
                if (signalGroupList.isEmpty()) {
                    // just run out
                    System.out.println("No signals to handle...");
                    alive = false;
                    return;
                }
                group = signalGroupList.removeNextGroup();

                if (group != null) {
                    int gid = group.getGroupId();
                    try {
                        group.execute(config);
                    } catch (NullPointerException e) {
                        System.out.println("Null pointer exception when executing group " + gid);
                        System.out.println("Bad group?");
                    } finally {
                        group.abort();
                    }

                    DbFactory.getDb().removeSignalGroup(gid);
                    HwFactory.getHw().resetState(); // just to be sure...
                }
                group = null;

                Thread.sleep(1000);
            }
        } catch (SQLException sx) {
            System.out.println("Something is wrong with the DB, should we restart the app?");
            // System.exit(-9); ??
        } catch (InterruptedException ix) {
            System.out.println("Signal runner Interrupted");
        } catch (HwException e) {
            System.out.println("HW exception in signal runner: " + e.getMessage());
        } finally {
            System.out.println("Signal runner ended");
            // add abort?
            try {
                HwFactory.getHw().resetState();
            } catch (HwException e) {
                System.out.println("HW is strange");
            } // just to be sure...
        }
    }

    public void close() {
        alive = false;
        if (!this.isInterrupted()) {
            this.interrupt();
        }
    }

}
