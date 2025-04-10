package com.buri;

import com.buri.config.ConfigStatus;
import com.buri.db.DbFactory;

public final class Engine {

    public void execute() {
        /* 
        try {

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
                        System.out.println(list.toString());
                        System.out.println("----");
                        System.out.println(list.getFirst().toString());
                        //start signaling with the new list
                    } else {
                        config = db.getConfig();
                        //handle mute and paus
                    }
                    status = statusTmp;
                    statusTmp = null;
                } else {
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
        */
    }

    public void close() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'close'");
    }

}
