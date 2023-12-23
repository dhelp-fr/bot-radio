const {createAudioPlayer, joinVoiceChannel, createAudioResource, VoiceConnection, AudioResource} = require("@discordjs/voice");
module.exports = class RadioPlayer {
    /**
     * @param {RadioClient} client
     */
    #client;
    /**
     * @type {VoiceConnection}
     */
    #con;
    /**
     * @type {AudioResource<null>}
     */
    #ressource;
    channelId;
    constructor(client) {
        this.#client = client;
        this.init()
    }

    async init() {
        this.player = createAudioPlayer();
        this.channelId = null;
    }

    createRessource(url) {
        this.player.stop()
        this.#ressource = createAudioResource(url);
        this.#con.subscribe(this.player);

        this.play();
    }

    joinChannel(channel_id, guild_id, voiceAdapterCreator) {
        this.#con = joinVoiceChannel({
            channelId: channel_id,
            guildId: guild_id,
            adapterCreator: voiceAdapterCreator
        });
        this.channelId = channel_id;
    }

    play() {
        this.player.play(this.#ressource);
    }

    stop() {
        this.channelId = null;
        this.player.stop();
        this.#con.destroy();
    }
}