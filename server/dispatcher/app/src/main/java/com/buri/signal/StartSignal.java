package com.buri.signal;

public class StartSignal extends Signal {

    public StartSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public void execute() {
        
    }

}
