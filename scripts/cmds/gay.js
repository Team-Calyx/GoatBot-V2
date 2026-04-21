const DIG = require("@zorner/discord-image-generation");
const axios = require('axios');
const fs = require("fs");
const os = require("os");
const path = require("path");

module.exports = {
    config: {
        name: "gay",
        aliases: ["gay"],
        version: "1.2",
        author: "Rômeo",
        countDown: 5,
        role: 0,
        shortDescription: "rainbowify someone's avatar",
        longDescription: "",
        category: "fun",
        guide: "{pn} [@mention]"
    },

    onStart: async function ({ message, event, args }) {
        const mentions = Object.keys(event.mentions);
        const senderID = event.senderID;

        const targetID = event.type === "message_reply"
            ? event.messageReply.senderID
            : mentions.length > 0
                ? mentions[0]
                : senderID;

        const targetName = event.type === "message_reply"
            ? event.messageReply.senderName
            : mentions.length > 0
                ? Object.values(event.mentions)[0]
                : "You";

        const pth = await makeGay(targetID);

        await message.reply({
            body: `Hey 🏳️‍🌈 `,
            attachment: fs.createReadStream(pth)
        });

        try { fs.unlinkSync(pth); } catch (e) { /* ignore */ }
    }
};

async function getAvatarBuffer(uid) {
    const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

async function makeGay(uid) {
    const avatar = await getAvatarBuffer(uid);
    const img = await new DIG.Gay().getImage(avatar);
    const tmpDir = os.tmpdir();
    const pth = path.join(tmpDir, `gay_${Date.now()}_${Math.floor(Math.random()*10000)}.png`);
    fs.writeFileSync(pth, img);
    return pth;
}