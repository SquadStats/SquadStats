//////////////////////////////////////////////////////////////////////////////////
// SquadStatsLogger       ||    By TobyDeTeckel    ||     https://SquadStats.nl //
//////////////////////////////////////////////////////////////////////////////////
//              All Rights Reserved     |     Copyright by SquadStats.nl        //
//////////////////////////////////////////////////////////////////////////////////
// Github: github.com/SquadStats/      || Discord: SquadStats.nl/discord        //
//////////////////////////////////////////////////////////////////////////////////
const currentVersion = 'v0.0.1';  // DO NOT CHANGE! Used by api and updates     //
//////////////////////////////////////////////////////////////////////////////////
import axios from 'axios';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import BasePlugin from './base-plugin.js';

export default class SquadStats extends BasePlugin {
    static get description() {
        return (
        'The SquadStats Logger plugin will log server events/actions to the SquadStats database with the help of our API.\n' +
        'More information can be found on our Discord <a href="https://squadstats.nl/discord">SquadStats.nl/Discord</a>\n' +
        'or on our website <a href="https://squadstats.nl/">SquadStats.nl</a>\n'
        );
    }

    static get defaultEnabled() {
        return false;
    }

    static get optionsSpecification() {
        return {
            api_key: {
            required: true,
            description: 'Your API key to authenticate to the SquadStats API.',
            default: 'default_API_key',
            },
            debugSuccessMessages: {
            required: false,
            description: 'Show success messages in console log',
            default: true
            },
            autoUpdate: {
            required: false,
            description: 'Automatically update the SquadStats Plugin',
            default: true
            }
        };
    }
    constructor(server, options, connectors) {
        super(server, options, connectors);

        this.onNewGame = this.onNewGame.bind(this);
        this.onRoundEnded = this.onRoundEnded.bind(this);
        this.onPlayerConnected = this.onPlayerConnected.bind(this);
        this.onPlayerWounded = this.onPlayerWounded.bind(this);
        this.onPlayerDied = this.onPlayerDied.bind(this);
        this.onPlayerRevived = this.onPlayerRevived.bind(this);
    	this.onChatCommand = this.onChatCommand.bind(this);
        this.isRetryingOldData = false;
        this.debugSuccess = this.options.debugSuccessMessages;
        this.onPlayerDisconnected = this.onPlayerDisconnected.bind(this);
    }

    async prepareToMount() {}

