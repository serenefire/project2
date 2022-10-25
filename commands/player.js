////"StAuth10222: I Brad Alfano, 000731709 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const {apikey} = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Player level icon and champion mastery')
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
            ),
    async execute(interaction){
        const summoner = 
            await axios.get(`https://${interaction.options.getString('server')}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${interaction.options.getString('ign')}`,
                            {headers: {"X-Riot-Token" : apikey}});
        

        const mastery = 
            await axios.get(`https://${interaction.options.getString('server')}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner.data.id}`,
                            {headers: {"X-Riot-Token" : apikey}});

        let string = `${summoner.data.name}\nSummoner Level: ${summoner.data.summonerLevel}\n`;
        let index = 0;
        for(var i in mastery.data){
            string += '\n' + await nameById(mastery.data[i].championId);
            string += '\n' + 'Mastery Level: ' + mastery.data[i].championLevel +  '   Mastery points: ' + mastery.data[i].championPoints;
            let date = new Date(mastery.data[i].lastPlayTime);
            string += '\n' + 'Last Played: '+ date.toString();
            string += '\n';

            index++;
            if(index == 5) break;
        }

        return interaction.reply({
            content: string,
            files: [`http://ddragon.leagueoflegends.com/cdn/12.19.1/img/profileicon/${summoner.data.profileIconId}.png`]
        });
    }
};

async function nameById(id){
    const champion = 
    await axios.get(`http://ddragon.leagueoflegends.com/cdn/12.19.1/data/en_US/champion.json`);

    let champs = champion.data.data;

    for(var i in champs){
        if(champs[i].key == id){
            return champs[i].id;
        }
    }
};