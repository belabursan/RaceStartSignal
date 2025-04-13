package com.buri.signal;

import com.buri.config.Config;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class FiveMinuteSignal extends Signal {

    public FiveMinuteSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public void signal(Config config) throws HwException, InterruptedException {
        System.out.println("Executing five minute signal...");
        if (countDown(config)) {
            HwFactory.getHw().fiveMinuteOn(config.isMute());
        }
        HwFactory.getHw().yellowOff();
    }

}
