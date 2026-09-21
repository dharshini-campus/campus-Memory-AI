/* =========================================================
   CAMPUS MEMORY AI
   FINAL SCRIPT
   SERVER-SIDE ADMIN AUTHENTICATION VERSION
========================================================= */


/* =========================================================
   DEFAULT PROJECTS
========================================================= */

let projects = [

    {
        id: "default-water-level",
        title: "Water Level Indicator",
        department: "EEE",
        year: "2025",
        teamMembers: "",
        guide: "",
        description:
            "A system for detecting and indicating different water levels in a tank.",
        objective:
            "To monitor water level and provide an alert when the tank reaches a specific level.",
        technology:
            "Water sensor, BC547 transistor, LEDs, buzzer, relay",
        working:
            "The water sensor detects the water level. Based on the detected level, the control circuit activates the corresponding LED and buzzer.",
        result:
            "The system successfully indicates the water level and provides an overflow alert.",
        limitations: [
            "No mobile notification",
            "No remote monitoring",
            "No automatic pump control"
        ],
        improvements: [
            "IoT-based monitoring",
            "Mobile notification",
            "Automatic pump control",
            "Water usage history"
        ],
        reportFileName: ""
    },

    {
        id: "default-gas-leakage",
        title: "Gas Leakage Detection",
        department: "EEE",
        year: "2025",
        teamMembers: "",
        guide: "",
        description:
            "A safety system that detects gas leakage and provides an alert.",
        objective:
            "To detect gas leakage early and alert users to improve safety.",
        technology:
            "ESP32, Gas Sensor, Buzzer, LED, IoT",
        working:
            "The gas sensor continuously monitors the gas level. When the level crosses the threshold, the ESP32 activates the alarm.",
        result:
            "The system detects gas leakage and provides an immediate warning.",
        limitations: [
            "No automatic ventilation",
            "Limited data storage",
            "Basic alert system"
        ],
        improvements: [
            "Automatic exhaust fan",
            "Mobile notification",
            "Cloud monitoring",
            "Real-time gas data analysis"
        ],
        reportFileName: ""
    },

    {
        id: "default-smart-home",
        title: "Smart Home Automation",
        department: "EEE",
        year: "2024",
        teamMembers: "",
        guide: "",
        description:
            "An IoT-based system for controlling electrical appliances automatically.",
        objective:
            "To reduce manual effort and improve energy management.",
        technology:
            "ESP32, Relay Module, Sensors, Wi-Fi",
        working:
            "Sensors collect information and the ESP32 controls connected appliances through relay modules.",
        result:
            "Electrical appliances can be controlled automatically using the system.",
        limitations: [
            "Limited number of appliances",
            "Basic automation rules",
            "No detailed energy analysis"
        ],
        improvements: [
            "AI-based automation",
            "Energy consumption monitoring",
            "Mobile application",
            "Voice control"
        ],
        reportFileName: ""
    }

];


/* =========================================================
   LOAD SAVED PROJECTS
========================================================= */

const savedProjects =
    localStorage.getItem("campusProjects");

if (savedProjects) {

    try {

        projects = JSON.parse(savedProjects);

    } catch (error) {

        console.error(
            "Could not load saved projects:",
            error
        );

    }

}


/* =========================================================
   SAVE PROJECTS
========================================================= */

function saveProjects() {

    localStorage.setItem(
        "campusProjects",
        JSON.stringify(projects)
    );

}


/* =========================================================
   HOME
========================================================= */

function goHome() {

    location.reload();

}


/* =========================================================
   PREVIOUS PROJECTS
========================================================= */

function exploreProjects() {

    showProjectsPage();

}


