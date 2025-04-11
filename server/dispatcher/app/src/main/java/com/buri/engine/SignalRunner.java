package com.buri.engine;

import java.sql.SQLException;

import com.buri.config.Config;
import com.buri.db.DbFactory;
import com.buri.hw.HwException;
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
        setConfig(config);
    }

    private void setConfig(Config config) {
        this.config = config;
    }

    @Override
    public void run() {
        alive = true;
        try {
            while (alive) {
                if(signalGroupList.isEmpty()) {
                    //just run out
                    alive = false;
                    return;
                }
                SignalGroup group = signalGroupList.removeNextGroup();
                DbFactory.getDb().removeSignalGroup(group.execute(config));

                Thread.sleep(1000);
            }
        } catch (SQLException sx) {
            System.out.println("Something is wrong with the DB, should we restart the app?");
            // System.exit(-9);
        } catch (InterruptedException ix) {
            System.out.println("Signal runner Interrupted");
        } catch (HwException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public void close() {
        alive = false;
        if (!this.isInterrupted()) {
            this.interrupt();
        }
    }

    public void setNewConfig(Config config) {
        setConfig(config);
    }

}
