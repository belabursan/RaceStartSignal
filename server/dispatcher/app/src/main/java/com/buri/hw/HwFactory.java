package com.buri.hw;

public final class HwFactory {
    private static HwHandler hw = null;
    private static boolean develop;
    private static boolean debug;

    private HwFactory() {
        // disable creation of objects
    }

    /**
     * Inits the hw
     * 
     * @throws HwException in case of hw error
     */
    public static void init(boolean debug, boolean develop) throws HwException {
        HwFactory.debug = debug;
        HwFactory.develop = develop;
        HwFactory.getHw();
    }

    /**
     * Rteurns a hardware interface
     * 
     * @return Returns the only instance of the hw interface
     * @throws HwException in case of initing the hw interface goes wrong
     */
    public static Hw getHw() throws HwException {
        if (HwFactory.hw == null) {
            HwFactory.hw = new HwHandler(HwFactory.develop, HwFactory.debug);
            HwFactory.hw.init();
        }
        return (Hw) HwFactory.hw;
    }

    /**
     * Closes the hw handler
     */
    public static void close() {
        if (HwFactory.hw != null) {
            HwFactory.hw.close();
        }
        HwFactory.hw = null;
        System.out.println("HwFactory closed.");
    }
}
