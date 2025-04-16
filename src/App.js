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
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
function App() {
    const [count, setCount] = useState(0);
    const [formData, setFormData] = useState({
        portal: "",
        title: "",
        company: "",
        location: "",
        description: "",
        url: "",
    });
    const handleClick = () => __awaiter(this, void 0, void 0, function* () {
        const [tab] = yield chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        const [{ result }] = yield chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const host = window.location.host;
                const getElement = (selector) => {
                    return document.querySelector(selector);
                };
                const linkedinFunction = () => {
                    var _a, _b, _c, _d;
                    try {
                        const companyName = (_a = getElement(".job-details-jobs-unified-top-card__company-name")) === null || _a === void 0 ? void 0 : _a.innerText;
                        const position = (_b = getElement(".job-details-jobs-unified-top-card__job-title")) === null || _b === void 0 ? void 0 : _b.innerText;
                        const jobDescription = (_c = document.getElementById("job-details")) === null || _c === void 0 ? void 0 : _c.innerText;
                        const location = (_d = getElement(".job-details-jobs-unified-top-card__tertiary-description-container")) === null || _d === void 0 ? void 0 : _d.innerText;
                        const jobData = {
                            portal: "LinkedIn",
                            title: position,
                            company: companyName,
                            location,
                            description: jobDescription,
                            url: window.location.href,
                        };
                        // setFormData(jobData);
                        console.log("📌 LinkedIn Job Data:", jobData);
                        // alert(`Tracked from LinkedIn: ${position}`);
                        return jobData;
                    }
                    catch (err) {
                        console.error("Error in LinkedIn scraper", err);
                    }
                };
                const naukriFunction = () => {
                    var _a, _b, _c, _d;
                    try {
                        const companyName = (_a = getElement(".jd-header-comp-name a")) === null || _a === void 0 ? void 0 : _a.innerText;
                        const position = (_b = getElement(".jd-header-title")) === null || _b === void 0 ? void 0 : _b.innerText;
                        const jobDescription = (_c = getElement(".dang-inner-html")) === null || _c === void 0 ? void 0 : _c.innerText;
                        const location = (_d = getElement(".locWdth")) === null || _d === void 0 ? void 0 : _d.innerText;
                        const jobData = {
                            portal: "Naukri",
                            title: position,
                            company: companyName,
                            location,
                            description: jobDescription,
                            url: window.location.href,
                        };
                        // setFormData(jobData);
                        console.log("📌 Naukri Job Data:", jobData);
                        alert(`Tracked from Naukri: ${position}`);
                        return jobData;
                    }
                    catch (err) {
                        console.error("Error in Naukri scraper", err);
                    }
                };
                if (host.includes("linkedin.com")) {
                    return linkedinFunction();
                }
                else if (host.includes("naukri.com")) {
                    return naukriFunction();
                }
                else {
                    alert("This site is not supported yet.");
                    return {
                        portal: "NOT SUPPORTED",
                        title: "ERROR",
                        company: "",
                        location: "",
                        description: "",
                        url: "",
                    };
                }
            },
        });
        console.log("result::::", result);
        setFormData(result);
    });
    return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("a", { href: "https://vite.dev", target: "_blank", children: _jsx("img", { src: viteLogo, className: "logo", alt: "Vite logo" }) }), _jsx("a", { href: "https://react.dev", target: "_blank", children: _jsx("img", { src: reactLogo, className: "logo react", alt: "React logo" }) })] }), _jsxs("h2", { children: ["CONTENT::: ", JSON.stringify(formData, null, 4)] }), _jsx("h1", { children: "Vite + React" }), _jsxs("div", { className: "card", children: [_jsx("button", { onClick: handleClick, children: "Track this job" }), _jsxs("button", { onClick: () => setCount((count) => count + 1), children: ["count is ", count] }), _jsxs("p", { children: ["Edit ", _jsx("code", { children: "src/App.tsx" }), " and save to test HMR"] })] }), _jsx("p", { className: "read-the-docs", children: "Click on the Vite and React logos to learn more" })] }));
}
export default App;
