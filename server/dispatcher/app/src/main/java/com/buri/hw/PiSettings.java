package com.buri.hw;

/**
 * Raspberry Pi settings for model 3 B+
 */
public final class PiSettings {
    // Class flag  - goes up at 5 min - short toot
    //              -goes down at start - short toot
    protected static final int GPIO_CLASS_FLAG = 6;

    // P-flag (Blue Peter)  - goes up at 4 min - short toot
    //                      - goes down at 1 min - long toot
    protected static final int GPIO_P_FLAG = 13;

    // Yellow flag (optional)   - goes up 15 min before start - indicates that race is to be started soon
    //                          - goes down 5 min before start, when classflag goes up
    protected static final int GPIO_YELLOW = 19;

    // Horn gpio - on starts the horn, off shuts it down
    protected static final int GPIO_HORN = 26;

    // TOOT length in milliseconds
    public static final int TOOT_LENGTH_SHORT_MS = 500;
    public static final int TOOT_LENGTH_LONG_MS = 1600;


    
    public static String values() {
        StringBuilder sb = new StringBuilder();
        sb.append("PiSettings: {\n");
            sb.append("  - ").append("GPIO_CLASS_FLAG").append(" = ").append(GPIO_CLASS_FLAG).append("\n");
            sb.append("  - ").append("GPIO_P_FLAG").append("     = ").append(GPIO_P_FLAG).append("\n");
            sb.append("  - ").append("GPIO_YELLOW").append("     = ").append(GPIO_YELLOW).append("\n");
            sb.append("  - ").append("GPIO_HORN").append("       = ").append(GPIO_HORN).append("\n");
            sb.append("  - ").append("TOOT_LENGTH_SHORT_MS").append(" = ").append(TOOT_LENGTH_SHORT_MS).append("\n");
            sb.append("  - ").append("TOOT_LENGTH_LONG_MS").append("  = ").append(TOOT_LENGTH_LONG_MS).append("\n");
        sb.append("}\n");
        return sb.toString();
    }
}
