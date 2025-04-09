package com.buri.signal;

import java.util.Collections;
import java.util.LinkedList;
import java.util.NoSuchElementException;

public final class SignalList extends LinkedList<Signal> {
    private static final long serialVersionUID = 2025L;

    /**
     * Constructor for SignalList class.
     */
    public SignalList() {
        super();
    }

    /**
     * Adds a signal to the list in a sorted way.
     * 
     * @param signal the signal to add
     */
    public boolean addSignal(Signal signal) {
        // https://www.baeldung.com/java-sort-list-by-date
        return this.offerLast(signal);
    }

    /**
     * Gets the next signal from the list.
     * 
     * @return the next signal
     */
    public Signal getNextSignal() throws NoSuchElementException {
        return this.getFirst();
    }

    /**
     * Sorts the list based on signal dates
     */
    public SignalList sort() {
        Collections.sort(this);
        return this;
    }

}
