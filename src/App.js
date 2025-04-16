var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useState } from "react";
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
  const handleClick = () =>
    __awaiter(this, void 0, void 0, function* () {
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
              const companyName =
                (_a = getElement(
                  ".job-details-jobs-unified-top-card__company-name"
                )) === null || _a === void 0
                  ? void 0
                  : _a.innerText;
              const position =
                (_b = getElement(
                  ".job-details-jobs-unified-top-card__job-title"
                )) === null || _b === void 0
                  ? void 0
                  : _b.innerText;
              const jobDescription =
                (_c = document.getElementById("job-details")) === null ||
                _c === void 0
                  ? void 0
                  : _c.innerText;
              const location =
                (_d = getElement(
                  ".job-details-jobs-unified-top-card__tertiary-description-container"
                )) === null || _d === void 0
                  ? void 0
                  : _d.innerText;
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
            } catch (err) {
              console.error("Error in LinkedIn scraper", err);
            }
          };
          const naukriFunction = () => {
            var _a, _b, _c, _d;
            try {
              const companyName =
                (_a = getElement(".styles_jd-header-comp-name__MvqAI")) ===
                  null || _a === void 0
                  ? void 0
                  : _a.innerText;
              const position =
                (_b = getElement(".styles_jd-header-title__rZwM1")) === null ||
                _b === void 0
                  ? void 0
                  : _b.innerText;
              const jobDescription =
                (_c = getElement(".styles_JDC__dang-inner-html__h0K4t")) ===
                  null || _c === void 0
                  ? void 0
                  : _c.innerText;
              const location =
                (_d = getElement(".styles_jhc__location__W_pVs")) === null ||
                _d === void 0
                  ? void 0
                  : _d.innerText;
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
            } catch (err) {
              console.error("Error in Naukri scraper", err);
            }
          };
          if (host.includes("linkedin.com")) {
            return linkedinFunction();
          } else if (host.includes("naukri.com")) {
            return naukriFunction();
          } else {
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
  return _jsxs(_Fragment, {
    children: [
      _jsxs("div", {
        children: [
          _jsxs("div", {
            children: [
              _jsx("label", { children: "Company:" }),
              _jsx("input", { value: formData.company }),
            ],
          }),
          _jsxs("div", {
            children: [
              _jsx("label", { children: "Role Title:" }),
              _jsx("input", { value: formData.title }),
            ],
          }),
          _jsxs("div", {
            children: [
              _jsx("label", { children: "Location:" }),
              _jsx("input", { value: formData.location }),
            ],
          }),
          _jsxs("div", {
            children: [
              _jsx("label", { children: "Portal:" }),
              _jsx("input", { value: formData.portal }),
            ],
          }),
          _jsxs("div", {
            children: [
              _jsx("label", { children: "Description:" }),
              _jsx("textarea", { value: formData.description }),
            ],
          }),
        ],
      }),
      _jsx("button", { onClick: handleClick, children: "Track this job" }),
    ],
  });
}
export default App;
