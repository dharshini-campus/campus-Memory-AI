require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

// ======================================================
// PROJECT REPORT FOLDER
// ======================================================

const reportsDir = path.join(__dirname, "project_reports");

if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

// ======================================================
// MULTER - PDF UPLOAD
// ======================================================

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed."));
        }
    }
});

// ======================================================
// GEMINI
// ======================================================

let geminiClient = null;

function getGeminiClient() {
    if (!geminiClient) {
        const { GoogleGenAI } = require("@google/genai");

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing.");
        }

        geminiClient = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }

    return geminiClient;
}

// ======================================================
// PDF TEXT EXTRACTION
// ======================================================

async function extractPDFText(buffer) {
    const pdfModule = require("pdf-parse");

    // Newer pdf-parse API
    if (pdfModule && typeof pdfModule.PDFParse === "function") {
        const parser = new pdfModule.PDFParse({
            data: buffer
        });

        const result = await parser.getText();

        if (typeof parser.destroy === "function") {
            await parser.destroy();
        }

        return result.text || "";
    }

    // Older pdf-parse API
    if (typeof pdfModule === "function") {
        const result = await pdfModule(buffer);
        return result.text || "";
    }

    throw new Error("Unable to load PDF parser.");
}

// ======================================================
// SAFE FILE NAME
// ======================================================

function safeFileName(name) {
    return String(name || "")
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/_+/g, "_");
}

// ======================================================
// ADMIN AUTHENTICATION
// ======================================================

const SESSION_SECRET =
    process.env.SESSION_SECRET || "CHANGE_THIS_SECRET";

const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

function createSession(username) {
    const payload = Buffer.from(
        JSON.stringify({
            username,
            expires: Date.now() + SESSION_DURATION
        })
    ).toString("base64url");

    const signature = crypto
        .createHmac("sha256", SESSION_SECRET)
        .update(payload)
        .digest("base64url");

    return `${payload}.${signature}`;
}

function verifySession(token) {
    try {
        if (!token) {
            return null;
        }

        const parts = token.split(".");

        if (parts.length !== 2) {
            return null;
        }

        const [payload, signature] = parts;

        const expectedSignature = crypto
            .createHmac("sha256", SESSION_SECRET)
            .update(payload)
            .digest("base64url");

        const signatureBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expectedSignature);

        if (signatureBuffer.length !== expectedBuffer.length) {
            return null;
        }

        if (
            !crypto.timingSafeEqual(
                signatureBuffer,
                expectedBuffer
            )
        ) {
            return null;
        }

        const data = JSON.parse(
            Buffer.from(payload, "base64url").toString("utf8")
        );

        if (!data.expires || Date.now() > data.expires) {
            return null;
        }

        return data;
    } catch (error) {
        return null;
    }
}

function getCookie(req, name) {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader.split(";");

    for (const cookie of cookies) {
        const [key, ...valueParts] = cookie.trim().split("=");

        if (key === name) {
            return decodeURIComponent(valueParts.join("="));
        }
    }

    return null;
}

function requireAdmin(req, res, next) {
    const token = getCookie(req, "campus_admin_session");

    const session = verifySession(token);

    if (!session) {
        return res.status(401).json({
            success: false,
            message: "Admin authentication required."
        });
    }

    req.admin = session;

    next();
}

// ======================================================
// ADMIN LOGIN
// ======================================================

app.post("/api/admin/login", (req, res) => {
    try {
        const { username, password } = req.body;

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
            return res.status(500).json({
                success: false,
                message: "Admin credentials are not configured on the server."
            });
        }

        if (
            username !== adminUsername ||
            password !== adminPassword
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const sessionToken = createSession(username);

        const isProduction = process.env.NODE_ENV === "production";

        const cookieParts = [
            `campus_admin_session=${encodeURIComponent(sessionToken)}`,
            "HttpOnly",
            "Path=/",
            "SameSite=Lax",
            `Max-Age=${SESSION_DURATION / 1000}`
        ];

        if (isProduction) {
            cookieParts.push("Secure");
        }

        res.setHeader(
            "Set-Cookie",
            cookieParts.join("; ")
        );

        res.json({
            success: true,
            message: "Admin login successful."
        });

    } catch (error) {
        console.error("Admin login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed."
        });
    }
});

// ======================================================
// ADMIN CHECK
// ======================================================

app.get("/api/admin/check", requireAdmin, (req, res) => {
    res.json({
        success: true,
        username: req.admin.username
    });
});

// ======================================================
// ADMIN LOGOUT
// ======================================================

app.post("/api/admin/logout", (req, res) => {
    res.setHeader(
        "Set-Cookie",
        "campus_admin_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0"
    );

    res.json({
        success: true,
        message: "Logged out successfully."
    });
});

// ======================================================
// UPLOAD PROJECT REPORT
// ======================================================

