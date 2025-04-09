package com.buri.config;

import java.time.LocalDateTime;
import java.time.LocalTime;

public final class Config {
    private final LocalDateTime configChangeDate;
    private final LocalDateTime listChangeDate;
    private final boolean paused;
    private final boolean mute;
    private final LocalTime race_start;
    private final LocalTime race_end;

    public Config(LocalDateTime confChanged, LocalDateTime listChanged, boolean paused, boolean mute,
            LocalTime race_start,
            LocalTime race_end) {
        this.configChangeDate = confChanged;
        this.listChangeDate = listChanged;
        this.paused = paused;
        this.mute = mute;
        this.race_start = race_start;
        this.race_end = race_end;
    }

    @Override
    public String toString() {
        return "Config [configChangeDate=" + configChangeDate + ", listChangeDate=" + listChangeDate + ", paused="
                + paused + ", mute=" + mute + ", race_start=" + race_start + ", race_end=" + race_end + "]";
    }

    
    public LocalDateTime getConfigChangeDate() {
        return configChangeDate;
    }

    public LocalDateTime getListChangeDate() {
        return listChangeDate;
    }

    public boolean isPaused() {
        return paused;
    }

    public boolean isMute() {
        return mute;
    }

    public LocalTime getRaceStart() {
        return race_start;
    }

    public LocalTime getRaceEnd() {
        return race_end;
    }

}
