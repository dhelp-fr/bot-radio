const {SlashCommandBuilder, ChatInputCommandInteraction, VoiceChannel, EmbedBuilder, Colors} = require("discord.js");
const {joinVoiceChannel, createAudioResource, createAudioPlayer, generateDependencyReport} = require("@discordjs/voice");
const {ChannelType} = require("discord-api-types/v10");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Permet de faire rejoindre le bot un salon vocal')
        .setDMPermission(false)
        .addChannelOption(
            opt => opt
                .setName('channel')
                .setDescription('Le channel à rejoindre')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
        ),
    /**
     *
     * @param {RadioClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const chl = interaction.options.getChannel('channel');

        /**
         * @type {VoiceChannel}
         */
        const channel = await client.channels.fetch(chl.id);
        if (!channel.joinable)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription('**Je n\'ai pas la permission de rejoindre ce channel !**')
            ]
        });
        if (!client?.config?.radio_uuid)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription('Il n\'y a pas de radio définie (/radio) !')
            ]
        });

        const station = (await client.radio.getStations({
            searchterm: client.config.radio_uuid,
            by: 'uuid',
        }))[0];

        client.player.joinChannel(channel.id, channel.guildId, channel.guild.voiceAdapterCreator)

        client.player.createRessource(station.url);

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`La radio est définie dans le channel ${channel.toString()}`)
            ]
        })
    }
}