package com.buri.signal;

import com.buri.Arguments;
import com.buri.config.Config;
import com.buri.db.DbSignal;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

/**
 * This class represents a start signal in the system. No one minute signal, no
 * yellow signal...
 */
public class SignalS extends Signal {

    /**
     * Constructor for SignalS class.
     * 
     * @param dbs the DbSignal object representing the signal
     */
    public SignalS(DbSignal dbs, Arguments args, Config config) {
        super(dbs, args, config);
    }

    /**
     * Executes the start signal.
     * 
     * @return true if the signal was executd successfully, false otherwise
     * @throws InterruptedException if execution is interrupted
     * @throws HwException          in case of hardware error
     */
    protected boolean executeStartSignal() throws InterruptedException, HwException {
        if (isAllowed()) {
            if (countDown(this.dbSignal.getDate())) {
                HwFactory.getHw().hwClassFlagOff();
                hornOn(args.getShortSignal());
                return true;
            }
        }
        return false;
    }

    @Override
    public void execute() throws InterruptedException, HwException {
        try {
            executeStartSignal();
        } catch (InterruptedException e) {
            System.out.println("SignalS execution interrupted");
            resetHw();
            throw e;
        }
        
    }

}
