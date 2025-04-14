package com.buri.hw;

/**
 * Thrown in case of hardware error
 */
public class HwException extends Exception {

    /**
     * Constructor
     */
    public HwException() {
        super();
    }

    /**
     * Constructor
     * 
     * @param message message to set
     */
    public HwException(String message) {
        super(message);
    }
}
