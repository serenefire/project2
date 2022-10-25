//"StAuth10222: I Brad Alfano, 000731709 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const {apikey} = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('match')
        .setDescription("Get a player's previous game played data")        
        .addStringOption(option =>
            option.setName('ign')
                .setDescription("In game name")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('server')
                .setDescription('Server of player')
                .setRequired(true)
                .addChoices(
                    { name: 'North America', value: 'NA1'},
                    { name: 'Europe West', value: 'EUW1'},
                    { name: 'Europe Nordic & East', value: 'EUN1'},
                    { name: 'Brazil', value: 'BR1'},
                    { name: 'Korea', value: 'KR'},
                    { name: 'Oceania', value: 'OC1'},
                    { name: 'Russia', value: 'RU'},
                    { name: 'Turkiye', value: 'TR1'},
                    { name: 'Japan', value: 'JP1'},
                    { name: 'Latin America South', value: 'LA2'},
                    { name: 'Latin America North', value: 'LA1'}
                )
        )   
        .addNumberOption(option =>
            option.setName('id')
                .setDescription("game # (1 - 1000) aslong as it exists")
                .setRequired(true)
        ),
    async execute(interaction){
        const summoner = 
            await axios.get(`https://${interaction.options.getString('server')}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${interaction.options.getString('ign')}`,
                            {headers: {"X-Riot-Token" : apikey}});
        
        let puuid = summoner.data.puuid;

        let server = await convertServer(interaction.options.getString('server'));
        const matches = 
            await axios.get(`https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${interaction.options.getNumber('id') - 1}&count=1`,
                            {headers: {"X-Riot-Token" : apikey}});


        let matchId = matches.data[0];

        const match = 
            await axios.get(`https://${server}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
                        {headers: {"X-Riot-Token" : apikey}});
        
        let string = "";
        string += '\n' + await getMapById(match.data.info.queueId);
        let date = new Date(match.data.info.gameCreation);
        string += '\nGame played at: ' + date.toString();
        string += '\nLength of game: ' + Math.trunc((match.data.info.gameDuration/60)) + ':' +(match.data.info.gameDuration%60) + ' minutes';


        for(var i in match.data.info.participants){
            if(match.data.info.participants[i].puuid == puuid){
                string += '\nGame ' + (match.data.info.participants[i] ? 'Won' : 'Lost');
                string += '\nChampion: ' + match.data.info.participants[i].championName;
                string += '\nKill/Death/Assist: ' + match.data.info.participants[i].kills + '/' + match.data.info.participants[i].deaths + '/' + match.data.info.participants[i].assists;
                string += '\nPosition played: ' + match.data.info.participants[i].lane;
                string += '\nGold earned: ' + match.data.info.participants[i].goldEarned;
                string += '\nMinions killed: ' + match.data.info.participants[i].totalMinionsKilled + ' Monsters killed: ' + match.data.info.participants[i].neutralMinionsKilled;
                string += '\nDamage dealt to champions: ' + match.data.info.participants[i].totalDamageDealtToChampions;
                string += '\nDamage dealt to objectives: ' + match.data.info.participants[i].damageDealtToObjectives;
            }
        }
        
        return interaction.reply(string);
    }
};

async function convertServer(server){
    if(server == 'NA1' || server == 'BR1' || server == 'LA1' || server == 'LA2'){
        return 'americas';
    }else if(server == 'KR' || server == 'JP1'){
        return 'asia';
    }else if(server == 'EUW1' || server == 'EUN1' || server == 'TR1' || server == 'RU'){
        return 'europe';
    }else{
        return 'sea';
    }
};

async function getMapById(id){
    const map = 
    await axios.get(`https://static.developer.riotgames.com/docs/lol/queues.json`);

    let maps = map.data;

    for(var i in maps){
        if(maps[i].queueId == id){
            string = 'Map: '+ maps[i].map;
            string += '\nGame Type: ' + maps[i].description;
            return string;
        }
    }
};

