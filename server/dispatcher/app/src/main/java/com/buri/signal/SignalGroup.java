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

    public int getGroupId() {
        return groupId;
    }

    public void setSignal(Signal signal) throws IllegalArgumentException{
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
        System.out.println("Executing " + this.toString());
        if (yellowSignal != null) {
            yellowSignal.signal(config);
        }
        if (fiveMinuteSignal != null) {
            fiveMinuteSignal.signal(config);
            fourMinuteSignal.signal(config);
            oneMinuteSignal.signal(config);
        }
        startSignal.signal(config);
        return groupId;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("SignalGroup ").append(groupId).append(": {");
        if (this.startSignal != null) {
            sb.append("\n  ").append(this.startSignal.toString());
        }
        if (this.oneMinuteSignal != null) {
            sb.append("\n  ").append(this.oneMinuteSignal.toString());
        }
        if (this.fourMinuteSignal != null) {
            sb.append("\n  ").append(this.fourMinuteSignal.toString());
        }
        if (this.fiveMinuteSignal != null) {
            sb.append("\n  ").append(this.fiveMinuteSignal.toString());
        }
        if (this.yellowSignal != null) {
            sb.append("\n  ").append(this.yellowSignal.toString());
        }
        sb.append("\n}");
        sb.trimToSize();
        return sb.toString();
    }

    public void abort() {
        if (yellowSignal != null) {
            yellowSignal.abort();
        }
        if (fiveMinuteSignal != null) {
            fiveMinuteSignal.abort();
        }
        if (fourMinuteSignal != null) {
            fourMinuteSignal.abort();
        }
        if (oneMinuteSignal != null) {
            oneMinuteSignal.abort();
        }
        if (oneMinuteSignal != null) {
            startSignal.abort();
        }
    }

}