    async mount() {
    // Register Server at SquadStats API.
    let endPoint = 'server';
	const serverData = {
    	name: this.server.serverName,
    	version: currentVersion,
    	debug: this.debugSuccess,
    	gameVersion: this.server.gameVersion,
	};
	this.serverData = serverData
	const response = await setDataAPI(endPoint, serverData, this.options.api_key);
	if (response.successStatus === 'Success') { 
    	saveServerConfigFile({ validated: response.validated, retryPermission: response.retryPermission });
	} 
    this.verbose(1, `Register server | ${response.successStatus} | ${response.successMessage}`);

    // Get Current MatchID Info from API
    endPoint = 'match';
    const matchResponse = await getDataAPI(endPoint, this.options.api_key);
	if (matchResponse.successStatus === 'Success'&& matchResponse.match && matchResponse.match.id) {
  		this.match = matchResponse.match;
  		saveServerConfigFile({ match: { id: this.match.id } });
        if (this.debugSuccess) {
        	this.verbose(1, `Get current match info | ${matchResponse.successStatus} | ${matchResponse.successMessage}`);
        }
	} else if (matchResponse.successStatus === 'Create new match') {
    	const newMatchData = {
        	server: this.server.serverName,
        	dlc: 'Game',
        	mapClassname: this.server.currentLayer.map.name,
        	layerClassname: this.server.currentLayer.classname,
        	map: this.server.currentLayer.map.name,
        	layer: this.server.currentLayer.name,
        	startTime: new Date().toISOString()
    	};
    	const newMatchResponse = await setDataAPI(endPoint, newMatchData, this.options.api_key);
    	if (newMatchResponse.successStatus === 'Success') {
        	this.match = newMatchResponse.match;
        	saveServerConfigFile({ match: { id: this.match.id } });      
        	if (this.debugSuccess) {
            	this.verbose(1, `No match found, create new | ${newMatchResponse.successStatus} | ${newMatchResponse.successMessage}`);
        	}
    	} else {
        	this.verbose(1, `Failed to create new match | ${newMatchResponse.successStatus} | ${newMatchResponse.successMessage}`);
    	}
	}  else if (matchResponse.successStatus === 'Error') {
    	const serverConfigFile = loadServerConfigFile();
    	this.match = serverConfigFile.match;
    	this.verbose(1, `Get current match info | ${matchResponse.successStatus} | ${matchResponse.successMessage} | Using matchID ${this.match.id} (from file).`);
    } else {
    		const serverConfigFile = loadServerConfigFile();
    		this.match = serverConfigFile.match;
    		this.verbose(1, `Getting match | ${matchResponse.successStatus} | ${matchResponse.successMessage} | Using matchID ${this.match.id} (from file).`);

        }
	
	if (this.options.autoUpdate === true) {
		updateAndCleanup(currentVersion); 
    }

    this.server.on('NEW_GAME', this.onNewGame);
    this.server.on('PLAYER_CONNECTED', this.onPlayerConnected);
    this.server.on('PLAYER_DISCONNECTED', this.onPlayerDisconnected);	
    this.server.on('ROUND_ENDED', this.onRoundEnded);
    this.server.on('PLAYER_WOUNDED', this.onPlayerWounded);
    this.server.on('PLAYER_DIED', this.onPlayerDied);
    this.server.on('PLAYER_REVIVED', this.onPlayerRevived);
    this.server.on(`CHAT_COMMAND:linkstats`, this.onChatCommand);
    this.updateServerInformationInterval = setInterval(this.updateServerInformation.bind(this), 120000);
    }

    async unmount() {
        this.server.removeEventListener('NEW_GAME', this.onNewGame);
        this.server.removeEventListener('PLAYER_CONNECTED', this.onPlayerConnected);
        this.server.removeEventListener('PLAYER_DISCONNECTED', this.onPlayerDisconnected);
        this.server.removeEventListener('ROUND_ENDED', this.onRoundEnded);
        this.server.removeEventListener('PLAYER_WOUNDED', this.onPlayerWounded);
        this.server.removeEventListener('PLAYER_DIED', this.onPlayerDied);
        this.server.removeEventListener('PLAYER_REVIVED', this.onPlayerRevived);
    	this.server.removeEventListener(`CHAT_COMMAND:linkstats`, this.onChatCommand);
 	}
    
    // Update  ServerInformation
    	async updateServerInformation() {
           	let endPoint = 'serverdata';
        	const serverData = {
			...this.serverData,
            name: this.server.serverName,
        	maxPlayers: this.server.maxPlayers,
        	publicSlots: this.server.publicSlots,
        	reserveSlots: this.server.reserveSlots,
        	a2sPlayerCount: this.server.a2sPlayerCount,
        	playerCount: this.server.playerCount,
        	publicQueue: this.server.publicQueue,
        	reserveQueue: this.server.reserveQueue,
        	matchStartTime: this.server.matchStartTime,
        	map: this.server.currentLayer.classname,
            nextmap: this.server.nextLayer,
        	gamemode: this.server.currentLayer.gamemode,
        };
        this.serverData = serverData
        const serverResponse = await setDataAPI(endPoint, serverData, this.options.api_key);
		this.verbose(1, `Sending server information | ${serverResponse.successStatus} | ${serverResponse.successMessage}`)
        if (serverResponse.successStatus === 'Success') {
            saveServerConfigFile({ match: { id: this.match.id }, validated: serverResponse.validated, retryPermission: serverResponse.retryPermission });
            await this.processQueuedFiles();
        } 
    }

