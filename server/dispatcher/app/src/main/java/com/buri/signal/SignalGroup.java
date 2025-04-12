package com.buri.signal;

import com.buri.config.Config;
import com.buri.hw.HwException;

/**
 * Represents a signal group including the start, one- four- five minute and
 * yellow signals
 */
public final class SignalGroup {

    private int groupId;
    private StartSignal startSignal;
    private OneMinuteSignal oneMinuteSignal;
    private FourMinuteSignal fourMinuteSignal;
    private FiveMinuteSignal fiveMinuteSignal;
    private YellowSignal yellowSignal;

    /**
     * Constructor
     */
    public SignalGroup(int group_id) {
        this.startSignal = null;
        this.oneMinuteSignal = null;
        this.fourMinuteSignal = null;
        this.fiveMinuteSignal = null;
        this.yellowSignal = null;
        this.groupId = group_id;
    }

    public void setSignal(Signal signal) {
        if (signal.getGroupId() != this.groupId) {
            throw new IllegalArgumentException("Bad group id: " + signal.getGroupId());
        }
        switch (signal.getType()) {
            case START_SIGNAL:
                this.startSignal = new StartSignal(signal);
                break;
            case ONE_MINUTE_SIGNAL:
                this.oneMinuteSignal = new OneMinuteSignal(signal);
                break;
            case FOUR_MINUTE_SIGNAL:
                this.fourMinuteSignal = new FourMinuteSignal(signal);
                break;
            case FIVE_MINUTE_SIGNAL:
                this.fiveMinuteSignal = new FiveMinuteSignal(signal);
                break;
            case YELLOW_FLAG_SIGNAL:
                this.yellowSignal = new YellowSignal(signal);
                break;
            default:
                throw new IllegalArgumentException("Bad signal type: " + signal.getType());
        }
    }

    
    public int execute(Config config) throws HwException, InterruptedException {
        yellowSignal.execute(config);
        fiveMinuteSignal.execute(config);
        fourMinuteSignal.execute(config);
        oneMinuteSignal.execute(config);
        startSignal.execute(config);
        return groupId;
    }

}
