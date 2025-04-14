package com.buri.hw;

public interface Hw {



    /**
     * Resets the states of all gpios to initial state
     * @throws HwException in case of problem with hw
     */
    public void resetState() throws HwException;

    /**
     * Closes the hardware
     */
    public void close();

    /**
     * Setts the horn on
     * @param milliseconds number of milliseconds the horn is on
     * @throws HwException in case of hw error
     * @throws InterruptedException if exec is interrupted
     */
    public void hornOn(int milliseconds) throws HwException, InterruptedException;

    

    public void hwClassFlagOn() throws HwException;


    public void hwClassFlagOff() throws HwException;

    
    public void hwPFlagOn() throws HwException;

    
    public void hwPFlagOff() throws HwException;


    /**
     * Turns on the yellow signal light
     * @throws HwException in case of hw error
     */
    public void hwYellowFlagOn() throws HwException;

    /**
     * Turns off the yellow signal light
     * @throws HwException
     */
    public void hwYellowFlagOff() throws HwException;
}
