/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { INITIAL_DRAFTS } from './mockData';
import { NewsDraft, CMSMenuType } from './types';
import Sidebar from './components/Sidebar';
import DraftWorkspace from './components/DraftWorkspace';
import PublishedNews from './components/PublishedNews';
import TrendsDashboard from './components/TrendsDashboard';
import SettingsWorkspace from './components/SettingsWorkspace';
import Toast, { ToastMessage, ToastType } from './components/Toast';

export default function App() {
  // Navigation State
  const [currentMenu, setCurrentMenu] = useState<CMSMenuType>('trends');

  // Master Draft datasets
  const [drafts, setDrafts] = useState<NewsDraft[]>(INITIAL_DRAFTS);
  const [activeDraftId, setActiveDraftId] = useState<string>(INITIAL_DRAFTS[0]?.id || '');

  // Published News store
  const [publishedList, setPublishedList] = useState<NewsDraft[]>([]);

  // Toast array
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Global disclaimer setting
  const [globalDisclaimer, setGlobalDisclaimer] = useState(
    '本內容由 智能 AI 算法自動組稿生成。'
  );

  // Trigger non-blocking toast
  const triggerToast = (text: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, text }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Update draft detail back into state
  const handleSaveDraft = (updatedDraft: NewsDraft) => {
    setDrafts((prev) => prev.map((d) => (d.id === updatedDraft.id ? updatedDraft : d)));
  };

  // Reject / mark draft as rejected
  const handleRejectDraft = (id: string) => {
    const draftTitle = drafts.find((d) => d.id === id)?.title || '';
    const updatedDrafts = drafts.filter((d) => d.id !== id);
    setDrafts(updatedDrafts);

    triggerToast(`草稿《${draftTitle.slice(0, 15)}...》已安全駁回並封存，不予發行。`, 'warning');

    // Automatically transition focus to next pending item if it exists
    if (updatedDrafts.length > 0) {
      setActiveDraftId(updatedDrafts[0].id);
    } else {
      setActiveDraftId('');
    }
  };

  // One-click publish
  const handlePublishDraft = (id: string, finalDraft?: NewsDraft) => {
    const draftToPublish = finalDraft || drafts.find((d) => d.id === id);
    if (!draftToPublish) return;

    // Final checks
    const publishedItem: NewsDraft = {
      ...draftToPublish,
      status: 'published',
      publishTimestamp: new Date().toLocaleString()
    };

    // Add to published, slide out of drafts
    setPublishedList((prev) => [publishedItem, ...prev]);
    setDrafts((prev) => prev.filter((d) => d.id !== id));

    triggerToast(`🚀 審核並發佈成功！新聞《${draftToPublish.title.slice(0, 15)}...》已在線上架，部署至 [${publishedItem.subcategory || publishedItem.category}] 頻道！`, 'success');

    // Shift screen selection
    setDrafts((prev) => {
      if (prev.length > 0) {
        setActiveDraftId(prev[0].id);
      } else {
        setActiveDraftId('');
      }
      return prev;
    });

    // Optional delay redirect to online news list
    setTimeout(() => {
      setCurrentMenu('published_news');
    }, 1200);
  };

  // Re-fill demo drafts when the scraper is triggered
  const handleScraperCrawlSuccess = (message: string) => {
    // If we have published or rejected all drafts, let's repopulate them to ensure infinite showcase loop
    if (drafts.length === 0) {
      setDrafts(INITIAL_DRAFTS);
      setActiveDraftId(INITIAL_DRAFTS[0].id);
    } else {
      // Otherwise, simulate adding or refreshing items
      triggerToast('增量同步：已覆蓋並同步最新香港熱點與時效性插圖！', 'success');
    }
    triggerToast(message, 'success');
  };

  // User decides to generate/focus on a trend to write a draft manually
  const handleCreateDraftFromTrend = (keyword: string, trendChannel: string, relativeTopic: string) => {
    // 1. Check if a draft with this keyword already exists in the local drafts list
    const existingDraft = drafts.find(
      (d) =>
        d.title.includes(keyword) ||
        d.trendingKeywords.includes(keyword) ||
        d.id.includes(keyword)
    );

    if (existingDraft) {
      setActiveDraftId(existingDraft.id);
      setCurrentMenu('draft_review');
      triggerToast(`已為您開啟現有草稿《${existingDraft.title.slice(0, 15)}...》！`, 'info');
      return;
    }

    // 2. Generate corresponding draft dataset based on selected trend
    let newId = `trend-${Date.now()}`;
    let title = `本港關注「${keyword}」熱度飆升 關聯「${relativeTopic}」引發全港高度探討`;
    let category = '民生焦點';
    let summary = [
      `今日 Google Trends 數據顯示，香港市民對「${keyword}」的搜索熱度今日顯著突破。`,
      `市民和業界熱切探討與「${relativeTopic}」相關的最新政策落實與後續影響。`,
      `本台 AI 智能編輯系統已自動追蹤抓取核心新聞片段，並整理完成首版事實查核供覆審。`
    ];
    let content = `
      <p>今日，網絡熱搜榜單中<strong>「${keyword}」</strong>一詞的搜索次數激增，顯示出本港市民的高度關切。據互聯網分析數據表明，本輪搜索熱潮的核心焦點，與<strong>${relativeTopic}</strong>具備極高的關聯性。</p>
      <p>在香港目前的社會民生和行業發展趨勢下，這一議題不僅涉及公共服務，也牽動著許多市民和專業人士的神經。業內專家表示，隨著討論的不斷深入，未來有關部門對此的政策指引與改善措施將更顯關鍵。本台將對後續動態保持實時跟進。</p>
    `;
    let englishKeywords = `A professional editorial graphic representing ${keyword} in Hong Kong, modern corporate identity style, sleek and elegant`;
    let originalImages = [
      {
        id: `img-${newId}-1`,
        url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
        source: 'AI 監測影像庫'
      }
    ];

    if (keyword === '香港考評局 DSE 放榜') {
      newId = 'dse-results-2026';
      title = '今屆 DSE 中學文憑試放榜 考評局公布誕生 8 名狀元 傳統名校囊括半壁江山';
      category = '教育民生';
      summary = [
        '今屆香港中學文憑試（DSE）今日放榜，考評局昨午率先公布今年共有 8 名各科考獲 5** 的頂尖狀元。',
        '狀元中包括 4 男 4 女，其中 3 名更是「超級狀元」，在數學延伸部分亦奪得最頂級評分。',
        '今年整體考生成績維持平穩，約四成二考生達到大學入學基本門檻，升學輔導機構建議善用複核機制。'
      ];
      content = `
        <p>今屆香港中學文憑試（DSE）今日正式公佈成績，無數考生與家長一早到校等候成績單發放。香港考試及評核局昨午召開新聞發布會，公佈了本屆考試的整體統計數據，顯示今年有 8 位考生考獲七科 5**，成為今屆矚目的「狀元」。</p>
        <p>這 8 位狀元分布於本港多所傳統名校。其中有 3 位更在數學延伸單元（M1/M2）中同獲 5**，榮膺「超級狀元」稱號。考評局秘書長表示，今年文憑試在多個核心科目落實了優化措施，整體及格率與去年基本持平，反映本港中學的教學質量在波動環境中依然保持卓越與高穩定度。</p>
        <p>對於其餘希望進入各大專院校的本地考生，學友社等升學輔導中心提醒，今年各大院校的學額競爭依然激烈，建議拿到成績後，應細緻研判聯招（JUPAS）改選策略，以最科學的梯度填報志願，把握最後的入學機會。</p>
      `;
      englishKeywords = 'A cheerful student receiving exam results paper in front of a modern Hong Kong school gate, professional high-quality photography';
      originalImages = [
        {
          id: 'img-dse-1',
          url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80',
          source: '教育時報庫'
        },
        {
          id: 'img-dse-2',
          url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
          source: 'HKStudy'
        }
      ];
    } else if (keyword === '強積金 MPF 回報率') {
      newId = 'mpf-returns-2026';
      title = '強積金首季整體回報勝預期 人均賺逾 8500 港元 美日股票基金表現一枝獨秀';
      category = '理財投資';
      summary = [
        '追蹤機構數據顯示，今年第一季本港強積金整體淨回報率達到 4.2%，扭轉去年年底的防守頹勢。',
        '強積金成員人均賺取約 8500 港元，其中美國股票基金與日本股票基金表現最為亮眼，累計漲幅超一成。',
        '積金局發言人再次提醒市民，強積金乃長達數十年的長線配置，切忌頻繁進行短期的跟風追漲殺跌操作。'
      ];
      content = `
        <p>隨著環球股市在今年首季強勁反彈，本港市民普遍關心的強積金（MPF）整體收益亦交出了一份令人滿意的好成績。根據最新獨立專業機構公佈的數據指出，首季度香港強積金整體平均回報率錄得 4.2% 的正增長，所有大類資產均實現了不同程度的盈利。</p>
        <p>折合實際金額，意味著全港每一位參與強積金計劃的打工仔，在首季度人均賬戶增值了約 8,500 港元。分項數據顯示，重倉投資於成熟市場的大類基金表现一枝獨秀，尤以美國股票基金及日本股票基金累計回報表現最為驚人，平均上漲幅度均躍升至兩位數。反觀以往高歌猛進的亞洲保守型與低波防守型債券產品，由於債券收益率震盪，其漲幅相對溫和。</p>
        <p>積金局對此發表公開回應，重申投資市場具有週期波動特點。強積金作為一項橫跨三十年以上的長線退休理財儲蓄工具，打工仔理應根據自身的年齡發展與風險耐量進行平衡多元的資產配置。過於频繁地跟風調整基金組合，往往容易落入「追漲殺跌」的投資陷阱，徒增管理成本與流動性折損風險。</p>
      `;
      englishKeywords = 'A professional miniature model scales representing savings growth, gold coins stacking, stock market chart backgrounds';
      originalImages = [
        {
          id: 'img-mpf-1',
          url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
          source: '香港財經資訊庫'
        },
        {
          id: 'img-mpf-2',
          url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
          source: '香港投資圈'
        }
      ];
    }

    const newDraft: NewsDraft = {
      id: newId,
      title,
      category,
      subcategory: trendChannel,
      tags: ['trends', keyword],
      trendingRank: 4,
      trendingKeywords: keyword,
      summary,
      content,
      originalImages,
      aiGeneratedImages: [],
      coverImage: originalImages[0]?.url || null,
      coverSource: originalImages[0]?.source ? `原圖擷取：${originalImages[0].source}` : 'AI 智能配圖',
      sources: [
        {
          id: `src-${newId}-s1`,
          sourceName: 'Google Trends (HK)',
          originalTitle: `網絡熱門搜索：${keyword} 及關聯話題統計`,
          url: 'https://trends.google.com/trends/trendingsearches/daily?geo=HK',
          textFragments: [
            `本港地區今日對「${keyword}」的搜索總量強勢攀升，觸發了 CMS 自動化信號預警。`,
            `線民核心討論高度圍繞「${relativeTopic}」展開。`
          ]
        }
      ],
      disclaimer: globalDisclaimer,
      status: 'pending',
      textToImageCalls: 0,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19),
      englishKeywords
    };

    setDrafts((prev) => [newDraft, ...prev]);
    setActiveDraftId(newId);
    setCurrentMenu('draft_review');
    triggerToast(`✨ 已成功由熱點生成草稿《${title.slice(0, 15)}...》，並已自動跳轉至人工審核工作區！`, 'success');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-800 font-sans antialiased">
      {/* Toast notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Navigation Sidebar */}
      <Sidebar
        currentMenu={currentMenu}
        setMenu={setCurrentMenu}
        pendingCount={drafts.length}
        publishedCount={publishedList.length}
      />

      {/* Main Workspace Frame container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentMenu === 'draft_review' && (
          <DraftWorkspace
            drafts={drafts}
            activeDraftId={activeDraftId}
            setActiveDraftId={setActiveDraftId}
            onSaveDraft={handleSaveDraft}
            onPublishDraft={handlePublishDraft}
            onRejectDraft={handleRejectDraft}
            triggerToast={triggerToast}
          />
        )}

        {currentMenu === 'published_news' && (
          <PublishedNews publishedList={publishedList} />
        )}

        {currentMenu === 'trends' && (
          <TrendsDashboard
            drafts={drafts}
            publishedList={publishedList}
            onCreateDraft={handleCreateDraftFromTrend}
            setActiveDraftId={setActiveDraftId}
            setMenu={setCurrentMenu}
            onCrawlSuccess={handleScraperCrawlSuccess}
          />
        )}

        {currentMenu === 'settings' && (
          <SettingsWorkspace
            disclaimer={globalDisclaimer}
            setDisclaimer={setGlobalDisclaimer}
            onSave={(msg) => triggerToast(msg, 'success')}
          />
        )}
      </main>
    </div>
  );
}
