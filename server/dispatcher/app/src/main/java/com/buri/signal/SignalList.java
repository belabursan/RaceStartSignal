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
    public Signal removeNextSignal() throws NoSuchElementException {
        return this.removeFirst();
    }

    /**
     * Returns the group id of the next element
     * @return group id
     * @throws NoSuchElementException if list is empty
     */
    public int getNextGroupId() throws NoSuchElementException {
        return this.getFirst().getGroupId();
    }

    /**
     * Sorts the list based on signal dates
     */
    public SignalList sort() {
        Collections.sort(this);
        return this;
    }

    /**
     * Returns the string representation of this list
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("SignalList: [");
        for (Signal signal : this) {
            sb.append("\n  ");
            sb.append(signal.toString()).append(",");
        }
        if (!this.isEmpty()) {
            sb.setLength(sb.length() - 2); // Remove the trailing comma and space
        }
        sb.append("\n]");
        return sb.toString();
    }

}
