const {Events, VoiceState} = require("discord.js");
module.exports = {
    name: Events.VoiceStateUpdate,
    /**
     * @param {RadioClient} client
     * @param {VoiceState} old
     * @param {VoiceState} nuw
     */
    execute(client, old, nuw) {
         if ((old ? old : nuw).member.id !== client.user.id)return;

         if (client.player.channelId === nuw.channelId)return;

         client.player.joinChannel(old.channelId, old.guild.id, old.guild.voiceAdapterCreator)
    }
}