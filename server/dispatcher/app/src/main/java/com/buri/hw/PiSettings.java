package com.buri.hw;

/**
 * Raspberry Pi settings for model 3 B+
 */
public final class PiSettings {
    // Class flag  - goes up at 5 min - short toot
    //              -goes down at start - short toot
    protected static final int GPIO_CLASS_FLAG = 14;

    // P-flag (Blue Peter)  - goes up at 4 min - short toot
    //                      - goes down at 1 min - long toot
    protected static final int GPIO_P_FLAG = 15;

    // Yellow flag (optional)   - goes up 15 min before start - indicates that race is to be started soon
    //                          - goes down 5 min before start, when classflag goes up
    protected static final int GPIO_YELLOW = 23;

    // Horn gpio - on starts the horn, off shuts it down
    protected static final int GPIO_HORN = 24;

    
    public static String values() {
        StringBuilder sb = new StringBuilder();
        sb.append("PiSettings: {\n");
            sb.append("  - ").append("GPIO_CLASS_FLAG").append(" = ").append(GPIO_CLASS_FLAG).append("\n");
            sb.append("  - ").append("GPIO_P_FLAG").append("     = ").append(GPIO_P_FLAG).append("\n");
            sb.append("  - ").append("GPIO_YELLOW").append("     = ").append(GPIO_YELLOW).append("\n");
            sb.append("  - ").append("GPIO_HORN").append("       = ").append(GPIO_HORN).append("\n");
        sb.append("}\n");
        return sb.toString();
    }
}
