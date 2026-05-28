/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Globe, Calendar, User, Eye, ArrowUpRight, ShieldCheck, Tag, X } from 'lucide-react';
import { NewsDraft } from '../types';

interface PublishedNewsProps {
  publishedList: NewsDraft[];
}

export default function PublishedNews({ publishedList }: PublishedNewsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<NewsDraft | null>(null);

  // Categories extraction
  const categories = ['all', ...Array.from(new Set(publishedList.map((item) => item.category)))];

  const filteredNews = publishedList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="text-emerald-500 w-7 h-7" /> 已發佈前台新聞
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            管理當前已發佈在線的新聞資訊。
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-lg border border-emerald-100 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          後端防盗鏈 OSS 重定向已生效
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 mb-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋已發佈新聞標題、關鍵字或文章內容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-bold shrink-0 uppercase tracking-wider mr-2">頻道分類</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat === 'all' ? '全部渠道' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* News list Grid */}
      {filteredNews.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 text-center max-w-xl mx-auto flex flex-col items-center justify-center">
          <div className="bg-slate-100 text-slate-400 p-4 rounded-2xl mb-4">
            <Globe className="w-10 h-10" />
          </div>
          <p className="text-slate-700 font-bold text-lg mb-1">並未搜尋到符合條件的新聞</p>
          <p className="text-slate-400 text-sm max-w-md">
            你可以切換分類、輸入其他關鍵字嘗試，或者前往「AI 草稿審核區」審核發佈第一篇新聞稿。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredNews.map((news) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col md:flex-row group"
            >
              {/* Cover Image container */}
              <div className="w-full md:w-48 h-48 md:h-auto bg-slate-100 relative shrink-0 overflow-hidden">
                {news.coverImage ? (
                  <img
                    referrerPolicy="no-referrer"
                    src={news.coverImage}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                    <Globe className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-extrabold text-white tracking-wide uppercase">
                  {news.category}
                </div>
              </div>

              {/* Contents block */}
              <div className="p-5 flex-1 flex flex-col justify-between" id={`published-news-card-body-${news.id}`}>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-bold mb-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{news.publishTimestamp || news.lastUpdated}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-indigo-600 font-medium bg-indigo-50/50 px-2 py-0.5 rounded tracking-wide text-[10px]">
                      子頻道: {news.subcategory || '港聞'}
                    </span>
                  </div>

                  <h2 className="font-bold text-slate-900 text-sm md:text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                    {news.title}
                  </h2>

                  {/* Co-creation Authors Info */}
                  <p className="text-xs font-semibold text-slate-600 mb-2.5 flex items-center gap-1">
                    <span>✍️ 署名：</span>
                    <span className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded text-[10px]/none inline-block">
                      {news.authorType || '聯合創作'}
                    </span>
                    <span className="text-slate-800 font-bold">{news.authorName || 'AI 編輯室'}</span>
                  </p>

                  {/* News tags pills list */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {news.tags && news.tags.length > 0 ? (
                      news.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-bold bg-indigo-50/40 text-indigo-700 border border-indigo-100/50 px-2 py-0.5 rounded-lg shadow-sm">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-350 italic">無配置標籤</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-emerald-700 text-[10px] font-bold bg-emerald-55/10 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                      ● {news.publishSchedule === 'offline' ? '已下線存檔' : news.publishSchedule === 'scheduled' ? '定時在綫中' : '全網上綫'}
                    </span>
                    <span className="text-slate-500 text-[10px] font-bold bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded">
                      💬 評論區: {news.commentsEnabled !== false ? '開啟' : '關閉'}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveArticle(news)}
                    className="items-center gap-1 flex text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none"
                    id={`view-news-details-btn-${news.id}`}
                  >
                    詳細閱讀 <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pop-up modal view for full article details */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl relative w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 已審核排版
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {activeArticle.category} 頻道 ➔ 子頻道: {activeArticle.subcategory || '港聞'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1 px-2.5 text-slate-400 hover:text-slate-605 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors focus:outline-none"
                >
                  <X className="w-4 h-4 inline" /> <span className="text-xs font-bold">關閉</span>
                </button>
              </div>

              {/* Content body Scroll */}
              <div className="p-8 overflow-y-auto flex-1 space-y-6" id={`article-modal-scroll-${activeArticle.id}`}>
                {/* Title */}
                <h1 className="text-xl md:text-2xl font-bold text-slate-950 leading-tight">
                  {activeArticle.title}
                </h1>

                {/* Audit & Author Credentials Metadata Badge Box */}
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs" id="news-modal-licensing-box">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-705 flex items-center gap-2 flex-wrap">
                      <span>✍️ 著作署名方式：</span>
                      <span className="text-slate-805 bg-slate-200 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase">
                        {activeArticle.authorType || '聯合創作'}
                      </span>
                      <span className="text-indigo-650 font-extrabold">{activeArticle.authorName || 'AI 編輯室'}</span>
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      📅 審核印發時戳: {activeArticle.publishTimestamp || activeArticle.lastUpdated}
                    </p>
                  </div>
                  
                  <div className="text-slate-500 font-bold space-y-1 md:text-right text-[11px]" id="news-modal-comment-badge">
                    <p>💬 評論區功能：{activeArticle.commentsEnabled !== false ? '🟢 已開啟評論權限' : '🔴 預先鎖定關閉'}</p>
                    <p>🌐 實時發佈排程：{activeArticle.publishSchedule === 'offline' ? '📁 歸檔保留(Draft)' : activeArticle.publishSchedule === 'scheduled' ? '⏰ 系統隊列定時釋放' : '🟢 實時全網透傳'}</p>
                  </div>
                </div>

                {/* Article Tags list */}
                <div className="flex flex-wrap gap-1.5" id="news-modal-tags-section">
                  {activeArticle.tags && activeArticle.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[11px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-750 px-2.5 py-0.5 rounded-lg shadow-sm">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Cover & Caption */}
                {activeArticle.coverImage && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200/60 shadow-md">
                    <img
                      referrerPolicy="no-referrer"
                      src={activeArticle.coverImage}
                      alt="News Cover"
                      className="w-full max-h-[350px] object-cover"
                    />
                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 font-medium flex justify-between items-center flex-wrap gap-2">
                      <span>{activeArticle.coverSource || '封面圖片'}</span>
                      <span className="text-slate-400 text-[11px] bg-slate-250/50 px-2 py-0.5 rounded-md font-semibold">
                        本地智能 OSS 保存 (防裂鏈保護)
                      </span>
                    </div>
                  </div>
                )}

                {/* Main Content Body */}
                <div className="prose prose-slate max-w-none">
                  <div
                    className="text-slate-800 text-base leading-relaxed space-y-4 font-normal"
                    dangerouslySetInnerHTML={{ __html: activeArticle.content }}
                  />
                </div>

                {/* Force Disclaimer in modal */}
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed italic">
                  系統警示及聲明：{activeArticle.disclaimer || '資料綜合多個管道，僅供工作流預覽。'}
                </div>

                {/* Crawled Reference Fact Logs */}
                <div className="space-y-2 border-t border-slate-100 pt-5">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">事实引用來源比對</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeArticle.sources.map((source, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-indigo-700">{source.sourceName}</span>
                          <span className="text-[10px] text-slate-400">核實通過</span>
                        </div>
                        <p className="font-semibold text-slate-800 truncate">{source.originalTitle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Close footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end flex-shrink-0">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2 hover:bg-slate-200 text-slate-700 bg-slate-100 rounded-xl text-xs font-bold transition-all"
                >
                  確認並關閉
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
