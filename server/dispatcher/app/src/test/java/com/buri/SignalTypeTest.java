package com.buri;
import static org.junit.Assert.assertTrue;
import org.junit.Test;

import com.buri.signal.SignalType;

public class SignalTypeTest {

    @Test
    public void testSignalType() {
        // Create an instance of SignalType
        SignalType s0 = SignalType.START_SIGNAL;
        SignalType s1 = SignalType.ONE_MINUTE_SIGNAL;
        SignalType s4 = SignalType.FOUR_MINUTE_SIGNAL;
        SignalType s5 = SignalType.FIVE_MINUTE_SIGNAL;

        // Check if the type is set correctly
        assertTrue(s0.value() == 0);
        assertTrue(s1.value() == 1);
        assertTrue(s4.value() == 4);
        assertTrue(s5.value() == 5);
    }
}
