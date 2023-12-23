const {Client, IntentsBitField} = require("discord.js");
const RadioHandler = require("./Handler");
const config = require("../../config.json");
const radioBrowser = require('radio-browser')
const RadioPlayer = require("./Player");

module.exports = class RadioClient extends Client {

    /**
     * @typedef {config}
     */
    config = config;

    /**
     * @typedef {radioBrowser}
     */
    radio = radioBrowser;

    /**
     * @type {RadioPlayer}
     */
    player;

    constructor() {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildVoiceStates
            ]
        });
        void this.init()
    }

    async init() {
        console.log("  ██████╗ ██╗  ██╗███████╗██╗     ██████╗ \n  ██╔══██╗██║  ██║██╔════╝██║     ██╔══██╗\n  ██║  ██║███████║█████╗  ██║     ██████╔╝       "+"Version: ".yellow+this.config.developer.version+" \n  ██║  ██║██╔══██║██╔══╝  ██║     ██╔═══╝     "+"Denière Update: ".yellow+this.config.developer.lastUpdate+" \n  ██████╔╝██║  ██║███████╗███████╗██║           "+ "Développeur:".yellow+  " Ifanoxy\n  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     \n");
        this.log("Lancement des handlers...".white);
        this.handler = new RadioHandler(this);
        this.player = new RadioPlayer(this);
        this.login(this.config.client.token)
            .then(() => {
                this.handler.addSlashCommands();
            });
    }
    log(message, tab = 0) {
        console.log("\n".repeat(tab) + "[".grey.bright + "DHelp".magenta.bright + "]".grey.bright, message, "\n".repeat(tab));
    }
}