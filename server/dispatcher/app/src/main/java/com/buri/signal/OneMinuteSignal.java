package com.buri.signal;

import com.buri.config.Config;
import com.buri.hw.Hw;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class OneMinuteSignal extends Signal {

    public OneMinuteSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public boolean signal(Config config) throws HwException, InterruptedException {
        System.out.println("--> Executing ONE MINUTE SIGNAL");
        Hw hw = HwFactory.getHw();
        if (countDown(config)) {
            hw.hwPFlagOff();
            if(!config.isMute()) {
                hw.hornOn(config.longSignal());
            }
            return true;
        }
        return false;
    }

}
