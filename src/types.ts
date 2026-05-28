/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SourceImage {
  id: string;
  url: string;
  source: string;
}

export interface AIGeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: string;
  isCover?: boolean;
}

export interface FactSource {
  id: string;
  sourceName: string;
  originalTitle: string;
  url: string;
  textFragments: string[];
}

export interface NewsDraft {
  id: string;
  title: string;
  category: string;
  subcategory?: string; // 子頻道
  authorType?: string; // 作者類型: e.g. 聯合創作
  authorName?: string; // 作者名稱
  commentsEnabled?: boolean; // 評論區: 開啟 / 關閉
  publishSchedule?: 'online' | 'offline' | 'scheduled'; // 上線、下線、定時上下線
  tags: string[]; // 新聞標籤
  trendingRank: number;
  trendingKeywords: string;
  summary: string[]; // 懶人包 List of bullets
  content: string; // HTML or Markdown full text
  originalImages: SourceImage[]; // 從爬蟲原網站提取的圖片池
  aiGeneratedImages: AIGeneratedImage[]; // 透過 AI 接口生成的圖片
  coverImage: string | null;
  coverSource: string | null; // "原圖：HK01" | "AI 繪圖" | etc.
  sources: FactSource[]; // 查核原文數據 3-5 篇
  disclaimer: string;
  status: 'pending' | 'published' | 'rejected';
  textToImageCalls: number; // 已經調用了幾次 AI 繪圖 (限制單篇最多 3 次)
  publishTimestamp?: string;
  lastUpdated: string;
  englishKeywords: string; // 預填 Prompt 時自動由中文轉出的英文關鍵詞
}

export type CMSMenuType = 'draft_review' | 'published_news' | 'trends' | 'settings';
