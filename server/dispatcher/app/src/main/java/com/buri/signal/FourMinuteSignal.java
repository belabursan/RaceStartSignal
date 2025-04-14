package com.buri.signal;

import com.buri.config.Config;
import com.buri.hw.Hw;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;
import com.buri.hw.PiSettings;

public class FourMinuteSignal extends Signal {

    public FourMinuteSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
    }

    public void signal(Config config) throws HwException, InterruptedException {
        System.out.println("Executing FOUR MINUTE SIGNAL");
        Hw hw = HwFactory.getHw();
        if (countDown(config)) {
            hw.hwPFlagOn();
            if(!config.isMute()) {
                hw.hornOn(PiSettings.TOOT_LENGTH_SHORT_MS);
            }
        }
    }

}
