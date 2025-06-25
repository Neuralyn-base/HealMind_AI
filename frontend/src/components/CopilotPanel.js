import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { chatApi } from '../services/api';

const CopilotPanel = ({ sessionId, messages, summaryUpdate }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    chatApi.getCopilotSummary(sessionId)
      .then(data => {
        setSummary(data.summary);
        if (summaryUpdate) summaryUpdate(data.summary);
      })
      .catch(err => {
        if (err.response && (err.response.status === 404 || err.response.status === 422)) {
          setSummary('');
          setError(null);
        } else {
          setError('Could not fetch copilot summary.');
          setSummary('');
        }
      })
      .finally(() => setLoading(false));
  }, [sessionId, messages, summaryUpdate]);

  // Helper: extract insights from summary (if present)
  const extractInsights = (summary) => {
    if (!summary) return [];
    // Try to find lines starting with numbers or dashes as insights
    const lines = summary.split('\n');
    const insights = lines.filter(line => /^\s*\d+\.|^- /.test(line.trim()));
    // If none found, just return the last 2 lines if summary is long
    if (insights.length === 0 && lines.length > 2) {
      return lines.slice(-2);
    }
    return insights;
  };
  const insights = extractInsights(summary);
  // Truncate summary for readability
  const shortSummary = summary.split('\n')[0]?.slice(0, 320) + (summary.length > 320 ? '...' : '');

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-6 w-6 text-secondary-400 animate-bounce" />
        <span className="font-semibold text-primary-700 text-lg">AI Copilot</span>
      </div>
      <div className="bg-white/80 rounded-xl p-4 shadow-inner text-neutral-700 mb-2 overflow-y-auto max-h-48 custom-scrollbar">
        <div className="font-medium mb-1">Live Session Summary</div>
        {loading ? (
          <div className="text-sm text-neutral-400">Loading summary...</div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : (
          <div className="text-sm text-neutral-600 whitespace-pre-line">{shortSummary || 'No summary yet.'}</div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto max-h-48 custom-scrollbar">
        <div className="font-semibold text-primary-700 mb-2">Copilot Insights</div>
        <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
          {insights.length > 0 ? insights.map((line, i) => <li key={i}>{line.trim()}</li>) : <li>No insights yet.</li>}
        </ul>
      </div>
    </div>
  );
};

export default CopilotPanel; 