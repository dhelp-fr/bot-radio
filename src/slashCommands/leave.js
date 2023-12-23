const {SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Colors} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Permet de faire quitter le bot radio du channel')
        .setDMPermission(false),
    /**
     *
     * @param {RadioClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(client, interaction) {
        client.player.stop()

        void interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription('La radio est désormait dans aucun channel.')
            ]
        })
    }
}