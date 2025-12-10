// Name: Cheng-Yi Tang, Shih-Cheng Lu, Han Wang, Jiazhao Lou
// Student ID: 77646578, 31864588, 23322916, 65305787

"use client";

import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Home() {
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    // Check system preference or localStorage
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDarkMode(shouldUseDark);
    
    if (shouldUseDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    
    // Force immediate update
    const htmlElement = document.documentElement;
    if (newDarkMode) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    
    // Debug: verify class was added/removed
    console.log("Dark mode toggled:", newDarkMode, "HTML classList:", htmlElement.classList.toString());
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, requirements }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI Code Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Build your software with AI and MCP in seconds
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-colors duration-200">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Software Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., A simple calculator application"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="requirements"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="e.g., Must support add, subtract, multiply, divide. Handle division by zero."
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    "Generate Software"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {result && (
          <div className="mt-8 space-y-8">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-colors duration-200">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Generated Code
                </h3>
                <div className="flex items-center gap-3">
                  {result.language && (
                    <span className="text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {result.language}
                    </span>
                  )}
                  <button
                    onClick={() => copyToClipboard(result.code, "code")}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 group relative"
                    aria-label="Copy code"
                    title="Copy code"
                  >
                    {copiedSection === "code" ? (
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <SyntaxHighlighter
                  language={result.language || "text"}
                  style={darkMode ? oneDark : oneLight}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: "0.875rem",
                  }}
                  showLineNumbers
                  lineNumberStyle={{
                    minWidth: "3em",
                    paddingRight: "1em",
                    textAlign: "right",
                    userSelect: "none",
                  }}
                >
                  {result.code}
                </SyntaxHighlighter>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-colors duration-200">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Generated Tests
                </h3>
                <div className="flex items-center gap-3">
                  {result.language && (
                    <span className="text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {result.language}
                    </span>
                  )}
                  <button
                    onClick={() => copyToClipboard(result.tests, "tests")}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 group relative"
                    aria-label="Copy tests"
                    title="Copy tests"
                  >
                    {copiedSection === "tests" ? (
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <SyntaxHighlighter
                  language={result.language || "text"}
                  style={darkMode ? oneDark : oneLight}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: "0.875rem",
                  }}
                  showLineNumbers
                  lineNumberStyle={{
                    minWidth: "3em",
                    paddingRight: "1em",
                    textAlign: "right",
                    userSelect: "none",
                  }}
                >
                  {result.tests}
                </SyntaxHighlighter>
              </div>
            </div>

            {result.usage && (
              <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-colors duration-200">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    LLM Usage Stats
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Agent Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Coder Agent */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Coder Agent
                      </h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600 dark:text-gray-400">Tokens</dt>
                          <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.usage.coderAgent?.tokens || 0}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600 dark:text-gray-400">API Calls</dt>
                          <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.usage.coderAgent?.calls || 0}</dd>
                        </div>
                      </dl>
                    </div>
                    {/* QA Agent */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        QA Agent
                      </h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600 dark:text-gray-400">Tokens</dt>
                          <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.usage.qaAgent?.tokens || 0}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600 dark:text-gray-400">API Calls</dt>
                          <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.usage.qaAgent?.calls || 0}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  {/* Total Summary */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Total Usage
                      </h4>
                      <dl className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600 dark:text-gray-400">Total Tokens</dt>
                          <dd className="text-sm font-bold text-gray-900 dark:text-gray-100">{result.usage.total?.tokens || 0}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600 dark:text-gray-400">Total API Calls</dt>
                          <dd className="text-sm font-bold text-gray-900 dark:text-gray-100">{result.usage.total?.calls || 0}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
