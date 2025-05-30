<div align="center">
<img src="https://squadstats.nl/media/image/squadstatsnl.png" alt="Logo" width="500"/>
    
[![GitHub Release](https://img.shields.io/github/v/release/SquadStats/SquadStats?style=for-the-badge&label=Version&color=green)](https://github.com/SquadStats/SquadStats/releases) 
[![GitHub contributors](https://img.shields.io/github/contributors-anon/SquadStats/SquadStats?style=for-the-badge&color=blue)](https://github.com/SquadStats/SquadStats/contributors) 
[![GitHub Repo stars](https://img.shields.io/github/stars/SquadStats/SquadStats?style=for-the-badge&label=Stars&color=purple)](https://github.com/SquadStats/SquadStats/stargazers) 
[![GitHub watchers](https://img.shields.io/github/watchers/SquadStats/SquadStats?style=for-the-badge&color=brown)](https://github.com/SquadStats/SquadStats/) 
[![GitHub forks](https://img.shields.io/github/forks/SquadStats/SquadStats?style=for-the-badge&label=Forks&color=olive)](https://github.com/SquadStats/SquadStats/forks) 
[![GitHub License](https://img.shields.io/github/license/SquadStats/SquadStats?style=for-the-badge&label=License&color=orange)](https://github.com/SquadStats/SquadStats/blob/main/LICENSE) 

[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/w/SquadStats/SquadStats/main?style=flat-square&label=Commits%20Weekly)](https://github.com/SquadStats/SquadStats/commits/main/) 
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/SquadStats/SquadStats/main?style=flat-square&label=Commits%20Monthly)](https://github.com/SquadStats/SquadStats/commits/main/) 
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/y/SquadStats/SquadStats/main?style=flat-square&label=Commits%20Yearly)](https://github.com/SquadStats/SquadStats/commits/main/)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/y/SquadStats/SquadStats/main?style=flat-square&label=Commits%20Total)](https://github.com/SquadStats/SquadStats/commits/main/)

[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/SquadStats/SquadStats?label=Issues&color=red)](https://github.com/SquadStats/SquadStats/issues) 
[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-closed/SquadStats/SquadStats?label=Issues&color=green)](https://github.com/SquadStats/SquadStats/issues) 
[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-pr/SquadStats/SquadStats?label=Pull%20Requests&color=orange)](https://github.com/SquadStats/SquadStats/pulls) 
[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-pr-closed/SquadStats/SquadStats?label=Pull%20Requests&color=green)](https://github.com/SquadStats/SquadStats/pulls) 

##

<div align="left">

## About

```
KNOW ISSUE:
Currently, the first time running (installation) the plugin searches for a folder that does not yet exist.
For now, the folder needs to be created manually.

/squad-server/plugins/pluginsData/SquadStatsLogger
```


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
_**Explanation of values:**_
- ```plugin```: _The name of the plugin._
- ```enabled```: _This will enable (true) or disable (false) the plugin._
- ```api_key```: _Your Private API key_
- ```debugSuccessMessages```: _This will enable (true) or disable (false) the logging of succesfull events in the squadJS console._
- ```autoUpdate```: _This will enable (true) or disable (false) the automatic updates of the plugin._


## Links
- Website: https://squadstats.nl
- Status: https://status.squadstats.nl
- Discord: https://squadstats.nl/discord
- Support: https://squadstats.nl/support

### _Other Squad Projects_
_There are many other projects that support server admins in managing their squad server and playerstats. For a list of cool projects for [SquadJS](https://github.com/Team-Silver-Sphere/SquadJS) and [Squad](https://www.joinsquad.com/) itself, please refer to ["Other SQUAD Projects"](https://squadstats.nl/other-squad-projects/). SquadStats is not affiliated with these projects. Nor with [Offworld Industries Ltd (OWI)](https://www.offworldindustries.com/). The projects are displayed because we appreciate what these projects mean and do for the Squad community._
