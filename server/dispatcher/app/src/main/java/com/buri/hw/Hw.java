package com.buri.hw;

public interface Hw {

    /**
     * Resets the states of all gpios to initial state
     * 
     * @throws HwException in case of problem with hw
     */
    public void resetState() throws HwException;

    /**
     * Closes the hardware
     */
    public void close();

    /**
     * Setts the horn on
     * 
     * @param milliseconds number of milliseconds the horn is on
     * @throws HwException          in case of hw error
     * @throws InterruptedException if exec is interrupted
     */
    public void hornOn(long milliseconds) throws HwException, InterruptedException;

    /**
     * Sets the pin steering the classflag relay on
     * 
     * @throws HwException in case of hw error
     */
    public void hwClassFlagOn() throws HwException;

    /**
     * Sets the pin steering the classflag relay off
     * 
     * @throws HwException in case of hw error
     */
    public void hwClassFlagOff() throws HwException;

    /**
     * Sets the pin steering the p-flag relay on
     * 
     * @throws HwException in case of hw error
     */
    public void hwPFlagOn() throws HwException;

    /**
     * Sets the pin steering the p-flag relay off
     * 
     * @throws HwException in case of hw error
     */
    public void hwPFlagOff() throws HwException;

    /**
     * Turns on the yellow signal light
     * 
     * @throws HwException in case of hw error
     */
    public void hwYellowFlagOn() throws HwException;

    /**
     * Turns off the yellow signal light
     * 
     * @throws HwException
     */
    public void hwYellowFlagOff() throws HwException;
}