    // Process failed, Queued Files
    async processQueuedFiles() {
  	    const __dirname = fileURLToPath(import.meta.url);
  	    const retryDirPath = path.join(__dirname, '..', 'pluginsData', 'SquadStatsLogger');
  	    let retryFiles = [];
  	    if (fs.existsSync(retryDirPath)) {
    	    retryFiles = fs.readdirSync(retryDirPath).filter(file => file.endsWith('DataAPI.json'));
  	    }  
	    if (retryFiles.length === 0) {
  	        return;
  	    }
        if (this.isRetryingOldData) {
		   this.verbose(1, 'Already processing queued files.');
           return;
  	    }
		this.verbose(1, 'Files in queue for retry, checking connection with retryAPI for possible retry.');
        this.isRetryingOldData = true;
  	    const endPoint = 'retry';
  	    const response = await getDataAPI(endPoint, this.options.api_key);
  	    if (response.successMessage === 'ready!') {
    	    this.verbose(1, 'SquadStats retryAPI is up and running. Retry queued files started.)');

            for (const retryFile of retryFiles) {
                const retryFilePath = path.join(retryDirPath, retryFile);
                this.verbose(1, `Retrying failed ${retryFile} requests.`);
                const retryFunction = retryFile.includes('Set') ? retrySetDataAPI : retryEditDataAPI;
                const completed = await retryFailedData(retryFilePath, retryFunction, this.options.api_key
                );
                this.verbose(1, completed);
            }
        }
        this.isRetryingOldData = false;
        return;
    }
  
    // Update on round start.
    async onNewGame(info) {
        let endPoint = 'server';
        const serverData = {
			...this.serverData,
            name: this.server.serverName,
            version: currentVersion,
        	debug: this.debugSuccess,
    		gameVersion: this.server.gameVersion,
        };
        const serverResponse = await setDataAPI(endPoint, serverData, this.options.api_key);       
        if (serverResponse.api_key === 'Valid!') { 
    		saveServerConfigFile({ validated: true, retryPermission: serverResponse.retryPermission });
		} 
        this.verbose(1, `Checking database | ${serverResponse.successStatus} | ${serverResponse.successMessage}`);
  
        endPoint = 'match';
        const newMatchData = {
            server: this.server.serverName,
            dlc: info.dlc,
            mapClassname: info.mapClassname,
            layerClassname: info.layerClassname,
            map: info.layer ? info.layer.map.name : null,
            layer: info.layer ? info.layer.name : null,
            startTime: info.time,
        };

        const matchResponse = await setDataAPI(endPoint, newMatchData, this.options.api_key);
        if (matchResponse.successStatus === 'Success') {
  			this.match = matchResponse.match;
  			saveServerConfigFile({ match: { id: this.match.id } });
        	if (this.debugSuccess) {
    			this.verbose(1, `Getting match | ${matchResponse.successStatus} | ${matchResponse.successMessage}`);
            }
		} else if (matchResponse.successStatus === 'Error') {
			this.verbose(1, `New game | ${matchResponse.successStatus} | ${matchResponse.successMessage}`);
            const serverConfigFile = loadServerConfigFile();
            this.match.id = serverConfigFile.match.id + 1;
            this.verbose('Error: Used matchID from file:', this.match.id);
            saveServerConfigFile({ match: { id: this.match.id } });
		} else {
			this.verbose(1, `New game | Unknown ${matchResponse.successStatus} | ${matchResponse.successMessage}`);
            const serverConfigFile = loadServerConfigFile();
            this.match.id = serverConfigFile.match.id + 1;
            this.verbose('Error: Used matchID from file:', this.match.id);
            saveServerConfigFile({ match: { id: this.match.id } });
		}	
        return;
    }

    // Update/create Player in database.
	async sendPlayerData(playerInfo, role, ip) {
    	const endPoint = 'player';
    	const playerData = {
        	eosID: playerInfo.eosID,
        	steamID: playerInfo.steamID,
        	lastName: playerInfo.name,
            lastIP: (role === 'connected' || role === 'disconnected') ? ip : undefined,
    	};
	
    	let response;
    	if (role === 'connected') {
        	response = await setDataAPI(endPoint, playerData, this.options.api_key);
	        if (this.debugSuccess) {
            	this.verbose(1, `Player ${role} | ${response.successStatus} | ${response.successMessage}`);
            }
    	} else {
        	response = await editDataAPI(endPoint, playerData, this.options.api_key);
    	}
	}  

