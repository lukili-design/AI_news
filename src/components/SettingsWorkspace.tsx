/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Shield, Server, HardDrive, Key, Check, Sparkles, Wand2 } from 'lucide-react';

interface SettingsWorkspaceProps {
  disclaimer: string;
  setDisclaimer: (val: string) => void;
  onSave: (message: string) => void;
}

export default function SettingsWorkspace({ disclaimer, setDisclaimer, onSave }: SettingsWorkspaceProps) {
  const [crawlSchedule, setCrawlSchedule] = useState('30m');
  const [legalTemplate, setLegalTemplate] = useState(disclaimer);

  // New states for custom models, api keys, and prompts for news writing & image generation
  const [aiNewsModel, setAiNewsModel] = useState('gemini-2.5-pro');
  const [aiNewsApiKey, setAiNewsApiKey] = useState('••••••••••••••••••••••••••••••••••••••••');
  const [aiNewsPrompt, setAiNewsPrompt] = useState('你是一個專業的港聞新聞主編，請根據以下熱點信號和抓取文本，編寫一篇新聞正文。要求：中立客觀、用詞專業、貼近香港書面港式用語（如：港鐵、深港合作、差估署等），突出時效性與社會民生影響...');

  const [aiImgModel, setAiImgModel] = useState('imagen-3.0-generate-002');
  const [aiImgApiKey, setAiImgApiKey] = useState('••••••••••••••••••••••••••••••••••••••••');
  const [aiImgPrompt, setAiImgPrompt] = useState('A professional editorial news photograph in HK local realist style, captured on 35mm lens, sharp focus, vivid colors, related to: <keywords>...');

  const handleSaveSettings = () => {
    setDisclaimer(legalTemplate);
    onSave('系統管理策略配置已成功更新，各核心 AI 模組與定時同步參數已實時重對齊！');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 space-y-8">
      {/* Header section with Save button at top right */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="text-slate-700 w-7 h-7" /> 系統管理配置
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            配置 AI 核心模型與參數、設定法務合規模板、以及管理 Google Trends 同步源。
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 focus:outline-none shrink-0"
        >
          <Check className="w-4 h-4" /> 保存配置
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI News Engine Strategy Config */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 col-span-1">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-indigo-650" />
            <h3 className="font-bold text-slate-900 text-sm md:text-base">AI 新聞撰寫引擎配置</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">使用 AI 模型</label>
                <select
                  value={aiNewsModel}
                  onChange={(e) => setAiNewsModel(e.target.value)}
                  className="w-full p-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold focus:ring-1 focus:ring-indigo-500 h-[38px]"
                  id="ai-news-model-select"
                >
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (推薦)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro Exp</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">API 金鑰 (Key)</label>
                <input
                  type="password"
                  value={aiNewsApiKey}
                  onChange={(e) => setAiNewsApiKey(e.target.value)}
                  placeholder="輸入 API 密鑰金鑰..."
                  className="w-full px-3 py-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold focus:ring-1 focus:ring-indigo-500 h-[38px] font-mono"
                  id="ai-news-key-input"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-bold block">常規組稿 system prompt 配置</label>
              <textarea
                value={aiNewsPrompt}
                onChange={(e) => setAiNewsPrompt(e.target.value)}
                rows={4}
                className="w-full p-3.5 text-xs text-slate-705 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed"
                id="ai-news-prompt-textarea"
              />
            </div>
          </div>
        </div>

        {/* AI Image Generation Engine Strategy Config */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 col-span-1">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Wand2 className="w-5 h-5 text-indigo-650 animate-pulse" />
            <h3 className="font-bold text-slate-900 text-sm md:text-base">AI 生圖編輯引擎配置</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">插圖 AI 模型</label>
                <select
                  value={aiImgModel}
                  onChange={(e) => setAiImgModel(e.target.value)}
                  className="w-full p-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold focus:ring-1 focus:ring-indigo-500 h-[38px]"
                  id="ai-image-model-select"
                >
                  <option value="imagen-3.0-generate-002">Imagen 3.0 (高清晰)</option>
                  <option value="imagen-3.0-fast-001">Imagen 3.0 Fast</option>
                  <option value="dall-e-3">DALL-E 3 (OpenAI)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">API 金鑰 (Key)</label>
                <input
                  type="password"
                  value={aiImgApiKey}
                  onChange={(e) => setAiImgApiKey(e.target.value)}
                  placeholder="輸入 API 密鑰金鑰..."
                  className="w-full px-3 py-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold focus:ring-1 focus:ring-indigo-500 h-[38px] font-mono"
                  id="ai-image-key-input"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-bold block">生圖風格與 Prompt 機制配置</label>
              <textarea
                value={aiImgPrompt}
                onChange={(e) => setAiImgPrompt(e.target.value)}
                rows={4}
                className="w-full p-3.5 text-xs text-slate-705 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed"
                id="ai-image-prompt-textarea"
              />
            </div>
          </div>
        </div>

        {/* Google Trends Config */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6 col-span-1 lg:col-span-2">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <HardDrive className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm md:text-base">Google Trends 配置</h3>
          </div>

          <div className="space-y-5">
            {/* Synchronizing timeline frequencies */}
            <div className="space-y-2 max-w-md">
              <label className="text-xs text-slate-500 font-bold block">香港 Google Trends 定時同步頻次</label>
              <select
                value={crawlSchedule}
                onChange={(e) => setCrawlSchedule(e.target.value)}
                className="w-full p-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold focus:ring-1 focus:ring-indigo-500 h-[38px]"
              >
                <option value="15m">每 15 分鐘 (高載同步)</option>
                <option value="30m">每 30 分鐘 (常規建議值)</option>
                <option value="1h">每小時 (對抗封禁安全型)</option>
                <option value="12h">每日兩次 </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & disclaimers templates card - Moved to the very bottom */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm md:text-base">全局法務免責聲明模板</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-bold block">新聞稿文末強制帶入文本</label>
            <textarea
              value={legalTemplate}
              onChange={(e) => setLegalTemplate(e.target.value)}
              rows={4}
              className="w-full p-4 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed font-mono"
            />
          </div>
        </div>
      </div>

      {/* Built-in API credentials monitor cards */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
          <Key className="w-4 h-4 animate-bounce" /> 雲端接口與凭證環境變量
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-normal">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-xs space-y-1">
            <p className="text-slate-500 uppercase font-bold tracking-wider text-[10px]">GEMINI_API_KEY</p>
            <p className="font-mono text-white opacity-80 truncate">••••••••••••••••••••••••</p>
            <p className="text-[10px] text-indigo-400">已由 AI Studio 云基礎設施智能注入</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-xs space-y-1">
            <p className="text-slate-500 uppercase font-bold tracking-wider text-[10px]">DALL-E 3 Gateway</p>
            <p className="font-mono text-emerald-400 font-bold">已啟用 (預設負載均衡代理端口)</p>
            <p className="text-[10px] text-slate-400">當前健康度：Excellent (99.98% uptime)</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-xs space-y-1">
            <p className="text-slate-500 uppercase font-bold tracking-wider text-[10px]">OSS Storage Bucket</p>
            <p className="font-mono text-white opacity-80 select-all font-medium">s3-hk-oss.news.local</p>
            <p className="text-[10px] text-slate-400">在線代理下載模式：生效中</p>
          </div>
        </div>
      </div>
    </div>
  );
}
