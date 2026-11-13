import express from "express";
import { put, list, del } from "@vercel/blob";

const app = express();

const CREATOR = "API Developer";
const PREFIX = "saved-numbers/";

app.use(express.json());

// CLEAN PHONE NUMBER
function cleanNumber(value) {
    return String(value || "").replace(/[+\s()-]/g, "");
}

// VALIDATE PHONE NUMBER
function validNumber(number) {
    return /^\d{8,15}$/.test(number);
}

// GET ALL SAVED NUMBERS
async function getAllNumbers() {
    let cursor;
    let hasMore = true;
    const numbers = [];

    while (hasMore) {
        const result = await list({
            prefix: PREFIX,
            limit: 1000,
            cursor,
            mode: "expanded"
        });

        for (const blob of result.blobs) {
            const match = blob.pathname.match(
                /^saved-numbers\/(\d+)\.json$/
            );

            if (match) {
                numbers.push({
                    number: match[1],
                    url: blob.url,
                    uploadedAt: blob.uploadedAt
                });
            }
        }

        hasMore = result.hasMore;
        cursor = result.cursor;
    }

    return numbers;
}

// HOME - VIEW ALL ENDPOINTS
app.get("/", (req, res) => {
    res.status(200).json({
        status: true,
        statusCode: 200,
        creator: CREATOR,
        name: "WhatsApp Number Storage API",
        description: "Permanent WhatsApp Number Storage",
        endpoints: {
            upload: {
                method: "GET",
                url: "/api/upload?number=255714595078"
            },
            retrieve: {
                method: "GET",
                url: "/api/numbers"
            },
            check: {
                method: "GET",
                url: "/api/numbers?number=255712345678"
            },
            delete: {
                method: "DELETE",
                url: "/api/numbers?number=255712345678"
            },
            dashboard: {
                method: "GET",
                url: "/dashboard"
            }
        }
    });
});

// UPLOAD NUMBER
app.get("/api/upload", async (req, res) => {
    const number = cleanNumber(req.query.number);

    if (!validNumber(number)) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            creator: CREATOR,
            message: "Valid phone number required.",
            example: "/api/upload?number=255714595078"
        });
    }

    try {
        const existing = await list({
            prefix: `${PREFIX}${number}.json`,
            limit: 10
        });

        const alreadyExists = existing.blobs.some(
            blob => blob.pathname === `${PREFIX}${number}.json`
        );

        if (alreadyExists) {
            return res.status(200).json({
                status: true,
                statusCode: 200,
                creator: CREATOR,
                number,
                saved: false,
                message: "Number already exists."
            });
        }

        await put(
            `${PREFIX}${number}.json`,
            JSON.stringify({
                number,
                createdAt: new Date().toISOString()
            }),
            {
                access: "private",
                addRandomSuffix: false,
                allowOverwrite: false,
                contentType: "application/json"
            }
        );

        return res.status(200).json({
            status: true,
            statusCode: 200,
            creator: CREATOR,
            number,
            saved: true,
            message: "Number saved successfully."
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            creator: CREATOR,
            message: "Failed to save number.",
            error: error.message
        });
    }
});

// RETRIEVE ALL NUMBERS OR CHECK NUMBER
app.get("/api/numbers", async (req, res) => {
    try {
        // CHECK NUMBER
        if (req.query.number !== undefined) {
            const number = cleanNumber(req.query.number);

            if (!validNumber(number)) {
                return res.status(400).json({
                    status: false,
                    statusCode: 400,
                    creator: CREATOR,
                    message: "Invalid phone number."
                });
            }

            const result = await list({
                prefix: `${PREFIX}${number}.json`,
                limit: 10
            });

            const exists = result.blobs.some(
                blob => blob.pathname === `${PREFIX}${number}.json`
            );

            return res.status(200).json({
                status: true,
                statusCode: 200,
                creator: CREATOR,
                number,
                exists,
                message: exists
                    ? "Number is saved."
                    : "Number not found."
            });
        }

        // RETRIEVE ALL NUMBERS
        const numbers = await getAllNumbers();

        return res.status(200).json({
            status: true,
            statusCode: 200,
            creator: CREATOR,
            total: numbers.length,
            numbers: numbers.map(item => item.number)
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            creator: CREATOR,
            message: "Failed to retrieve numbers.",
            error: error.message
        });
    }
});

// DELETE NUMBER
app.delete("/api/numbers", async (req, res) => {
    const number = cleanNumber(req.query.number);

    if (!validNumber(number)) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            creator: CREATOR,
            message: "Valid phone number required."
        });
    }

    try {
        const result = await list({
            prefix: `${PREFIX}${number}.json`,
            limit: 10
        });

        const blob = result.blobs.find(
            item => item.pathname === `${PREFIX}${number}.json`
        );

        if (!blob) {
            return res.status(200).json({
                status: true,
                statusCode: 200,
                creator: CREATOR,
                number,
                deleted: false,
                message: "Number not found."
            });
        }

        await del(blob.url);

        return res.status(200).json({
            status: true,
            statusCode: 200,
            creator: CREATOR,
            number,
            deleted: true,
            message: "Number deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            creator: CREATOR,
            message: "Failed to delete number.",
            error: error.message
        });
    }
});

// SAVED NUMBERS DASHBOARD
app.get("/dashboard", async (req, res) => {
    try {
        const numbers = await getAllNumbers();

        const rows = numbers.map(item => `
            <tr>
                <td>${item.number}</td>
                <td>WhatsApp-compatible format</td>
            </tr>
        `).join("");

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Saved Numbers</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        font-family: Arial;
                        background: #101820;
                        color: white;
                        padding: 20px;
                    }
                    h1 { color: #25d366; }
                    .card {
                        background: #1c2935;
                        padding: 20px;
                        border-radius: 12px;
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    td, th {
                        padding: 13px;
                        border-bottom: 1px solid #34495e;
                        text-align: left;
                    }
                    th { color: #25d366; }
                </style>
            </head>
            <body>
                <h1>Saved Numbers</h1>

                <div class="card">
                    <h2>Total: ${numbers.length}</h2>
                    <p>WhatsApp Number Storage API</p>
                </div>

                <div class="card">
                    <table>
                        <thead>
                            <tr>
                                <th>Phone Number</th>
                                <th>Format</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows || "<tr><td colspan='2'>No numbers saved.</td></tr>"}
                        </tbody>
                    </table>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        res.status(500).send("Failed to load saved numbers.");
    }
});

// API 404
app.use("/api", (req, res) => {
    res.status(404).json({
        status: false,
        statusCode: 404,
        creator: CREATOR,
        message: "API endpoint not found.",
        path: req.originalUrl
    });
});

// EXPORT
export default app;