	async onPlayerConnected(info) {
    	await this.sendPlayerData(info.player, 'connected', info.ip);
	}
	async processPlayers(info) {
    	if (info.victim) {
        	await this.sendPlayerData(info.victim, 'victim');
    	}
    	if (info.attacker) {
        	await this.sendPlayerData(info.attacker, 'attacker');
    	}
    	if (info.reviver) {
        	await this.sendPlayerData(info.reviver, 'reviver');
    	}
	}

    // Update on Player disconnection.
	async onPlayerDisconnected(info) {
    	if (info.player && info.ip) {
        	await this.sendPlayerData(info.player, 'disconnected', info.ip);
    	} else {
        	this.verbose(1, 'Player disconnected | No information to log | Skip data update.');
    	}
	}
      
    // Update on round end.
    async onRoundEnded(info) {
        const endPoint = 'match';
        let matchData = {};
        if (!info.winner || !info.loser) {
            matchData = {
			matchID: this.match.id,
            endTime: info.time,
            winningTeamID: 0,
            winningTeam: 'Draw',
            winningSubfaction: 'Draw',
            winningTickets: 0,
            losingTeamID: 0,
            losingTeam: 'Draw',
            losingSubfaction: 'Draw',
            losingTickets: 0,
            };
        } else {
            matchData = {
			matchID: this.match.id,
            endTime: info.time,
            winningTeamID: info.winner.team,
            winningTeam: info.winner.faction,
            winningSubfaction: info.winner.subfaction,
            winningTickets: info.winner.tickets,
            losingTeamID: info.loser.team,
            losingTeam: info.loser.faction,
            losingSubfaction: info.loser.subfaction,
            losingTickets: info.loser.tickets,
            };
        }
        const response = await editDataAPI(
            endPoint,
            matchData,
            this.options.api_key
        );

		if (response.successStatus === 'Success') {
        	if (this.debugSuccess) {
    			this.verbose(1, `Round ended | ${response.successStatus} | ${response.successMessage}`);
            }
		} else if (response.successStatus === 'Error') {
    		this.verbose(1, `Round ended | ${response.successStatus} | ${response.successMessage}`);
		} else {
    		this.verbose(1, `Round ended | Unknown ${response.successStatus} | ${response.successMessage}`);
		}
        return;
    }
  
    // Update on player wound.
    async onPlayerWounded(info) {
    	if (info.victim || info.attacker) {
        	await this.processPlayers(info);
    	}
        const endPoint = 'wound';
        const woundData = {
            match: this.match && this.match.id ? this.match.id : null,
            time: info.time,
            victim: info.victim ? info.victim.steamID : null,
            victimEosID: info.victim ? info.victim.eosID : null,
            victimName: info.victim ? info.victim.name : null,
            victimTeamID: info.victim ? info.victim.teamID : null,
            victimSquadID: info.victim ? info.victim.squadID : null,
            attacker: info.attacker ? info.attacker.steamID : null,
            attackerEosID: info.attacker ? info.attacker.eosID : null,
            attackerName: info.attacker ? info.attacker.name : null,
            attackerTeamID: info.attacker ? info.attacker.teamID : null,
            attackerSquadID: info.attacker ? info.attacker.squadID : null,
            damage: info.damage,
            weapon: info.weapon,
            teamkill: info.teamkill,
        };
        const response = await setDataAPI(
            endPoint,
            woundData,
            this.options.api_key
        );
		if (response.successStatus === 'Success') {
        	if (this.debugSuccess) {
    			this.verbose(1, `Player wounded | ${response.successStatus} | ${response.successMessage}`);
            }
		} else if (response.successStatus === 'Error') {
    		this.verbose(1, `Player wounded | ${response.successStatus} | ${response.successMessage}`);
		} else {
    		this.verbose(1, `Player wounded | Unknown ${response.successStatus} | ${response.successMessage}`);
		}
        return;
    }
  
