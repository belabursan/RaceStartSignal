package com.buri.signal;

public class OneMinuteSignal extends Signal {

    public OneMinuteSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public void execute() {
        
    }

}
