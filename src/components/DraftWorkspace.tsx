/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsDraft, SourceImage, AIGeneratedImage } from '../types';
import { INSTANT_AI_IMAGES_POOL } from '../mockData';
import {
  FileText, Sparkles, Image as ImageIcon, CheckCircle2,
  AlertTriangle, ArrowRight, Save, Trash2, ShieldCheck, HelpCircle,
  Clock, Plus, Copy, Server, ChevronDown, ChevronUp, Link as LinkIcon
} from 'lucide-react';

interface DraftWorkspaceProps {
  drafts: NewsDraft[];
  activeDraftId: string;
  setActiveDraftId: (id: string) => void;
  onSaveDraft: (updatedDraft: NewsDraft) => void;
  onPublishDraft: (id: string, finalDraft?: NewsDraft) => void;
  onRejectDraft: (id: string) => void;
  triggerToast: (text: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function DraftWorkspace({
  drafts,
  activeDraftId,
  setActiveDraftId,
  onSaveDraft,
  onPublishDraft,
  onRejectDraft,
  triggerToast
}: DraftWorkspaceProps) {
  const currentDraft = drafts.find((d) => d.id === activeDraftId);

  // Active tabs
  const [rightActiveTab, setRightActiveTab] = useState<'fact_check' | 'visual_assets'>('fact_check');
  const [visualSubTab, setVisualSubTab] = useState<'scraped' | 'ai_gen'>('scraped');

  // Accordion indices for Fact-Check
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    'src-mtr-1': true,
    'src-rent-1': true,
    'src-career-1': true
  });

  // Fact translation highlights
  const [showFactDiff, setShowFactDiff] = useState(false);

  // AI Generation configuration
  const [promptInput, setPromptInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('新聞寫實');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generationTimer, setGenerationTimer] = useState(5);
  const [loadingStep, setLoadingStep] = useState('');