    // Update on player died.
    async onPlayerDied(info) {
		if (info.victim || info.attacker) {
        	await this.processPlayers(info);
    	}
        if (info.victim) {
            const endPoint = 'death';
            const deathData = {
                match: this.match && this.match.id ? this.match.id : null,
                time: info.time,
                woundTime: info.woundTime,
                victim: info.victim ? info.victim.steamID : null,
                victimEosID: info.victim ? info.victim.eosID : null,
                victimName: info.victim ? info.victim.name : null,
                victimTeamID: info.victim ? info.victim.teamID : null,
                victimSquadID: info.victim ? info.victim.squadID : null,
                attacker: info.attacker ? info.attacker.steamID : null,
                attackerEosID: info.attacker ? info.attacker.eosID : null,
                attackerName: info.attacker ? info.attacker.name : null,
                attackerTeamID: info.attacker ? info.attacker.teamID : null,
                attackerSquadID: info.attacker ? info.attacker.squadID : null,
                damage: info.damage,
                weapon: info.weapon,
                teamkill: info.teamkill,
            };
            const response = await setDataAPI(
                endPoint,
                deathData,
                this.options.api_key
            );
			if (response.successStatus === 'Success') {
        	if (this.debugSuccess) {
    				this.verbose(1, `Player died | ${response.successStatus} | ${response.successMessage}`);
                }
			} else if (response.successStatus === 'Error') {
    			this.verbose(1, `Player died | ${response.successStatus} | ${response.successMessage}`);
			} else {
    			this.verbose(1, `Player died | Unknown ${response.successStatus} | ${response.successMessage}`);
			}
        }
        return;
    }
  
    // Update on player Revived.
    async onPlayerRevived(info) {
	    if (info.victim || info.attacker || info.reviver) {
        await this.processPlayers(info);
    	}
        const endPoint = 'revive';
        const reviveData = {
            match: this.match && this.match.id ? this.match.id : null,
            time: info.time,
            woundTime: info.woundTime,
            victim: info.victim ? info.victim.steamID : null,
            victimEosID: info.victim ? info.victim.eosID : null,
            victimName: info.victim ? info.victim.name : null,
            victimTeamID: info.victim ? info.victim.teamID : null,
            victimSquadID: info.victim ? info.victim.squadID : null,
            attacker: info.attacker ? info.attacker.steamID : null,
            attackerEosID: info.attacker ? info.attacker.eosID : null,
            attackerName: info.attacker ? info.attacker.name : null,
            attackerTeamID: info.attacker ? info.attacker.teamID : null,
            attackerSquadID: info.attacker ? info.attacker.squadID : null,
            damage: info.damage,
            weapon: info.weapon,
            teamkill: info.teamkill,
            reviver: info.reviver ? info.reviver.steamID : null,
            reviverEosID: info.reviver ? info.reviver.eosID : null,
            reviverName: info.reviver ? info.reviver.name : null,
            reviverTeamID: info.reviver ? info.reviver.teamID : null,
            reviverSquadID: info.reviver ? info.reviver.squadID : null,
        };
        const response = await setDataAPI(
            endPoint,
            reviveData,
            this.options.api_key
        );
		if (response.successStatus === 'Success') {
        	if (this.debugSuccess) {
    			this.verbose(1, `Player revived | ${response.successStatus} | ${response.successMessage}`);
            }
		} else if (response.successStatus === 'Error') {
    		this.verbose(1, `Player revived | ${response.successStatus} | ${response.successMessage}`);
		} else {
    		this.verbose(1, `Player revived | Unknown ${response.successStatus} | ${response.successMessage}`);
		}
        return;
    }
    
// Link player
	async onChatCommand(info) {
    	const message = info.message;
        	const linkCode = info.message;
			if (linkCode.length !== 8 || /[^0-9]/.test(linkCode)) {
    			await this.server.rcon.warn(
       				info.player.steamID,
        			'Please provide a valid 8-digit link code, as described in the Discord message.'
    			);
    			return;
			}
        
        	const endPoint = 'link';
        	const query = `?playerID=${info.player.steamID}`;
       		let response = await getDataAPI(endPoint + query, this.options.api_key);
        	if (response.successStatus === 'Success') {
            	const player = response.player;
            	if (player.discordID !== null) {
                	await this.server.rcon.warn(
                    	info.player.steamID,
                    	'Player data found, your account is already linked.\nContact an admin if this is not correct.'
                	);
                	return;
            	}
            	const linkData = {
                	steamID: info.player.steamID,
                	code: linkCode,
            	};
            	response = await setDataAPI(endPoint, linkData, this.options.api_key);          
            	if (response.successStatus === 'Error') {
                	await this.server.rcon.warn(
                    	info.player.steamID,
                    	`${response.successMessage}\nPlease try again.`
                	);
            		this.verbose(1, `Player link | ${response.successStatus} | ${response.successMessage}`);
                	return;
            	}
            	await this.server.rcon.warn(
                	info.player.steamID,
                	'Account linking successful.\nView your Stats in our Discord.'
            	);
        		if (this.debugSuccess) {
    				this.verbose(1, `Player link | ${response.successStatus} | ${response.successMessage}`);
            	}
            	return;
        	} else if (response.successStatus === 'Error') {
            	await this.server.rcon.warn(
                	info.player.steamID,
                	'There was an Error while linking your account.\nPlease try again.'
            	);
         		this.verbose(1, `Player link | ${response.successStatus} | ${response.successMessage}`);
            	return;
        	}
		}
	}

