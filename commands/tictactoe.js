const Discord = require('discord.js')
const functions = require('../functions.js')
const Board = require('tictactoe-board')
const config = require("../config/config.json")

module.exports =  {
    aliases: ['velha'],
    category: 'Economia',
    description: 'challenge someone to a game of tic tac toe',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 2,
    expectedArgs: '<user> <falcoins>',
    expectedArgsTypes: ['USER', 'STRING'],
    options: [{
        name: 'user',
        description: 'user to challenge',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
    },
    {
        name: 'falcoins',
        description: 'amount of falcoins to bet in the game',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }   
    ],
    callback: async ({instance, guild, message, interaction, client, user, args}) => {
        try {
            var board = new Board.default()
            const author = user
            if (message) {
                if (args[0][2] == '!') {
                    args[0] = args[0].slice(3,-1)
                } else {
                    args[0] = args[0].slice(2,-1)
                }
            }
            const member = await functions.getMember(guild, args[0])
            if (member.user != author) {
                try {
                    var bet = await functions.specialArg(args[1], user.id, "falcoins")
                } catch {
                    return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[1]})
                } 
                if (await functions.readFile(user.id, 'falcoins') >= bet && await functions.readFile(member.user.id, 'falcoins') >= bet && bet > 0) {
                    if (message) {
                        var answer = await message.reply({
                            content: instance.messageHandler.get(guild, "VELHA_CHAMOU", {USER: author.username, USER2: member.user.username, FALCOINS: await functions.format(bet)})
                        })
                    } else {
                        var answer = await interaction.reply({
                            content: instance.messageHandler.get(guild, "VELHA_CHAMOU", {USER: author.username, USER2: member.user.username, FALCOINS: await functions.format(bet)}),
                            fetchReply: true
                        })
                    }
                    answer.react('✅')
                    answer.react('🚫')
    
                    const filter = (reaction, user) => {
                        return user.id === member.user.id && user.id !== client.user.id
                    }
    
                    const collector = answer.createReactionCollector({
                        filter,
                        max: 1,
                        time: 1000 * 300
                    })
    
                    collector.on('end', async collected => {
                        if (collected.size === 0) {
                            if (message) {
                                message.reply({
                                    content: instance.messageHandler.get(guild, "VELHA_CANCELADO_DEMOROU", {USER: member})
                                }) 
                            } else {
                                interaction.followUp({
                                    content: instance.messageHandler.get(guild, "VELHA_CANCELADO_DEMOROU", {USER: member})
                                })
                            }
                            return
                        } else if (collected.first()._emoji.name === '🚫') {
                            if (message) {
                                message.reply({
                                    content: instance.messageHandler.get(guild, "VELHA_CANCELADO_RECUSOU", {USER: member})
                                }) 
                            } else {
                                interaction.followUp({
                                    content: instance.messageHandler.get(guild, "VELHA_CANCELADO_RECUSOU", {USER: member})
                                })
                            }
                        }else {
                            const row = new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageButton()
                                .setCustomId('1')
                                .setLabel('\u200b')
                                .setStyle('SECONDARY')
                            )
                            .addComponents(
                                new Discord.MessageButton()
                                .setCustomId('2')
                                .setLabel('\u200b')
                                .setStyle('SECONDARY')
                            )
                            .addComponents(
                                new Discord.MessageButton()
                                .setCustomId('3')
                                .setLabel('\u200b')
                                .setStyle('SECONDARY')
                            )
                            const row2 = new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageButton()
                                .setCustomId('4')
                                .setLabel('\u200b')
                                .setStyle('SECONDARY')
                            )
                            .addComponents(
                                new Discord.MessageButton()
                                .setCustomId('5')
                                .setLabel('\u200b')
                                .setStyle('SECONDARY')
                            )
                            .addComponents(
                                new Discord.MessageButton()
                                .setCustomId('6')
                                .setLabel('\u200b')
                                .setStyle('SECONDARY')
                            )
                            const row3 = new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageButton()
                                .setCustomId('7')
                                .setLabel('\u200b')
                                .setStyle('SECONDARY')
                            )
                            .addComponents(
                                new Discord.MessageButton()
                                .setCustomId('8')
                                .setLabel('\u200b')
                                .setStyle('SECONDARY')
                            )
                            .addComponents(
                                new Discord.MessageButton()
                                .setCustomId('9')
                                .setLabel('\u200b')
                                .setStyle('SECONDARY')
                            )

                            if (message) {
                                var answer2 = await message.reply({
                                    content: `:older_woman: \`${author.username}\` **VS**  \`${member.user.username}\` \n\n${instance.messageHandler.get(guild, "VELHA_MOVIMENTO", {USER: author.username})}`,
                                    components: [row, row2, row3]
                                }) 
                            } else {
                                var answer2 = await interaction.reply({
                                    content: `:older_woman: \`${author.username}\` **VS**  \`${member.user.username}\` \n\n${instance.messageHandler.get(guild, "VELHA_MOVIMENTO", {USER: member.user.username})}`,
                                    components: [row, row2, row3],
                                    fetchReply: true
                                })
                            }

                            const filter2 = (btInt) => {
                                if (btInt.user.id === author.id && btInt.user.id !== client.user.id && board.currentMark() === 'X') {
                                    return true
                                } else if (btInt.user.id === member.user.id && btInt.user.id !== client.user.id && board.currentMark() === 'O') {
                                    return true
                                }
                            }
            
                            const collector2 = answer2.createMessageComponentCollector({
                                filter: filter2,
                                max: 9,
                                time: 1000 * 60 * 60
                            })

                            collector2.on('collect', async i => {
                                if (i.customId === '1') {  
                                    row.components[0].setLabel(board.currentMark())
                                    i.user.id === author.id ? row.components[0].setStyle("PRIMARY") : row.components[0].setStyle("DANGER")
                                    row.components[0].setDisabled(true)
                                    board = board.makeMove(1, board.currentMark())
                                } else if (i.customId === '2') {  
                                    row.components[1].setLabel(board.currentMark())
                                    i.user.id === author.id ? row.components[1].setStyle("PRIMARY") : row.components[1].setStyle("DANGER")
                                    row.components[1].setDisabled(true)
                                    board = board.makeMove(2, board.currentMark())
                                } else if (i.customId === '3') {  
                                    row.components[2].setLabel(board.currentMark())
                                    i.user.id === author.id ? row.components[2].setStyle("PRIMARY") : row.components[2].setStyle("DANGER")
                                    row.components[2].setDisabled(true)
                                    board = board.makeMove(3, board.currentMark())
                                } else if (i.customId === '4') { 
                                    row2.components[0].setLabel(board.currentMark())
                                    i.user.id === author.id ? row2.components[0].setStyle("PRIMARY") : row2.components[0].setStyle("DANGER")
                                    row2.components[0].setDisabled(true)
                                    board = board.makeMove(4, board.currentMark())
                                } else if (i.customId === '5') { 
                                    row2.components[1].setLabel(board.currentMark())
                                    i.user.id === author.id ? row2.components[1].setStyle("PRIMARY") : row2.components[1].setStyle("DANGER")
                                    row2.components[1].setDisabled(true)
                                    board = board.makeMove(5, board.currentMark())
                                } else if (i.customId === '6') { 
                                    row2.components[2].setLabel(board.currentMark())
                                    i.user.id === author.id ? row2.components[2].setStyle("PRIMARY") : row2.components[2].setStyle("DANGER")
                                    row2.components[2].setDisabled(true)
                                    board = board.makeMove(6, board.currentMark())
                                } else if (i.customId === '7') { 
                                    row3.components[0].setLabel(board.currentMark())
                                    i.user.id === author.id ? row3.components[0].setStyle("PRIMARY") : row3.components[0].setStyle("DANGER")
                                    row3.components[0].setDisabled(true)
                                    board = board.makeMove(7, board.currentMark())
                                } else if (i.customId === '8') { 
                                    row3.components[1].setLabel(board.currentMark())
                                    i.user.id === author.id ? row3.components[1].setStyle("PRIMARY") : row3.components[1].setStyle("DANGER")
                                    row3.components[1].setDisabled(true)
                                    board = board.makeMove(8, board.currentMark())
                                } else if (i.customId === '9') { 
                                    row3.components[2].setLabel(board.currentMark())
                                    i.user.id === author.id ? row3.components[2].setStyle("PRIMARY") : row3.components[2].setStyle("DANGER")
                                    row3.components[2].setDisabled(true)
                                    board = board.makeMove(9, board.currentMark())
                                }

                                await i.update({
                                    content: `:older_woman: \`${author.username}\` **VS**  \`${member.user.username}\` \n\n${instance.messageHandler.get(guild, "VELHA_MOVIMENTO", {USER: board.currentMark() === 'X' ? author.username : member.user.username})}`,
                                    components: [row, row2, row3]
                                })

                                if (board.isGameOver()) {
                                    collector2.stop()
                                }
                            })

                            collector2.on('end', async () => {
                                if (board.hasWinner()) {
                                    if(board.winningPlayer() === 'X') {
                                        await functions.changeDB(author.id, 'falcoins', bet)
                                        await functions.changeDB(author.id, 'vitorias', 1)
                                        await functions.changeDB(member.id, 'falcoins', -bet)
                                    } else {
                                        await functions.changeDB(member.id, 'falcoins', bet)
                                        await functions.changeDB(member.id, 'vitorias', 1)
                                        await functions.changeDB(author.id, 'falcoins', -bet)
                                    }
                                    await answer2.edit({
                                        content: `:older_woman: \`${author.username}\` **VS**  \`${member.user.username}\` \n\n**${instance.messageHandler.get(guild, "GANHOU", {WINNER: board.winningPlayer() === 'X' ? author.username : member.user.username, FALCOINS: bet})}**`,
                                    })  
                                } else {
                                    await answer2.edit({
                                        content: `:older_woman: \`${author.username}\` **VS**  \`${member.user.username}\` \n\n${instance.messageHandler.get(guild, "VELHA_EMPATOU")}`
                                    })  
                                }
                            })
                        }
                    })
                } else {
                    return instance.messageHandler.get(guild, "INSUFICIENTE_CONTAS")
                }
            } else {
                return instance.messageHandler.get(guild, "NAO_JOGAR_SOZINHO")
            }
        } catch (error) {
            console.error(`velha: ${error}`)
        }
    }
}   