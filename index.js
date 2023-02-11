const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

//////////////////////////////////////////CÓDIGO DEL BOT////////////////////////////////
// https://www.npmjs.com/package/distube/v/2.8.18
// instalarlo aparte npm i distube@2.8.18
//npm install discordjs/opus
// comandos 
// /micheL <argumento>  -->es el bot cleverbot
// /michel play, cola,siguiente,stop  --> bot de música.
// /michel md @user <arg> --> envia un md al usuario
// /michel /datos --> te da info del servidor
// cuando entras en algún canal de voz de dira un mensaje personalizado
const Discord = require("discord.js");//añadir biblioteca discord
const cleverbot = require("cleverbot-free");
const client = new Discord.Client({ restRequestTimeout: 60000 });//conectarse a discord
const mySecret = process.env['token']; // el token
const prefix = "/michel"; // prefijo
let conversation = [];
//const ytdl = require('ytdl-core');//modulo de yt
const Distube = require('distube');
const distube = new Distube(client, { searchsong: false, emitNewSongOnly: true });
require('dotenv').config();

client.on("ready", () => {
  console.log('esto tira');
  client.user.setActivity(`la Huerta carrasco`, { type: "WATCHING" });
});

//Manejo de errores

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});



//para detectar si ha entrado alguien nuevo

client.on('voiceStateUpdate', (oldState, newState) => {
  // use the .channelID property (.voice doesn't exist)
  const newUserChannel = newState.channelID;
  const textChannel = client.channels.cache.get('938208142540537897');
  const textChannel2 = client.channels.cache.get('761080145070522389');

  if (newUserChannel === '816698939096170517') {
    let max = 9;
    let min = 0;
    const numRandom = Math.floor(Math.random() * (max - min) + min);
    const frases = ['besame mi amooor necesito que me abraces con pasioon🎶🎶', 'que dise er tio 🚬🚬', 'no tendras un poquillo de drogi no 💉💉?', 'puuuuuteeee', 'la pooopeee', 'uuuuuaaaaaaaaaaooooooooh🐯🐯', 'el aguiluchoooo 🐦🐦', 'JAJJAJAJAJAAJ', 'MU BUENAS SU TIO']
    const imgMichel = './michel/' + numRandom + '.png';
    textChannel.send(frases[numRandom], { files: [imgMichel] });
  }

  if (newUserChannel === '824339916699074611') {
    let max = 9;
    let min = 0;
    const numRandom = Math.floor(Math.random() * (max - min) + min);
    const frases = ['besame mi amooor necesito que me abraces con pasioon🎶🎶', 'que dise er tio 🚬🚬', 'no tendras un poquillo de drogi no 💉💉?', 'puuuuuteeee', 'la pooopeee', 'uuuuuaaaaaaaaaaooooooooh🐯🐯', 'el aguiluchoooo 🐦🐦', 'JAJJAJAJAJAAJ', 'MU BUENAS SU TIO']
    const imgMichel = './michel/' + numRandom + '.png';
    textChannel2.send(frases[numRandom], { files: [imgMichel] });
  }
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

client.on("message", async (message) => {

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  console.log(message.content);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift();

  const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;


  // DisTube event listeners, more in the documentation page
  distube
    .on("playSong", (message, status, song) => message.channel.send(
      `** 🤪  ⁓ Ahora vas a escuchar :**
> ${song.name}\` - \`${song.formattedDuration}\``
    ))
    .on("addSong", (message, status, song) => message.channel.send(
      `** 🤪  ⁓ Añadida puuute: **
> ${song.name} - \`${song.formattedDuration}\` **to the queue.**`
    ))
    .on("playList", (message, status, playlist, song) => message.channel.send(
      `** 🤪  ⁓ Escuchando ahora:**
>` `${song.name}\` - \`${song.formattedDuration}\``
    ))
    .on("addList", (message, status, playlist) => message.channel.send(
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



  if (command == "play") {
    if (!message.member.voice.channel) return message.channel.send('tendrás que estar en algun canal de voz no ?');
    if (!args[0]) return message.channel.send('dame una cancion o algo hulio');
    distube.play(message, args.join(" "));
    let max = 9;
    let min = 0;
    const numRandom = Math.floor(Math.random() * (max - min) + min);
    const frases = ['besame mi amooor necesito que me abraces con pasioon🎶🎶', 'que dise er tio 🚬🚬', 'no tendras un poquillo de drogi no 💉💉?', 'puuuuuteeee', 'la pooopeee', 'uuuuuaaaaaaaaaaooooooooh🐯🐯', 'el aguiluchoooo 🐦🐦', 'JAJJAJAJAJAAJ', 'MU BUENAS SU TIO']
    const imgMichel = './michel/' + numRandom + '.png';

    message.channel.send(frases[numRandom]);

  }

  if (command == "stop") {
    const bot = message.guild.members.cache.get(client.user.id);
    if (!message.member.voice.channel) return message.channel.send(' no estas en ningun canal de voz');
    if (bot.voice.channel !== message.member.voice.channel) return message.channel.send("no estas en el mismo canal del bot");
    distube.stop(message);
    message.channel.send('has parado la musica  puuuutee');
  }

  if (command == "siguiente") {
    distube.skip(message);
    message.channel.send('siguiente');
  }

  if (command == "cola") {
    let queue = distube.getQueue(message);
    message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
      `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
    ).slice(0, 10).join("\n"));
    message.channel.send('comprobando cola de música');
  }

  // muestra los datos del servidor
  if (command == "datos") {
    var server = message.guild;

    const embed = new Discord.MessageEmbed()
      .setThumbnail(server.iconURL())
      .setAuthor(server.name, server.iconURL())
      .addField('ID', server.id, true)
      .addField('Region', server.region, true)
      .addField('Creado el', server.joinedAt.toDateString(), true)
      .addField('Dueño del Servidor', server.owner.user.tag + '(' + server.owner.user.id + ')', true)
      .addField('Miembros', server.memberCount, true)
      .addField('Roles', server.roles.size, true)
      .setColor(0x66b3ff)

    message.channel.send(embed);
  }

  //para enviar md 
  if (command == "md") {
    let prefix = "/michel md";
    //Pon esto si no tienes definido args o prefix o los dos xd:
    let args = message.content.slice(prefix.length).trim().split(/ +/g); //Definimos args

    let perms = message.member.hasPermission("ADMINISTRATOR");//Definimos los permisos qje necesitas para ejecutar este comando
    let user = message.mentions.members.first();//Definimos el usuario mediante una menciÃÂ³n
    let mensaje = args.slice(1).join(' ');//Definimos el texto del mensaje a enviar
    if (!perms) return message.channel.send("No tienes permisos"); //Enviamos un mensaje si no tienes permisos
    if (!user) return message.channel.send("No has mencionado a nadie"); //Enviamos un mensaje si no has mencionado a nadie
    if (!mensaje) return message.channel.send("No has escrito el mensaje a enviar"); //Enviamos un mensaje si no se ha escribido el mensaje a enviar
    let max = 9;
    let min = 0;
    const numRandom = Math.floor(Math.random() * (max - min) + min)
    const imgMichel = './michel/' + numRandom + '.png';
    user.send(mensaje, { files: [imgMichel] }); //Enviamos el mensaje al user
    message.channel.send("Mensaje enviado correctamente"); //Enviamos un mensaje conforme estÃÂ¡ correcto y despues lo eliminaremos despues de un 10 segundos
  }


});

client.login(mySecret) // Aqui pondremos el token de nuestro bot