// Translate error to readable format.
function translateErrorsAPI(error) {
    if (error.response) {
        let errMsg = '';
        const status = 'Error';
        if (error.response.status === 504) {
            errMsg = 'Timed out while connecting to SquadStats API.';
        } else if (error.response.status === 503) {
            errMsg = 'SquadStats API is unavailable.';
        } else if (error.response.status === 502) {
            errMsg = 'Cannot connect to SquadStats API.';
        } else if (error.response.status === 500) {
            errMsg = 'Something went wrong on the SquadStats server itself.';
        } else if (error.response.status === 429) {
            errMsg = 'Too many requests to the SquadStats API made.';
        } else if (error.response.status === 404) {
            errMsg = 'SquadStats API not found.';
        } else if (error.response.status === 403) {
            errMsg = 'Access to SquadStats denied.';
        } else if (error.response.status === 401) {
            errMsg = 'Access to SquadStats denied.';
        } else if (error.response.status === 400) {
            errMsg = 'Bad Request to SquadStats.';
        }
        if (!errMsg && error.response.statusText) {
            errMsg = `${error.response.statusText}`;
        }
        errMsg = `${error.response.status} ${errMsg}`;
        return {
            successStatus: status,
            successMessage: errMsg,
        };
    } else if (error.request) {
        return {
            successStatus: 'Error',
            successMessage: 'No response received.',
        };
    } else {
        return {
            successStatus: 'Error',
            successMessage: `Error: ${error.message}`,
        };
    }
}

// Retry failed data function.
async function retryFailedData(filePath, apiFunction, api_key) {
    let failedRequests = JSON.parse(fs.readFileSync(filePath));
    const retryendPoint = 'retry';
    const retryData = {
		version: currentVersion,
        filePath: filePath,
        failedRequests: failedRequests.length,
    };
    const retryResponse = await setDataAPI(retryendPoint, retryData, api_key);
    console.log(`[SquadStats] Registering qeued retry\'s | ${retryResponse.successStatus} | ${retryResponse.successMessage}`);
    if (retryResponse.api_key === 'Valid!') { 
    	saveServerConfigFile({ validated: true, retryPermission: retryResponse.retryPermission, retryToken: retryResponse.retryToken });
       	failedRequests.sort((a, b) => {
        	if (a.endPoint === 'match' && b.endPoint !== 'match') {
            	return -1;
        	} else if (a.endPoint !== 'match' && b.endPoint === 'match') {
            	return 1;
        	} else if (a.endPoint === 'server' && b.endPoint !== 'server') {
            	return -1;
        	} else if (a.endPoint !== 'server' && b.endPoint === 'server') {
            	return 1;
        	} else if (a.endPoint === 'player' && b.endPoint !== 'player') {
            	return -1;
        	} else if (a.endPoint !== 'player' && b.endPoint === 'player') {
            	return 1;
        	} else {
            	return 0;
        	}
    	});

    	for (let i = 0; i < failedRequests.length; i++) {
        	const request = failedRequests[i];

        	if (!request.retryCount) {
            	request.retryCount = 0;
        	}

        	const retryResponse = await apiFunction(
            	request.endPoint,
            	request.data,
            	api_key
        	);

        	console.log(`[SquadStats] Retry ${request.endPoint} data | ${retryResponse.successStatus} | ${retryResponse.successMessage}`);

        	if (retryResponse.successStatus === 'Success') {
            	failedRequests.splice(i, 1);
            	i--;
            	fs.writeFileSync(filePath, JSON.stringify(failedRequests));
        	} else if (retryResponse.successStatus === 'Error') {
            	request.retryCount++;
            	if (request.retryCount >= 3) {
                	failedRequests.splice(i, 1);
                	i--;
            	}            
            	fs.writeFileSync(filePath, JSON.stringify(failedRequests));
        	}
        	await new Promise((resolve) => setTimeout(resolve, 5000));
    	}
    	if (failedRequests.length === 0) {
        	fs.unlinkSync(filePath);
    	}

    	let completed = `[SquadStats] Finished retrying failed data uploads...`;
    	return completed;
	} 
}

