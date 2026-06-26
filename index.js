const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Data Storage
const startingMessagesData = {
    title: 'joel Xmd starting messages',
    bot_name: ' ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ',
    creator: 'joeljamestech',
    channel_link: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
    channel_jid: '120363317462952356@newsletter',
    thumbnail: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg',
    image: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/Xstarting.jpg',
    premiumumusers: '[255714595078,255781144539,255767570963,255684884538,919862726575]',
    caption: '```╭❍「JOEL XMD BOT」❍```\n```│mode: private```\n```│status: online```\n```│uptime: 2s```\n```│theme: joelXtech```\n```╰──────────❍```\n```powered by joelXtec```'
};

const notificationData = {
    title: 'joel Xmd notifications',
    status: 'active',
    frequency: 'instant',
    logs: 'System operational'
};

// --- API ENDPOINTS ---

// GET: Fetch starting messages configuration
app.get('/api/starting-messages', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(startingMessagesData, null, 4));
});

// GET: Fetch notification configuration
app.get('/api/notifications', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(notificationData, null, 4));
});


// --- HTML WEB INTERFACE (Based on IMG-20260626-WA0011.jpg) ---
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JOEL XMD COMMAND CENTRE</title>
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <!-- JetBrains Mono Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg-color: #050508;
            --card-bg: #0d0d14;
            --border-color: #1f1f2e;
            --text-main: #ffffff;
            --text-muted: #7e7e9a;
            --accent-green: #00ff66;
            --accent-pink: #ff007f;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'JetBrains Mono', monospace;
            padding: 20px;
            display: flex;
            justify-content: center;
        }

        .container {
            width: 100%;
            max-width: 480px;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        /* Module Card Base Stlye */
        .card {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 16px;
            position: relative;
        }

        /* Terminal Window Dots */
        .window-dots {
            position: absolute;
            top: 12px;
            right: 12px;
            display: flex;
            gap: 6px;
        }
        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--border-color);
        }
        .dot.pink { background-color: var(--accent-pink); }

        /* Section Headers */
        .section-title {
            font-size: 1.1rem;
            text-transform: lowercase;
            color: var(--text-main);
            margin-bottom: 12px;
            padding-left: 4px;
            border-left: 3px solid var(--accent-pink);
        }

        /* Top Header Core Control */
        .header-box {
            border-color: var(--accent-green);
            text-align: center;
        }
        .header-box h1 {
            font-size: 1.2rem;
            letter-spacing: 1px;
            margin-bottom: 16px;
            color: var(--accent-green);
            text-transform: uppercase;
        }
        .profile-section {
            display: flex;
            align-items: center;
            gap: 16px;
            text-align: left;
            background: rgba(255,255,255,0.02);
            padding: 12px;
            border-radius: 8px;
        }
        .avatar-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid var(--accent-green);
            display: flex;
            align-items: center;
            justify-content: center;
            background: #111;
            color: var(--accent-green);
            font-size: 1.4rem;
        }
        .profile-info h2 {
            font-size: 1rem;
            color: var(--text-main);
        }
        .profile-info p {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 2px;
        }

        /* Endpoint Control Rows */
        .endpoint-card {
            margin-bottom: 16px;
        }
        .endpoint-card h3 {
            font-size: 0.9rem;
            margin-bottom: 8px;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .endpoint-card h3 i {
            color: var(--accent-pink);
        }
        .url-bar {
            display: flex;
            gap: 6px;
            margin-bottom: 8px;
        }
        .url-input {
            flex: 1;
            background: #000;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 6px 10px;
            color: var(--accent-green);
            font-size: 0.75rem;
            font-family: inherit;
        }
        .btn {
            background: #1a1a26;
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .btn:hover {
            background: var(--accent-pink);
            color: #000;
            border-color: var(--accent-pink);
        }
        .btn-green:hover {
            background: var(--accent-green);
            color: #000;
            border-color: var(--accent-green);
        }
        .response-preview {
            width: 100%;
            height: 80px;
            background: #000;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 8px;
            color: var(--text-muted);
            font-size: 0.7rem;
            resize: none;
            font-family: inherit;
        }

        /* Repo Items */
        .repo-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .repo-item {
            background: rgba(255,255,255,0.01);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .repo-left {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        .repo-icon {
            font-size: 1.2rem;
            color: var(--accent-green);
        }
        .repo-name {
            font-size: 0.9rem;
            font-weight: bold;
        }
        .repo-desc {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 2px;
        }
        .repo-stats {
            display: flex;
            gap: 10px;
            font-size: 0.7rem;
            margin-top: 4px;
            color: var(--accent-pink);
        }
        .status-msg {
            font-size: 0.7rem;
            color: var(--accent-green);
            margin-top: 4px;
            min-height: 12px;
        }

        /* Developer Card */
        .dev-card {
            text-align: center;
            padding: 24px 16px;
        }
        .dev-avatar {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            border: 1px dashed var(--accent-pink);
            margin: 0 auto 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: var(--accent-pink);
            background: #000;
        }
        .dev-username {
            font-size: 1rem;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .dev-bio {
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-top: 6px;
        }

        /* Footer Element */
        footer {
            text-align: center;
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 8px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
        }
        .social-row {
            display: flex;
            gap: 12px;
        }
        .social-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-main);
            text-decoration: none;
            font-size: 0.85rem;
            transition: all 0.2s ease;
        }
        .social-icon:hover {
            border-color: var(--accent-green);
            color: var(--accent-green);
            background: rgba(0,255,102,0.05);
        }
    </style>
</head>
<body>

    <div class="container">

        <!-- Top Core App Wrapper -->
        <div class="card header-box">
            <h1>joel xmd command centre</h1>
            <div class="profile-section">
                <div class="avatar-circle">
                    <i class="fa fa-terminal"></i>
                </div>
                <div class="profile-info">
                    <h2>joel - xmd</h2>
                    <p>welcome to joel-xmd the home of technology.</p>
                </div>
            </div>
        </div>

        <!-- Categories Routing Framework -->
        <div>
            <h2 class="section-title">categories de centre</h2>
            
            <div class="card">
                <div class="window-dots"><div class="dot"></div><div class="dot pink"></div></div>
                
                <!-- Card 1: Starting Message Controller -->
                <div class="endpoint-card">
                    <h3><i class="fa fa-envelope-o"></i> starting messages style</h3>
                    <div class="url-bar">
                        <input type="text" class="url-input" id="url-start" readonly value="${req.protocol}://${req.get('host')}/api/starting-messages">
                        <button class="btn" onclick="copyRoute('url-start', 'status-start')">copy</button>
                        <button class="btn" onclick="viewRoute('/api/starting-messages', 'preview-start')">view</button>
                        <button class="btn btn-green">edit</button>
                    </div>
                    <textarea class="response-preview" id="preview-start" readonly placeholder="// Click view to parse current api live payload..."></textarea>
                    <div class="status-msg" id="status-start"></div>
                </div>

                <!-- Card 2: Notification Style Controller -->
                <div class="endpoint-card" style="margin-bottom: 0;">
                    <h3><i class="fa fa-bell-o"></i> notification style</h3>
                    <div class="url-bar">
                        <input type="text" class="url-input" id="url-notify" readonly value="${req.protocol}://${req.get('host')}/api/notifications">
                        <button class="btn" onclick="copyRoute('url-notify', 'status-notify')">copy</button>
                        <button class="btn" onclick="viewRoute('/api/notifications', 'preview-notify')">view</button>
                        <button class="btn btn-green">edit</button>
                    </div>
                    <textarea class="response-preview" id="preview-notify" readonly placeholder="// Click view to parse current api live payload..."></textarea>
                    <div class="status-msg" id="status-notify"></div>
                </div>
            </div>
        </div>

        <!-- Git Tracked Repos Matrix -->
        <div>
            <h2 class="section-title">other repos</h2>
            <div class="repo-list">
                
                <!-- Repo 1 -->
                <div class="repo-item">
                    <div class="repo-left">
                        <div class="repo-icon"><i class="fa fa-github-alt"></i></div>
                        <div>
                            <div class="repo-name">joel-xmd</div>
                            <div class="repo-desc">advanced whatsapp bot by joel</div>
                            <div class="repo-stats">
                                <span><i class="fa fa-star"></i> 104</span>
                                <span><i class="fa fa-code-fork"></i> 335</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn" onclick="window.open('https://github.com/joeljamestech2/JOEL-XMD', '_blank')"><i class="fa fa-code-fork"></i> fork</button>
                </div>

                <!-- Repo 2 -->
                <div class="repo-item">
                    <div class="repo-left">
                        <div class="repo-icon"><i class="fa fa-github-alt"></i></div>
                        <div>
                            <div class="repo-name">joel-md</div>
                            <div class="repo-desc">advanced wa chat bot</div>
                            <div class="repo-stats">
                                <span><i class="fa fa-star"></i> 327</span>
                                <span><i class="fa fa-code-fork"></i> 665</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn" onclick="window.open('https://github.com/joeljamestech/joel-md', '_blank')"><i class="fa fa-code-fork"></i> fork</button>
                </div>

            </div>
        </div>

        <!-- Meet Developer Profile Core -->
        <div>
            <h2 class="section-title">meet developer</h2>
            <div class="card dev-card">
                <div class="window-dots"><div class="dot pink"></div></div>
                <div class="dev-avatar">
                    <i class="fa fa-user-circle-o"></i>
                </div>
                <div class="dev-username">joeljamestech</div>
                <div class="dev-bio">&gt; founder of joel xmd</div>
            </div>
        </div>

        <!-- Footnote Segment -->
        <footer>
            <div>joel jamestech inc 2026</div>
            <div class="social-row">
                <a href="https://github.com/joeljamestech2" target="_blank" class="social-icon"><i class="fa fa-github"></i></a>
                <a href="https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K" target="_blank" class="social-icon"><i class="fa fa-whatsapp"></i></a>
                <a href="#" class="social-icon"><i class="fa fa-telegram"></i></a>
            </div>
        </footer>

    </div>

    <!-- Non-Alert Client Engine Interactions -->
    <script>
        function copyRoute(inputId, statusId) {
            const copyText = document.getElementById(inputId);
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(copyText.value);
            
            const statusTarget = document.getElementById(statusId);
            statusTarget.innerText = ">> path tracking string linked to clipboard successful.";
            setTimeout(() => {
                statusTarget.innerText = "";
            }, 3000);
        }

        function viewRoute(endpoint, textareaId) {
            fetch(endpoint)
                .then(res => res.json())
                .then(data => {
                    document.getElementById(textareaId).value = JSON.stringify(data, null, 4);
                })
                .catch(err => {
                    document.getElementById(textareaId).value = "// err tracing downstream connection payload components.";
                });
        }
    </script>
</body>
</html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`joel Xmd server running on port ${PORT}`);
});