// app/jobs/new/components/Section1Basic.tsx (Fixed safe array check)
'use client';

import React from 'react';

const jobCategoriesList = [
  'ソフトウェア開発・エンジニア',
  'インフラ・ネットワークエンジニア',
  'AI・データサイエンティスト',
  'Webデザイナー・UI/UX',
  'フロントエンドエンジニア',
  'バックエンドエンジニア',
  'プロジェクトマネージャー・ディレクター',
  '社内SE・情報システム',
  'セキュリティエンジニア',
  'ITセールス・プリセールス',
  'カスタマーサクセス・サポート',
  'ゲーム開発・クリエイター',
  'Webマーケティング・SEO',
  'SNS運用・PR担当',
  '通信インフラ・工事',
  '法人営業（B2B）',
  '個人営業（B2C）',
  'ルートセールス',
  '海外営業・貿易',
  '営業企画・セールスオペレーション',
  'マーケティング・商品企画',
  '広報・PR',
  '広告運用・Web広告',
  'イベント企画・運営',
  'テレマーケティング・インサイドセールス',
  '一般事務・アシスタント',
  '営業事務・受発注',
  '人事・採用・労務',
  '経理・財務・税務',
  '法務・コンプライアンス',
  '総務・ファシリティ',
  '秘書・受付',
  '広報・IR',
  '購買・調達・サプライチェーン',
  'データ入力・キータッチ',
  'コールセンター管理・SV',
  '経営企画・事業戦略',
  '機械設計・CADオペレーター',
  '電気・電子回路設計',
  '生産管理・工程管理',
  '品質管理・品質保証',
  '工場製造・組立・加工',
  '溶接・板金・塗装',
  'メンテナンス・保守・修理',
  '研究開発・R&D',
  '化学・素材開発',
  '食品加工・製造',
  '包装・梱包・検品',
  'プラント運転・管理',
  '施工管理（建築・土木）',
  'CADオペレーター（建築）',
  '設計・意匠（建築）',
  '測量・地質調査',
  '不動産営業・仲介',
  'プロパティマネジメント',
  'ビルメンテナンス・管理',
  'リフォーム・内装施工',
  '土木作業員・施工',
  '看護師・准看護師',
  '介護職・ヘルパー',
  'ケアマネージャー',
  '理学療法士・作業療法士',
  '薬剤師',
  '医療事務・クラーク',
  '保育士・幼稚園教諭',
  '生活相談員',
  '歯科助手・衛生士',
  '店長・店舗マネージャー候補',
  'ホールスタッフ・接客',
  '調理師・シェフ・板前',
  'キッチンスタッフ・調理補助',
  'カフェバリスタ・パティシエ',
  '居酒屋・ダイニングスタッフ',
  'デリバリー・配達スタッフ',
  '栄養士・調理師',
  '店長・エリアマネージャー',
  '販売スタッフ・接客',
  'VMD・店舗設計',
  'バイヤー・MD（マーチャンダイザー）',
  'ECサイト運営・店長',
  'スーパー・コンビニスタッフ',
  'アパレル販売・店員',
  'コスメ・美容部員',
  '配送ドライバー・配達員',
  '大型トラック・長距離ドライバー',
  'フォークリフト・倉庫作業',
  '物流管理・配車係',
  'ピッキング・梱包スタッフ',
  'タクシー・送迎ドライバー',
  '通関士・貿易事務',
  '倉庫管理・在庫管理',
  '経営コンサルタント',
  '財務・M&Aコンサル',
  '公認会計士・税理士',
  '弁護士・司法書士・行政書士',
  '通訳・翻訳',
  'グラフィックデザイナー',
  'コピーライター・編集者',
  'カメラマン・映像クリエイター',
  '美容師・スタイリスト',
  'エステティシャン・セラピスト',
  'フィットネストレーナー',
  '警備・セキュリティ',
  '清掃・ビルクリーニング',
  'ホテル・フロントスタッフ',
  '旅行代理店・ツアープランナー'
];

interface Section1Props {
  selectedJobCategories?: string[];
  handleJobCategoryToggle?: (cat: string) => void;
  title: string;
  setTitle: (val: string) => void;
  employmentType: string;
  setEmploymentType: (val: string) => void;
  headcount: string;
  setHeadcount: (val: string) => void;
  inputStyle: React.CSSProperties;
}

export default function Section1Basic({
  selectedJobCategories = [],
  handleJobCategoryToggle = () => {},
  title,
  setTitle,
  employmentType,
  setEmploymentType,
  headcount,
  setHeadcount,
  inputStyle
}: Section1Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#065f46', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: 0 }}>1. 基本情報・募集背景</h3>
      
      {/* 職種選択（複数選択可・最大2件まで） */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>業種・職種（複数選択可：現在 {selectedJobCategories.length}件選択中）*</label>
          <span style={{ fontSize: '11.5px', color: '#64748b' }}>※最大2つまで選択できます</span>
        </div>

        <div style={{ 
          background: '#f8fafc', 
          border: '1px solid #cbd5e1', 
          borderRadius: '12px', 
          padding: '16px', 
          maxHeight: '220px', 
          overflowY: 'auto', 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px' 
        }}>
          {jobCategoriesList.map((cat) => {
            const isChecked = selectedJobCategories.includes(cat);
            return (
              <label 
                key={cat} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '13.5px', 
                  color: '#334155', 
                  cursor: 'pointer',
                  userSelect: 'none' 
                }}
              >
                <input 
                  type="checkbox" 
                  checked={isChecked} 
                  onChange={() => handleJobCategoryToggle(cat)}
                  style={{ width: '16px', height: '16px', accentColor: '#059669', cursor: 'pointer' }} 
                />
                {cat}
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>求人タイトル / ポジション名 * <span style={{ fontSize: '11px', color: '#64748b' }}>（5文字以上・具体的に）</span></label>
        <input 
          type="text" 
          placeholder="例: 【幹部候補】事業拡大を牽引するコアメンバー（裁量権大・急成長フェーズ）" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={inputStyle} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>雇用形態 *</label>
          <select value={employmentType} onChange={e => setEmploymentType(e.target.value)} style={inputStyle}>
            <option value="正社員">正社員</option>
            <option value="契約社員">契約社員</option>
            <option value="業務委託">業務委託</option>
            <option value="アルバイト・パート">アルバイト・パート</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>採用人数</label>
          <select value={headcount} onChange={e => setHeadcount(e.target.value)} style={inputStyle}>
            <option value="1名（厳選採用）">1名（厳選採用）</option>
            <option value="若干名（コアメンバーの採用）">若干名（コアメンバーの採用）</option>
            <option value="3名〜5名（積極採用中）">3名〜5名（積極採用中）</option>
            <option value="10名以上（大規模募集）">10名以上（大規模募集）</option>
          </select>
        </div>
      </div>
    </div>
  );
}