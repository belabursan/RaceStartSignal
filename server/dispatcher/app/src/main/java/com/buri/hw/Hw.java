package com.buri.hw;

public interface Hw {

    /**
     * Setts the horn on
     * @param seconds number of seconds the horn is on
     * @throws HwException in case of hw error
     */
    public void hornOn(int seconds) throws HwException;

    /**
     * Turns on the start signal light and honks for 2 seconds
     * @param mute false if the horn shall be turned on, true otherwise
     * @throws HwException in case of hw error
     */
    public void startSignalOn(boolean mute) throws HwException;

    /**
     * Turns off the start signal light
     * @param mute false if the horn shall be turned on, true otherwise
     * @throws HwException
     */
    public void startSignalOff(boolean mute) throws HwException;

    /**
     * Turns on the one minute signal light and honks for 1 seconds
     * @param mute false if the horn shall be turned on, true otherwise
     * @throws HwException in case of hw error
     */
    public void oneMinutesOn(boolean mute) throws HwException;

    /**
     * Turns off the one minute signal light
     * @param mute false if the horn shall be turned on, true otherwise
     * @throws HwException
     */
    public void oneMinutesOff(boolean mute) throws HwException;

    /**
     * Turns on the four minute signal light and honks for 1 seconds
     * @param mute false if the horn shall be turned on, true otherwise
     * @throws HwException in case of hw error
     */
    public void fourMinutesOn(boolean mute) throws HwException;

    /**
     * Turns off the four minute signal light
     * @param mute false if the horn shall be turned on, true otherwise
     * @throws HwException
     */
    public void fourMinutesOff(boolean mute) throws HwException;

    /**
     * Turns on the five minute signal light and honks for 1 seconds
     * @param mute false if the horn shall be turned on, true otherwise
     * @throws HwException in case of hw error
     */
    public void fiveMinuteOn(boolean mute) throws HwException;

    /**
     * Turns off the five minute signal light
     * @param mute false if the horn shall be turned on, true otherwise
     * @throws HwException
     */
    public void fiveMinuteOff(boolean mute) throws HwException;

    /**
     * Turns on the yellow signal light
     * @throws HwException in case of hw error
     */
    public void yellowOn() throws HwException;

    /**
     * Turns off the yellow signal light
     * @throws HwException
     */
    public void yellowOff() throws HwException;
}
