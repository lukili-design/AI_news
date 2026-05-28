/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Newspaper, FileText, TrendingUp, Settings2, Cpu } from 'lucide-react';
import { CMSMenuType } from '../types';

interface SidebarProps {
  currentMenu: CMSMenuType;
  setMenu: (menu: CMSMenuType) => void;
  pendingCount: number;
  publishedCount: number;
}

export default function Sidebar({ currentMenu, setMenu, pendingCount, publishedCount }: SidebarProps) {
  const menuItems = [
    {
      id: 'trends' as CMSMenuType,
      label: '熱點信號源',
      icon: TrendingUp,
      description: 'Google Trends (HK) 與爬蟲狀態',
    },
    {
      id: 'draft_review' as CMSMenuType,
      label: 'AI新聞草稿審核',
      icon: Cpu,
      badge: pendingCount > 0 ? pendingCount : undefined,
      description: 'AI 定時草稿 ➔ 雙軌配圖事實審查',
    },
    {
      id: 'published_news' as CMSMenuType,
      label: '已發佈新聞',
      icon: Newspaper,
      badge: publishedCount > 0 ? publishedCount : undefined,
      badgeStyle: 'bg-emerald-100 text-emerald-800',
      description: '前台新聞列表與資料歸檔',
    },
    {
      id: 'settings' as CMSMenuType,
      label: '系統管理配置',
      icon: Settings2,
      description: '文生圖 API 次數限制及版權聲明',
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-100 min-h-screen flex flex-col border-r border-slate-800 shadow-xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg tracking-tight text-white">AI 新聞編輯室</h1>
            <p className="text-xs text-slate-400 font-medium">智能 CMS 審核工作流</p>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentMenu === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setMenu(item.id)}
              className={`w-full text-left flex flex-col p-3.5 rounded-xl transition-all duration-200 outline-none ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-2.5">
                  <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      item.badgeStyle || 'bg-indigo-500/30 text-indigo-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <p className={`text-xs ${isActive ? 'text-indigo-200' : 'text-slate-500'} font-medium`}>
                {item.description}
              </p>
            </button>
          );
        })}
      </nav>

      {/* Status Deck Widget */}
      <div className="p-4 mx-4 mb-6 rounded-xl bg-slate-800/40 border border-slate-700/50">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400 font-medium">DALL-E 繪圖配額</span>
          <span className="text-indigo-400 font-bold">100% 充沛</span>
        </div>
        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
        </div>
        <div className="flex justify-between items-center mt-3 text-[11px] text-slate-500">
          <span>今日已扣額: 12 / 100 次</span>
          <span className="text-slate-400">營運安全</span>
        </div>
      </div>
    </aside>
  );
}
