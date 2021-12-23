const fetch = require('cross-fetch')
function timeOut(client, guildid, userid) {
    const x = new Date(Date.now() + 432000000).toISOString();
    fetch(`https://discord.com/api/guilds/${guildid}/members/${userid}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${client.config.token}`
        },
        body: JSON.stringify({
            communication_disabled_until: x
        })
    })
}

function timeIn(client, guildid, userid) {
    fetch(`https://discord.com/api/guilds/${guildid}/members/${userid}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${client.config.token}`
        },
        body: JSON.stringify({
            communication_disabled_until: null
        })
    })
}

module.exports= {
    timeOut,
    timeIn
}