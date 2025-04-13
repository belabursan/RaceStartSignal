package com.buri.signal;

import java.time.Duration;
import java.time.LocalDateTime;

import com.buri.config.Config;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class FiveMinuteSignal extends Signal {

    private boolean aborted;
    private Object SYNC = new Object();

    public FiveMinuteSignal(Signal signal) {
        super(signal.getId(), signal.getGroupId(), signal.getDate(), signal.getType());
        aborted = false;
    }

    public void execute(Config config) throws HwException, InterruptedException {
        System.out.println("Executing five minute signal...");
        HwFactory.getHw().yellowOff();
        if (allowed(config)) {
            LocalDateTime now = LocalDateTime.now();
            System.out.println("-----Loacaldatetime: " + this.getDate());
            System.out.println("-----Now:            " + now);
            Duration duration = Duration.between(now, this.getDate());
            System.out.println("Dur0("+duration+"): " + duration.toMillis());

            if (duration.isNegative()) {
                System.out.println("Old Five minute signal, ignoring");
                // old signal, ignore
                return;
            }
            while (!aborted) {
                synchronized (SYNC) {
                    if (duration.isZero() || duration.isNegative()) {
                        HwFactory.getHw().fiveMinuteOn(config.isMute());
                        return;
                    }
                    long dur1 = duration.toMillis();
                    System.out.println("Dur1: " + dur1);
                    if (duration.toMillis() > 3000) {
                        long dur2 = duration.minusSeconds(3).toMillis();
                        System.out.println("It seems that I have to wait a while..." + dur2);
                        SYNC.wait(dur2); // wait until 3 seconds befor signal
                    } else {
                        SYNC.wait(500);
                    }
                    duration = Duration.between(LocalDateTime.now(), this.getDate());
                }
            }
        } else {
            System.out.println("Not allowed, time is out of range");
        }
    }

    public void abort() {
        System.out.println("Aborting Five minute signal");
        aborted = true;
        synchronized (SYNC) {
            this.notify();
        }
    }

}
