import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Network, Brain, ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function KnowledgeGraphPage() {
  const [topics, setTopics] = useState([]);
  const [masteries, setMasteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topRes, masRes] = await Promise.all([
          API.get('/topics'),
          API.get('/mastery')
        ]);
        if (topRes.data.success) setTopics(topRes.data.data);
        if (masRes.data.success) setMasteries(masRes.data.data);
      } catch (err) {
        console.error('Failed to load Knowledge Graph data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner label="Constructing curriculum Knowledge Graph canvas..." />;

  // Map mastery data to topic IDs
  const masteryMap = {};
  masteries.forEach(m => {
    if (m.topicId) {
      masteryMap[m.topicId._id || m.topicId] = m;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 rounded-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <Network className="w-4 h-4 text-indigo-400" />
          <span>Curriculum Dependency Map</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Interactive Knowledge Graph</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore concept prerequisite linkages and identify foundational knowledge bottlenecks before studying advanced topics.
        </p>
      </div>

      {/* Main Canvas & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knowledge Tree Display */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Prerequisite Dependency Nodes" subtitle="Click any topic node to inspect prerequisite state">
            <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl min-h-[380px] flex flex-col justify-center">
              {topics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {topics.map(t => {
                    const m = masteryMap[t._id];
                    const score = m?.masteryScore || 0;
                    let badgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                    let statusText = 'Needs Attention';

                    if (score >= 75) {
                      badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                      statusText = 'Mastered';
                    } else if (score >= 45) {
                      badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                      statusText = 'Developing';
                    }

                    const isSelected = selectedTopic?._id === t._id;

                    return (
                      <div
                        key={t._id}
                        onClick={() => setSelectedTopic(t)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/80 border-indigo-500 shadow-lg shadow-indigo-600/20 scale-[1.02]'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {t.subjectId?.name || 'Subject'}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${badgeClass}`}>
                            {statusText} ({score}%)
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white">{t.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{t.description || 'No description'}</p>

                        {t.prerequisites?.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center text-[10px] text-indigo-300 font-semibold space-x-1">
                            <ArrowRight className="w-3 h-3" />
                            <span>Requires: {t.prerequisites.map(p => p.name || 'Prereq').join(', ')}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-8 text-slate-400 text-xs">
                  No topics available in Knowledge Graph. Add subjects and topics to render dependency tree!
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Selected Topic Inspector */}
        <div className="space-y-6">
          <Card title="Node Inspector" subtitle="Prerequisite & concept details">
            {selectedTopic ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{selectedTopic.subjectId?.name}</span>
                  <h3 className="text-lg font-bold text-white">{selectedTopic.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedTopic.description || 'No description provided.'}</p>
                  <div className="pt-2 text-xs font-semibold text-slate-400">Difficulty Rating: <strong className="text-white">{selectedTopic.difficulty}/5</strong></div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Prerequisite Status</h4>
                  {selectedTopic.prerequisites?.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      {selectedTopic.prerequisites.map(p => {
                        const pm = masteryMap[p._id || p];
                        const pScore = pm?.masteryScore || 0;
                        return (
                          <div key={p._id || p} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-950 border border-slate-800">
                            <span className="text-slate-200">{p.name || 'Prerequisite'}</span>
                            <span className={`font-bold ${pScore >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>{pScore}% Mastery</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No prerequisites specified for this topic.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                Click any topic node on the left to inspect prerequisite linkages and mastery details.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
