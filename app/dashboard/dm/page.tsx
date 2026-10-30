// app/dm/page.tsx (Unified design with Settings / Stores layout)
'use client';

import React, { useState, useEffect } from 'react';

interface Thread {
  id: string;
  applicantName: string;
  jobTitle: string;
  lastMessage: string;
  updatedAt: string;
}

interface Message {
  id: string;
  sender: 'company' | 'applicant';
  text: string;
  timestamp: string;
}

// デモ用のスレッドデータ
const demoThreads: Thread[] = [
  {
    id: 'thread_1',
    applicantName: '佐藤 健太',
    jobTitle: '【東北から世界へ・フルリモート可】フロントエンドテックリード候補',
    lastMessage: '一次面接の日程につきまして、来週の火曜日でお願いできますでしょうか。',
    updatedAt: '2026/06/07 14:30'
  },
  {
    id: 'thread_2',
    applicantName: '鈴木 美咲',
    jobTitle: '【オープニングスタッフ募集】店舗運営マネージャー候補',
    lastMessage: 'ご質問いただきありがとうございます。履歴書をお送りいたします。',
    updatedAt: '2026/06/05 11:15'
  }
];

// デモ用のメッセージデータ
const demoMessages: Record<string, Message[]> = {
  thread_1: [
    { id: 'm1', sender: 'applicant', text: 'はじめまして。求人拝見し、フロントエンドの経験を活かしたく応募いたしました。', timestamp: '2026/06/07 10:00' },
    { id: 'm2', sender: 'company', text: '佐藤様、ご応募ありがとうございます！ぜひ一度カジュアルにお話しさせてください。', timestamp: '2026/06/07 12:00' },
    { id: 'm3', sender: 'applicant', text: '一次面接の日程につきまして、来週の火曜日でお願いできますでしょうか。', timestamp: '2026/06/07 14:30' }
  ],
  thread_2: [
    { id: 'm4', sender: 'applicant', text: '店舗運営の経験が3年あります。詳細を伺いたく存じます。', timestamp: '2026/06/05 09:00' },
    { id: 'm5', sender: 'company', text: 'ご連絡ありがとうございます。ご質問いただきありがとうございます。履歴書をお送りいたします。', timestamp: '2026/06/05 11:15' }
  ]
};

export default function DmPage() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>(demoThreads);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('thread_1');
  const [messages, setMessages] = useState<Message[]>(demoMessages['thread_1'] || []);
  const [inputText, setInputText] = useState<string>('');

  useEffect(() => {
    const id = localStorage.getItem('nexus_company_id');
    if (!id) {
      localStorage.setItem('nexus_company_id', 'demo_company_001');
      setCompanyId('demo_company_001');
    } else {
      setCompanyId(id);
    }
  }, []);

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setMessages(demoMessages[threadId] || []);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'company',
      text: inputText.trim(),
      timestamp: new Date().toLocaleString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    demoMessages[selectedThreadId] = updatedMessages;
    setInputText('');
  };

  const activeThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  return (
    <div style={{ minHeight: '90vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '40px 40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* ヘッダーエリア（パンくずリスト ＆ 画面タイトル） */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#059669', marginBottom: '6px' }}>
            SETTINGS / MESSAGES
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            応募者メッセージ (DM)
          </h1>
        </div>

        {/* メインカードコンテナ */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', height: '680px', overflow: 'hidden' }}>
          
          {/* 左側：メッセージ（スレッド）一覧 */}
          <div style={{ width: '360px', borderRight: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                メッセージ一覧 ({threads.length})
              </h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {threads.map(thread => {
                const isSelected = thread.id === selectedThreadId;
                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    style={{
                      padding: '18px 24px',
                      borderBottom: '1px solid #e2e8f0',
                      background: isSelected ? '#ffffff' : 'transparent',
                      borderLeft: isSelected ? '4px solid #059669' : '4px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: '800', color: '#0f172a' }}>{thread.applicantName}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{thread.updatedAt.slice(5, 16)}</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#059669', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {thread.jobTitle}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {thread.lastMessage}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 右側：チャットやり取り画面 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
            
            {/* チャットヘッダー */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>
                  {activeThread.applicantName} さんとのやり取り
                </h3>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669' }}>
                  対象求人: {activeThread.jobTitle}
                </span>
              </div>
              <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
                選考中
              </span>
            </div>

            {/* メッセージ表示エリア */}
            <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>
              {messages.map(msg => {
                const isCompany = msg.sender === 'company';
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isCompany ? 'flex-end' : 'flex-start', width: '100%' }}>
                    <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isCompany ? 'flex-end' : 'flex-start' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                        {isCompany ? '自社（採用担当）' : activeThread.applicantName} ・ {msg.timestamp}
                      </span>
                      <div style={{
                        padding: '14px 18px',
                        borderRadius: isCompany ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        background: isCompany ? '#059669' : '#ffffff',
                        color: isCompany ? '#ffffff' : '#0f172a',
                        border: isCompany ? 'none' : '1px solid #cbd5e1',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                        wordBreak: 'break-word'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* メッセージ送信フォーム */}
            <form onSubmit={handleSendMessage} style={{ padding: '20px 28px', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="メッセージを入力してください..." 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                style={{ flex: 1, padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#f8fafc' }}
              />
              <button 
                type="submit"
                style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)', whiteSpace: 'nowrap' }}
              >
                送信する
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}