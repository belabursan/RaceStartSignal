package com.buri.signal;

/**
 * Enum representing different types of signals.
* The types are:
    START: Represents the start signal
    RACE_5: Represents a group of 4 signals:
        5 minute signal when class flag goes up
        4 minute signal when P-flag goes up
        1 minute signal when P-flag goes down
        0 minute signal (start signal) when class flag goes down
    RaCE_5Y: Represents a group of 5 signals:
        15 minute yellow flag goes up
        5 minute signal when class flag goes up, yellow flag goes down
        4 minute signal when P-flag goes up
        1 minute signal when P-flag goes down
        0 minute signal (start signal) when class flag goes down
 */
public enum SignalType {
    START,
    RACE_5,
    RACE_5Y;

    public static SignalType fromString(String type) {
        switch (type) {
            case "START":
                return START;
            case "RACE_5":
                return RACE_5;
            case "RACE_5Y":
                return RACE_5Y;
            default:
                throw new IllegalArgumentException("Unknown signal type: " + type);
        }
    }
}
