/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GOOGLE_TRENDS_HK } from '../mockData';
import { TrendingUp, RefreshCw, CheckCircle2, ServerCog, Globe, FileText, Check, HelpCircle } from 'lucide-react';
import { NewsDraft, CMSMenuType } from '../types';

interface TrendsDashboardProps {
  drafts: NewsDraft[];
  publishedList: NewsDraft[];
  onCreateDraft: (keyword: string, trendChannel: string, relativeTopic: string) => void;
  setActiveDraftId: (id: string) => void;
  setMenu: (menu: CMSMenuType) => void;
  onCrawlSuccess: (message: string) => void;
}

export default function TrendsDashboard({
  drafts,
  publishedList,
  onCreateDraft,
  setActiveDraftId,
  setMenu,
  onCrawlSuccess
}: TrendsDashboardProps) {
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlStep, setCrawlStep] = useState(0);
  const [generatingKeyword, setGeneratingKeyword] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const triggerCrawl = () => {
    setIsCrawling(true);
    setCrawlStep(1);

    // Timeout chain simulating scraper steps:
    setTimeout(() => setCrawlStep(2), 1200);
    setTimeout(() => setCrawlStep(3), 2400);
    setTimeout(() => setCrawlStep(4), 3600);
    setTimeout(() => {
      setIsCrawling(false);
      setCrawlStep(0);
      onCrawlSuccess('香港熱點監測與爬蟲同步完成：已增量同步最新香港熱門搜索信號與備用素材！');
    }, 4800);
  };

  const handleActionClick = (keyword: string, trendChannel: string, relativeTopic: string) => {
    setGeneratingKeyword(keyword);
    // Simulate real AI model loading configuration API and generating structure
    setTimeout(() => {
      setGeneratingKeyword(null);
      onCreateDraft(keyword, trendChannel, relativeTopic);
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="text-indigo-600 w-7 h-7" /> 熱點與爬蟲信號源
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            訂閱 Google Trends 香港實時熱榜與爬蟲狀態。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-600 hover:text-slate-800 border border-slate-200 shadow-sm flex items-center gap-1.5 transition-all focus:outline-none"
          >
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            什麼是預估熱度？
          </button>

          <button
            onClick={triggerCrawl}
            disabled={isCrawling}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              isCrawling
                ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isCrawling ? 'animate-spin' : ''}`} />
            {isCrawling ? '爬蟲數據同步中...' : '立即拉取 Trends ＆ 爬網'}
          </button>
        </div>
      </div>

      {/* Explanation Banner */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-xs md:text-sm text-indigo-950 space-y-3 leading-relaxed">
              <h4 className="font-bold text-indigo-900 flex items-center gap-1.5">
                💡 編輯室科普：熱度狀態與估算指標說明
              </h4>
              <ul className="space-y-2 list-disc list-inside text-indigo-900/90 font-medium">
                <li>
                  <strong className="text-indigo-950">「預估搜索熱度」是怎麼來的？</strong><br />
                  <span className="text-indigo-850 pl-5 inline-block">
                    數據直接讀取自 Google Trends (香港地區) 本日實時趨勢。例如 <code className="font-mono bg-indigo-100/80 px-1 rounded">20K+ 搜尋</code> 代表在過去 24 小時內，全港使用 Google 搜索引擎對該特徵關鍵字的累計檢索次數保守估計已突破兩萬次，具有極高的社會民生關注度。
                  </span>
                </li>
                <li>
                  <strong className="text-indigo-950">手動控制寫稿決策：</strong><br />
                  <span className="text-indigo-850 pl-5 inline-block font-normal">
                    我們已經關閉了後台全自動生稿機制，把<strong>「寫不寫、何時寫」</strong>的專業裁量權重歸人手。點擊右側的 <code className="bg-indigo-150 px-1.5 py-0.5 rounded font-bold">✍️ 手動撰寫此稿</code> 按鈕，系統即會根據您在「系統管理配置」中設定的 system prompt 模型，實時調研並組裝好草稿配圖並將其寫入 <strong className="text-indigo-900">AI 新聞草稿審核</strong> 工作台，供您進行最終人工事實覆對與發佈！
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crawl simulation Overlay popup */}
      <AnimatePresence>
        {isCrawling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-slate-200 p-8 max-w-lg w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-2xl">
                  <ServerCog className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">系統自動化爬蟲同步中</h3>
                  <p className="text-xs text-slate-400">正在執行 HK Trends 定時任務與正文擷取...</p>
                </div>
              </div>

              {/* Progress Steps UI */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {crawlStep >= 1 ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600" />
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-full border border-slate-300 bg-slate-100"></div>
                    )}
                  </div>
                  <div className="flex-1 text-sm font-semibold text-slate-700">
                    <p className={crawlStep === 1 ? 'text-indigo-600 font-bold' : ''}>1. 讀取 Google Trends (HK) 今日熱榜</p>
                    {crawlStep === 1 && <p className="text-xs text-slate-400 font-medium">擷取榜單：港鐵故障、差估署租金、職場AI威脅...</p>}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {crawlStep >= 2 ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-full border border-slate-300 bg-slate-50"></div>
                    )}
                  </div>
                  <div className="flex-1 text-sm font-semibold text-slate-700">
                    <p className={crawlStep === 2 ? 'text-indigo-600 font-bold' : ''}>2. 派發分散式爬蟲搜索原文字段與原圖</p>
                    {crawlStep === 2 && <p className="text-xs text-slate-400 font-medium">爬網目標：香港01、明報、東網、經濟日報...</p>}
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {crawlStep >= 3 ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600" />
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-full border border-slate-300 bg-slate-50"></div>
                    )}
                  </div>
                  <div className="flex-1 text-sm font-semibold text-slate-700">
                    <p className={crawlStep === 3 ? 'text-indigo-600 font-bold' : ''}>3. 提取圖片 URL 構成雙軌素材備用池</p>
                    {crawlStep === 3 && <p className="text-xs text-slate-400 font-medium">過濾水印以及過小縮略圖，匹配防盗鏈 OSS 重定向模組...</p>}
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {crawlStep >= 4 ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600" />
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-full border border-slate-300 bg-slate-50"></div>
                    )}
                  </div>
                  <div className="flex-1 text-sm font-semibold text-slate-700">
                    <p className={crawlStep === 4 ? 'text-indigo-600 font-bold' : ''}>4. 調用 AI 整合模型：準備雙軌對照草稿</p>
                    {crawlStep === 4 && <p className="text-xs text-slate-400 font-medium">翻譯英文繪圖關鍵提示詞、提取 3-5 篇核查段落...</p>}
                  </div>
                </div>
              </div>

              {/* Loader bars */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 transition-all duration-1000"
                  style={{ width: `${(crawlStep / 4) * 100}%` }}
                ></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Trends (HK) Listing */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="text-indigo-600 w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} /> Google Trends 香港今日實時熱榜
          </h2>
          <span className="text-xs text-slate-400 font-bold">同步週期：每 30 分鐘</span>
        </div>

        <div className="divide-y divide-slate-100">
          {GOOGLE_TRENDS_HK.map((trend, idx) => {
            // Check if there is already a draft in pending/draft_review
            const pendingDraft = drafts.find(d => 
              d.trendingKeywords.includes(trend.keyword) || 
              d.title.includes(trend.keyword) ||
              trend.keyword.includes(d.trendingKeywords) ||
              (trend.keyword === '港鐵信號故障' && d.id === 'mtr-delay-2026') ||
              (trend.keyword === '差估署住宅租金' && d.id === 'hk-rent-record-high') ||
              (trend.keyword === '職場 AI 取代化' && d.id === 'hk-career-ai-2026') ||
              (trend.keyword === '香港考評局 DSE 放榜' && d.id === 'dse-results-2026') ||
              (trend.keyword === '強積金 MPF 回報率' && d.id === 'mpf-returns-2026')
            );

            // Check if there is already a draft in published_news
            const publishedDraft = publishedList.find(d => 
              d.trendingKeywords.includes(trend.keyword) || 
              d.title.includes(trend.keyword) ||
              trend.keyword.includes(d.trendingKeywords) ||
              (trend.keyword === '港鐵信號故障' && d.id === 'mtr-delay-2026') ||
              (trend.keyword === '差估署住宅租金' && d.id === 'hk-rent-record-high') ||
              (trend.keyword === '職場 AI 取代化' && d.id === 'hk-career-ai-2026') ||
              (trend.keyword === '香港考評局 DSE 放榜' && d.id === 'dse-results-2026') ||
              (trend.keyword === '強積金 MPF 回報率' && d.id === 'mpf-returns-2026')
            );

            const isGenerating = generatingKeyword === trend.keyword;

            return (
              <div
                key={idx}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                id={`trend-row-${idx}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-black text-slate-300 font-mono w-6">0{idx + 1}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">{trend.keyword}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-semibold">
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">
                        {trend.trendChannel}
                      </span>
                      <span>關聯話題：{trend.relativeTopic}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 sm:text-right shrink-0">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">預估搜尋熱度</p>
                    <p className="text-sm font-bold text-slate-800 font-mono">{trend.searchVolume}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Badge Selection based on decision */}
                    {publishedDraft ? (
                      <>
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          已網上發佈
                        </span>
                        <button
                          onClick={() => setMenu('published_news')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all focus:outline-none flex items-center gap-1"
                          id={`view-published-${idx}`}
                        >
                          📖 閱讀新聞
                        </button>
                      </>
                    ) : pendingDraft ? (
                      <>
                        <span className="bg-indigo-50 text-indigo-800 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                          已產出待核稿
                        </span>
                        <button
                          onClick={() => {
                            setActiveDraftId(pendingDraft.id);
                            setMenu('draft_review');
                          }}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-all focus:outline-none flex items-center gap-1"
                          id={`view-draft-${idx}`}
                        >
                          🔍 前往審查
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          信號監測中
                        </span>
                        <button
                          disabled={generatingKeyword !== null || isGenerating}
                          onClick={() => handleActionClick(trend.keyword, trend.trendChannel, trend.relativeTopic)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all focus:outline-none flex items-center gap-1.5 shadow-sm ${
                            isGenerating
                              ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10'
                          }`}
                          id={`generate-draft-${idx}`}
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin text-white" />
                              組稿中...
                            </>
                          ) : (
                            <>
                              ✍️ 決定起稿
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
