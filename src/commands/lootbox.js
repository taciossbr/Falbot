const functions = require('../utils/functions.js')
const config = require("../config.json")

module.exports =  {
    aliases: ['lb'],
    category: 'Economia',
    description: 'Claim your lootbox (available every 12 hours)',
    slash: 'both',
    cooldown: '12h',
    guildOnly: true,
    testOnly: config.testOnly,
    callback: async ({instance, guild, user}) => {
        try {
            const quantity = await functions.readFile(user.id, 'lootbox')
            functions.changeDB(user.id, 'falcoins', quantity)
            return instance.messageHandler.get(guild, "LOOTBOX", {FALCOINS: quantity})
        } catch (error) {
            console.error(`lootbox: ${error}`)
        }
    }
}