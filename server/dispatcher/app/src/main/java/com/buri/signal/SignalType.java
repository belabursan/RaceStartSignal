package com.buri.signal;

/**
 * Enum representing different types of signals.
 * Each signal type has an associated integer value.
 */
public enum SignalType {
    
    START_SIGNAL(0),
    ONE_MINUTE_SIGNAL(1),
    FOUR_MINUTE_SIGNAL(4),
    FIVE_MINUTE_SIGNAL(5);

    private final int value;

    /**
     * Constructor for SignalType enum.
     * @param value the integer value associated with the signal type
     * @throws IllegalArgumentException if the value is not valid
     */
    SignalType(int value) {
        if(value == 0 || value == 1 || value == 4 || value == 5) {
            this.value = value;
        } else {
            throw new IllegalArgumentException("Invalid signal type value: " + value);
        }
    }

    /**
     * Get the value of the signal type.
     * @return the value of the signal type
     */
    public int value() {
        return value;
    }
}
