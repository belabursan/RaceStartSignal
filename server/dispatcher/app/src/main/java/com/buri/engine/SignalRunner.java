package com.buri.engine;

import java.time.LocalTime;

import com.buri.config.Config;
import com.buri.signal.SignalList;

public final class SignalRunner extends Thread {
    private boolean alive;
    private boolean mute;
    private boolean paused;
    private LocalTime minRaceStartTime;
    private LocalTime maxRaceEndTime;
    private SignalList signalList;

    public SignalRunner(SignalList signalList, Config config) {
        this.alive = false;
        this.signalList = signalList;
        setConfig(config);
    }

    private void setConfig(Config config) {
        this.mute = config.isMute();
        this.paused = config.isPaused();
        this.minRaceStartTime = config.getRaceStart();
        this.maxRaceEndTime = config.getRaceEnd();
    }

    @Override
    public void run() {
        alive = true;
        try {
            while (alive) {
                Thread.sleep(1000);
            }
        } catch (InterruptedException ix) {
            System.out.println("Signal runner Interrupted");
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
