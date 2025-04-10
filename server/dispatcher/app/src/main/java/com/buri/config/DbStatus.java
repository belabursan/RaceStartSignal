package com.buri.config;

import java.time.LocalDateTime;

public class DbStatus {
    private final LocalDateTime configTime;
    private final LocalDateTime listTime;

    public DbStatus(LocalDateTime confTime, LocalDateTime listTime) {
        this.configTime = confTime;
        this.listTime = listTime;
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

}
