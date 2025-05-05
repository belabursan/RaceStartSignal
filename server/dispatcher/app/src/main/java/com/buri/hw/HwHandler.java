package com.buri.hw;

import com.pi4j.Pi4J;
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
    private final boolean debug;

    /**
     * Constructor
     */
    public HwHandler(boolean debug) {
        this.debug = debug;
        this.HornLock = new Object();
        this.console = new Console();
        this.pi4j = Pi4J.newAutoContext();
        
        System.out.println("Hw created using: " + PiSettings.values());
    }

    /**
     * Initializes the hardware
     * 
     * @throws HwException
     */
    void init() throws HwException {
        System.out.println("Initing HW");
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
        System.out.println("Hw inited");
    }

    /****************** */
    private void reset() throws HwException {
        if (debug) {
            System.out.println("resetting hw");
        }

            try {
                synchronized (HornLock) {
                    HornLock.notify();
                }
                if(pinClassFlag != null) {
                    pinClassFlag.low();
                }
                if(pinP_Flag != null) {
                    pinP_Flag.low();
                }
                if(pinYellowFlag != null) {
                    pinYellowFlag.low();
                }
                if(pinHorn != null) {
                    pinHorn.low();
                }
            } catch (Exception e) {
                System.out.println("Exception when resetting hw: " + e.getMessage());
                throw new HwException(e.getMessage());
            }
    }

    /****** P U B L I C I N T E R F A C E ************************* */

    @Override
    public void resetState() throws HwException {
        reset();
    }

    @Override
    public void hornOn(long milliseconds) throws HwException, InterruptedException {
            synchronized (HornLock) {
                if (milliseconds > 0) {
                    System.out.println("horn on: " + milliseconds);
                    this.pinHorn.high();
                    HornLock.wait(milliseconds);
                }
                System.out.println("horn off");
                this.pinHorn.low();
            }
    }

    @Override
    public void hwClassFlagOn() throws HwException {
        System.out.println("class flag on");
        if (pinClassFlag != null) {
            pinClassFlag.high();
        }
    }

    @Override
    public void hwClassFlagOff() throws HwException {
        System.out.println("class flag off");
        if (pinClassFlag != null) {
            pinClassFlag.low();
        }
    }

    @Override
    public void hwPFlagOn() throws HwException {
        System.out.println("p-flag on");
        if (pinP_Flag != null) {
            pinP_Flag.high();
        }
    }

    @Override
    public void hwPFlagOff() throws HwException {
        System.out.println("p-flag off");
        if (pinP_Flag != null) {
            pinP_Flag.low();
        }
    }

    @Override
    public void hwYellowFlagOn() throws HwException {
        System.out.println("yellow ON");
        if (pinYellowFlag != null) {
            this.pinYellowFlag.high();
        }
    }

    @Override
    public void hwYellowFlagOff() throws HwException {
        System.out.println("yellow OFF");
        if (pinYellowFlag != null) {
            this.pinYellowFlag.low();
        }
    }

    @Override
    public void close() {
        if (debug) {
            System.out.println("Closing HW...");
        }
        try {
            reset();
        } catch (HwException e) {
            // do nothing, closing anyway
        }
        if (console != null) {
            console.goodbye();
        }        
        if (pi4j != null) {
            pi4j.shutdown();
        }    
        System.out.println("HW closed");    
    }

}
