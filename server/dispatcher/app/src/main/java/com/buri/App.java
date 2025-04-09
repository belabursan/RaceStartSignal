package com.buri;

import com.buri.config.Config;
import com.buri.config.ConfigStatus;
import com.buri.db.Db;
import com.buri.db.DbFactory;
import com.buri.signal.SignalList;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args )
    {
        try {
            Arguments arguments = new Arguments().readArguments();
            System.out.println(arguments.toString());
            DbFactory.init(arguments);
            Db db = DbFactory.getDb();

            Config config = db.getConfig();
            System.out.println(config.toString());
            ConfigStatus status = db.getDbStatus();
            SignalList list = null;

            while(true) {
                ConfigStatus statusTmp = db.getDbStatus();
                if(list == null) {
                    list = db.getSignalList();
                    System.out.println("List size: " + list.size());
                }

                if(status.isDbChanged(statusTmp)) {
                    System.out.println("Db status changed!!!");
                    if(status.isListChanged(statusTmp)) {
                        // handle list change
                        //  1 abort signaling thread
                        list = db.getSignalList();
                        System.out.println("New list size: " + list.size());
                        //start signaling with the new list
                    } else {
                        config = db.getConfig();
                        //handle mute and paus
                    }
                    status = statusTmp;
                    statusTmp = null;
                } else {
                    System.out.println("No change in db, sleeping...");
                    Thread.sleep(5000);
                }
            }
        } catch (InterruptedException e) {
            System.out.println("Thread interrupted: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            DbFactory.reset();
        }
        System.out.println( "Goodbye Signal!" );
        System.exit(0);
    }
}