function showProjectsPage() {

    document.body.innerHTML = `

        <div class="chat-container">

            <h1>📚 Previous Campus Projects</h1>

            <p>
                Explore projects from previous students
                and learn from their work.
            </p>

            <input
                type="text"
                id="projectSearch"
                placeholder="🔍 Search projects..."
                oninput="searchProjects()"
                style="
                    width:90%;
                    padding:14px;
                    border:1px solid #ccc;
                    border-radius:8px;
                    font-size:16px;
                    margin:15px 0;
                "
            >

            <div id="projectList"></div>

            <button onclick="goHome()">
                ← Back to Home
            </button>

        </div>

    `;

    displayProjects(projects);

}


/* =========================================================
   DISPLAY PROJECTS
========================================================= */

function displayProjects(list) {

    const projectList =
        document.getElementById("projectList");

    if (!projectList) return;

    if (list.length === 0) {

        projectList.innerHTML = `

            <div class="ai-message">
                No projects found.
            </div>

        `;

        return;

    }

    projectList.innerHTML =

        list.map(project => {

            const index =
                projects.indexOf(project);

            return `

                <div
                    class="ai-message"
                    style="
                        max-width:90%;
                        margin:15px auto;
                    "
                >

                    <h2>
                        ${escapeHTML(project.title)}
                    </h2>

                    <p>
                        <b>Department:</b>
                        ${escapeHTML(project.department || "")}
                    </p>

                    <p>
                        <b>Year:</b>
                        ${escapeHTML(project.year || "")}
                    </p>

                    <p>
                        ${escapeHTML(project.description || "")}
                    </p>

                    <button
                        onclick="viewProject(${index})"
                    >
                        View Details
                    </button>

                </div>

            `;

        }).join("");

}


/* =========================================================
   SEARCH
========================================================= */

