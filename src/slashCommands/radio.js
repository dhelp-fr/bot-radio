const {SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction, EmbedBuilder, Colors} = require("discord.js");
const fs = require("fs");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('radio')
        .setDescription('Changer la radio d\'écoute du bot.')
        .addStringOption(
            opt => opt
                .setName('country')
                .setDescription('définissez le pays de recherche de la radio')
                .setAutocomplete(true)
        )
        .addStringOption(
            opt => opt
                .setName('search')
                .setDescription('Recherchez la radio avec son nom')
                .setAutocomplete(true)
        )
        .addStringOption(
            opt => opt
                .setName('tag')
                .setDescription('définissez le tag de recherche de la radio')
                .setAutocomplete(true)
        )
        .setDMPermission(false),
    /**
     *
     * @param {RadioClient} client
     * @param {AutocompleteInteraction} interaction
     */
    async autocomplete(client, interaction) {
        const focused = interaction.options.getFocused(true);
        const tag = interaction.options.getString('tag');
        const country = interaction.options.getString('country');
        switch (true) {
            case focused.name === 'tag' : {
                const tags = await client.radio.getCategory('tags', {
                    by: focused.value,
                    limit: 25,
                    reverse: true,
                    order: 'stationcount',
                    country: country,
                }).catch(() => {});
                void interaction.respond(tags.map(x => ({
                    name: `${x.name.length > 60 ? x.name.slice(0, 60) + '...' : x.name} (${x.stationcount})`,
                    value: x.name
                }))).catch(() => ([]));
            }break;
            case focused.name === 'country' : {
                const countries = await client.radio.getCategory('countries', {
                    searchterm: focused.value,
                    limit: 25,
                    order: 'stationcount',
                    reverse: true
                }).catch(() => ([]));
                void interaction.respond(countries.map(x => ({
                    name: `${x.name} (${x.stationcount})`,
                    value: x.name
                }))).catch(() => {});
            }break;
            case focused.name === 'search' : {
                const filter = {
                    name: focused.value,
                    tag: tag,
                    country: country,
                    limit: 10,
                    order: 'votes',
                    hidebroken: true,
                    reverse: true,
                    codec: 'MP3'
                };
                const stations = await client.radio.searchStations(filter).catch(() => {});
                void interaction.respond(stations.map(x => ({
                    name: `${x.name.length > 50 ? x.name.slice(0, 50) + '...' : x.name} ${x.language ? `(${x.language})` : ''}`,
                    value: x.stationuuid
                }))).catch(() => ([]))
            }break;
        }
    },
    /**
     *
     * @param {RadioClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply()
        const searched = interaction.options.getString('search');
        if (!searched)return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription('Vous devez remplir l\'option `search` afin de changer la radio !')
            ]
        });

        const station = (await client.radio.getStations({
            searchterm: searched,
            by: 'uuid',
        }))[0];

        client.config.radio_uuid = station.stationuuid;
        fs.writeFileSync("./config.json", JSON.stringify(client.config, null, 2));

        if (client.voice.adapters.get(interaction.guildId))
            client.player.createRessource(station.url)

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Aqua)
                    .setTitle('Changement de piste radio')
                    .setDescription(
                        `**${station.name}**\n`+
                        (station.homepage ? `- Page web de la radio: [Cliquez ici](${station.homepage})\n` : '') +
                        (station.country ? `- Pays : **${station.country}**\n` : '') +
                        (station.tags ? `- Tag : \`${station.tags}\`` : '')
                    )
                    .setThumbnail(station.favicon || null)
                    .setFooter({ text: `Nombre de vote : ${station.votes || 0}`})
            ]
        });
    }
}