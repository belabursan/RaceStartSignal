package com.buri.config;

import java.time.LocalDateTime;

public class DbStatus {
    private LocalDateTime configTime;
    private LocalDateTime listTime;
    private final boolean debug;

    public DbStatus(LocalDateTime confTime, LocalDateTime listTime, boolean debug) {
        this.configTime = confTime;
        this.listTime = listTime;
        this.debug = debug;
    }

    public boolean isConfigChanged(DbStatus status) {
        return this.configTime.compareTo(status.getConfigDateTime()) != 0;
    }

    public boolean isListChanged(DbStatus status) {
        return this.listTime.compareTo(status.getListDateTime()) != 0;
    }

    public boolean isDbChanged(DbStatus status) {
        return isConfigChanged(status) || isListChanged(status);
    }

    public LocalDateTime getConfigDateTime() {
        return this.configTime;
    }

    public LocalDateTime getListDateTime() {
        return this.listTime;
    }

    @Override
    public String toString() {
        return "DbStatus {" +
                "configTime=" + configTime +
                ", listTime=" + listTime +
                " }";
    }

    public void update(DbStatus newStatus) {
        if (debug) {
            System.out.println("Updating Db status");
        }
        this.configTime = newStatus.getConfigDateTime();
        this.listTime = newStatus.getListDateTime();
    }

}
