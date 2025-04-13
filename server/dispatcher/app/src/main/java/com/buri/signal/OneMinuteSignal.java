package com.buri.signal;

import com.buri.config.Config;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class OneMinuteSignal extends Signal {

    public OneMinuteSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public void signal(Config config) throws HwException, InterruptedException {
        System.out.println("Executing one minute signal...");
        if (countDown(config)) {
            HwFactory.getHw().fourMinutesOff(config.isMute());
        }

    }

}
