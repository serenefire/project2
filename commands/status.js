//"StAuth10222: I Brad Alfano, 000731709 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const {apikey} = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Server status')        
        .addStringOption(option => 
            option.setName('server')
                .setDescription('Server for status')
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

        const status = 
            await axios.get(`https://${interaction.options.getString('server')}.api.riotgames.com/lol/status/v4/platform-data`,
                            {headers: {"X-Riot-Token" : apikey}});

        var index = 0;
        var string = `${status.data.name} \n\n`;

        string += "Maintenances:\n";
        while(status.data.maintenances[index] != null){
            string += `${status.data.maintenances[index].updates[0].translations[0].content} \n\n`;
            let str = `${status.data.incidents[index].created_at}`;
            string += `Created: ${str.substring(0,10)}\n\n`;
            index++;
        }
        if(index == 0) string += "Currently not under maintenance\n\n";

        index = 0;
        string += "Incidents:\n"
        while(status.data.incidents[index] != null){
            string += `${status.data.incidents[index].updates[0].translations[0].content}\n`;
            let str = `${status.data.incidents[index].created_at}`;
            string += `Created: ${str.substring(0,10)}\n\n`;
            index++;
        }
        if(index == 0) string += "Server is running without incidents";

        return interaction.reply(string);
    },
};