function searchProjects() {

    const input =
        document.getElementById("projectSearch");

    if (!input) return;

    const search =
        input.value
            .toLowerCase()
            .trim();

    const filtered =
        projects.filter(project => {

            return (

                (project.title || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (project.department || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (project.technology || "")
                    .toLowerCase()
                    .includes(search)

            );

        });

    displayProjects(filtered);

}


/* =========================================================
   PROJECT DETAILS
========================================================= */

function viewProject(index) {

    const project =
        projects[index];

    if (!project) return;

    document.body.innerHTML = `

        <div class="chat-container">

            <h1>
                📘 ${escapeHTML(project.title)}
            </h1>

            <div
                class="chat-box"
                style="height:auto;"
            >

                <h3>🎯 Objective</h3>

                <p>
                    ${escapeHTML(
                        project.objective ||
                        "Not provided."
                    )}
                </p>

                <h3>⚙️ Technology / Components</h3>

                <p>
                    ${escapeHTML(
                        project.technology ||
                        "Not provided."
                    )}
                </p>

                <h3>🔧 Working</h3>

                <p>
                    ${escapeHTML(
                        project.working ||
                        "Not provided."
                    )}
                </p>

                <h3>✅ Result</h3>

                <p>
                    ${escapeHTML(
                        project.result ||
                        "Not provided."
                    )}
                </p>

                <h3>⚠️ Limitations</h3>

                <ul>

                    ${(project.limitations || [])
                        .map(item => `
                            <li>
                                ${escapeHTML(item)}
                            </li>
                        `)
                        .join("")}

                </ul>

                <h3>💡 Possible Improvements</h3>

                <ul>

                    ${(project.improvements || [])
                        .map(item => `
                            <li>
                                ${escapeHTML(item)}
                            </li>
                        `)
                        .join("")}

                </ul>

            </div>

            ${
                project.reportFileName
                ?

                `
                <button
                    onclick="viewProjectReport(${index})"
                >
                    📄 View Full Project Report
                </button>
                `

                :

                `
                <div class="ai-message">

                    📄 Full Project Report

                    <br><br>

                    Report has not been uploaded
                    by the faculty yet.

                </div>
                `
            }

            <button
                onclick="askAIForProject(${index})"
            >
                🤖 Ask Campus AI About This Project
            </button>

            <button
                onclick="showProjectsPage()"
            >
                ← Back to Projects
            </button>

            <button onclick="goHome()">
                🏠 Home
            </button>

        </div>

    `;

}


/* =========================================================
   VIEW FULL REPORT
========================================================= */

function viewProjectReport(index) {

    const project =
        projects[index];

    if (!project) return;

    if (!project.reportFileName) {

        alert(
            "Project report has not been uploaded yet."
        );

        return;

    }

    const url =
        "/api/project-report/" +
        encodeURIComponent(
            project.reportFileName
        );

    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   CAMPUS AI FOR SELECTED PROJECT
========================================================= */

function askAIForProject(index) {

    const project =
        projects[index];

    if (!project) return;

    sessionStorage.setItem(
        "selectedProjectIndex",
        index
    );

    askCampusAI(index);

}


/* =========================================================
   CAMPUS AI
========================================================= */

function askCampusAI(selectedIndex = null) {

    if (
        selectedIndex === null ||
        selectedIndex === undefined
    ) {

        const stored =
            sessionStorage.getItem(
                "selectedProjectIndex"
            );

        if (stored !== null) {

            selectedIndex =
                Number(stored);

        }

    }

    const selectedProject =
        (
            selectedIndex !== null &&
            projects[selectedIndex]
        )
            ?
            projects[selectedIndex]
            :
            null;

    document.body.innerHTML = `

        <div class="chat-container">

            <h1>
                🤖 Campus AI Assistant
            </h1>

            ${
                selectedProject
                ?

                `
                <div
                    class="ai-message"
                    style="max-width:90%;"
                >

                    <b>Current Project:</b>

                    <br><br>

                    ${escapeHTML(
                        selectedProject.title
                    )}

                    <br><br>

                    <button
                        onclick="clearSelectedProject()"
                    >
                        Ask About All Projects
                    </button>

                </div>
                `

                :

                `
                <p>
                    Ask about previous projects,
                    limitations, technology,
                    improvements, or project ideas.
                </p>
                `
            }

            <div
                id="chatBox"
                class="chat-box"
            >

                <div class="ai-message">

                    Hello! 👋

                    <br><br>

                    I am Campus AI.

                    <br><br>

                    ${
                        selectedProject
                        ?

                        "Ask me anything about the selected project."

                        :

                        "Ask me anything about campus projects."
                    }

                </div>

            </div>

            <div class="input-area">

                <input
                    type="text"
                    id="userInput"
                    placeholder="Type your question..."
                    onkeydown="handleEnter(event)"
                >

                <button
                    onclick="sendQuestion()"
                >
                    Ask
                </button>

            </div>

            <button onclick="goHome()">
                ← Back to Home
            </button>

        </div>

    `;

}


/* =========================================================
   CLEAR SELECTED PROJECT
========================================================= */

function clearSelectedProject() {

    sessionStorage.removeItem(
        "selectedProjectIndex"
    );

    askCampusAI(null);

}


/* =========================================================
   ENTER KEY
========================================================= */

function handleEnter(event) {

    if (event.key === "Enter") {

        sendQuestion();

    }

}


/* =========================================================
   SEND QUESTION
========================================================= */

async function sendQuestion() {

    const input =
        document.getElementById("userInput");

    if (!input) return;

    const question =
        input.value.trim();

    if (!question) return;

    const chatBox =
        document.getElementById("chatBox");

    chatBox.innerHTML += `

        <div class="user-message">

            ${escapeHTML(question)}

        </div>

    `;

    input.value = "";

    const thinkingId =
        "thinking-" +
        Date.now();

    chatBox.innerHTML += `

        <div
            class="ai-message"
            id="${thinkingId}"
        >
            🤖 Campus AI is thinking...
        </div>

    `;

    chatBox.scrollTop =
        chatBox.scrollHeight;

    try {

        const stored =
            sessionStorage.getItem(
                "selectedProjectIndex"
            );

        let selectedProject = null;

        if (stored !== null) {

            const index =
                Number(stored);

            if (projects[index]) {

                selectedProject =
                    projects[index];

            }

        }

        const response =
            await fetch(
                "/api/ask",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        question:
                            question,

                        project:
                            selectedProject

                    })

                }
            );

        const data =
            await response.json();

        const thinkingMessage =
            document.getElementById(
                thinkingId
            );

        if (!thinkingMessage) return;

        if (!response.ok) {

            thinkingMessage.innerHTML = `

                ❌ ${escapeHTML(
                    data.error ||
                    "AI request failed."
                )}

            `;

            return;

        }

        thinkingMessage.innerHTML =
            formatAIResponse(
                data.answer ||
                "No answer was generated."
            );

    } catch (error) {

        console.error(
            "Campus AI error:",
            error
        );

        const thinkingMessage =
            document.getElementById(
                thinkingId
            );

        if (thinkingMessage) {

            thinkingMessage.innerHTML = `

                ❌ Could not connect to Campus AI.

                <br><br>

                Please try again.

            `;

        }

    }

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


/* =========================================================
   FORMAT AI RESPONSE
========================================================= */

function formatAIResponse(text) {

    if (!text) return "";

    return escapeHTML(text)
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

function adminLogin() {

    document.body.innerHTML = `

        <div class="chat-container">

            <h1>
                👨‍💼 Admin Login
            </h1>

            <div
                class="chat-box"
                style="height:auto;"
            >

                <label>
                    Username
                </label>

                <input
                    type="text"
                    id="adminUsername"
                    placeholder="Enter username"
                >

                <label>
                    Password
                </label>

                <input
                    type="password"
                    id="adminPassword"
                    placeholder="Enter password"
                >

                <button
                    onclick="checkAdminLogin()"
                >
                    Login
                </button>

            </div>

            <button onclick="goHome()">
                ← Back to Home
            </button>

        </div>

    `;

}


/* =========================================================
   CHECK ADMIN LOGIN
   SERVER-SIDE AUTHENTICATION
========================================================= */

async function checkAdminLogin() {

    const usernameElement =
        document.getElementById(
            "adminUsername"
        );

    const passwordElement =
        document.getElementById(
            "adminPassword"
        );

    if (!usernameElement || !passwordElement) {

        return;

    }

    const username =
        usernameElement.value.trim();

    const password =
        passwordElement.value;

    if (!username || !password) {

        alert(
            "Please enter username and password."
        );

        return;

    }

    try {

        const response =
            await fetch(
                "/api/admin/login",
                {

                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        username:
                            username,

                        password:
                            password

                    })

                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.error ||
                "Invalid username or password."
            );

            return;

        }

        alert(
            "✅ Admin login successful."
        );

        showAdminDashboard();

    } catch (error) {

        console.error(
            "Admin login error:",
            error
        );

        alert(
            "Could not connect to the server."
        );

    }

}


