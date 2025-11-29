// Name: AI Agent
// Student ID: 000000

"use client";

import { useState } from "react";

export default function Home() {
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Code Generator
          </h1>
          <p className="text-lg text-gray-600">
            Build your software with AI and MCP in seconds
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Software Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., A simple calculator application"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="requirements"
                  className="block text-sm font-medium text-gray-700"
                >
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="e.g., Must support add, subtract, multiply, divide. Handle division by zero."
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? "Generating..." : "Generate Software"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {result && (
          <div className="mt-8 space-y-8">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">
                  Generated Code
                </h3>
              </div>
              <div className="p-6 bg-gray-900 overflow-x-auto">
                <pre className="text-green-400 font-mono text-sm">
                  {result.code}
                </pre>
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">
                  Generated Tests
                </h3>
              </div>
              <div className="p-6 bg-gray-900 overflow-x-auto">
                <pre className="text-green-400 font-mono text-sm">
                  {result.tests}
                </pre>
              </div>
            </div>

            {result.usage && (
              <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">
                    LLM Usage Stats
                  </h3>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Total Tokens
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {result.usage.tokens}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        API Calls
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {result.usage.calls}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
