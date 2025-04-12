package com.buri.signal;

public class FourMinuteSignal extends Signal {
    private boolean aborted;

    public FourMinuteSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
        aborted = false;
    }

    public void execute() {
        
    }

    public synchronized void abort() {
        System.out.println("Aborting Four minute signal");
        aborted = true;
        this.notify();
    }


}