app.post(
    "/api/project-report/upload",
    requireAdmin,
    upload.single("report"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No PDF file uploaded."
                });
            }

            const oldFileName = req.body.oldFileName || "";

            // Delete old report if provided
            if (oldFileName) {
                const oldSafeName = safeFileName(oldFileName);

                const oldPath = path.join(
                    reportsDir,
                    oldSafeName
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            const originalName = safeFileName(
                req.file.originalname
            );

            const uniqueName =
                `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${originalName}`;

            const filePath = path.join(
                reportsDir,
                uniqueName
            );

            fs.writeFileSync(
                filePath,
                req.file.buffer
            );

            let extractedText = "";

            try {
                extractedText = await extractPDFText(
                    req.file.buffer
                );
            } catch (pdfError) {
                console.error(
                    "PDF extraction error:",
                    pdfError
                );
            }

            res.json({
                success: true,
                message: "Project report uploaded successfully.",
                fileName: uniqueName,
                text: extractedText
            });

        } catch (error) {
            console.error(
                "Report upload error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Report upload failed."
            });
        }
    }
);

// ======================================================
// VIEW PROJECT REPORT
// ======================================================

app.get(
    "/api/project-report/:fileName",
    (req, res) => {
        try {
            const fileName = safeFileName(
                req.params.fileName
            );

            const filePath = path.join(
                reportsDir,
                fileName
            );

            if (!fs.existsSync(filePath)) {
                return res.status(404).send(
                    "Project report not found."
                );
            }

            res.sendFile(filePath);

        } catch (error) {
            console.error(
                "Report view error:",
                error
            );

            res.status(500).send(
                "Unable to open report."
            );
        }
    }
);

// ======================================================
// DELETE PROJECT REPORT
// ======================================================

function deleteReportFile(fileName) {
    if (!fileName) {
        return;
    }

    const safeName = safeFileName(fileName);

    const filePath = path.join(
        reportsDir,
        safeName
    );

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

// ======================================================
// DELETE PROJECT
// ======================================================

app.post(
    "/api/project/delete",
    requireAdmin,
    (req, res) => {
        try {
            const {
                projectId,
                reportFileName
            } = req.body;

            if (reportFileName) {
                deleteReportFile(
                    reportFileName
                );
            }

            res.json({
                success: true,
                message: "Project deleted successfully."
            });

        } catch (error) {
            console.error(
                "Project delete error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Project deletion failed."
            });
        }
    }
);

// ======================================================
// CAMPUS AI
// ======================================================

app.post("/api/ask", async (req, res) => {
    try {
        const {
            question,
            project
        } = req.body;

        if (!question || !String(question).trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is required."
            });
        }

        const selectedProject =
            project || {};

        let reportText = "";

        // Read selected project report
        if (
            selectedProject.reportFileName
        ) {
            try {
                const reportFileName =
                    safeFileName(
                        selectedProject.reportFileName
                    );

                const reportPath =
                    path.join(
                        reportsDir,
                        reportFileName
                    );

                if (fs.existsSync(reportPath)) {
                    const pdfBuffer =
                        fs.readFileSync(
                            reportPath
                        );

                    reportText =
                        await extractPDFText(
                            pdfBuffer
                        );
                }
            } catch (reportError) {
                console.error(
                    "Report reading error:",
                    reportError
                );
            }
        }

        const projectContext = `
PROJECT INFORMATION

Project Title:
${selectedProject.title || "Not available"}

Department:
${selectedProject.department || "Not available"}

Year:
${selectedProject.year || "Not available"}

Team Members:
${selectedProject.team || "Not available"}

Guideline:
${selectedProject.guideline || "Not available"}

Problem Statement:
${selectedProject.problem || "Not available"}

Objective:
${selectedProject.objective || "Not available"}

Technology / Components:
${selectedProject.technology || "Not available"}

Working:
${selectedProject.working || "Not available"}

Result:
${selectedProject.result || "Not available"}

Limitations:
${selectedProject.limitations || "Not available"}

Possible Improvements:
${selectedProject.improvements || "Not available"}

PROJECT REPORT TEXT
${reportText || "No uploaded report available."}
`;

        const prompt = `
You are Campus Memory AI, an academic project research assistant.

Your purpose is to help college students understand previous
projects and develop improved technical ideas.

Use the selected project information and report text as the
primary context.

IMPORTANT:

1. Understand the project before answering.
2. Answer the student's actual question.
3. Do not simply repeat the project description.
4. If limitations are missing, identify reasonable technical
   limitations from the available project information.
5. Explain WHY a limitation exists when the student asks.
6. Suggest technically realistic improvements.
7. When discussing an improved project, explain:
   - Problem
   - Proposed solution
   - Components
   - Architecture
   - Working
   - Advantages
   - Possible implementation
8. Do not invent information that is clearly absent from the
   project context.
9. If information is uncertain, clearly say that it is uncertain.
10. Use simple but technically correct language suitable for
    engineering students.

SELECTED PROJECT:

${projectContext}

STUDENT QUESTION:

${question}

Now provide a useful, structured answer.
`;

        const ai = getGeminiClient();

        const response =
            await ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prompt
            });

        const answer =
            response.text ||
            "Sorry, I could not generate an answer.";

        res.json({
            success: true,
            answer
        });

    } catch (error) {
        console.error(
            "Campus AI error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Campus AI request failed."
        });
    }
});

// ======================================================
// STATIC WEBSITE
// ======================================================

app.use(
    express.static(__dirname)
);

// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {
    console.log(
        `Campus Memory AI running on port ${PORT}`
    );
});