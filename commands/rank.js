//"StAuth10222: I Brad Alfano, 000731709 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const {apikey} = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Get player ranked data')
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
        const summoner = await axios.get(`https://${interaction.options.getString('server')}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${interaction.options.getString('ign')}`,
                                        {headers: {"X-Riot-Token" : apikey}});


        const ranked = await axios.get(`https://${interaction.options.getString('server')}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.data.id}`,
                                      {headers: {"X-Riot-Token" : apikey}});

        var index = 0;
        let string = `${summoner.data.name}\n`;
        while(ranked.data[index] != null){
            string +=  `Queue type: ${convert(ranked.data[index].queueType)}\n` + 
                       `Rank: ${ranked.data[index].tier} ${ranked.data[index].rank}\n` +
                       `Points: ${ranked.data[index].leaguePoints}\n` +
                       `Wins: ${ranked.data[index].wins} Losses: ${ranked.data[index].losses} \n\n`;
            index++;
        }

        if(index == 0){
            string += `Unranked`;
        }

        return interaction.reply(string);
    }
};

function convert(string){
    if(string == 'RANKED_FLEX_SR'){
        return 'Ranked Flex';
    }else if(string == 'RANKED_SOLO_5x5'){
        return 'Ranked Solo';
    }else{
        return string;
    }
};


