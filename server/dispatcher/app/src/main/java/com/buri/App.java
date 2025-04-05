package com.buri;

import com.buri.DB.Db;
import com.buri.DB.DbFactory;

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
            System.out.println("Arguments: " + arguments.toString());
            DbFactory.init(arguments);
            Db db = DbFactory.getDb();
            
            int x=0;
            while(true) {
                System.out.println( "Hello Signal: " + x++ );
                Thread.sleep(10000);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /*sudo service ntp stop
sudo ntpd -gq
sudo service ntp start */
}
