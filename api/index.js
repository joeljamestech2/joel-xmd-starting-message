const express = require("express");
const { neon } = require("@neondatabase/serverless");

const app = express();

const CREATOR = "API Developer";

app.use(express.json());

function getDB() {
    if (!process.env.DATABASE_URL) {
        throw new Error("PostgreSQL database is not connected.");
    }

    return neon(process.env.DATABASE_URL);
}

function cleanNumber(value) {
    return String(value || "").replace(/[+\s()-]/g, "");
}

function validNumber(number) {
    return /^\d{8,15}$/.test(number);
}

// INITIALIZE DATABASE
async function initializeDatabase() {
    const sql = getDB();

    await sql`
        CREATE TABLE IF NOT EXISTS saved_numbers (
            id BIGSERIAL PRIMARY KEY,
            phone_number VARCHAR(15) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
}

// HOME - ALL ENDPOINTS
app.get("/", async (req, res) => {
    res.status(200).json({
        status: true,
        statusCode: 200,
        creator: CREATOR,
        name: "WhatsApp Number Storage API",
        description: "Permanent Phone Number Storage API",
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
            message: "Valid phone number required."
        });
    }

    try {
        await initializeDatabase();

        const sql = getDB();

        const result = await sql`
            INSERT INTO saved_numbers (phone_number)
            VALUES (${number})
            ON CONFLICT (phone_number) DO NOTHING
            RETURNING phone_number
        `;

        res.status(200).json({
            status: true,
            statusCode: 200,
            creator: CREATOR,
            number,
            saved: result.length > 0,
            message: result.length > 0
                ? "Number saved successfully."
                : "Number already exists."
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            statusCode: 500,
            creator: CREATOR,
            message: "Failed to save number.",
            error: error.message
        });
    }
});

// RETRIEVE / CHECK NUMBERS
app.get("/api/numbers", async (req, res) => {
    try {
        await initializeDatabase();

        const sql = getDB();

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

            const result = await sql`
                SELECT phone_number
                FROM saved_numbers
                WHERE phone_number = ${number}
                LIMIT 1
            `;

            const exists = result.length > 0;

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
        const numbers = await sql`
            SELECT phone_number, created_at
            FROM saved_numbers
            ORDER BY created_at DESC
        `;

        return res.status(200).json({
            status: true,
            statusCode: 200,
            creator: CREATOR,
            total: numbers.length,
            numbers: numbers.map(item => item.phone_number)
        });

    } catch (error) {
        res.status(500).json({
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
        await initializeDatabase();

        const sql = getDB();

        const result = await sql`
            DELETE FROM saved_numbers
            WHERE phone_number = ${number}
            RETURNING phone_number
        `;

        const deleted = result.length > 0;

        res.status(200).json({
            status: true,
            statusCode: 200,
            creator: CREATOR,
            number,
            deleted,
            message: deleted
                ? "Number deleted successfully."
                : "Number not found."
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            statusCode: 500,
            creator: CREATOR,
            message: "Failed to delete number.",
            error: error.message
        });
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

module.exports = app;
