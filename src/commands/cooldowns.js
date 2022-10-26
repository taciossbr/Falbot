const { MessageEmbed } = require("discord.js")
const { readFile, getRoleColor, msToTime } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const fs = require("fs")

module.exports = {
	category: "uteis",
	description: "Shows your commands cooldowns",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, user, member }) => {
		try {
			var config = JSON.parse(fs.readFileSync("./src/config.json", "utf8"))
			voteCooldown = Date.now() - (await readFile(user.id, "lastVote"))
			scratchSchema = instance._mongoConnection.models["wokcommands-cooldowns"]
			scratchCooldown = await scratchSchema.findById(
				`scratch-${guild.id}-${user.id}`
			)
			const embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setAuthor({ name: member.displayName, iconURL: user.avatarURL() })
				.setFooter({ text: "by Falcão ❤️" })
				.setTitle(instance.messageHandler.get(guild, "COOLDOWNS"))
				.addFields(
					{
						name: ":ballot_box: " + instance.messageHandler.get(guild, "VOTO"),
						value: `**${
							voteCooldown < 43200000
								? `:red_circle: ${await msToTime(43200000 - voteCooldown)}`
								: `:green_circle: ${instance.messageHandler.get(
										guild,
										"PRONTO"
								  )}`
						}**`,
						inline: true,
					},
					{
						name:
							":slot_machine: " + instance.messageHandler.get(guild, "SCRATCH"),
						value: `**${
							scratchCooldown
								? `:red_circle: ${await msToTime(
										scratchCooldown["cooldown"] * 1000
								  )}`
								: `:green_circle: ${instance.messageHandler.get(
										guild,
										"PRONTO"
								  )}`
						}**`,
						inline: true,
					},
					{
						name:
							":loudspeaker: " + instance.messageHandler.get(guild, "EVENTS"),
						value: `**${instance.messageHandler.get(
							guild,
							"LOTTERY"
						)}** - ${instance.messageHandler.get(guild, "LOTTERY_DRAWN", {
							TIME: await msToTime(config["lottery"]["drawTime"] - Date.now()),
						})}`,
						inline: false,
					}
				)

			return embed
		} catch (error) {
			console.error(`cooldowns: ${error}`)
		}
	},
}
