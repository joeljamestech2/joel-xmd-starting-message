const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Root Endpoint: Send formatted JSON
app.get('/', (req, res) => {
    const data = {
        title: 'joel Xmd starting messages',
        bot_name: ' ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ',
        creator: 'joeljamestech',
        channel_link: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
        channel_jid: '120363317462952356@newsletter',
        thumbnail: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg',
        image: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/Xstarting.jpg',
        premiumumusers: '[255714595078,255781144539,255767570963,255684884538,919862726575]',
        caption: '\`\`\`╭❍「JOEL XMD BOT」❍\`\`\`\n\`\`\`│mode: private\`\`\`\n\`\`\`│status: online\`\`\`\n\`\`\`│uptime: 2s\`\`\`\n\`\`\`│theme: joelXtech\`\`\`\n\`\`\`╰──────────❍\`\`\`\n\`\`\`powered by joelXtec\`\`\`'
};
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 4)); // 4-space indentation
});

// Start server
app.listen(PORT, () => {
    console.log(`joel Xmd server running on port ${PORT}`);
});
//joel Xmd starting message server 
//╭━━ 『 ᴊᴏᴇʟ-ᴍᴅ ɪɴɪᴛɪᴀʟɪᴢᴇᴅ 』\n┃  ⚡ ʙᴏᴛ ɴᴀᴍᴇ: ᴊᴏᴇʟ-ᴍᴅ \n┃  👑 ᴏᴡɴᴇʀ: ʟᴏʀᴅ ᴊᴏᴇʟ \n┃  ⚙️ ᴍᴏᴅᴇ: *private*\n┃  🎯 ᴘʀᴇꜰɪx: *.*\n┃  ✅ ꜱᴛᴀᴛᴜꜱ: ᴏɴʟɪɴᴇ & ꜱᴛᴀʙʟᴇ\n╰━━━━━━━━━━━━━━━━━━━╯\n\n⚠️ ʀᴇᴘᴏʀᴛ ᴀɴʏ ɢʟɪᴛᴄʜᴇꜱ ᴅɪʀᴇᴄᴛʟʏ ᴛᴏ ᴛʜᴇ ᴏᴡɴᴇʀ.\n\n╭──────────────────★\n│ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ\n╰──────────────────★
//https://vimatech.vercel.app/second           
