package com.buri.signal;

public class FourMinuteSignal extends Signal {

    public FourMinuteSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public void execute() {
        
    }

}
