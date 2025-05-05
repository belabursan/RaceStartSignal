package com.buri.signal;

import com.buri.config.Config;
import com.buri.hw.Hw;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class StartSignal extends Signal {

    public StartSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public boolean signal(Config config) throws HwException, InterruptedException {
        System.out.println("--> Executing START SIGNAL");
        Hw hw = HwFactory.getHw();
        if (countDown(config)) {
            hw.hwClassFlagOff();
            if(!config.isMute()) {
                hw.hornOn(config.shortSignal());
            }
            return true;
        }
        return false;
    }

}
