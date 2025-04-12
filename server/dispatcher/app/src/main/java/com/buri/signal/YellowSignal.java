package com.buri.signal;

import java.time.LocalDateTime;
import java.time.Duration;

import com.buri.config.Config;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class YellowSignal extends Signal {
    private boolean aborted;

    public YellowSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
        aborted = false;
    }

    public synchronized void execute(Config config) throws HwException, InterruptedException {
        System.out.println("Executing yellow flag...");
        if (allowed(config)) {
            Duration duration = Duration.between(LocalDateTime.now(), this.getDate());
            if (duration.isNegative()) {
                System.out.println("Old Yellof flag signal, ignoring");
                // old yellow, ignore
                return;
            }
            while (!aborted) {
                if (duration.isZero() || duration.isNegative()) {
                    HwFactory.getHw().yellowOn();
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
        } else {
            System.out.println("Outside allowed time, ignoring yellow flag");
        }
    }

    public synchronized void abort() {
        aborted = true;
        this.notify();
    }

}
