const noblox = require("noblox.js")
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const config = require("./config.json")
 
async function startApp () {
    const currentUser = await noblox.setCookie(config.roblox_bot_token) 
    console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)

    const transactionEvent = noblox.onGroupTransaction(config.groupSales.group_Id, "Sale")

    transactionEvent.on("data", async function(data) {
        console.log("New Transaction!", data)

        let playerThumbnail = await noblox.getPlayerThumbnail(data.agent.id, 420, "png", false, "Headshot")
        let information = await noblox.getPlayerInfo({userId: data.agent.id})

        client.channels.cache.get(config.groupSales.discord_channel_id).send({ 
            embeds: [{
                "title": "Profile",
                "description": "```\nUser Id: " + data.agent.id +"\nUsername: " + data.agent.name +"\nDisplayName: " + information.displayName +"\nProduct Name: " + data.details.name +"\nProduct Price: " + data.currency.amount +" Robux```",
                "url": "https://www.roblox.com/users/" + data.agent.id + "/profile",
                "color": 16312092,
                "thumbnail": { 
                    "url": playerThumbnail[0].imageUrl 
                }
            }]
        });
    })

    transactionEvent.on("error", function(err) {
     console.error("Timed out...")
    })

    client.on('ready', async () => {
        console.log("Logged in as " + client.user.tag);
    });

    client.login(config.discord_bot_token);
}

startApp()
