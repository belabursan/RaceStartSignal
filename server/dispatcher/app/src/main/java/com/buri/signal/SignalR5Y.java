package com.buri.signal;

import java.time.LocalDateTime;

import com.buri.Arguments;
import com.buri.config.Config;
import com.buri.db.DbSignal;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

public class SignalR5Y extends SignalR5 {

    protected final LocalDateTime yellowSig;

    /**
     * Constructor for SignalR5Y class.
     * 
     * @param dbs the DbSignal object representing the signal
     */
    public SignalR5Y(DbSignal dbs, Arguments args, Config config) {
        super(dbs, args, config);
        this.yellowSig = dbs.getDate().minusMinutes(args.getYellowSignalTimeM());
    }

    /**
     * Executes the yellow signal.
     * 
     * @return true if the signal was executed successfully, false otherwise
     * @throws InterruptedException if execution is interrupted
     * @throws HwException          in case of hardware error
     */
    private boolean executeYellowSignal() throws InterruptedException, HwException {
        System.out.println("Executing Yellow signal: " + yellowSig);
        if (isAllowed()) {
            if (countDown(yellowSig)) {
                HwFactory.getHw().hwYellowFlagOn();
                return true;
            }
        }
        return false;
    }

    @Override
    public void execute() throws InterruptedException, HwException {
        try {
            if (executeYellowSignal()) {
                if (executePreStartSignals()) {
                    executeStartSignal();
                    return;
                }
            }
            System.out.println("SignalR5Y execution failed");
            resetHw();
        } catch (InterruptedException e) {
            System.out.println("SignalR5Y execution interrupted");
            resetHw();
            throw e;
        }
    }
}
