const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

//////////////////////////////////////////CÓDIGO DEL BOT////////////////////////////////
// https://www.npmjs.com/package/distube/v/2.8.18
// instalarlo aparte npm i distube@2.8.18
const Discord = require("discord.js");//añadir biblioteca discord
const cleverbot = require("cleverbot-free");
const client = new Discord.Client();//conectarse a discord
const mySecret = process.env['token']; // el token
const prefix = "/michel"; // prefijo
let conversation=[];
const ytdl = require('ytdl-core');//modulo de yt
const Distube = require('distube');
const distube = new Distube(client,{searchsong:false,emitNewSongOnly:true});
require('dotenv').config();

client.on("ready", () => {
  console.log('esto tira');
  client.user.setActivity(`Huerta carrasco`,{type:"WATCHING"});
});



client.on("message", (message) => {
  // si menciona al bot
  if (message.content.startsWith("/micheL")) {
    let text = message.content;
    text = text.substring(text.indexOf('>') + 2, text.length);
    console.log(text);
  
    //probando la ia que responda
    cleverbot(text, conversation).then((res) => {
      conversation.push(text);
      conversation.push(res);
      message.channel.send(res);
    });
  }
});

client.on("message", async (message) =>{
  
  if(message.author.bot)return;
  if(!message.content.startsWith(prefix))return;
  console.log(message.content);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift();

const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

  
// DisTube event listeners, more in the documentation page
distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `** 🤪  ⁓ Ahora vas a escuchar :**
> ${song.name}\` - \`${song.formattedDuration}\``
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `** 🤪  ⁓ Añadida puuute: **
> ${song.name} - \`${song.formattedDuration}\` **to the queue.**`
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(
        `** 🤪  ⁓ Escuchando ahora:**
>` `${song.name}\` - \`${song.formattedDuration}\``
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(
        `** 🤪 ⁓ Añadida: **
> ${song.name} - \`${song.formattedDuration}\` **pa la cola.**`
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("An error encountered: " + e);
  })


  
  if(command =="play"){
    if(!message.member.voice.channel) return message.channel.send('tendrás que estar en algun canal de voz no ?');
    if(!args[0]) return message.channel.send('dame una cancion o algo hulio');
    distube.play(message,args.join(" "));
    message.channel.send("que quieres perra");

  }

  if(command=="stop"){
    const bot = message.guild.members.cache.get(client.user.id);
    if(!message.member.voice.channel)return message.channel.send(' no estas en ningun canal de voz');
    if(bot.voice.channel !== message.member.voice.channel)return message.channel.send("no estas en el mismo canal del bot");
    distube.stop(message);
    message.channel.send('has parado la musica peazo puuuutee');
  }
  
 if (command == "siguiente"){
        distube.skip(message);
       message.channel.send('siguiente');
 }

if (command == "cola") {
  let queue = distube.getQueue(message);
  message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
      `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
  ).slice(0, 10).join("\n"));
      message.channel.send('colita puuute');
  }
  
});

client.login(mySecret) // Aqui pondremos el token de nuestro bot