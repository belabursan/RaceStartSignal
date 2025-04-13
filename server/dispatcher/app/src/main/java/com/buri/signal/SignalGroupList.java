package com.buri.signal;

import java.util.LinkedList;
import java.util.NoSuchElementException;

public class SignalGroupList extends LinkedList<SignalGroup> {

    public SignalGroupList(SignalList signalList) {
        while (!signalList.isEmpty()) {
            populate(signalList);
        }
    }

    private void populate(SignalList signalList) {
        SignalGroup group = null;
        try {
            Signal signal = signalList.removeNextSignal();
            int groupid = signal.getGroupId();
            group = new SignalGroup(groupid);
            group.setSignal(signal);
            while (true) {
                if (signalList.getNextGroupId() == groupid) {
                    group.setSignal(signalList.removeNextSignal());
                } else {
                    break;
                }
            }
        } catch (NoSuchElementException e) {
            // list is empty, just return
        }
        if (group != null) {
            this.addLast(group);
        }
    }

    public SignalGroup removeNextGroup() {
        return this.removeFirst();
    }
}
