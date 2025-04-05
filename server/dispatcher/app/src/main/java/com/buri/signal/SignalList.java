package com.buri.signal;

import java.util.LinkedList;

public final class SignalList extends LinkedList<Signal> {
    private static final long serialVersionUID = 1L;

    /**
     * Constructor for SignalList class.
     */
    public SignalList() {
        super();
    }

    /**
     * Adds a signal to the list.
     * @param signal the signal to add
     */
    public void addSignal(Signal signal) {
        this.add(signal);
    }

    /**
     * Gets the next signal from the list.
     * @return the next signal
     */
    public Signal getNextSignal() {
        return this.poll();
    }

}
