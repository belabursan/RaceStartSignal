package com.buri.signal;

import com.buri.config.Config;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class FourMinuteSignal extends Signal {

    public FourMinuteSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public void signal(Config config) throws HwException, InterruptedException {
        System.out.println("Executing four minute signal...");
        if (countDown(config)) {
            HwFactory.getHw().fourMinutesOn(config.isMute());
        }
    }

}
