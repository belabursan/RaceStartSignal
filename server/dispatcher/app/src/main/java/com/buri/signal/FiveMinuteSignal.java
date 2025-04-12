package com.buri.signal;

import java.time.Duration;
import java.time.LocalDateTime;

import com.buri.config.Config;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class FiveMinuteSignal extends Signal {

    private boolean aborted;

    public FiveMinuteSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
        aborted = false;
    }

    public synchronized void execute(Config config) throws HwException, InterruptedException {
        System.out.println("Executing five minute signal...");
        HwFactory.getHw().yellowOff();
        if (allowed(config)) {
            Duration duration = Duration.between(LocalDateTime.now(), this.getDate());
            if (duration.isNegative()) {
                System.out.println("Old Five minute signal, ignoring");
                // old signal, ignore
                return;
            }
            while (!aborted) {
                if (duration.isZero() || duration.isNegative()) {
                    HwFactory.getHw().fiveMinuteOn(config.isMute());
                    return;
                }
                if (duration.toMillis() > 3000) {
                    System.out.println("It seems that I have to wait a while...");
                    this.wait(duration.minusSeconds(3).toMillis()); // wait until 3 seconds befor signal
                } else {
                    this.wait(500);
                }
                duration = Duration.between(LocalDateTime.now(), this.getDate());
            }
        }
    }

    public synchronized void abort() {
        System.out.println("Aborting Five minute signal");
        aborted = true;
        this.notify();
    }

}