// Data update API function.
async function setDataAPI(endPoint, data, api_key) {
    const __dirname = fileURLToPath(import.meta.url);
    try {
        const response = await axios.post(
            `https://api.squadstats.nl/api/${endPoint}`,
            data,
            {
                headers: { 'Authorization': `${api_key}` },
            }
        );
        return response.data;
    } catch (error) {
        const requestDetails = {
            endPoint: `${endPoint}`,
            data: data,
        };
        const dirPath = path.join(__dirname, '..', 'pluginsData', 'SquadStatsLogger');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, 'retrySetDataAPI.json');
        let failedRequests = [];
        if (fs.existsSync(filePath)) {
            failedRequests = JSON.parse(fs.readFileSync(filePath));
        }
      	const apiStatus = loadServerConfigFile();
    	if (apiStatus && apiStatus.validated === true && apiStatus.retryPermission !== 0) {
        	if (endPoint !== 'serverdata') {
            	if (error.response && [504, 503, 502, 500, 429, 404, 403, 401, 400].includes(error.response.status)) {
                	failedRequests.push(requestDetails);
            	} else if (error.request) {
                	failedRequests.push(requestDetails);
            	}
            	fs.writeFileSync(filePath, JSON.stringify(failedRequests));
        	}
        }
        return translateErrorsAPI(error);
    }
}

// Retry data update API function.
async function retrySetDataAPI(endPoint, data, api_key) {
    const apiStatus = loadServerConfigFile(); 
        const headers = {
        'Authorization': api_key
    };
    if (apiStatus && apiStatus.retryToken) {
        headers['retryToken'] = apiStatus.retryToken; 
    }
    try {
        const response = await axios.post(
            `https://api.squadstats.nl/api/${endPoint}`,
            data,
            { headers }
        );
        return response.data;
    } catch (error) {
        return translateErrorsAPI(error);
    }
}

// Data edit API function.
async function editDataAPI(endPoint, data, api_key) {
    const __dirname = fileURLToPath(import.meta.url);
    try {
        const response = await axios.patch(
            `https://api.squadstats.nl/api/${endPoint}`,
            data,
            {
                headers: { 'Authorization': `${api_key}` },
            }
        );
        return response.data;
    } catch (error) {
    const requestDetails = {
        endPoint: `${endPoint}`,
        data: data,
    };
    const dirPath = path.join(__dirname, '..', 'pluginsData', 'SquadStatsLogger');
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, 'retryeditDataAPI.json');
    let failedRequests = [];

    if (fs.existsSync(filePath)) {
        failedRequests = JSON.parse(fs.readFileSync(filePath));
    }
    const apiStatus = loadServerConfigFile();
    if (apiStatus && apiStatus.validated === true && apiStatus.retryPermission !== 0) {
        if (endPoint !== 'player') {
            if (error.response && [504, 503, 502, 500, 429, 404, 403, 401, 400].includes(error.response.status)) {
                failedRequests.push(requestDetails);
            } else if (error.request) {
                failedRequests.push(requestDetails);
            }
            fs.writeFileSync(filePath, JSON.stringify(failedRequests));
        }
    }
    return translateErrorsAPI(error);
	}
}

