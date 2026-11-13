

const CREATOR = "API Developer";

// GITHUB CONFIGURATION
const GITHUB_OWNER = "joeljamestech";
const GITHUB_REPO = "joel-xmd-starting-message";
const GITHUB_TOKEN = "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";
const GITHUB_BRANCH = "main";

const GITHUB_FILE = "data/numbers.json";
const API_URL = "https://api.github.com";
function cleanNumber(value) {
    return String(value || "").replace(/[+\s()-]/g, "");
}

function validNumber(number) {
    return /^\d{8,15}$/.test(number);
}

// GITHUB CONFIGURATION
function checkConfig() {
    if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
        throw new Error("GitHub storage configuration is incomplete.");
    }
}

// GITHUB REQUEST
async function githubRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(
            data.message || "GitHub storage request failed."
        );

        error.status = response.status;
        throw error;
    }

    return data;
}

// FILE URL
function getFileURL() {
    const file = GITHUB_FILE
        .split("/")
        .map(encodeURIComponent)
        .join("/");

    return `${API_URL}/repos/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(GITHUB_REPO)}/contents/${file}`;
}

// READ NUMBERS
async function readNumbers() {
    checkConfig();

    try {
        const url = `${getFileURL()}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;

        const file = await githubRequest(url);

        const content = Buffer.from(
            file.content.replace(/\s/g, ""),
            "base64"
        ).toString("utf8");

        const numbers = JSON.parse(content);

        if (!Array.isArray(numbers)) {
            throw new Error("Invalid numbers storage format.");
        }

        return {
            numbers,
            sha: file.sha
        };

    } catch (error) {
        if (error.status === 404) {
            return {
                numbers: [],
                sha: null
            };
        }

        throw error;
    }
}

// WRITE NUMBERS
async function writeNumbers(numbers, sha) {
    checkConfig();

    const content = Buffer.from(
        JSON.stringify(numbers, null, 2)
    ).toString("base64");

    const body = {
        message: "Update saved phone numbers",
        content,
        branch: GITHUB_BRANCH
    };

    if (sha) {
        body.sha = sha;
    }

    return githubRequest(getFileURL(), {
        method: "PUT",
        body: JSON.stringify(body)
    });
}

// UPDATE WITH CONFLICT RETRIES
async function updateNumbers(callback) {
    for (let attempt = 0; attempt < 5; attempt++) {
        const { numbers, sha } = await readNumbers();

        const result = callback(numbers);

        if (!result.changed) {
            return result.value;
        }

        try {
            await writeNumbers(result.numbers, sha);
            return result.value;

        } catch (error) {
            if (
                (error.status === 409 || error.status === 422) &&
                attempt < 4
            ) {
                continue;
            }

            throw error;
        }
    }

    throw new Error("Unable to update number storage.");
}

// RESPONSE HELPER
function sendError(res, message, error) {
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
            storage: "GitHub JSON",
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
        (pathname === "/api/upload" || pathname === "/hapi/upload")
    ) {
        const number = cleanNumber(url.searchParams.get("number"));

        if (!validNumber(number)) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                creator: CREATOR,
                message: "Valid phone number required."
            });
        }

        try {
            const saved = await updateNumbers(numbers => {
                if (numbers.includes(number)) {
                    return {
                        changed: false,
                        value: false
                    };
                }

                return {
                    changed: true,
                    numbers: [...numbers, number],
                    value: true
                };
            });

            return res.status(200).json({
                status: true,
                statusCode: 200,
                creator: CREATOR,
                number,
                saved,
                message: saved
                    ? "Number saved successfully."
                    : "Number already exists."
            });

        } catch (error) {
            return sendError(
                res,
                "Failed to save number.",
                error
            );
        }
    }

    // RETRIEVE OR CHECK NUMBERS
    if (method === "GET" && pathname === "/api/numbers") {
        try {
            const { numbers } = await readNumbers();

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

            // RETRIEVE ALL NUMBERS
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

        try {
            const deleted = await updateNumbers(numbers => {
                if (!numbers.includes(number)) {
                    return {
                        changed: false,
                        value: false
                    };
                }

                return {
                    changed: true,
                    numbers: numbers.filter(n => n !== number),
                    value: true
                };
            });

            return res.status(200).json({
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
            return sendError(
                res,
                "Failed to delete number.",
                error
            );
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
