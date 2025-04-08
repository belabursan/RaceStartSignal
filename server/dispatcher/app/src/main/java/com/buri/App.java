package com.buri;

import com.buri.DB.Db;
import com.buri.DB.DbFactory;
import com.buri.signal.Signal;

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

            Signal s = db.getNextSignal();
            System.out.println(s.toString());
            
            int x=0;
            while(true) {
                System.out.println( "Hello Signal: " + x++ );
                Thread.sleep(10000);
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
