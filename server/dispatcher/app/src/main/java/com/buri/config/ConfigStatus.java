package com.buri.config;

import java.time.LocalDateTime;

public class ConfigStatus {
    private final LocalDateTime configChanged;
    private final LocalDateTime listChanged;

    public ConfigStatus(LocalDateTime confChanged, LocalDateTime listChanged) {
        this.configChanged = confChanged;
        this.listChanged = listChanged;
    }

    public boolean isConfigChanged(ConfigStatus status) {
        return this.configChanged.compareTo(status.getConfigDateTime()) != 0;
    }

    public boolean isListChanged(ConfigStatus status) {
        return this.listChanged.compareTo(status.getListDateTime()) != 0;
    }

    public boolean isDbChanged(ConfigStatus status) {
        return isConfigChanged(status) || isListChanged(status);
    }

    public LocalDateTime getConfigDateTime() {
        return this.configChanged;
    }

    public LocalDateTime getListDateTime() {
        return this.listChanged;
    }

}
