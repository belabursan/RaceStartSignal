# SailRaceSignal

Software for running a signal "machine".
Docker based, runs on a raspberry 4B, needs 4 relays

## Dockers

- Database: holds the signals
- Dispatcher: reads the datatbase for signals and steers the relays
- LAMP: web interface, used to set the signals
- Node: backend for web, writes the signals to the database
- PhpMyAdmin: used under development - manipulates the database
- Dozzle: used under development - shows logs from the dockers

## Commands

Run from RaceSignal/server directory

- docker compose up
- docker compose down
- docker system prune --all