// Retry data edit API function.
async function retryEditDataAPI(endPoint, data, api_key) {
    const apiStatus = loadServerConfigFile(); 
    const headers = {
        'Authorization': api_key
    };
    if (apiStatus && apiStatus.retryToken) {
        headers['retryToken'] = apiStatus.retryToken; 
    }

    try {
        const response = await axios.patch(
            `https://api.squadstats.nl/api/${endPoint}`,
            data,
            { headers }
        );
        return response.data;
    } catch (error) {
        return translateErrorsAPI(error);
    }
}

// Get data API function.
async function getDataAPI(endPoint, api_key) {
    try {
        const response = await axios.get(`https://api.squadstats.nl/api/${endPoint}`, {
    		headers: {
        		'Authorization': `${api_key}`
    		}
		});
        return response.data;
    } catch (error) {
        return translateErrorsAPI(error);
    }
}

// Get latest version from github.
const updateAndCleanup = async (currentVersion) => {
    const __dirname = fileURLToPath(import.meta.url);
    const retryDirPath = path.join(__dirname, '..', 'pluginsData', 'SquadStatsLogger');
    try {
        const response = await axios.get('https://api.github.com/repos/SquadStats/SquadStats/releases/latest');
        const latestVersion = response.data.tag_name;
        if (currentVersion === latestVersion) {
            console.log(`[SquadStats][autoUpdate] You're up to date! Version: ${latestVersion}`);
            return;
        } else if (currentVersion > latestVersion) {
            console.log(`[SquadStats][autoUpdate] Local version ${currentVersion} is higher than the latest version ${latestVersion}.`);
            return;
        } else {
            console.log(`[SquadStats][autoUpdate] Update available! Latest version: ${latestVersion}. Download of latest plugin version started.`);
        }
        const downloadResponse = await axios({
            url: `https://raw.githubusercontent.com/SquadStats/SquadStats/${latestVersion}/squad-server/plugins/squadstats-logger.js`,
            method: 'GET',
            responseType: 'stream'
        });
        const writer = fs.createWriteStream(__dirname);
        downloadResponse.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', async () => {
                console.log('[SquadStats][autoUpdate] File updated successfully!');

                if (fs.existsSync(retryDirPath)) {
                    const retryFiles = fs.readdirSync(retryDirPath).filter(file => file.endsWith('DataAPI.json'));
                    for (const file of retryFiles) {
                        const filePath = path.join(retryDirPath, file);
                        fs.unlinkSync(filePath);
                        console.log(`[SquadStats][autoUpdate] Deleted old retry file: ${file}`);
                    }
                    if (retryFiles.length === 0) {
                        console.log("[SquadStats][autoUpdate] No old retry files to delete.");
                    }
                } else {
                    console.log("[SquadStats][autoUpdate] Retry directory does not exist.");
                }
                resolve();
      			try {
       	 			throw new Error(
          			`[SquadStats][autoUpdate] SquadStats logger updated successfully force restarting. (this will create an error on purpose)`
        			);
      			} catch (error) {
        			console.error(error);
        			process.exit(1);
      			}                
            });
            writer.on('error', (err) => {
                console.log(`[SquadStats][autoUpdate] Error writing file: ${err.message}`);
                reject(err);
            });
        });
    } catch (error) {
        console.log("[SquadStats][autoUpdate] Error while fetching the latest release version:", error.message);
    }
};

// Save/Load serverstata from/to a file
const __dirname = fileURLToPath(import.meta.url);
const configFilePath = path.join(__dirname, '..', 'pluginsData', 'SquadStatsLogger', '.pluginData');
function saveServerConfigFile(configUpdates = {}) {
    let config = loadServerConfigFile();
    config = {  SquadStats: {Warning: "This file stores critical temporary configuration data. DO NOT DELETE THIS FILE!!"}, ...config, ...configUpdates };
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 4));
}

function loadServerConfigFile() {
    if (fs.existsSync(configFilePath)) {
        const data = fs.readFileSync(configFilePath);
        return JSON.parse(data);
    }
    return {
        match: { id: 1 },
        validated: false,
        retryPermission: 1,
        retryToken: null,
    };
}
