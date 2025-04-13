package com.buri.hw;

final class HwHandler implements Hw {
    private RaspiHw raspi;

    void init() throws HwException {
        this.raspi = new RaspiHw();
        System.out.println("SETTING HW INIT");
    }


    @Override
    public void hornOn(int seconds) throws HwException {
        System.out.println("TODO:::::SETTING HORN ON");
    }

    @Override
    public void startSignalOn(boolean mute) throws HwException {
        System.out.println("SETTING START SIG ON");
    }

    @Override
    public void startSignalOff(boolean mute) throws HwException {
        System.out.println("SETTING START SIG OFF");
    }

    @Override
    public void oneMinutesOn(boolean mute) throws HwException {
        System.out.println("SETTING 1 MIN ON");
    }

    @Override
    public void oneMinutesOff(boolean mute) throws HwException {
        System.out.println("SETTING 1 MIN OFF");
    }

    @Override
    public void fourMinutesOn(boolean mute) throws HwException {
        System.out.println("SETTING 4 MIN ON");
    }

    @Override
    public void fourMinutesOff(boolean mute) throws HwException {
        System.out.println("SETTING 4 MIN OFF");
    }

    @Override
    public void fiveMinuteOn(boolean mute) throws HwException {
        System.out.println("SETTING 5 MIN ON");
    }

    @Override
    public void fiveMinuteOff(boolean mute) throws HwException {
        System.out.println("SETTING 5 MIN OFF");
    }

    @Override
    public void yellowOn() throws HwException {
        System.out.println("SETTING YELLOW ON");
    }

    @Override
    public void yellowOff() throws HwException {
        System.out.println("SETTING YELLOW OFF");
    }

    public void close() {
        System.out.println("HX CLOSE");
    }

}
