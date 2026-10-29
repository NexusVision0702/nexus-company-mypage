// app/support/page.tsx (Fixed import error: addDocs -> addDoc)
'use client';

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTI6ZylCTzLGXxnuLVlQb1ccmhUAMpxm0",
  authDomain: "nexus-job-board-d042c.firebaseapp.com",
  projectId: "nexus-job-board-d042c",
  storageBucket: "nexus-job-board-d042c.firebasestorage.app",
  messagingSenderId: "266729846625",
  appId: "1:266729846625:web:b5f7296cc7bae2017e3720",
  measurementId: "G-ZML9CWEG75"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

interface ChatMessage {
  id: string;
  sender: 'company' | 'support';
  text: string;
  timestamp: string;
}

const demoMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'support',
    text: 'NexusVision サポートデスクへようこそ！求人掲載やプラン変更、応募者管理についてご不明な点がございましたら、お気軽にお問い合わせください。',
    timestamp: '2026/06/01 10:00'
  },
  {
    id: 'msg_2',
    sender: 'company',
    text: '求人の掲載期間を延長したいのですが、どのように手続きすればよいでしょうか？',
    timestamp: '2026/06/07 11:20'
  },
  {
    id: 'msg_3',
    sender: 'support',
    text: 'お問い合わせありがとうございます！求人一覧画面の「編集する」ボタンより、掲載プランおよび掲載期間の再設定を行っていただけます。ご不明な点がございましたら操作手順をご案内いたしますのでお知らせください。',
    timestamp: '2026/06/07 11:25'
  }
];

export default function SupportPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(demoMessages);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'company',
      text: inputText.trim(),
      timestamp: new Date().toLocaleString()
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setInputText('');

    // 自動返信のモック
    setLoading(true);
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        text: 'お問い合わせいただきありがとうございます。担当スタッフが内容を確認し、折り返しご連絡いたします。',
        timestamp: new Date().toLocaleString()
      };
      setMessages(prev => [...prev, replyMsg]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '90vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '40px 40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* ヘッダーエリア */}
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#059669', marginBottom: '6px' }}>
            SETTINGS / SUPPORT
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            サポートチャット
          </h1>
        </div>

        {/* メインカードコンテナ */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', height: '650px', overflow: 'hidden' }}>
          
          {/* チャット情報ヘッダー */}
          <div style={{ padding: '20px 28px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>🎧</span>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' }}>
                  公式カスタマーサポート
                </h3>
                <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>● 通常 24時間以内にご対応いたします</span>
              </div>
            </div>
            <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
              受付中
            </span>
          </div>

          {/* メッセージ表示エリア */}
          <div style={{ flex: 1, padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff' }}>
            {messages.map((msg) => {
              const isCompany = msg.sender === 'company';
              return (
                <div key={msg.id} style={{ display: 'flex', justifyContent: isCompany ? 'flex-end' : 'flex-start', width: '100%' }}>
                  <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: isCompany ? 'flex-end' : 'flex-start' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: '700' }}>
                      {isCompany ? '自社担当者' : 'サポート担当'} ・ {msg.timestamp}
                    </span>
                    <div style={{
                      padding: '14px 18px',
                      borderRadius: isCompany ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      background: isCompany ? '#059669' : '#f1f5f9',
                      color: isCompany ? '#ffffff' : '#0f172a',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                      wordBreak: 'break-word',
                      fontWeight: isCompany ? '600' : '500'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', background: '#f1f5f9', padding: '8px 14px', borderRadius: '8px' }}>
                  サポート担当が入力中...
                </span>
              </div>
            )}
          </div>

          {/* メッセージ入力フォーム */}
          <form onSubmit={handleSendMessage} style={{ padding: '20px 28px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="ご質問やお問い合わせ内容を入力してください..." 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              style={{ flex: 1, padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff', fontWeight: '500' }}
            />
            <button 
              type="submit"
              style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)', whiteSpace: 'nowrap' }}
            >
              送信する ➔
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}