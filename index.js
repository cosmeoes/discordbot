`use strict`;

require('dotenv').config();
const Discord = require('discord.js');


const client = new Discord.Client();

let emojis = {};

client.on('ready', () => {
    console.log("Hi, I'm awake");
    emojis = client.emojis.cache.filter(emoji => emoji.animated).reduce((acc, emoji) => {
        acc[":"+emoji.name+":"] = emoji;
        return acc;
    }, {});
})

client.on('message', message => {
    if (message.author.bot || message.channel.type != 'text' || message.author.premium_type > 0) {
        return;
    }
    let member = false;

    if (message.guild != null) {
        member = message.guild.member(message.author);
    }
    
    if (member && member.user.premium_type > 0) {
        return;
    }

    let content = message.content;
    let found = false;
    for (const key of Object.keys(emojis)) {
        if (content.includes(key)) {
            let emoji = emojis[key]
            content = content.replace(key, `${emoji}`);
            found = true;
        }
    }

    if (found)  {
        console.log("Sending message")
        message.delete()

        let name = member ? member.displayName : message.author.username;
        const embed = new Discord.MessageEmbed()
            .setTitle(name)
            .setDescription(content)
        message.channel.send(embed)
    }
});


client.login(process.env.TOKEN);
