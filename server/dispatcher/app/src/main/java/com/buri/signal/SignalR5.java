package com.buri.signal;

import java.time.LocalDateTime;

import com.buri.Arguments;
import com.buri.config.Config;
import com.buri.db.DbSignal;
import com.buri.hw.Hw;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class SignalR5 extends SignalS {

    protected final LocalDateTime fiveMinSig;
    protected final LocalDateTime fourMinSig;
    protected final LocalDateTime oneMinSig;

    /**
     * Constructor for SignalR5 class.
     * 
     * @param dbs the DbSignal object representing the signal
     */
    public SignalR5(DbSignal dbs, Arguments args, Config config) {
        super(dbs, args, config);
        this.fiveMinSig = dbs.getDate().minusMinutes(5);
        this.fourMinSig = dbs.getDate().minusMinutes(4);
        this.oneMinSig = dbs.getDate().minusMinutes(1);
    }

    protected boolean executePreStartSignals() throws InterruptedException, HwException {
        System.out.println("Executing PreStart signals: " + fiveMinSig + ", " + fourMinSig + ", " + oneMinSig);
        if (isAllowed()) {
            Hw hw = HwFactory.getHw();
            if (countDown(fiveMinSig)) {
                hw.hwYellowFlagOff();
                hw.hwClassFlagOn();
                hornOn(args.getShortSignal());
                if (countDown(fourMinSig)) {
                    hw.hwPFlagOn();
                    hornOn(args.getShortSignal());
                    if (countDown(oneMinSig)) {
                        hw.hwPFlagOff();
                        hornOn(args.getLongSignal());
                        return true;
                    }
                }
            }
        }
        // something went wrong here, shut down every flag
        // todo
        return false;
    }

    @Override
    public void execute() throws InterruptedException, HwException {
        try {
            if (executePreStartSignals()) {
                executeStartSignal();
                return;
            }
            System.out.println("SignalR5 execution failed");
            resetHw();
        } catch (InterruptedException e) {
            System.out.println("SignalR5 execution interrupted");
            resetHw();
            throw e;
        }
    }

}
