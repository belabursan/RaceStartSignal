package com.buri.signal;

public class StartSignal extends Signal {
    private boolean aborted;

    public StartSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
        aborted = false;
    }

    public void execute() {
        
    }

    public synchronized void abort() {
        System.out.println("Aborting Five minute signal");
        aborted = true;
        this.notify();
    }


}
