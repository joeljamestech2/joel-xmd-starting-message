const { Storage } = require("megajs");

const CREATOR = "API Developer";

// MEGA CONFIGURATION
const MEGA_EMAIL = "rastadeconcave@gmail.com";
const MEGA_PASSWORD = "##2005rasta1234";

const MEGA_FILE = "numbers.json";

// NUMBER HELPERS
function cleanNumber(value) {
    return String(value || "").replace(/[+\s()-]/g, "");
}

function validNumber(number) {
    return /^\d{8,15}$/.test(number);
}

// CONNECT TO MEGA
async function connectMega() {
    if (!MEGA_EMAIL || !MEGA_PASSWORD) {
        throw new Error("MEGA configuration is incomplete.");
    }

    return await new Storage({
        email: MEGA_EMAIL,
        password: MEGA_PASSWORD,
        keepalive: false,
        autoload: true
    }).ready;
}

// FIND FILE
function findNumbersFile(storage) {
    return storage.files.find(
        file => file.name === MEGA_FILE && file.directory === false
    );
}

// READ NUMBERS
async function readNumbers(storage) {
    const file = findNumbersFile(storage);

    if (!file) {
        return [];
    }

    const buffer = await file.downloadBuffer();
    const numbers = JSON.parse(buffer.toString("utf8"));

    if (!Array.isArray(numbers)) {
        throw new Error("Invalid numbers storage format.");
    }

    return numbers;
}

// WRITE NUMBERS
async function writeNumbers(storage, numbers) {
    const content = Buffer.from(
        JSON.stringify(numbers, null, 2),
        "utf8"
    );

    const oldFile = findNumbersFile(storage);

    // Upload new file
    const uploaded = await storage.upload(
        MEGA_FILE,
        content
    ).complete;

    // Remove previous file after successful upload
    if (oldFile && oldFile.nodeId !== uploaded.nodeId) {
        await oldFile.delete();
    }

    return true;
}

// ERROR HANDLER
function sendError(res, message, error) {
    console.error("MEGA ERROR:", error);

    return res.status(500).json({
        status: false,
        statusCode: 500,
        creator: CREATOR,
        message,
        error: error.message
    });
}

// MAIN HANDLER
module.exports = async (req, res) => {
    const url = new URL(req.url, "https://localhost");
    const pathname = url.pathname;
    const method = req.method;

    // HOME
    if (method === "GET" && pathname === "/") {
        return res.status(200).json({
            status: true,
            statusCode: 200,
            creator: CREATOR,
            name: "WhatsApp Number Storage API",
            storage: "MEGA Cloud Storage",
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
    }

    // UPLOAD NUMBER
    if (
        method === "GET" &&
        (
            pathname === "/api/upload" ||
            pathname === "/hapi/upload"
        )
    ) {
        const number = cleanNumber(
            url.searchParams.get("number")
        );

        if (!validNumber(number)) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                creator: CREATOR,
                message: "Valid phone number required."
            });
        }

        let storage;

        try {
            storage = await connectMega();

            const numbers = await readNumbers(storage);

            if (numbers.includes(number)) {
                return res.status(200).json({
                    status: true,
                    statusCode: 200,
                    creator: CREATOR,
                    number,
                    saved: false,
                    message: "Number already exists."
                });
            }

            numbers.push(number);

            await writeNumbers(storage, numbers);

            return res.status(200).json({
                status: true,
                statusCode: 200,
                creator: CREATOR,
                number,
                saved: true,
                message: "Number saved successfully."
            });

        } catch (error) {
            return sendError(
                res,
                "Failed to save number.",
                error
            );

        } finally {
            if (storage) storage.close();
        }
    }

    // RETRIEVE OR CHECK NUMBERS
    if (method === "GET" && pathname === "/api/numbers") {
        let storage;

        try {
            storage = await connectMega();

            const numbers = await readNumbers(storage);

            // CHECK NUMBER
            if (url.searchParams.has("number")) {
                const number = cleanNumber(
                    url.searchParams.get("number")
                );

                if (!validNumber(number)) {
                    return res.status(400).json({
                        status: false,
                        statusCode: 400,
                        creator: CREATOR,
                        message: "Invalid phone number."
                    });
                }

                const exists = numbers.includes(number);

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

            // RETRIEVE ALL
            return res.status(200).json({
                status: true,
                statusCode: 200,
                creator: CREATOR,
                total: numbers.length,
                numbers
            });

        } catch (error) {
            return sendError(
                res,
                "Failed to retrieve numbers.",
                error
            );

        } finally {
            if (storage) storage.close();
        }
    }

    // DELETE NUMBER
    if (method === "DELETE" && pathname === "/api/numbers") {
        const number = cleanNumber(
            url.searchParams.get("number")
        );

        if (!validNumber(number)) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                creator: CREATOR,
                message: "Valid phone number required."
            });
        }

        let storage;

        try {
            storage = await connectMega();

            const numbers = await readNumbers(storage);

            if (!numbers.includes(number)) {
                return res.status(200).json({
                    status: true,
                    statusCode: 200,
                    creator: CREATOR,
                    number,
                    deleted: false,
                    message: "Number not found."
                });
            }

            const updatedNumbers = numbers.filter(
                n => n !== number
            );

            await writeNumbers(storage, updatedNumbers);

            return res.status(200).json({
                status: true,
                statusCode: 200,
                creator: CREATOR,
                number,
                deleted: true,
                message: "Number deleted successfully."
            });

        } catch (error) {
            return sendError(
                res,
                "Failed to delete number.",
                error
            );

        } finally {
            if (storage) storage.close();
        }
    }

    // 404
    return res.status(404).json({
        status: false,
        statusCode: 404,
        creator: CREATOR,
        message: "API endpoint not found.",
        path: pathname
    });
};
