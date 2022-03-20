const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")
const builder = require("../snake-builder.js")

module.exports =  {
    category: 'Fun',
    description: 'play a game of snake',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    callback: async ({instance, client, guild, message, interaction, user}) => {
        try {
            const author = user

            const game = new builder.Game()
            game.spawnFood()
            time = 30

            const embed = new Discord.MessageEmbed()
            .setTitle(":snake:")
            .addField('\u200b', game.world2string(game.world, game.snake))
            .addField(`\u200b`, `:alarm_clock: ${time}s\n\n${instance.messageHandler.get(guild, "SCORE")}: ${game.snake.length}`)
            .setFooter({text: 'by Falcão ❤️'})
            .setColor('PURPLE')
            if (message) {
                var answer = await message.reply({
                    embeds: [embed]
                }) 
            } else {
                var answer = await interaction.reply({
                    embeds: [embed],
                    fetchReply: true
                })
            }
            await answer.react('⬆')
            await answer.react('⬅')
            await answer.react('➡')
            await answer.react('⬇')

            const filter = (reaction, user) => {
                return user.id === author.id
            }
            
            const collector = answer.createReactionCollector({
                filter,
                time: 1000 * 60 * 60
            })

            var myTimer = setInterval(async function () {
                if (time <= 0) {
                    game.snakeMovement(game.snake, game.Sd)
                    time = 30
                }
                const embed2 = new Discord.MessageEmbed()
                .setTitle(':snake:')
                .addField('\u200b', game.world2string(game.world, game.snake))
                .addField(`\u200b`, `:alarm_clock: ${time}s\n\n${instance.messageHandler.get(guild, "SCORE")}: ${game.snake.length}`)
                .setFooter({text: 'by Falcão ❤️'})
                .setColor('PURPLE')

                await answer.edit({
                    embeds: [embed2]
                })
                time -= 5
            }, 1000 * 5)

            collector.on('collect', async reaction => {
                if (reaction._emoji.name === '⬆') {
                    game.snakeMovement(game.snake, 'N')
                } else if (reaction._emoji.name === '⬅') {
                    game.snakeMovement(game.snake, 'W')
                } else if (reaction._emoji.name === '➡') {
                    game.snakeMovement(game.snake, 'E')
                } else if (reaction._emoji.name === '⬇') {
                    game.snakeMovement(game.snake, 'S')
                }
            

                const embed2 = new Discord.MessageEmbed()
                .setTitle(':snake:')
                .addField('\u200b', game.world2string(game.world, game.snake))
                .addField(`\u200b`, `:alarm_clock: ${time}s\n\n${instance.messageHandler.get(guild, "SCORE")}: ${game.snake.length}`)
                .setFooter({text: 'by Falcão ❤️'})
                .setColor('PURPLE')

                await answer.edit({
                    embeds: [embed2]
                })

                if (game.gameEnded) {
                    clearInterval(myTimer)
                    collector.stop()
                }

                time = 30
            })
        } catch (error) {
            console.error(`snake: ${error}`)
        }
    }
}   