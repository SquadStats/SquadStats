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

| 🌍 Language | 🧠 Completion & Badge | 🧑‍💻 Contributor(s) | 📄 File |
|-------------|------------------------|---------------------|---------|
| 🌐 English (Base) — `en` | <span style='color:limegreen'>[##########] 100.0% ✅</span> ![en](https://img.shields.io/badge/En-100%25-brightgreen?style=flat&labelColor=555) | SquadStats Team / [@Tobydeteckel](https://github.com/Tobydeteckel) | [`en.json`](https://github.com/SquadStats/SquadStatsBotTranslations/blob/beta/locales/en.json) |
| 🇩🇪 German — `de` | <span style='color:gray'>[----------] 1.6%</span> ![de](https://img.shields.io/badge/De-1%25-lightgrey?style=flat&labelColor=555) | _Open for contributors!_ | [`de.json`](https://github.com/SquadStats/SquadStatsBotTranslations/blob/beta/locales/de.json) |
| 🇪🇸 Spanish — `es` | <span style='color:gray'>[----------] 0.0%</span> ![es](https://img.shields.io/badge/Es-0%25-lightgrey?style=flat&labelColor=555) | _Open for contributors!_ | [`es.json`](https://github.com/SquadStats/SquadStatsBotTranslations/blob/beta/locales/es.json) |
| 🇫🇷 French — `fr` | <span style='color:gray'>[----------] 0.0%</span> ![fr](https://img.shields.io/badge/Fr-0%25-lightgrey?style=flat&labelColor=555) | _Open for contributors!_ | [`fr.json`](https://github.com/SquadStats/SquadStatsBotTranslations/blob/beta/locales/fr.json) |
| 🇵🇹 Portuguese — `pt` | <span style='color:gray'>[----------] 0.0%</span> ![pt](https://img.shields.io/badge/Pt-0%25-lightgrey?style=flat&labelColor=555) | _Open for contributors!_ | [`pt.json`](https://github.com/SquadStats/SquadStatsBotTranslations/blob/beta/locales/pt.json) |

 💡 Want to help translate? See the [instructions below](#how-to-contribute-translations).
##

<div align="left">

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
_**Explanation of values:**_
- ```plugin```: _The name of the plugin._
- ```enabled```: _This will enable (true) or disable (false) the plugin._
- ```api_key```: _Your Private API key_
- ```debugSuccessMessages```: _This will enable (true) or disable (false) the logging of succesfull events in the squadJS console._
- ```autoUpdate```: _This will enable (true) or disable (false) the automatic updates of the plugin._

## 🌍 Translations — Help Localize SquadStats!

SquadStats supports multiple languages to bring the experience to players around the world. Each translation is stored in a simple, easy-to-edit `.json` file — no coding required!

## 🌐 Supported Languages

Here are the languages currently available in SquadStats, including translation progress, badges, and contributor credits.

| 🌍 Language | 🧠 Completion & Badge | 🧑‍💻 Contributor(s) | 📄 File |
|-------------|------------------------|---------------------|---------|
| 🌐 English (Base) — `en` | <span style='color:limegreen'>[##########] 100.0% ✅</span> ![en](https://img.shields.io/badge/En-100%25-brightgreen?style=flat&labelColor=555) | SquadStats Team / [@Tobydeteckel](https://github.com/Tobydeteckel) | [`en.json`](https://github.com/SquadStats/SquadStatsBotTranslations/blob/beta/locales/en.json) |
| 🇩🇪 German — `de` | <span style='color:gray'>[----------] 1.6%</span> ![de](https://img.shields.io/badge/De-1%25-lightgrey?style=flat&labelColor=555) | _Open for contributors!_ | [`de.json`](https://github.com/SquadStats/SquadStatsBotTranslations/blob/beta/locales/de.json) |
| 🇪🇸 Spanish — `es` | <span style='color:gray'>[----------] 0.0%</span> ![es](https://img.shields.io/badge/Es-0%25-lightgrey?style=flat&labelColor=555) | _Open for contributors!_ | [`es.json`](https://github.com/SquadStats/SquadStatsBotTranslations/blob/beta/locales/es.json) |
| 🇫🇷 French — `fr` | <span style='color:gray'>[----------] 0.0%</span> ![fr](https://img.shields.io/badge/Fr-0%25-lightgrey?style=flat&labelColor=555) | _Open for contributors!_ | [`fr.json`](https://github.com/SquadStats/SquadStatsBotTranslations/blob/beta/locales/fr.json) |
| 🇵🇹 Portuguese — `pt` | <span style='color:gray'>[----------] 0.0%</span> ![pt](https://img.shields.io/badge/Pt-0%25-lightgrey?style=flat&labelColor=555) | _Open for contributors!_ | [`pt.json`](https://github.com/SquadStats/SquadStatsBotTranslations/blob/beta/locales/pt.json) |

> 💡 Want to help translate? See the [instructions above](#-how-to-contribute-translations).

---

### 🧭 Legend
- Progress bars are updated regularly 🔄
- Click contributor names to visit their GitHub profile
- Want your name listed? [Contribute a translation!](https://github.com/SquadStats/SquadStatsBotTranslations/pulls)

### 🧩 How Translations Work

All language files are located in the [`locales/`](https://github.com/SquadStats/SquadStatsBotTranslations/tree/beta/locales) folder. Each file (e.g. `fr.json`, `de.json`) follows this format:

```json
{
  "category": {
    "1": {
      "default": "English text here",
      "translated": "Translated text here"
    }
  }
}
```

- `default`: the English source string (do **not** edit this)
- `translated`: your translation goes here ✍️

---

## How to Contribute Translations

Whether you're translating a single string or an entire language — thank you! There are two easy ways to contribute:

### ✅ Option 1: Use GitHub’s Web Editor (No Fork Needed)

1. Go to the [`beta` branch](https://github.com/SquadStats/SquadStatsBotTranslations/tree/beta)
2. Open the [`locales/`](https://github.com/SquadStats/SquadStatsBotTranslations/tree/beta/locales) folder
3. Click the language file you want to update (e.g. `fr.json`)
4. Click the ✏️ **Edit this file** button
5. Only change the `"translated"` values
6. Scroll down, write a short commit message like `Update French translation`
7. Choose **"Create a new branch for this commit and start a pull request"**
8. Click **"Propose changes"**

That’s it! We’ll review and merge your translation 🚀

---

### 🛠️ Option 2: Fork and Edit (Advanced)

1. Fork this repository
2. Edit or translate files in the `locales/` folder
3. Push your changes and open a Pull Request to the `beta` branch

---

## 🌐 Want to Add a New Language?

We’d love to support it!

- Open an [issue](https://github.com/SquadStats/SquadStatsBotTranslations/issues)
- Or contact us via Discord
- We’ll generate a clean translation file for you to start

---

🎖️ Contributors will be credited in the README and changelog.  
📢 Let’s bring SquadStats to more people — one language at a time!



## Links
- Website: https://squadstats.nl
- Status: https://status.squadstats.nl
- Discord: https://squadstats.nl/discord
- Support: https://squadstats.nl/support

### _Other Squad Projects_
_There are many other projects that support server admins in managing their squad server and playerstats. For a list of cool projects for [SquadJS](https://github.com/Team-Silver-Sphere/SquadJS) and [Squad](https://www.joinsquad.com/) itself, please refer to ["Other SQUAD Projects"](https://squadstats.nl/other-squad-projects/). SquadStats is not affiliated with these projects. Nor with [Offworld Industries Ltd (OWI)](https://www.offworldindustries.com/). The projects are displayed because we appreciate what these projects mean and do for the Squad community._