  // Local editable draft state to avoid sluggishness and enable discard
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBullets, setEditedBullets] = useState<string[]>([]);
  const [editedContent, setEditedContent] = useState('');
  const [editedDisclaimer, setEditedDisclaimer] = useState('');
  const [editedCoverImage, setEditedCoverImage] = useState<string | null>(null);
  const [editedCoverSource, setEditedCoverSource] = useState<string | null>(null);

  // Audit modal and parameter states
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState('港聞');
  const [selectedAuthorType, setSelectedAuthorType] = useState('聯合創作');
  const [selectedAuthorName, setSelectedAuthorName] = useState('AI 編輯室');
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [publishSchedule, setPublishSchedule] = useState<'online' | 'offline' | 'scheduled'>('online');
  const [tagInput, setTagInput] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);

  // OSS Agent downloading overlay mockup state
  const [isDownloadingOSS, setIsDownloadingOSS] = useState(false);
  const [ossTargetUrl, setOssTargetUrl] = useState('');

  // Synchronize state when switching drafts
  useEffect(() => {
    if (currentDraft) {
      setEditedTitle(currentDraft.title);
      setEditedBullets([...currentDraft.summary]);
      setEditedContent(currentDraft.content);
      setEditedDisclaimer(currentDraft.disclaimer);
      setEditedCoverImage(currentDraft.coverImage);
      setEditedCoverSource(currentDraft.coverSource);
      setPromptInput(currentDraft.englishKeywords);
      setEditedTags(currentDraft.tags || ['trends']);
      setSelectedSubcategory(currentDraft.subcategory || '港聞');
      setSelectedAuthorType(currentDraft.authorType || '聯合創作');
      setSelectedAuthorName(currentDraft.authorName || 'AI 編輯室');
      setCommentsEnabled(currentDraft.commentsEnabled !== undefined ? currentDraft.commentsEnabled : true);
      setPublishSchedule(currentDraft.publishSchedule || 'online');
    }
  }, [activeDraftId, currentDraft]);

  if (!currentDraft) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-12">
        <div className="bg-slate-100 p-4 rounded-full text-slate-400 mb-4 shadow-inner">
          <FileText className="w-12 h-12" />
        </div>
        <p className="text-slate-800 font-bold text-lg">無待審核草稿</p>
        <p className="text-slate-400 text-sm mt-1">
          恭喜你！所有定時抓取的新聞草稿已全數審查完畢，你可以去「已發佈新聞網」查看。
        </p>
      </div>
    );
  }

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Fact-Check sentence scanning highlighter
  const highlightFactInEditor = (keyword: string) => {
    triggerToast(`正文查核定位：已著色與 ${keyword} 相關的事實敘述進行二次對比！`, 'info');
    setShowFactDiff(true);
  };

  // Bullet items manipulation
  const updateBullet = (index: number, val: string) => {
    const updated = [...editedBullets];
    updated[index] = val;
    setEditedBullets(updated);
  };

  const deleteBullet = (index: number) => {
    const updated = editedBullets.filter((_, idx) => idx !== index);
    setEditedBullets(updated);
    triggerToast('懶人包含量已調整', 'info');
  };

  const addBullet = () => {
    setEditedBullets([...editedBullets, '請輸入新增的新聞扼要紀實亮點...']);
  };

  // Intercepting external URLs and hosting them on local OSS simulation with detailed tech logs
  const simulateOSSProtection = (origUrl: string, sourceSite: string, type: 'insert' | 'cover') => {
    setOssTargetUrl(origUrl);
    setIsDownloadingOSS(true);

    setTimeout(() => {
      // Simulate OSS translation
      const randomId = Math.floor(Math.random() * 89999) + 10000;
      const proxyUrl = `https://oss.intelligence-news.hk/assets/scraped/img_${randomId}.png`;
      const captionText = `（圖片來源：${sourceSite} 截圖轉存）`;

      if (type === 'cover') {
        setEditedCoverImage(origUrl); // visually load
        setEditedCoverSource(`原圖轉存：${sourceSite}`);
        triggerToast('成功將外部原圖轉存至自建 OSS，並設為頭條新聞封面！', 'success');
      } else {
        // Formulate captioned image tag
        const imageHtml = `\n<div class="my-4 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50">
  <img src="${origUrl}" alt="scraped aspect" class="w-full object-cover max-h-[290px]" />
  <p class="p-2.5 text-center text-xs text-slate-500 font-medium bg-slate-100 border-t border-slate-100">${captionText}</p>
</div>\n`;
        setEditedContent((prev) => prev + imageHtml);
        triggerToast('已對抗防盜網，成功將原圖即時代下載至 OSS 並插入正文段落！', 'success');
      }
      setIsDownloadingOSS(false);
    }, 1500);
  };

  // AI text-to-image generator with strict 3-time threshold rule and custom style queries
  const triggerImageGeneration = () => {
    if (currentDraft.textToImageCalls >= 3) {
      triggerToast('⚠️ 成本逾計阻擋：為防止 API 資源重疊浪費，單篇草稿限制呼叫 AI 繪製最多 3 次！', 'error');
      return;
    }

    setIsGeneratingImage(true);
    setGenerationTimer(5);

    // Dynamic steps simulation
    const steps = [
      '正在解析標題意圖並調用 DALL-E 3 API 網關...',
      '正在將您輸入的 Prompt 與高像素樣式範本拼裝...',
      '生成式 AI 正在輸出向量插畫並渲染構圖張力...',
      '本地雲 OSS 接管：正在下載圖像落地，生成免裂鏈安全 CDN 網址...'
    ];

    setLoadingStep(steps[0]);

    // Timer countdown
    const countdown = setInterval(() => {
      setGenerationTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Step change timer
    setTimeout(() => setLoadingStep(steps[1]), 1200);
    setTimeout(() => setLoadingStep(steps[2]), 2400);
    setTimeout(() => setLoadingStep(steps[3]), 3600);

    setTimeout(() => {
      // Complete generation logic
      const poolForDraft = INSTANT_AI_IMAGES_POOL[currentDraft.id as keyof typeof INSTANT_AI_IMAGES_POOL] || [];
      const chosenStyleMock = poolForDraft.find((i) => i.style === selectedStyle) || poolForDraft[0];

      const newAiImage: AIGeneratedImage = {
        id: `ai-img-${Date.now()}`,
        url: chosenStyleMock.previewUrl,
        prompt: promptInput,
        style: selectedStyle,
        timestamp: new Date().toLocaleTimeString()
      };

      const updatedCalls = currentDraft.textToImageCalls + 1;
      const updatedDraft: NewsDraft = {
        ...currentDraft,
        textToImageCalls: updatedCalls,
        aiGeneratedImages: [...currentDraft.aiGeneratedImages, newAiImage]
      };

      onSaveDraft(updatedDraft);
      setIsGeneratingImage(false);
      triggerToast(`🪄 AI 繪圖生成成功！已消耗次數: ${updatedCalls}/3`, 'success');
    }, 5000);
  };

  const handleInsertAiImage = (imgUrl: string, style: string) => {
    const captionText = `（圖片由 AI 生成，僅供示意）`;
    const imageHtml = `\n<div class="my-4 border border-dashed border-indigo-200 rounded-xl overflow-hidden shadow-sm bg-indigo-50/20">
  <img src="${imgUrl}" alt="AI illustration" class="w-full object-cover max-h-[300px]" />
  <p class="p-2.5 text-center text-xs text-indigo-700 font-bold bg-indigo-50 border-t border-indigo-100">${captionText}</p>
</div>\n`;
    setEditedContent((prev) => prev + imageHtml);
    triggerToast('已將 AI 生成圖片安全插入文章正文！', 'success');
  };

  const handleSetAiAsCover = (imgUrl: string) => {
    setEditedCoverImage(imgUrl);
    setEditedCoverSource('圖片由 AI 繪製生成（僅供示意）');
    triggerToast('AI 繪圖已成功設定為該新聞的頭條封面！', 'success');
  };

  // Save changes locally to database
  const handleSave = () => {
    if (!editedDisclaimer.trim()) {
      triggerToast('儲存失敗：CMS 規範要求正文末尾必須強制包含事實來源免責聲明！', 'warning');
      return;
    }

    const updated: NewsDraft = {
      ...currentDraft,
      title: editedTitle,
      summary: editedBullets,
      content: editedContent,
      disclaimer: editedDisclaimer,
      coverImage: editedCoverImage,
      coverSource: editedCoverSource,
      tags: editedTags,
      subcategory: selectedSubcategory,
      authorType: selectedAuthorType,
      authorName: selectedAuthorName,
      commentsEnabled: commentsEnabled,
      publishSchedule: publishSchedule,
      lastUpdated: new Date().toLocaleString()
    };
    onSaveDraft(updated);
    triggerToast('草稿修改內容已安全存入本地數據緩存區。', 'success');
  };

  // Publish News logic (via Audit process)
  const handleAuditAndPublish = () => {
    if (!editedDisclaimer.trim()) {
      triggerToast('發佈失敗：請填報對應的事實來源免責聲明。', 'warning');
      return;
    }

    // Capture latest finalized audited state
    const finalDraft: NewsDraft = {
      ...currentDraft,
      title: editedTitle,
      summary: editedBullets,
      content: editedContent,
      disclaimer: editedDisclaimer,
      coverImage: editedCoverImage,
      coverSource: editedCoverSource,
      tags: editedTags,
      subcategory: selectedSubcategory,
      authorType: selectedAuthorType,
      authorName: selectedAuthorName,
      commentsEnabled: commentsEnabled,
      publishSchedule: publishSchedule,
      lastUpdated: new Date().toLocaleString()
    };
    onSaveDraft(finalDraft);

    // Call publish handler with final draft object
    onPublishDraft(currentDraft.id, finalDraft);
    setIsAuditModalOpen(false);
  };

  // Is this a socio-transit "hard" news? (e.g., MTR delays)
  const isHardNews = currentDraft.category === '交通民生';

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      {/* Draft Workspace Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl border border-indigo-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                審查待發佈 (PENDING)
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {currentDraft.id}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-slate-900">當前審查單：</span>
              <select
                value={activeDraftId}
                onChange={(e) => setActiveDraftId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-1 text-slate-700 font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                {drafts.map((d) => (
                  <option key={d.id} value={d.id}>
                    ({d.category}) Rank {d.trendingRank}: {d.title.slice(0, 18)}...
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Saved feedback */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono hidden lg:inline">
            最後自動同步: {currentDraft.lastUpdated}
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-2 hover:bg-slate-100 border border-slate-200 text-slate-700 bg-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-slate-500" />
            保存草稿
          </button>
          <button
            onClick={() => onRejectDraft(currentDraft.id)}
            className="px-4 py-2 hover:bg-rose-100 border border-rose-200 text-rose-700 bg-rose-50/50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            駁回此單
          </button>
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="px-5 py-2 hover:bg-emerald-700 bg-emerald-600 shadow-md shadow-emerald-600/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            審核
          </button>
        </div>
      </div>

      {/* Main split screens panel container */}
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT PANEL: Writing area & summaries */}
        {/* ========================================================= */}
        <div className="w-1/2 overflow-y-auto px-8 py-6 space-y-6 border-r border-slate-200 bg-white shadow-sm">
          {/* Section banner */}
          <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <span>01 / WRITING WORKSPACE</span>
              <span className="text-slate-300">|</span>
              <span className="text-indigo-600 font-medium">前台發布排版與富文本</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              字數統計：<strong className="text-slate-700">{editedContent.length}</strong> 字
            </span>
          </div>

          {/* Title Area */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-bold block uppercase tracking-wider">新聞標題</label>
            <textarea
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              rows={2}
              className="w-full p-4 text-base font-bold text-slate-900 border border-slate-200 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all leading-snug"
              placeholder="請輸入新聞的主標題（吸引點擊與SEO關鍵詞並存）"
            />
          </div>

          {/* New Interactive News Tags field: replaces category config */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                新聞標籤
                <span className="text-[10px] text-slate-400 font-normal">（內置預代入 trends 與抓取標籤）</span>
              </label>
              <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded">
                頻道屬性: {currentDraft.category}
              </span>
            </div>

            {/* Tag pills list */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
              {editedTags.map((tag, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 text-[11px] font-bold bg-white border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg shadow-sm hover:border-indigo-300 transition-colors"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedTags(editedTags.filter((_, tIdx) => tIdx !== idx));
                    }}
                    className="text-indigo-400 hover:text-rose-500 transition-colors font-extrabold focus:outline-none text-[12px] ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              {editedTags.length === 0 && (
                <span className="text-xs text-slate-400 font-medium italic">尚未配置標籤，請於下方新增</span>
              )}
            </div>

            {/* Tag add input bar */}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (tagInput.trim() && !editedTags.includes(tagInput.trim())) {
                      setEditedTags([...editedTags, tagInput.trim()]);
                      setTagInput('');
                    }
                  }
                }}
                placeholder="輸入新聞標籤（例如：深港合作）按 Enter"
                className="flex-1 bg-white border border-slate-200 text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => {
                  if (tagInput.trim() && !editedTags.includes(tagInput.trim())) {
                    setEditedTags([...editedTags, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl px-4 py-1.5 text-xs font-bold shadow-sm hover:shadow-indigo-600/15 transition-all text-center"
              >
                新增標籤
              </button>
            </div>
          </div>

          {/* Rich Content Editor Simulation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400 font-bold block uppercase tracking-wider">新聞正文（支援 HTML 排版注入）</label>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-[10px] font-bold text-slate-500 border border-slate-200">
                <span className="px-2.5 py-1 bg-white rounded-lg text-slate-800 shadow-sm">標準編輯</span>
                <span className="px-2.5 py-1 cursor-pointer hover:text-slate-800">HTML源代碼</span>
              </div>
            </div>

            {/* Simulating a CMS formatting toolbar */}
            <div className="bg-slate-50 border border-slate-200 p-2 rounded-t-xl border-b-0 flex gap-1.5 items-center flex-wrap">
              <button
                onClick={() => {
                  setEditedContent((prev) => prev + '\n<p><strong>強調文字：</strong>請在此輸入...</p>\n');
                  triggerToast('已在正文末尾追加加粗文本段落', 'info');
                }}
                className="p-1 px-2.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-slate-700 scroll-smooth"
                title="加粗"
              >
                B
              </button>
              <button
                onClick={() => {
                  setEditedContent((prev) => prev + '\n<p><em>斜體文字：</em>請在此輸入...</p>\n');
                  triggerToast('已在正文末尾追加斜體文本段落', 'info');
                }}
                className="p-1 px-2.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-slate-700"
                title="斜體"
              >
                I
              </button>
              <button
                onClick={() => {
                  setEditedContent((prev) => prev + '\n<h3>小標題名</h3>\n');
                  triggerToast('已追加 H3 副標題', 'info');
                }}
                className="p-1 px-2.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-slate-700"
                title="標題"
              >
                H3
              </button>
              <div className="w-px h-5 bg-slate-200 mx-1"></div>
              <button
                onClick={() => {
                  setEditedContent((prev) => prev + '\n<blockquote>“引用政要或機構言論”</blockquote>\n');
                  triggerToast('已追加 blockquote 區塊', 'info');
                }}
                className="p-1 px-2.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-semibold text-slate-600"
                title="塊框引用"
              >
                “ 引用
              </button>
              <button
                onClick={() => {
                  setEditedContent((prev) => prev + '\n<ul>\n  <li>亮點 A</li>\n  <li>亮點 B</li>\n</ul>\n');
                  triggerToast('已追加 UL 無序列表段', 'info');
                }}
                className="p-1 px-2.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-xs font-semibold text-slate-600"
              >
                • 列表
              </button>
            </div>

            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={7}
              className={`w-full p-4 text-sm font-normal text-slate-800 ring-2 ring-transparent border border-slate-200 rounded-b-xl focus:outline-none focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-sans leading-relaxed ${
                showFactDiff ? 'bg-amber-50/25 border-amber-300' : 'bg-transparent'
              }`}
            />
          </div>

          {/* Cover Art Box with active status preview */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
              本篇頭條封面圖預覽 (Cover Showcase)
            </label>
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
              {editedCoverImage ? (
                <div>
                  <img
                    referrerPolicy="no-referrer"
                    src={editedCoverImage}
                    alt="Current Cover"
                    className="w-full max-h-[220px] object-cover"
                  />
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold">{editedCoverSource || '原網站擷取圖片'}</span>
                    <button
                      onClick={() => {
                        setEditedCoverImage(null);
                        setEditedCoverSource(null);
                        triggerToast('封面大圖已註銷，發布前請重新配置！', 'warning');
                      }}
                      className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1.5 focus:outline-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      清除封面
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center flex flex-col items-center justify-center bg-slate-100/50">
                  <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-600">當前未設定新聞封面</p>
                  <p className="text-xs text-slate-400 max-w-sm mt-0.5 leading-relaxed">
                    您可以在右側素材池面板中，一鍵點選原圖擷取下的 【設為封面】 或一鍵調用 AI 繪圖 【設為封面】
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Forced disclaimer required for compliance */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                文末強制帶入之事實查檢免責聲明
              </label>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded">
                監管條規強鎖
              </span>
            </div>
            <textarea
              value={editedDisclaimer}
              onChange={(e) => setEditedDisclaimer(e.target.value)}
              rows={2}
              className="w-full p-3.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium italic leading-relaxed"
              placeholder="綜合來源免責保護條款為空..."
            />
            <p className="text-[10px] text-slate-400">
              * 系統後置發佈器會自動對齊將該段免責申報拼接於前台排版最下方。
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: Scraper Facts and Scraping Images Tabs */}
        {/* ========================================================= */}
        <div className="w-1/2 overflow-y-auto px-8 py-6 space-y-6 bg-slate-50">
          {/* Section tab toggle headers */}
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider">
              02 / REFERENTIAL SOURCES & ASSETS
            </h3>
            <div className="flex bg-slate-200 p-0.5 rounded-xl border border-slate-200 text-xs font-bold leading-none">
              <button
                onClick={() => setRightActiveTab('fact_check')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  rightActiveTab === 'fact_check'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🔎 文章查核 (Fact-Check)
              </button>
              <button
                onClick={() => setRightActiveTab('visual_assets')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  rightActiveTab === 'visual_assets'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🖼️ 圖片素材池 (Visual Assets)
            </button>
            </div>
          </div>

          {/* Tab 1: Fact Check Accordions */}
          {rightActiveTab === 'fact_check' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">防範 AI 幻覺事实對照審查器</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  以下為抓取所得的 3-5 篇香港原網即時文本比對片段。請編輯認真核查關鍵人名、重要數據點，保障信息真實性！
                </p>
              </div>

              {/* Accordion loop */}
              <div className="space-y-3">
                {currentDraft.sources.map((src) => {
                  const isOpen = !!openAccordions[src.id];
                  return (
                    <div
                      key={src.id}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Accordion Click trigger header */}
                      <button
                        onClick={() => toggleAccordion(src.id)}
                        className="w-full text-left p-4 flex items-center justify-between gap-3 focus:outline-none group active:bg-slate-50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-extrabold border border-indigo-100 flex items-center gap-1">
                              <Server className="w-3 h-3" />
                              {src.sourceName} 原文
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                              <LinkIcon className="w-2.5 h-2.5" />
                              {src.url.slice(0, 30)}...
                            </span>
                          </div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                            {src.originalTitle}
                          </p>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {/* Accordion expand block */}
                      {isOpen && (
                        <div className="p-4 pt-1 bg-slate-50 border-t border-slate-100 space-y-3">
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                            抓取文本碎片比對 (Citations)：
                          </p>
                          <div className="space-y-2">
                            {src.textFragments.map((frag, fIdx) => (
                              <div
                                key={fIdx}
                                onClick={() => highlightFactInEditor(frag.slice(0, 10))}
                                className="p-3 bg-white border border-slate-200/70 rounded-lg text-xs hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer relative group/frag"
                              >
                                <p className="text-slate-600 leading-relaxed font-medium">“ {frag} ”</p>
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-0 group-hover/frag:opacity-100 transition-opacity bg-indigo-600 text-white text-[9px] font-bold px-2 py-1 rounded">
                                  點擊在正文定位對比
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Visual Assets */}
          {rightActiveTab === 'visual_assets' && (
            <div className="space-y-6">
              {/* Media Sub-tabs selector */}
              <div className="bg-slate-200/80 p-1.5 rounded-xl flex gap-2 text-xs font-bold border border-slate-200">
                <button
                  onClick={() => setVisualSubTab('scraped')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    visualSubTab === 'scraped' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  🕸️ 原圖擷取 (Scraped Images)
                </button>
                <button
                  onClick={() => setVisualSubTab('ai_gen')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    visualSubTab === 'ai_gen' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  🪄 AI 繪圖生成 (AI文生圖)
                </button>
              </div>

              {/* Media Subtab A: Scraped images with live proxy log overlays */}
              {visualSubTab === 'scraped' && (
                <div className="space-y-4">
                  {/* OSS Warning description */}
                  <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-4 rounded-xl text-xs space-y-1.5">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      後端防盜鏈攔截機制：熱聯防禦 (Hotlinking Prevention)
                    </p>
                    <p className="text-slate-600 font-normal leading-relaxed">
                      點擊任意擷取的原圖，系統將會在後台執行 **OSS 代理重定向 (Fetch Proxy)**
                      ：即時將圖像下載到我們自建的安全高防 OSS 桶中，重定向為自建雲 URL 後再插入文章。
                      這可以徹底解決直接調用外部 URL 導致的圖片失效或裂圖問題。
                    </p>
                  </div>

                  {/* Waterfall Masonry preview of scraped images */}
                  <div className="grid grid-cols-2 gap-4">
                    {currentDraft.originalImages.map((img) => (
                      <div
                        key={img.id}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-lg hover:border-slate-300 transition-all"
                      >
                        <div className="relative aspect-video bg-slate-100 overflow-hidden">
                          <img
                            referrerPolicy="no-referrer"
                            src={img.url}
                            alt="scraped visual source"
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider">
                            {img.source}
                          </div>

                          {/* Hover Interaction panel overlay */}
                          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2.5">
                            <button
                              onClick={() => simulateOSSProtection(img.url, img.source, 'insert')}
                              className="w-full max-w-[120px] py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 shadow-sm focus:outline-none"
                            >
                              <Plus className="w-3.5 h-3.5" /> ➕ 插入正文
                            </button>
                            <button
                              onClick={() => simulateOSSProtection(img.url, img.source, 'cover')}
                              className="w-full max-w-[120px] py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 shadow-sm focus:outline-none border border-slate-200"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-slate-600" /> 設為封面
                            </button>
                          </div>
                        </div>
                        <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-medium truncate">
                          原站域名: {img.url.slice(0, 40)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Subtab B: AI Text to Image generator tool */}
              {visualSubTab === 'ai_gen' && (
                <div className="space-y-6">
                  {/* Law/Copyright Warning Block as specified in PRD */}
                  <div
                    className={`p-4 rounded-xl text-xs space-y-1 ${
                      isHardNews
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className={`w-4.5 h-4.5 ${isHardNews ? 'text-amber-600' : 'text-indigo-600'}`} />
                      版權與防僞聲明指南 (PRD 法務規範)
                    </div>
                    {isHardNews ? (
                      <p className="font-normal text-slate-600 leading-relaxed">
                        ⚠️ <strong className="text-amber-900 font-bold">當前欄目為「交通民生」硬新聞/社會事件：</strong>
                        法務與公眾指引要求嚴禁使用 AI 繪圖生成「現場擬真照」，以免引發製造假新聞之公眾恐慌！
                        此類新聞若無现场安全原圖，請优先使用地圖截圖、警徽或港鐵標誌等公有圖片。
                        AI 生成僅限用於財經、娛樂、科普、心理學等不需要現場紀實的軟性資訊。
                      </p>
                    ) : (
                      <p className="font-normal text-slate-600 leading-relaxed">
                        ✅ <strong className="text-indigo-900 font-bold">當前欄目為「軟性資訊 / 科技財經」：</strong>
                        此類場景（如本單主題）極其適合在原圖受版權水印困擾時，利用 AI 文生圖生成抽象、概念插畫。請自主配置您的提示詞！
                      </p>
                    )}
                  </div>

                  {/* AI Generator Control panel */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
                    {/* Prompt input with preset translation indicators */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-500 font-bold block uppercase tracking-wider">
                          Prompt 提示詞配置 (自動中翻英提取)
                        </label>
                        <span className="text-[10px] text-slate-400 font-bold">
                          依據新聞自動優化
                        </span>
                      </div>
                      <textarea
                        value={promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                        rows={3}
                        className="w-full p-3.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono leading-relaxed"
                        placeholder="請輸入英文 Prompt 以激發 DALL-E 3 大模型最大創意..."
                      />
                    </div>

                    {/* Pre-made style variants list */}
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                        預設插畫藝術风格選擇
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {['新聞寫實', '賽博朋克', '扁平插畫', '3D卡通'].map((style) => (
                          <button
                            key={style}
                            onClick={() => setSelectedStyle(style)}
                            className={`p-2 rounded-xl text-center text-xs font-bold transition-all border outline-none ${
                              selectedStyle === style
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* API Costs restrictions & generate button */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-[11px] font-bold text-slate-700">文生圖 API 次數限制</p>
                        <p className="text-[10px] text-slate-400">
                          本單：<strong className={`${currentDraft.textToImageCalls >= 3 ? 'text-rose-500 font-bold' : 'text-slate-700 font-extrabold'}`}>
                            {currentDraft.textToImageCalls} / 3 次
                          </strong>
                        </p>
                      </div>

                      <button
                        onClick={triggerImageGeneration}
                        disabled={isGeneratingImage}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all outline-none ${
                          isGeneratingImage
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border'
                            : currentDraft.textToImageCalls >= 3
                            ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        {isGeneratingImage ? `正在生成 (${generationTimer}s)...` : '🪄 呼叫 AI 繪製'}
                      </button>
                    </div>
                  </div>

                  {/* AI Image Generation Simulation Loader overlay */}
                  <AnimatePresence>
                    {isGeneratingImage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] bg-indigo-600/40 text-indigo-300 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                            API WORKFLOW PROGRESS
                          </span>
                          <span className="font-mono text-xs text-indigo-400 animate-pulse font-bold">
                            大模型響應倒數: {generationTimer}s
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-xs text-slate-300 font-medium leading-relaxed">
                            {loadingStep}...
                          </p>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000"
                              style={{ width: `${((5 - generationTimer) / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Generated illustration gallery */}
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                      已經生成之 AI 插圖庫 (History ({currentDraft.aiGeneratedImages.length}))
                    </p>

                    {currentDraft.aiGeneratedImages.length === 0 ? (
                      <div className="bg-white border border-dashed border-slate-200 p-8 rounded-2xl text-center text-slate-400 text-xs font-medium">
                        暫時無為本案生成的 AI 圖片，配置上方 Style 後点击按鈕開始畫圖。
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {currentDraft.aiGeneratedImages.map((aiImg) => (
                          <div
                            key={aiImg.id}
                            className="bg-white border border-slate-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all"
                          >
                            <div className="relative aspect-video bg-slate-100 overflow-hidden">
                              <img
                                referrerPolicy="no-referrer"
                                src={aiImg.url}
                                alt="generated illustration visual"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 bg-indigo-900/90 border border-indigo-700/50 px-2.5 py-0.5 rounded text-[9px] font-bold text-indigo-100 uppercase tracking-wider">
                                {aiImg.style}
                              </div>

                              {/* Hover Options */}
                              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-1.5">
                                <button
                                  onClick={() => handleInsertAiImage(aiImg.url, aiImg.style)}
                                  className="w-full max-w-[120px] py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 shadow-sm"
                                >
                                  <Plus className="w-3.5 h-3.5" /> ➕ 插入正文
                                </button>
                                <button
                                  onClick={() => handleSetAiAsCover(aiImg.url)}
                                  className="w-full max-w-[120px] py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 shadow-sm border border-slate-200"
                                >
                                  <ImageIcon className="w-3.5 h-3.5 text-slate-600" /> 設為封面
                                </button>
                              </div>
                            </div>
                            <div className="p-2 truncate bg-slate-50 text-[9px] text-slate-400 border-t border-slate-100">
                              時戳: {aiImg.timestamp}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* OSS Proxy real-time Agent download blocking overlay loader */}
      <AnimatePresence>
        {isDownloadingOSS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/90 backdrop-blur-md z-40 flex flex-col items-center justify-center space-y-4"
          >
            <div className="bg-indigo-100 p-4 rounded-3xl animate-bounce">
              <Server className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="text-center space-y-1.5 max-w-sm">
              <h4 className="font-bold text-slate-900 text-base">正在執行本地代理轉存 (OSS Sync)</h4>
              <p className="text-xs text-slate-400">正在阻斷外部域名聯網，下載圖片並安全重定位至 OSS 鏡像鏈接中...</p>
            </div>
            {/* Tech output animation logs */}
            <div className="w-80 bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-[10px] font-mono text-indigo-400 space-y-1 block leading-normal">
              <p className="text-slate-500">{"$ curl -I " + ossTargetUrl.slice(0, 32)}...</p>
              <p className="text-emerald-400">HTTP/1.1 200 OK (Bypass hotlink filter)</p>
              <p>Buffer stream size: 2.18 MB</p>
              <p className="text-yellow-400">Syncing to secure OSS s3-hk-bucket...</p>
              <p className="text-indigo-300">New Path: /assets/scraped/img_{Math.floor(Math.random() * 8999) + 1000}.png</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CMS Audit and Publication Parameter Selection Modal */}
      <AnimatePresence>
        {isAuditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuditModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              id="audit-backdrop"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
              id="audit-modal-box"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between" id="audit-header">
                <div className="flex items-center gap-2.5">
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl border border-emerald-100">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">新聞草稿審核</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">請配置發佈頻道屬性、著作人及前台模塊參數</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(false)}
                  className="p-1 px-2.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 font-bold text-sm"
                  id="close-audit-btn"
                >
                  ×
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1" id="audit-form-body">
                {/* 1. Subchannel Selection (子頻道下拉選框) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    子頻道 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-700 font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none h-[38px]"
                    id="subchannel-select"
                  >
                    {['港聞', '財經', '科技', '娛樂', '體育', '國際', '兩岸'].map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Author configuration (作者: 兩個下拉選框放在一行) */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    作者 <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Author Type Select */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">作者類型</span>
                      <select
                        value={selectedAuthorType}
                        onChange={(e) => {
                          const newType = e.target.value;
                          setSelectedAuthorType(newType);
                          // Auto preset default name under the type
                          if (newType === '聯合創作') setSelectedAuthorName('AI 編輯室');
                          else if (newType === '獨家發表') setSelectedAuthorName('特約記者 陳大文');
                          else if (newType === '智能生成') setSelectedAuthorName('智能綜合創作員');
                          else setSelectedAuthorName('特約通訊員 周星星');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-700 font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none h-[38px]"
                        id="audit-author-type-select"
                      >
                        {['聯合創作', '獨家發表', '智能生成', '特約撰稿'].map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Author Name Select */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">作者名稱</span>
                      <select
                        value={selectedAuthorName}
                        onChange={(e) => setSelectedAuthorName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-700 font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none h-[38px]"
                        id="audit-author-name-select"
                      >
                        {(selectedAuthorType === '聯合創作'
                          ? ['AI 編輯室', '聯合通訊社', '港聞編輯組', '特約記者小組']
                          : selectedAuthorType === '獨家發表'
                          ? ['特約記者 陳大文', '首席編輯 李小明', '財經專案組']
                          : selectedAuthorType === '智能生成'
                          ? ['智能綜合創作員', 'AI 新聞室', '智能綜合編輯']
                          : ['特約通訊員 周星星', '專欄作家 張小強', '客座筆者林琳']
                        ).map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Comments block (Single Row) */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    評論區
                  </label>
                  <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold flex leading-none max-w-sm">
                    <button
                      type="button"
                      onClick={() => setCommentsEnabled(true)}
                      className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                        commentsEnabled
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                      id="comment-enable-btn"
                    >
                      開啟
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentsEnabled(false)}
                      className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                        !commentsEnabled
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                      id="comment-disable-btn"
                    >
                      關閉
                    </button>
                  </div>
                </div>

                {/* 4. Publish schedule block (Single Row) */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    上線線發佈
                  </label>
                  <select
                    value={publishSchedule}
                    onChange={(e) => setPublishSchedule(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-700 font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none h-[38px]"
                    id="publish-schedule-select"
                  >
                    <option value="online">上線</option>
                    <option value="offline">下線</option>
                    <option value="scheduled">定時上下線</option>
                  </select>
                </div>

                {/* Datepicker display fallback if 'scheduled' is selected */}
                {publishSchedule === 'scheduled' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1.5"
                    id="scheduled-date-panel"
                  >
                    <span className="text-[10px] text-indigo-805 font-bold block">定時發佈預定時刻：</span>
                    <input
                      type="datetime-local"
                      defaultValue="2026-06-01T08:00"
                      className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none"
                    />
                    <p className="text-[9px] text-indigo-500 leading-relaxed">
                      * 系統排程守護進程 (Cron Worker) 將在到期時自動觸發 API 以激活文章。
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0" id="audit-footer">
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(false)}
                  className="px-4.5 py-2 hover:bg-slate-200 border border-slate-200 text-slate-700 bg-white rounded-xl text-xs font-bold transition-all focus:outline-none"
                  id="cancel-audit-and-publish-btn"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAuditAndPublish}
                  className="px-5 py-2 hover:bg-emerald-700 bg-emerald-600 shadow-md shadow-emerald-600/15 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 focus:outline-none"
                  id="confirm-audit-and-publish-btn"
                >
                  <ShieldCheck className="w-4 h-4" />
                  審核並發佈
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
