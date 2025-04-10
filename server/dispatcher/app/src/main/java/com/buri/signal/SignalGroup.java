package com.buri.signal;

/**
 * Represents a signal group including the start, one- four- five minute and
 * yellow signals
 */
public final class SignalGroup {

    private int groupId;
    private Signal startSignal;
    private Signal oneMinuteSignal;
    private Signal fourMinuteSignal;
    private Signal fiveMinuteSignal;
    private Signal yellowSignal;

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
                this.startSignal = signal;
                break;
            case ONE_MINUTE_SIGNAL:
                this.oneMinuteSignal = signal;
                break;
            case FOUR_MINUTE_SIGNAL:
                this.fourMinuteSignal = signal;
                break;
            case FIVE_MINUTE_SIGNAL:
                this.fiveMinuteSignal = signal;
                break;
            case YELLOW_FLAG_SIGNAL:
                this.yellowSignal = signal;
                break;
            default:
                throw new IllegalArgumentException("Bad signal type: " + signal.getType());
        }
    }

    /**
     * Gets the group ID.
     *
     * @return the group ID
     */
    public int getGroupId() {
        return groupId;
    }

    /**
     * Gets the start signal.
     *
     * @return the start signal
     */
    public Signal getStartSignal() {
        return startSignal;
    }

    /**
     * Gets the one-minute signal.
     *
     * @return the one-minute signal
     */
    public Signal getOneMinuteSignal() {
        return oneMinuteSignal;
    }

    /**
     * Gets the four-minute signal.
     *
     * @return the four-minute signal
     */
    public Signal getFourMinuteSignal() {
        return fourMinuteSignal;
    }

    /**
     * Gets the five-minute signal.
     *
     * @return the five-minute signal
     */
    public Signal getFiveMinuteSignal() {
        return fiveMinuteSignal;
    }

    /**
     * Gets the yellow signal.
     *
     * @return the yellow signal
     */
    public Signal getYellowSignal() {
        return yellowSignal;
    }

    
    public void execute() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'execute'");
    }

}
