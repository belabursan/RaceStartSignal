package com.buri.hw;

import com.pi4j.Pi4J;
import com.pi4j.boardinfo.util.BoardInfoHelper;
import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalOutput;
import com.pi4j.util.Console;

final class HwHandler implements Hw {

    private Context pi4j = null;
    private final Console console;
    private DigitalOutput pinClassFlag;
    private DigitalOutput pinP_Flag;
    private DigitalOutput pinYellowFlag;
    private DigitalOutput pinHorn;
    private Object HornLock;

    /**
     * Constructor
     */
    public HwHandler() {
        this.HornLock = new Object();
        this.console = new Console();
        this.pi4j = Pi4J.newAutoContext();
        System.out.println("Using: " + PiSettings.values());
        System.out.println("Hw created");
    }

    /**
     * Initializes the hardware
     * 
     * @throws HwException
     */
    void init() throws HwException {
        // init gpios
        this.pinClassFlag = pi4j.digitalOutput().create(PiSettings.GPIO_CLASS_FLAG);
        this.pinP_Flag = pi4j.digitalOutput().create(PiSettings.GPIO_P_FLAG);
        this.pinYellowFlag = pi4j.digitalOutput().create(PiSettings.GPIO_YELLOW);
        this.pinHorn = pi4j.digitalOutput().create(PiSettings.GPIO_HORN);
        reset();

        // print some info
        console.println("Board model: " + pi4j.boardInfo().getBoardModel().getLabel());
        console.println("Operating system: " + pi4j.boardInfo().getOperatingSystem());
        console.println("Java versions: " + pi4j.boardInfo().getJavaInfo());
        // This info is also available directly from the BoardInfoHelper,
        // and with some additional realtime data.
        console.println("Board model: " + BoardInfoHelper.current().getBoardModel().getLabel());
        console.println("Raspberry Pi model with RP1 chip (Raspberry Pi 5): " + BoardInfoHelper.usesRP1());
        console.println("OS is 64-bit: " + BoardInfoHelper.is64bit());
        console.println("JVM memory used (MB): " + BoardInfoHelper.getJvmMemory().getUsedInMb());
        console.println("Board temperature (°C): " + BoardInfoHelper.getBoardReading().getTemperatureInCelsius());
        System.out.println("Hw inited");
    }

    /****************** */

    private void reset() throws HwException {
        try {
            synchronized (HornLock) {
                HornLock.notify();
            }
            pinClassFlag.low();
            pinP_Flag.low();
            pinYellowFlag.low();
            pinHorn.low();
        } catch (Exception e) {
            System.out.println("Exception when reset hw: " + e.getMessage());
            throw new HwException(e.getMessage());
        }
    }

    /******        P U B L I C     I N T E R F A C E ************************* */

    @Override
    public void resetState() throws HwException {
        reset();
    }

    @Override
    public void hornOn(int milliseconds) throws HwException, InterruptedException {
        synchronized (HornLock) {
            if (milliseconds > 0) {
                System.out.println("horn on");
                this.pinHorn.high();
                HornLock.wait(milliseconds);
            }
            System.out.println("horn off");
            this.pinHorn.low();
        }
    }
    

    @Override
    public void hwClassFlagOn() throws HwException {
        System.out.println("classfag on");
        pinClassFlag.high();
    }

    @Override
    public void hwClassFlagOff() throws HwException {
        System.out.println("classflag off");
        pinClassFlag.low();
    }

    @Override
    public void hwPFlagOn() throws HwException {
        System.out.println("p-flag on");
        pinP_Flag.high();
    }

    @Override
    public void hwPFlagOff() throws HwException {
        System.out.println("p-flag off");
        pinP_Flag.low();
    }

    @Override
    public void hwYellowFlagOn() throws HwException {
        System.out.println("yellow ON");
        this.pinYellowFlag.high();
    }

    @Override
    public void hwYellowFlagOff() throws HwException {
        System.out.println("yellow OFF");
        this.pinYellowFlag.low();
    }

    @Override
    public void close() {
        try {
            reset();
        } catch (HwException e) {
            // do nothing, closing anyway
        }
        console.goodbye();
        if (pi4j != null) {
            pi4j.shutdown();
        }

    }

}
