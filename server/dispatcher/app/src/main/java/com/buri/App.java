package com.buri;

import java.sql.SQLException;

import com.buri.config.Config;
import com.buri.db.Db;
import com.buri.db.DbFactory;
import com.buri.engine.Engine;
import com.buri.hw.HwException;
import com.buri.hw.HwFactory;

/**
 * Race Start Signal App
 *
 */
public class App {
    private void runStartUp() throws IllegalStateException, SQLException,
            ClassNotFoundException, IllegalArgumentException, HwException {
        Arguments arguments = new Arguments().readArguments();
        System.out.println(arguments.toString());

        DbFactory.init(arguments);
        Db db = DbFactory.getDb();
        Config config = db.getConfig();
        System.out.println(config.toString());
        HwFactory.init(arguments.isDebug(), arguments.isDevelop());
    }

    void run() {
        Engine engine = null;
        try {
            runStartUp();
            System.out.println("Startup seems ok, run the engine...");
            engine = new Engine();
            engine.execute();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (HwException e) {
            e.printStackTrace();
        } catch (InterruptedException i) {
            System.out.println("Interrupted");
        } finally {
            if (engine != null) {
                engine.close();
            }
            DbFactory.close();
            HwFactory.close();
        }
    }

    public static void main(String[] args) {
        try {
            new App().run();
        } catch (Exception e) {
            // Catch everything it is possible to catch, just to see...
            e.printStackTrace();
        }
        System.out.println("Goodbye Signal!");
        System.exit(0);
    }
}
