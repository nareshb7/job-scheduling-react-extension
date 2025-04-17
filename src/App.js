var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import "./App.css";
function App() {
    const [formData, setFormData] = useState({
        portal: "",
        title: "",
        company: "",
        location: "",
        description: "",
        url: "",
    });
    // ✅ This runs on popup load
    useEffect(() => {
        chrome.storage.local.get("userId", (data) => {
            console.log("data::::", data);
            if (!data.userId) {
                window.location.href = "unauthorized.html";
                return;
            }
            // ✅ now you can use data.userId
            console.log("✅ userId from chrome.storage", data.userId);
        });
        const checkAuth = () => __awaiter(this, void 0, void 0, function* () {
            const userId = "67fe21d2cec60a9927dd8bad"; // Replace this later with localStorage or real login
            const BASE_URL = "http://localhost:3001/api";
            try {
                const response = yield fetch(`${BASE_URL}/user/${userId}`);
                if (!response.ok) {
                    // 🔴 Redirect to unauthorized.html if not authenticated
                    window.location.href = "unauthorized.html";
                    return;
                }
                const data = yield response.json();
                console.log("✅ Authenticated user:", data);
            }
            catch (error) {
                console.error("Auth check failed:", error);
                window.location.href = "unauthorized.html";
            }
        });
        checkAuth();
    }, []);
    const handleClick = () => __awaiter(this, void 0, void 0, function* () {
        const [tab] = yield chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        const [{ result }] = yield chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const host = window.location.host;
                const getElement = (selector) => document.querySelector(selector);
                const linkedinFunction = () => {
                    var _a, _b, _c, _d;
                    try {
                        const companyName = (_a = getElement(".job-details-jobs-unified-top-card__company-name")) === null || _a === void 0 ? void 0 : _a.innerText;
                        const position = (_b = getElement(".job-details-jobs-unified-top-card__job-title")) === null || _b === void 0 ? void 0 : _b.innerText;
                        const jobDescription = (_c = document.getElementById("job-details")) === null || _c === void 0 ? void 0 : _c.innerText;
                        const location = (_d = getElement(".job-details-jobs-unified-top-card__tertiary-description-container")) === null || _d === void 0 ? void 0 : _d.innerText;
                        const data = chrome.storage.local.get("userId", (data) => {
                            console.log("data::::", data);
                            if (!data.userId) {
                                window.location.href = "unauthorized.html";
                                return;
                            }
                            if (data.userId) {
                                fetch(`http://localhost:3001/api/portal/add`, {
                                    method: "POST",
                                    headers: {
                                        "Content-type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        portal: "LinkedIn",
                                        title: position,
                                        company: companyName,
                                        location,
                                        description: jobDescription,
                                        url: window.location.href,
                                        userId: data.userId,
                                    }),
                                })
                                    .then((res) => res.json())
                                    .then((dt) => console.log("portal_updated:::", dt))
                                    .catch((er) => console.error("portal_add_error", er.message));
                            }
                            // ✅ now you can use data.userId
                            console.log("✅ userId from chrome.storage", data.userId);
                            return data;
                        });
                        console.log("dataL::::::id", data);
                        return {
                            portal: "LinkedIn",
                            title: position,
                            company: companyName,
                            location,
                            description: jobDescription,
                            url: window.location.href,
                        };
                    }
                    catch (err) {
                        console.error("Error in LinkedIn scraper", err);
                        return null;
                    }
                };
                const naukriFunction = () => {
                    var _a, _b, _c, _d;
                    try {
                        const companyName = (_a = getElement(".jd-header-comp-name a")) === null || _a === void 0 ? void 0 : _a.innerText;
                        const position = (_b = getElement(".jd-header-title")) === null || _b === void 0 ? void 0 : _b.innerText;
                        const jobDescription = (_c = getElement(".dang-inner-html")) === null || _c === void 0 ? void 0 : _c.innerText;
                        const location = (_d = getElement(".locWdth")) === null || _d === void 0 ? void 0 : _d.innerText;
                        return {
                            portal: "Naukri",
                            title: position,
                            company: companyName,
                            location,
                            description: jobDescription,
                            url: window.location.href,
                        };
                    }
                    catch (err) {
                        console.error("Error in Naukri scraper", err);
                        return null;
                    }
                };
                if (host.includes("linkedin.com"))
                    return linkedinFunction();
                if (host.includes("naukri.com"))
                    return naukriFunction();
                alert("This site is not supported yet.");
                return {
                    portal: "NOT SUPPORTED",
                    title: "ERROR",
                    company: "",
                    location: "",
                    description: "",
                    url: "",
                };
            },
        });
        console.log("📦 Job Data Retrieved:", result);
        if (result) {
            setFormData(result);
        }
    });
    return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsxs("div", { children: [_jsx("label", { children: "Company:" }), _jsx("input", { value: formData.company, readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { children: "Role Title:" }), _jsx("input", { value: formData.title, readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { children: "Location:" }), _jsx("input", { value: formData.location, readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { children: "Portal:" }), _jsx("input", { value: formData.portal, readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { children: "Description:" }), _jsx("textarea", { value: formData.description, readOnly: true })] })] }), _jsx("button", { onClick: handleClick, children: "Track this job" })] }));
}
export default App;