/* =========================================================
   ADMIN SESSION CHECK
========================================================= */

async function checkAdminSession() {

    try {

        const response =
            await fetch(
                "/api/admin/check",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

        return response.ok;

    } catch (error) {

        console.error(
            "Admin session check error:",
            error
        );

        return false;

    }

}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

async function adminLogout() {

    try {

        await fetch(
            "/api/admin/logout",
            {
                method: "POST",
                credentials: "include"
            }
        );

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

    sessionStorage.removeItem(
        "selectedProjectIndex"
    );

    goHome();

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

async function showAdminDashboard() {

    const authenticated =
        await checkAdminSession();

    if (!authenticated) {

        alert(
            "Admin session expired. Please login again."
        );

        adminLogin();

        return;

    }

    document.body.innerHTML = `

        <div class="chat-container">

            <h1>
                👨‍💼 Admin Dashboard
            </h1>

            <div
                class="chat-box"
                style="height:auto;"
            >

                <h2>
                    📚 Add New Project
                </h2>

                <label>
                    Project Title
                </label>

                <input
                    type="text"
                    id="projectTitle"
                    placeholder="Enter project title"
                >

                <label>
                    Department
                </label>

                <input
                    type="text"
                    id="projectDepartment"
                    placeholder="Example: EEE"
                >

                <label>
                    Year
                </label>

                <input
                    type="text"
                    id="projectYear"
                    placeholder="Example: 2026"
                >

                <label>
                    Team Members
                </label>

                <textarea
                    id="teamMembers"
                    placeholder="Enter team members"
                ></textarea>

                <label>
                    Guide Name
                </label>

                <input
                    type="text"
                    id="guideName"
                    placeholder="Enter guide name"
                >

                <label>
                    Problem Statement
                </label>

                <textarea
                    id="problemStatement"
                    placeholder="Enter problem statement"
                ></textarea>

                <label>
                    Objective
                </label>

                <textarea
                    id="objective"
                    placeholder="Enter objective"
                ></textarea>

                <label>
                    Technology / Components
                </label>

                <textarea
                    id="technology"
                    placeholder="Enter technologies/components"
                ></textarea>

                <label>
                    Working
                </label>

                <textarea
                    id="working"
                    placeholder="Explain project working"
                ></textarea>

                <label>
                    Result
                </label>

                <textarea
                    id="result"
                    placeholder="Enter project result"
                ></textarea>

                <label>
                    Limitations
                </label>

                <textarea
                    id="limitations"
                    placeholder="Enter limitations separated by commas"
                ></textarea>

                <label>
                    Possible Improvements
                </label>

                <textarea
                    id="improvements"
                    placeholder="Enter improvements separated by commas"
                ></textarea>

                <label>
                    Project Report (Optional)
                </label>

                <input
                    type="file"
                    id="projectReport"
                    accept=".pdf"
                >

                <br><br>

                <button
                    onclick="submitProject()"
                >
                    ✅ Submit New Project
                </button>

            </div>

            <div
                class="chat-box"
                style="height:auto; margin-top:20px;"
            >

                <h2>
                    🗂️ Manage Existing Projects
                </h2>

                <p>
                    Select an existing project to
                    add/update its report or delete it.
                </p>

                <div id="adminProjectList"></div>

            </div>

            <button
                onclick="adminLogout()"
            >
                🚪 Logout
            </button>

            <button onclick="goHome()">
                🏠 Home
            </button>

        </div>

    `;

    displayAdminProjects();

}


/* =========================================================
   ADMIN PROJECT LIST
========================================================= */

function displayAdminProjects() {

    const container =
        document.getElementById(
            "adminProjectList"
        );

    if (!container) return;

    if (projects.length === 0) {

        container.innerHTML = `

            <div class="ai-message">
                No projects available.
            </div>

        `;

        return;

    }

    container.innerHTML =

        projects.map((project, index) => {

            return `

                <div
                    class="ai-message"
                    style="
                        max-width:95%;
                        margin:15px auto;
                    "
                >

                    <h3>
                        📘 ${escapeHTML(
                            project.title
                        )}
                    </h3>

                    <p>
                        <b>Department:</b>
                        ${escapeHTML(
                            project.department || ""
                        )}
                    </p>

                    <p>
                        <b>Year:</b>
                        ${escapeHTML(
                            project.year || ""
                        )}
                    </p>

                    <p>
                        <b>Report:</b>

                        ${
                            project.reportFileName
                            ?
                            "✅ Uploaded"
                            :
                            "❌ Not uploaded"
                        }

                    </p>

                    <button
                        onclick="addOrUpdateReport(${index})"
                    >
                        📎
                        ${
                            project.reportFileName
                            ?
                            "Update Report"
                            :
                            "Add Report"
                        }
                    </button>

                    <button
                        onclick="deleteProject(${index})"
                    >
                        🗑️ Delete Project
                    </button>

                </div>

            `;

        }).join("");

}


/* =========================================================
   ADD / UPDATE REPORT
========================================================= */

function addOrUpdateReport(index) {

    const project =
        projects[index];

    if (!project) return;

    document.body.innerHTML = `

        <div class="chat-container">

            <h1>
                📎 Add / Update Project Report
            </h1>

            <div
                class="ai-message"
                style="max-width:90%;"
            >

                <h2>
                    ${escapeHTML(
                        project.title
                    )}
                </h2>

                <p>
                    Department:
                    ${escapeHTML(
                        project.department || ""
                    )}
                </p>

            </div>

            <div
                class="chat-box"
                style="height:auto;"
            >

                <label>
                    Select Project Report PDF
                </label>

                <input
                    type="file"
                    id="existingProjectReport"
                    accept=".pdf"
                >

                <br><br>

                <button
                    onclick="uploadReportForExistingProject(${index})"
                >
                    📤
                    ${
                        project.reportFileName
                        ?
                        "Update Report"
                        :
                        "Add Report"
                    }
                </button>

            </div>

            <button
                onclick="showAdminDashboard()"
            >
                ← Back to Admin Dashboard
            </button>

        </div>

    `;

}


/* =========================================================
   UPLOAD REPORT FOR EXISTING PROJECT
========================================================= */

async function uploadReportForExistingProject(index) {

    const project =
        projects[index];

    if (!project) return;

    const authenticated =
        await checkAdminSession();

    if (!authenticated) {

        alert(
            "Admin session expired. Please login again."
        );

        adminLogin();

        return;

    }

    const input =
        document.getElementById(
            "existingProjectReport"
        );

    if (
        !input ||
        !input.files ||
        !input.files.length
    ) {

        alert(
            "Please select a PDF report."
        );

        return;

    }

    const file =
        input.files[0];

    if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    ) {

        alert(
            "Please select a PDF file."
        );

        return;

    }

    const formData =
        new FormData();

    formData.append(
        "report",
        file
    );

    formData.append(
        "projectId",
        String(project.id)
    );

    if (project.reportFileName) {

        formData.append(
            "oldFileName",
            project.reportFileName
        );

    }

    try {

        const response =
            await fetch(
                "/api/project-report/upload",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData
                }
            );

        const data =
            await response.json();

        if (response.status === 401) {

            alert(
                "Admin session expired. Please login again."
            );

            adminLogin();

            return;

        }

        if (!response.ok) {

            alert(
                data.error ||
                "Report upload failed."
            );

            return;

        }

        project.reportFileName =
            data.fileName;

        saveProjects();

        alert(
            "✅ Project report added/updated successfully."
        );

        showAdminDashboard();

    } catch (error) {

        console.error(
            "Report upload error:",
            error
        );

        alert(
            "Report upload failed: " +
            error.message
        );

    }

}


/* =========================================================
   SUBMIT NEW PROJECT
========================================================= */

async function submitProject() {

    const authenticated =
        await checkAdminSession();

    if (!authenticated) {

        alert(
            "Admin session expired. Please login again."
        );

        adminLogin();

        return;

    }

    const title =
        document.getElementById(
            "projectTitle"
        ).value.trim();

    const department =
        document.getElementById(
            "projectDepartment"
        ).value.trim();

    const year =
        document.getElementById(
            "projectYear"
        ).value.trim();

    const teamMembers =
        document.getElementById(
            "teamMembers"
        ).value.trim();

    const guide =
        document.getElementById(
            "guideName"
        ).value.trim();

    const description =
        document.getElementById(
            "problemStatement"
        ).value.trim();

    const objective =
        document.getElementById(
            "objective"
        ).value.trim();

    const technology =
        document.getElementById(
            "technology"
        ).value.trim();

    const working =
        document.getElementById(
            "working"
        ).value.trim();

    const result =
        document.getElementById(
            "result"
        ).value.trim();

    const limitationsText =
        document.getElementById(
            "limitations"
        ).value.trim();

    const improvementsText =
        document.getElementById(
            "improvements"
        ).value.trim();

    const reportInput =
        document.getElementById(
            "projectReport"
        );

    const reportFile =
        reportInput &&
        reportInput.files.length
            ?
            reportInput.files[0]
            :
            null;

    if (!title) {

        alert(
            "Please enter Project Title."
        );

        return;

    }

    if (!department) {

        alert(
            "Please enter Department."
        );

        return;

    }

    if (!year) {

        alert(
            "Please enter Year."
        );

        return;

    }

    const newProject = {

        id:
            Date.now().toString(),

        title:
            title,

        department:
            department,

        year:
            year,

        teamMembers:
            teamMembers,

        guide:
            guide,

        description:
            description ||
            "Problem statement not provided.",

        objective:
            objective ||
            "Objective not provided.",

        technology:
            technology ||
            "Technology details not provided.",

        working:
            working ||
            "Working details not provided.",

        result:
            result ||
            "Result details not provided.",

        limitations:
            limitationsText
                ?
                limitationsText
                    .split(",")
                    .map(item => item.trim())
                    .filter(Boolean)
                :
                [],

        improvements:
            improvementsText
                ?
                improvementsText
                    .split(",")
                    .map(item => item.trim())
                    .filter(Boolean)
                :
                [],

        reportFileName:
            ""

    };

    try {

        /* =========================================
           SAVE PDF FIRST IF SELECTED
        ========================================== */

        if (reportFile) {

            if (
                reportFile.type !== "application/pdf" &&
                !reportFile.name.toLowerCase().endsWith(".pdf")
            ) {

                alert(
                    "Please select a PDF file."
                );

                return;

            }

            const formData =
                new FormData();

            formData.append(
                "pdf",
                reportFile
            );

            formData.append(
                "projectId",
                String(newProject.id)
            );

            const response =
                await fetch(
                    "/api/project-report/upload",
                    {
                        method: "POST",
                        credentials: "include",
                        body: formData
                    }
                );

            const data =
                await response.json();

            if (response.status === 401) {

                alert(
                    "Admin session expired. Please login again."
                );

                adminLogin();

                return;

            }

            if (!response.ok) {

                alert(
                    data.error ||
                    "Project report upload failed."
                );

                return;

            }

            newProject.reportFileName =
                data.fileName;

        }

        /* =========================================
           SAVE PROJECT
        ========================================== */

        projects.push(
            newProject
        );

        saveProjects();

        alert(
            "✅ New project submitted successfully!"
        );

        showAdminDashboard();

    } catch (error) {

        console.error(
            "Submit project error:",
            error
        );

        alert(
            "Project submission failed: " +
            error.message
        );

    }

}


/* =========================================================
   DELETE PROJECT — ADMIN ONLY
========================================================= */

async function deleteProject(index) {

    const project =
        projects[index];

    if (!project) return;

    const authenticated =
        await checkAdminSession();

    if (!authenticated) {

        alert(
            "Admin session expired. Please login again."
        );

        adminLogin();

        return;

    }

    const confirmation =
        confirm(
            "Are you sure you want to delete this project?\n\n" +
            project.title +
            "\n\n" +
            "The project and its uploaded report will be removed."
        );

    if (!confirmation) {

        return;

    }

    try {

        const response =
            await fetch(
                "/api/project/delete",
                {

                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        projectId:
                            String(project.id),

                        fileName:
                            project.reportFileName ||
                            ""

                    })

                }
            );

        const data =
            await response.json();

        if (response.status === 401) {

            alert(
                "Admin session expired. Please login again."
            );

            adminLogin();

            return;

        }

        if (!response.ok) {

            alert(
                data.error ||
                "Project deletion failed."
            );

            return;

        }

        projects.splice(
            index,
            1
        );

        saveProjects();

        alert(
            "✅ Project deleted successfully."
        );

        showAdminDashboard();

    } catch (error) {

        console.error(
            "Delete project error:",
            error
        );

        alert(
            "Project deletion failed: " +
            error.message
        );

    }

}