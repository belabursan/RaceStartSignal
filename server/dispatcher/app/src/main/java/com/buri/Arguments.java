package com.buri;

/**
 * The {@code Arguments} class is responsible for reading and storing
 * configuration values from environment variables. These values include
 * database connection details, as well as debug and development mode flags.
 * <p>
 * The class provides getter methods to access the stored configuration values.
 * </p>
 * <ul>
 * <li>{@code mysql_db} - The name of the MySQL database.</li>
 * <li>{@code mysql_user} - The username for the MySQL database.</li>
 * <li>{@code mysql_pass} - The password for the MySQL database.</li>
 * <li>{@code mysql_host} - The host address of the MySQL database.</li>
 * <li>{@code debug} - A flag indicating whether debug mode is enabled.</li>
 * <li>{@code develop} - A flag indicating whether development mode is
 * enabled.</li>
 * </ul>
 * <p>
 * The {@code readArguments} method initializes these values by reading
 * environment variables. If an error occurs during this process, it is
 * logged to the console.
 * </p>
 */
public final class Arguments {

    private String mysql_db;
    private String mysql_user;
    private String mysql_pass;
    private String mysql_host;
    private long short_signal_ms;
    private long long_signal_ms;
    private boolean debug;
    private boolean develop;
    private int yellow_signal_time_m;

    /**
     * Reads the environment variables.
     * 
     * @return this instance of Arguments with the read values.
     * @throws IllegalArgumentException if an error occurs while reading the environment variables.
     */
    final Arguments readArguments() throws IllegalArgumentException {
        try {
            this.mysql_db = System.getenv("MYSQL_DATABASE");
            this.mysql_user = System.getenv("MYSQL_USER");
            this.mysql_pass = System.getenv("MYSQL_PASSWORD");
            this.mysql_host = System.getenv("MYSQL_HOST");
            this.debug = Boolean.parseBoolean(System.getenv("DEBUG"));
            this.develop = Boolean.parseBoolean(System.getenv("DEVELOP"));
            try {
                this.short_signal_ms = Long.parseLong(System.getenv("SHORT_SIGNAL_MS"));
            } catch (Exception e) {
                System.out.println("No short signal defined, setting default: " + 1200);
                this.short_signal_ms = 1200;
            }
            try {
                this.long_signal_ms = Long.parseLong(System.getenv("LONG_SIGNAL_MS"));
            } catch (Exception e) {
                System.out.println("No long signal defined, setting default: " + 2600);
                this.long_signal_ms = 2600;
            }
            try {
                this.yellow_signal_time_m = Integer.parseInt(System.getenv("YELLOW_SIGNAL_M"));
            } catch (Exception e) {
                System.out.println("No yellow signal defined, setting default: " + 15);
                this.short_signal_ms = 15;
            }
            return this.validate();
        } catch (Exception e) {
            System.out.println("Error reading environment variables: " + e.getMessage());
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    /**
     * Validates the required environment variables.
     * 
     * @return this instance of Arguments if all required variables are set.
     * @throws IllegalArgumentException if any required variable is not set.
     */
    public Arguments validate() throws IllegalArgumentException {
        if (mysql_db == null || mysql_db.isEmpty()) {
            throw new IllegalArgumentException("MYSQL_DATABASE is not set");
        }
        if (mysql_user == null || mysql_user.isEmpty()) {
            throw new IllegalArgumentException("MYSQL_USER is not set");
        }
        if (mysql_pass == null || mysql_pass.isEmpty()) {
            throw new IllegalArgumentException("MYSQL_PASSWORD is not set");
        }
        if (mysql_host == null || mysql_host.isEmpty()) {
            throw new IllegalArgumentException("MYSQL_HOST is not set");
        }
        return this;
    }

    // Getter for short signal
    public long getShortSignal() {
        return short_signal_ms;
    }

    // Getter for long signal
    public long getLongSignal() {
        return long_signal_ms;
    }

    // Getter for mysql_db
    public String getMysqlDb() {
        return mysql_db;
    }

    // Getter for mysql_user
    public String getMysqlUser() {
        return mysql_user;
    }

    // Getter for mysql_pass
    public String getMysqlPass() {
        return mysql_pass;
    }

    // Getter for mysql_host
    public String getMysqlHost() {
        return mysql_host;
    }

    // Getter for debug
    public boolean isDebug() {
        return debug;
    }

    // Getter for develop
    public boolean isDevelop() {
        return develop;
    }

    public int getYellowSignalTimeM() {
        return yellow_signal_time_m;
    }

    /**
     * Returns a string representation of the Arguments object.
     */
    @Override
    public String toString() {
        return "Arguments {" +
                "\n mysql_db='" + mysql_db + '\'' +
                ",\n mysql_user='" + mysql_user + '\'' +
                ",\n mysql_pass='" + (develop ? mysql_pass : "******") + '\'' +
                ",\n mysql_host='" + mysql_host + '\'' +
                ",\n debug=" + debug +
                ",\n develop=" + develop +
                ",\n short signal=" + short_signal_ms +
                ",\n long signal=" + long_signal_ms +
                ",\n yellow signal=" + yellow_signal_time_m +
                "\n}\n";
    }
}
