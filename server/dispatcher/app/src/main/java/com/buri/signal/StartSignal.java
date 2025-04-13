package com.buri.signal;

import com.buri.config.Config;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class StartSignal extends Signal {

    public StartSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public void signal(Config config) throws HwException, InterruptedException {
        System.out.println("Executing START SIGNAL");
        if (countDown(config)) {
            HwFactory.getHw().fiveMinuteOff(config.isMute());
        }
    }

}
