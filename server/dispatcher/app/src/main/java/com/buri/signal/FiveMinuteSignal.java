package com.buri.signal;

import java.time.Duration;
import java.time.LocalDateTime;

import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class FiveMinuteSignal extends Signal {

    private boolean aborted;

    public FiveMinuteSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
        aborted = false;
    }

    public synchronized void execute() throws HwException, InterruptedException {
        
    }

    public synchronized void abort() {
        System.out.println("Aborting yellow flag task");
        aborted = true;
        this.notify();
    }

}
