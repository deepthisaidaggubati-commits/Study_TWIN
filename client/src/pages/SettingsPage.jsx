import React from 'react';
import Card from '../components/ui/Card';
import { Settings, Bell, Shield, Moon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <p className="text-xs text-slate-400">Configure application behavior and notification preferences</p>
      </div>

      <Card title="Notification Preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white">High Forgetting Risk Alerts</h4>
              <p className="text-[10px] text-slate-400">Receive notifications when topics exceed 60% risk score</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600 rounded" />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white">Upcoming Exam Reminders</h4>
              <p className="text-[10px] text-slate-400">Alerts 14 days and 3 days before exam dates</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600 rounded" />
          </div>
        </div>
      </Card>
    </div>
  );
}
