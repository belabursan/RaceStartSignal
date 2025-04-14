package com.buri.signal;

import com.buri.config.Config;
import com.buri.hw.Hw;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;
import com.buri.hw.PiSettings;

public class StartSignal extends Signal {

    public StartSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public void signal(Config config) throws HwException, InterruptedException {
        System.out.println("Executing START SIGNAL");
        Hw hw = HwFactory.getHw();
        if (countDown(config)) {
            hw.hwClassFlagOff();
            if(!config.isMute()) {
                hw.hornOn(PiSettings.TOOT_LENGTH_SHORT_MS);
            }
        }
    }

}
