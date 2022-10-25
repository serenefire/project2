//"StAuth10222: I Brad Alfano, 000731709 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, GatewayIntentBits} = require('discord.js');
const {token} = require('./config.json');

const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    
    if(!command) return;

    try{
        await command.execute(interaction);
    }catch(error){
        await interaction.reply({content: 'There was an error executing this command!', ephemeral: true });
        console.log(error);
    }
});

client.login(token);