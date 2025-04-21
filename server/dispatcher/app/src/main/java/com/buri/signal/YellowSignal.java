package com.buri.signal;

import com.buri.config.Config;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class YellowSignal extends Signal {

    public YellowSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public synchronized boolean signal(Config config) throws HwException, InterruptedException {
        if(countDown(config)) {
            HwFactory.getHw().hwYellowFlagOn();
            return true;
        }
        return false;
    }

}
