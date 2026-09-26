import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Network, ArrowRight } from 'lucide-react';

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

  const masteryMap = {};
  masteries.forEach(m => {
    if (m.topicId) {
      masteryMap[m.topicId._id || m.topicId] = m;
    }
  });

  return (
    <div className="space-y-6">
      <div className="glass-panel border border-[#63C63D]/30 p-6 rounded-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#63C63D]/20 text-[#168F3B] dark:text-[#B7E51D] text-xs font-bold mb-2">
          <Network className="w-4 h-4 text-[#FFD900]" />
          <span>Curriculum Dependency Map</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Interactive Knowledge Graph</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Explore concept prerequisite linkages and identify foundational knowledge bottlenecks before studying advanced topics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Prerequisite Dependency Nodes" subtitle="Click any topic node to inspect prerequisite state">
            <div className="p-6 glass-panel rounded-2xl min-h-[380px] flex flex-col justify-center border border-[#63C63D]/30">
              {topics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {topics.map(t => {
                    const m = masteryMap[t._id];
                    const score = m?.masteryScore || 0;
                    let badgeClass = 'bg-[#FFD900]/20 text-[#FFD900] border-[#FFD900]/40';
                    let statusText = 'Needs Attention';

                    if (score >= 75) {
                      badgeClass = 'bg-[#36A852]/20 text-[#36A852] dark:text-[#B7E51D] border-[#63C63D]/40';
                      statusText = 'Mastered';
                    } else if (score >= 45) {
                      badgeClass = 'bg-[#63C63D]/20 text-[#168F3B] dark:text-[#B7E51D] border-[#63C63D]/40';
                      statusText = 'Developing';
                    }

                    const isSelected = selectedTopic?._id === t._id;

                    return (
                      <div
                        key={t._id}
                        onClick={() => setSelectedTopic(t)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#168F3B]/20 border-[#63C63D] shadow-lg shadow-[#63C63D]/20 scale-[1.02]'
                            : 'glass-card hover:border-[#63C63D]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded glass-pill text-slate-700 dark:text-slate-300">
                            {t.subjectId?.name || 'Subject'}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${badgeClass}`}>
                            {statusText} ({score}%)
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{t.description || 'No description'}</p>

                        {t.prerequisites?.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-slate-200/20 dark:border-slate-800/40 flex items-center text-[10px] text-[#36A852] dark:text-[#B7E51D] font-bold space-x-1">
                            <ArrowRight className="w-3 h-3" />
                            <span>Requires: {t.prerequisites.map(p => p.name || 'Prereq').join(', ')}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-8 text-slate-500 dark:text-slate-400 text-xs">
                  No topics available in Knowledge Graph. Add subjects and topics to render dependency tree!
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Node Inspector" subtitle="Prerequisite & concept details">
            {selectedTopic ? (
              <div className="space-y-4">
                <div className="p-4 glass-card space-y-2">
                  <span className="text-[10px] font-bold text-[#168F3B] dark:text-[#B7E51D] uppercase tracking-wider">{selectedTopic.subjectId?.name}</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedTopic.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selectedTopic.description || 'No description provided.'}</p>
                  <div className="pt-2 text-xs font-bold text-slate-500 dark:text-slate-400">Difficulty Rating: <strong className="text-slate-900 dark:text-white">{selectedTopic.difficulty}/5</strong></div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 glass-card">
                Click any topic node on the left to inspect prerequisite linkages and mastery details.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
