package com.buri;

/**
 * The {@code Arguments} class is responsible for reading and storing
 * configuration values from environment variables. These values include
 * database connection details, as well as debug and development mode flags.
 * <p>
 * The class provides getter methods to access the stored configuration values.
 * </p>
 * <ul>
 *   <li>{@code mysql_db} - The name of the MySQL database.</li>
 *   <li>{@code mysql_user} - The username for the MySQL database.</li>
 *   <li>{@code mysql_pass} - The password for the MySQL database.</li>
 *   <li>{@code mysql_host} - The host address of the MySQL database.</li>
 *   <li>{@code debug} - A flag indicating whether debug mode is enabled.</li>
 *   <li>{@code develop} - A flag indicating whether development mode is enabled.</li>
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
    private boolean debug;
    private boolean develop;

    /**
     * Reads the environment variables.
     * @return this instance of Arguments with the read values.
     * @throws Exception if an error occurs while reading the environment variables.
     */
    final Arguments readArguments() {
        try {
            this.mysql_db = System.getenv("MYSQL_DATABASE");
            this.mysql_user = System.getenv("MYSQL_USER");
            this.mysql_pass = System.getenv("MYSQL_PASSWORD");
            this.mysql_host = System.getenv("MYSQL_HOST");
            this.debug = Boolean.parseBoolean(System.getenv("DEBUG"));
            this.develop = Boolean.parseBoolean(System.getenv("DEVELOP"));
            return this;
        } catch (Exception e) {
            System.out.println("Error reading environment variables: " + e.getMessage());
            throw e;
        }
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

    /**
     * Returns a string representation of the Arguments object.
     */
    @Override
    public String toString() {
        return "Arguments {" +
                "\n mysql_db='" + mysql_db + '\'' +
                ",\n mysql_user='" + mysql_user + '\'' +
                ",\n mysql_pass='" + mysql_pass + '\'' +
                ",\n mysql_host='" + mysql_host + '\'' +
                ",\n debug=" + debug +
                ",\n develop=" + develop +
                "\n}\n";
    }
}
