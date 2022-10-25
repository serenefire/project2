//"StAuth10222: I Brad Alfano, 000731709 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const {apikey} = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('freeplay')
        .setDescription('List of free to play champions')        
        .addStringOption(option => 
            option.setName('server')
                .setDescription('Server of free to play champions')
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
        const freeplay = 
            await axios.get(`https://${interaction.options.getString('server')}.api.riotgames.com/lol/platform/v3/champion-rotations`,
                            {headers: {"X-Riot-Token" : apikey}});


        let ids = freeplay.data.freeChampionIds;

        string = "Free to play champions for players above lvl 10:\n";
        for(var i in ids){
            string += await nameById(ids[i]) + "  ";
        }

        ids = freeplay.data.freeChampionIdsForNewPlayers;

        string += "\n\nFree to play champions for players lvl 10 and below:\n";
        for(var i in ids){
            string += await nameById(ids[i]) + "  ";
        }

        return interaction.reply(string);
    },
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