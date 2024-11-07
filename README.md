# SquadStats
The SquadStats plugin to connect to our API

[![Version](https://img.shields.io/badge/Version-v0.0.2-green)](https://github.com/SquadStats/SquadStats/)

## About

SquadStats.nl is a specialized Discord bot for the game Squad, designed to help server admins manage various aspects of their community. The bot provides features such as player statistics, server stats, and even a medal system. 
SquadStats is by no means the only Squad Tool that focuses on player stats, but unlike some other stats tools, SquadStats is focused exclusively on data within a single clan or server, ensuring that data isn't compared across different servers or clans. 
This can help keep individual community data isolated for more specific clan-focused insights.

## Preview
- [Playerstats](https://squadstats.nl/showcase/playerstats/)
- [Serverstats](https://squadstats.nl/showcase/serverstats/)
- [Seeding Bot](https://squadstats.nl/showcase/seeding-bot/)
- [Medals](https://squadstats.nl/showcase/medals/)
- Weaponstats
- Serverstatus

## Installation
- Squadstats will send server actions/events to our database using our API. As a result, you have no difficult configuration and maintenance of databases yourself. To use SquadStats the first time, you need to place the ``squadstats-logger.js`` file in the ``../squad-server/plugins/`` folder. You also need to update the SquadJS configuration file. This is where you will need to add SquadStats as a plugin. You can find an example configuration for the plugin below and at [github.com/SquadStats/SquadStats/blob/main/config.json](https://github.com/SquadStats/SquadStats/blob/main/config.json)

- For authentication, you will need an API Key. This API key will give your server access to the SquadStats servers, this is where the data is stored. Currently, you can request an API key through our Discord at [SquadStats.nl/discord](https://discord.com/channels/1286481858611122217/1286481859143925772)


```   
    {
      "plugin": "SquadStats",
      "enabled": true,
      "api_key": "YOUR_API_KEY",
      "debugSuccessMessages": true,
      "autoUpdate": true
    }
```
#### _Explanation of values_
- ```plugin```: _The name of the plugin._
- ```enabled```: _This will enable (true) or disable (false) the plugin._
- ```api_key```: _Your Private API key_
- ```debugSuccessMessages```: _This will enable (true) or disable (false) the logging of succesfull events in the squadJS console._
- ```autoUpdate```: _This will enable (true) or disable (false) the automatic updates of the plugin._


## Links
- Website: https://squadstats.nl
- Status: https://status.squadstats.nl
- Discord: https://squadstats.nl/discord
