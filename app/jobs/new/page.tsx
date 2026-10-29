// app/jobs/new/page.tsx (Fully fixed sticky header and isolated scroll layout)
'use client';

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

import Section1Basic from './components/Section1Basic';
import Section2Salary from './components/Section2Salary';
import Section3Mission from './components/Section3Mission';
import Section4Requirements from './components/Section4Requirements';
import Section5Workplace from './components/Section5Workplace';
import Section6CompanyCulture from './components/Section6CompanyCulture';

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

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];

export default function NewJobPage() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  
  // 企業データ（本社・店舗詳細情報を含む）
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [availableLocations, setAvailableLocations] = useState<{ id: string; name: string; address: string; phone: string; employees: string; hours: string }[]>([]);
  const [selectedPostingLocation, setSelectedPostingLocation] = useState('本社');

  // 1. 基本情報
  const [selectedJobCategories, setSelectedJobCategories] = useState<string[]>(['ソフトウェア開発・エンジニア', 'フロントエンドエンジニア']);
  const [title, setTitle] = useState('【東北から世界へ・フルリモート可】自社SaaSプロダクトを牽引するフロントエンドテックリード候補');
  const [employmentType, setEmploymentType] = useState('正社員');
  const [headcount, setHeadcount] = useState('3名（組織急拡大枠）');

  // 2. 報酬・給与
  const [salaryUnit, setSalaryUnit] = useState('年収');
  const [salaryMode, setSalaryMode] = useState('変動');
  const [salaryFixed, setSalaryFixed] = useState('');
  const [salaryMin, setSalaryMin] = useState('6500000');
  const [salaryMax, setSalaryMax] = useState('10000000');
  const [overtimePayMode, setOvertimePayMode] = useState('含む');
  const [overtimePayHours, setOvertimePayHours] = useState('45');
  const [overtimePayAmount, setOvertimePayAmount] = useState('98000');
  const [salaryDetail, setSalaryDetail] = useState('前職の給与・スキル・実績を最大限にリスペクトし優遇いたします。昇給年2回。');
  const [modelSalaries, setModelSalaries] = useState([
    { unit: '年収', period: '入社3年目', role: '開発責任者・テックリード', amount: '9000000' }
  ]);

  // 3. ミッション等
  const [mission, setMission] = useState('私たちは「テクノロジーの力で東北の産業構造とビジネスをアップデートする」をパーパスに掲げ、自社SaaSプラットフォームを開発しています。');
  const [dailyWork, setDailyWork] = useState('・React / Next.js / TypeScriptを用いた次世代型Webアプリケーションの設計・新規機能開発\n・デザインシステムの構築');
  const [careerPath, setCareerPath] = useState('入社後はコア機能の開発をリードしていただき、ゆくゆくはVPoEやCTOとして組織を牽引するキャリアパスが大きく開かれています。');

  // 4. 応募要件
  const [mustRequirements, setMustRequirements] = useState('・React、Vue.js、Next.js等のモダンなフロントエンドフレームワークを用いたWebアプリケーションの開発実務経験（3年以上）\n・TypeScriptを用いた堅牢な型安全設計');
  const [wantRequirements, setWantRequirements] = useState('・テックリードやプレイングマネージャーとしてのリーダーシップ経験\n・デザインシステムの構築・運用経験');
  const [idealPerson, setIdealPerson] = useState('・ユーザーにとって最高の体験とは何かを主体的に考え、妥協せずプロダクトに向き合える方\n・変化の激しいスタートアップ環境を楽しめる方');

  // 5. 勤務地・環境
  const [locationMode, setLocationMode] = useState('固定勤務地');
  const [zipcode, setZipcode] = useState('983-0852');
  const [prefAndCity, setPrefAndCity] = useState('宮城県仙台市宮城野区');
  const [streetNumber, setStreetNumber] = useState('榴岡1-2-3');
  const [buildingName, setBuildingName] = useState('仙台ITビル 5F');
  const [mobileArea, setMobileArea] = useState('');
  const [accessMethod, setAccessMethod] = useState('徒歩');
  const [accessStation, setAccessStation] = useState('仙台駅');
  const [accessMinutes, setAccessMinutes] = useState('3');
  const [remoteWorkType, setRemoteWorkType] = useState('一部リモートワーク可');
  const [remoteWorkDetail, setRemoteWorkDetail] = useState('週2〜3日のリモートワーク可能');
  const [workSchedules, setWorkSchedules] = useState([
    { startHour: '09', startMin: '30', endHour: '18', endMin: '30', note: 'フレックスタイム制（コアタイム 11:00〜15:00）' }
  ]);
  const [overtimeChoice, setOvertimeChoice] = useState('あり');
  const [overtimeHours, setOvertimeHours] = useState('15');
  const [probationChoice, setProbationChoice] = useState('あり');
  const [probationDuration, setProbationDuration] = useState('3');
  const [probationUnit, setProbationUnit] = useState('月');
  const [probationChange, setProbationChange] = useState('条件変動なし');
  const [probationChangeDetail, setProbationChangeDetail] = useState('');
  const [holidayType, setHolidayType] = useState('完全週休2日制（土日祝）');
  const [holidayDetail, setHolidayDetail] = useState('年間休日125日 / 夏季休暇 / 年末年始休暇');

  // 6. 福利厚生・社風・選考プロセス・写真
  const [teamAtmosphere, setTeamAtmosphere] = useState('平均年齢32歳。フラットで意見が言いやすく、経営陣との距離も非常に近いアットホームかつプロフェッショナルな環境です。');
  const [jobImages, setJobImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
  ]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([
    '社会保険完備',
    '交通費全額支給',
    '書籍購入補助',
    '資格取得支援',
    '定期健康診断'
  ]);
  const [benefitsExtra, setBenefitsExtra] = useState('最新MacBook Pro ＋ 4Kモニター支給');
  const [smoking, setSmoking] = useState('屋内禁煙（専用喫煙室あり）');
  const [selectionSteps, setSelectionSteps] = useState<string[]>(['書類選考', 'カジュアル面談', '一次面接', '最終面接', '内定']);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // 本社・店舗情報の取得
  useEffect(() => {
    const id = localStorage.getItem('nexus_company_id');
    if (!id) {
      window.location.href = '/';
      return;
    }
    setCompanyId(id);

    const fetchLocations = async () => {
      try {
        let locations: { id: string; name: string; address: string; phone: string; employees: string; hours: string }[] = [];

        const compDocRef = doc(db, 'companies', id);
        const compDocSnap = await getDoc(compDocRef);

        let compData: any = null;
        if (compDocSnap.exists()) {
          compData = compDocSnap.data();
        } else {
          const q = query(collection(db, 'companies'), where('companyId', '==', id));
          const querySnap = await getDocs(q);
          if (!querySnap.empty) {
            compData = querySnap.docs[0].data();
          }
        }

        if (compData) {
          setCompanyProfile(compData);
          
          const hqAddr = `${compData.prefAndCity || compData.prefecture || ''} ${compData.streetNumber || compData.address || ''}`.trim();
          locations.push({
            id: 'hq',
            name: '本社',
            address: hqAddr,
            phone: compData.phone || compData.headquartersPhone || '未登録',
            employees: compData.employees || compData.employeeCount || '非公開',
            hours: compData.businessHours || compData.hours || '9:00 〜 18:00'
          });

          const storeList = compData.stores || compData.branches || [];
          if (Array.isArray(storeList)) {
            storeList.forEach((store: any, idx: number) => {
              const storeName = store.name || store.storeName || `店舗 ${idx + 1}`;
              const storeAddr = `${store.prefAndCity || store.prefecture || ''} ${store.streetNumber || store.address || ''}`.trim();
              locations.push({
                id: `store_${idx}`,
                name: storeName,
                address: storeAddr,
                phone: store.phone || compData.phone || '未登録',
                employees: store.employees || compData.employees || '非公開',
                hours: store.businessHours || compData.businessHours || '9:00 〜 18:00'
              });
            });
          }
        }

        if (locations.length === 0) {
          locations.push({ id: 'hq', name: '本社', address: '', phone: '未登録', employees: '非公開', hours: '9:00 〜 18:00' });
        }

        setAvailableLocations(locations);
        setSelectedPostingLocation(locations[0].name);
      } catch (err) {
        setAvailableLocations([{ id: 'hq', name: '本社', address: '', phone: '未登録', employees: '非公開', hours: '9:00 〜 18:00' }]);
        setSelectedPostingLocation('本社');
      }
    };

    fetchLocations();
  }, []);

  const currentPostingLocationDetails = availableLocations.find(loc => loc.name === selectedPostingLocation) || availableLocations[0] || {
    name: selectedPostingLocation || '本社',
    address: '住所未登録',
    phone: '未登録',
    employees: '非公開',
    hours: '9:00 〜 18:00'
  };

  const isFormComplete = 
    selectedJobCategories.length > 0 &&
    title.trim() !== '' &&
    employmentType.trim() !== '' &&
    headcount.trim() !== '' &&
    (salaryMode === '固定' ? salaryFixed.trim() !== '' : (salaryMin.trim() !== '' && salaryMax.trim() !== '')) &&
    (overtimePayMode === '含まない' || (overtimePayHours.trim() !== '' && overtimePayAmount.trim() !== '')) &&
    salaryDetail.trim() !== '' &&
    modelSalaries.every(m => m.role.trim() !== '' && m.amount.trim() !== '') &&
    mission.trim() !== '' &&
    dailyWork.trim() !== '' &&
    careerPath.trim() !== '' &&
    mustRequirements.trim() !== '' &&
    wantRequirements.trim() !== '' &&
    idealPerson.trim() !== '' &&
    zipcode.trim() !== '' &&
    prefAndCity.trim() !== '' &&
    streetNumber.trim() !== '' &&
    (locationMode === '固定勤務地' || mobileArea.trim() !== '') &&
    accessStation.trim() !== '' &&
    accessMinutes.trim() !== '' &&
    remoteWorkDetail.trim() !== '' &&
    workSchedules.every(w => w.note.trim() !== '') &&
    (overtimeChoice === 'なし' || overtimeHours.trim() !== '') &&
    (probationChoice === 'なし' || probationDuration.trim() !== '') &&
    holidayDetail.trim() !== '' &&
    teamAtmosphere.trim() !== '' &&
    selectedBenefits.length > 0 &&
    selectedPostingLocation.trim() !== '' &&
    selectionSteps.every(s => s.trim() !== '');

  const handleJobCategoryToggle = (cat: string) => {
    if (selectedJobCategories.includes(cat)) {
      setSelectedJobCategories(selectedJobCategories.filter(c => c !== cat));
    } else {
      if (selectedJobCategories.length >= 2) {
        alert('職種は最大2つまで選択できます。');
        return;
      }
      setSelectedJobCategories([...selectedJobCategories, cat]);
    }
  };

  const handleZipChange = async (val: string) => {
    setZipcode(val);
    const cleanZip = val.replace(/[^0-9]/g, '');
    if (cleanZip.length === 7) {
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const fullAddr = `${result.address1}${result.address2}${result.address3}`;
          setPrefAndCity(fullAddr);
        }
      } catch (err) {}
    }
  };

  const handleBenefitToggle = (benefit: string) => {
    if (selectedBenefits.includes(benefit)) {
      setSelectedBenefits(selectedBenefits.filter(b => b !== benefit));
    } else {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    if (jobImages.length + newFiles.length > 7) {
      alert('掲載できる写真は最大7枚までです。');
      return;
    }

    const newImageUrls = newFiles.map(file => URL.createObjectURL(file));
    setJobImages([...jobImages, ...newImageUrls].slice(0, 7));
  };

  const handleRemoveImage = (index: number) => {
    setJobImages(jobImages.filter((_, i) => i !== index));
  };

  const addSelectionStep = () => {
    if (selectionSteps.length >= 6) {
      alert('選考ステップは最大6つまで登録できます。');
      return;
    }
    setSelectionSteps([...selectionSteps, '面接']);
  };

  const removeSelectionStep = (index: number) => {
    if (selectionSteps.length <= 1) {
      alert('選考ステップは少なくとも1つ必要です。');
      return;
    }
    setSelectionSteps(selectionSteps.filter((_, i) => i !== index));
  };

  const updateSelectionStep = (index: number, val: string) => {
    const updated = [...selectionSteps];
    updated[index] = val;
    setSelectionSteps(updated);
  };

  const addModelSalary = () => {
    if (modelSalaries.length >= 3) {
      alert('モデル例は最大3つまで登録できます。');
      return;
    }
    setModelSalaries([...modelSalaries, { unit: '年収', period: '入社3年目', role: '', amount: '' }]);
  };

  const removeModelSalary = (index: number) => {
    setModelSalaries(modelSalaries.filter((_, i) => i !== index));
  };

  const updateModelSalary = (index: number, field: string, value: string) => {
    const updated = [...modelSalaries];
    if (field === 'unit') {
      const defaultPeriod = value === '時給' ? '勤務開始3ヶ月' : value === '日給' ? '稼働初日〜' : '入社1年目';
      updated[index] = { ...updated[index], unit: value, period: defaultPeriod };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setModelSalaries(updated);
  };

  const addWorkSchedule = () => {
    if (workSchedules.length >= 5) {
      alert('勤務時間は最大5つまで登録できます。');
      return;
    }
    setWorkSchedules([...workSchedules, { startHour: '10', startMin: '00', endHour: '19', endMin: '00', note: '' }]);
  };

  const removeWorkSchedule = (index: number) => {
    setWorkSchedules(workSchedules.filter((_, i) => i !== index));
  };

  const updateWorkSchedule = (index: number, field: string, value: string) => {
    const updated = [...workSchedules];
    updated[index] = { ...updated[index], [field]: value };
    setWorkSchedules(updated);
  };

  const handleOpenPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) {
      alert('未入力の項目があります。すべての必須項目を入力してください。');
      return;
    }
    setIsPreviewMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmPublish = async () => {
    if (!companyId) {
      alert('企業IDが確認できません。再度ログインしてください。');
      return;
    }

    let baseSalaryStr = '';
    if (salaryMode === '固定') {
      baseSalaryStr = `${salaryUnit} ${Number(salaryFixed).toLocaleString()}円（固定）`;
    } else {
      baseSalaryStr = `${salaryUnit} ${Number(salaryMin).toLocaleString()}円${salaryMax ? ` 〜 ${Number(salaryMax).toLocaleString()}円` : ''}（変動）`;
    }

    const overtimeInfo = overtimePayMode === '含む' 
      ? ` / 固定残業代: ${Number(overtimePayAmount).toLocaleString()}円（${overtimePayHours}時間分含む、超過分は別途支給）` 
      : ' / 固定残業代: なし';

    const finalSalaryFormatted = `${baseSalaryStr}${overtimeInfo}`;

    const formattedModelSalaries = modelSalaries.map(m => `${m.period}（${m.role}）: ${m.unit} ${Number(m.amount).toLocaleString()}円`).join(' / ');
    const formattedWorkingHours = workSchedules.map(w => `${w.startHour}:${w.startMin} 〜 ${w.endHour}:${w.endMin}（${w.note}）`).join(' / ');
    
    const mainAddress = `${prefAndCity} ${streetNumber}${buildingName ? ` ${buildingName}` : ''}`.trim();
    const finalLocation = locationMode === '固定勤務地' 
      ? mainAddress
      : `[変動勤務地] メイン拠点: ${mainAddress} / 活動エリア: ${mobileArea.trim()}`;

    const formattedAccess = `${accessStation}より${accessMethod}${accessMinutes ? `約${accessMinutes}分` : ''}`;
    const formattedRemoteWork = `${remoteWorkType}${remoteWorkDetail ? `（${remoteWorkDetail}）` : ''}`;
    const formattedOvertime = overtimeChoice === 'あり' ? `あり（平均${overtimeHours}時間）` : 'なし';
    const formattedProbation = probationChoice === 'なし' 
      ? 'なし' 
      : `あり（${probationDuration}${probationUnit}・${probationChange}${probationChangeDetail ? `: ${probationChangeDetail}` : ''}）`;
    const formattedHolidays = `${holidayType}${holidayDetail ? `（${holidayDetail}）` : ''}`;

    const combinedBenefits = [
      ...selectedBenefits,
      ...(benefitsExtra.trim() ? [benefitsExtra.trim()] : [])
    ].join('、');

    const formattedSelectionProcess = selectionSteps.filter(s => s.trim() !== '').join(' ➔ ');

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'jobs'), {
        companyId,
        jobCategory: selectedJobCategories.join(' / '),
        title: title.trim(),
        employmentType,
        headcount,
        salary: finalSalaryFormatted,
        salaryDetail,
        modelSalary: formattedModelSalaries,
        benefits: combinedBenefits,
        location: finalLocation,
        access: formattedAccess,
        remoteWork: formattedRemoteWork,
        workingHours: formattedWorkingHours,
        overtime: formattedOvertime,
        holidays: formattedHolidays,
        probation: formattedProbation,
        mustRequirements,
        wantRequirements,
        idealPerson,
        mission: mission.trim(),
        dailyWork,
        careerPath,
        teamAtmosphere,
        jobImages,
        smoking,
        postingLocationInfo: currentPostingLocationDetails,
        selectionProcess: formattedSelectionProcess,
        status: '公開中',
        createdAt: serverTimestamp()
      });

      const generatedUrl = `${window.location.origin}/jobs/${docRef.id}`;
      setPublishedUrl(generatedUrl);
    } catch (err: any) {
      alert('作成失敗: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#0f172a',
    fontSize: '15px',
    boxSizing: 'border-box' as const,
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  const disabledInputStyle = {
    ...inputStyle,
    background: '#f1f5f9',
    color: '#94a3b8',
    borderColor: '#e2e8f0',
    cursor: 'not-allowed'
  };

  const centerNumberInputStyle = {
    ...inputStyle,
    width: '90px',
    textAlign: 'center' as const,
    padding: '14px 8px'
  };

  const disabledCenterNumberInputStyle = {
    ...disabledInputStyle,
    width: '90px',
    textAlign: 'center' as const,
    padding: '14px 8px'
  };

  const stationInputStyle = {
    ...inputStyle,
    width: '240px',
    padding: '14px 14px'
  };

  const salaryAmountInputStyle = {
    ...inputStyle,
    width: '180px',
    textAlign: 'center' as const,
    padding: '14px 16px'
  };

  // ==========================================
  // 【公開完了画面】
  // ==========================================
  if (publishedUrl) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ background: '#ffffff', maxWidth: '600px', width: '100%', borderRadius: '24px', padding: '48px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center' }}>
          
          <div style={{ width: '64px', height: '64px', background: '#ecfdf5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto' }}>
            🎉
          </div>

          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>求人の公開が完了しました！</h2>
            <p style={{ fontSize: '14.5px', color: '#64748b', margin: 0 }}>以下の本番用URLから、いつでも求職者向けの求人ページにアクセスできます。</p>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="text" 
              readOnly 
              value={publishedUrl} 
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#0f172a', fontSize: '13.5px', fontWeight: '700', outline: 'none' }} 
            />
            <button 
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(publishedUrl);
                alert('本番用URLをクリップボードにコピーしました！');
              }}
              style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              コピー
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button 
              type="button"
              onClick={() => window.location.href = publishedUrl}
              style={{ flex: 1, background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
            >
              公開ページを確認する ↗
            </button>
            <button 
              type="button"
              onClick={() => window.location.href = '/jobs'}
              style={{ flex: 1, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
            >
              求人一覧に戻る
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // 【求職者向け 独立プレビュー画面】（完全に独立したスクロール領域としてレイアウト）
  // ==========================================
  if (isPreviewMode) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#f8fafc', color: '#1e293b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* 固定されたトップヘッダーバー */}
        <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ background: '#059669', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '5px 14px', borderRadius: '20px', letterSpacing: '0.05em' }}>
              求人プレビュー
            </span>
            <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px', border: '1px solid #cbd5e1' }}>
              <button
                type="button"
                onClick={() => setIsMobileFrame(false)}
                style={{ background: !isMobileFrame ? '#059669' : 'transparent', color: !isMobileFrame ? '#fff' : '#475569', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                💻 PC表示
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFrame(true)}
                style={{ background: isMobileFrame ? '#059669' : 'transparent', color: isMobileFrame ? '#fff' : '#475569', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                📱 スマホ表示
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              onClick={() => setIsPreviewMode(false)}
              style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '10px', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' }}
            >
              ← 編集画面に戻る
            </button>
            <button 
              type="button" 
              disabled={loading}
              onClick={handleConfirmPublish}
              style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', border: 'none', padding: '10px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)' }}
            >
              {loading ? '公開中...' : 'この内容で公開する'}
            </button>
          </div>
        </div>

        {/* プレビュー本文のスクロールコンテナ */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 20px' }}>
          <div style={{ 
            maxWidth: isMobileFrame ? '410px' : '900px', 
            margin: '0 auto', 
            padding: isMobileFrame ? '20px 10px' : '0 20px', 
            background: isMobileFrame ? '#0f172a' : 'transparent',
            borderRadius: isMobileFrame ? '40px' : '0',
            boxShadow: isMobileFrame ? '0 25px 50px -12px rgba(0,0,0,0.5)' : 'none',
            border: isMobileFrame ? '10px solid #334155' : 'none',
            height: isMobileFrame ? '740px' : 'auto',
            maxHeight: isMobileFrame ? '740px' : 'none',
            overflowY: isMobileFrame ? 'auto' : 'visible',
            transition: 'all 0.3s ease'
          }}>
            
            <div style={{ 
              background: isMobileFrame ? '#f8fafc' : 'transparent', 
              borderRadius: isMobileFrame ? '24px' : '0', 
              overflow: 'visible',
              padding: isMobileFrame ? '16px' : '0',
              display: 'flex', 
              flexDirection: 'column', 
              gap: isMobileFrame ? '20px' : '32px' 
            }}>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {selectedJobCategories.map((cat, i) => (
                  <span key={i} style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '5px 12px', borderRadius: '8px', fontSize: isMobileFrame ? '11.5px' : '13px', fontWeight: '800', whiteSpace: 'nowrap' }}>
                    {cat}
                  </span>
                ))}
                <span style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '8px', fontSize: isMobileFrame ? '11.5px' : '13px', fontWeight: '800', whiteSpace: 'nowrap' }}>
                  {employmentType}
                </span>
              </div>

              <h1 style={{ fontSize: isMobileFrame ? '22px' : '34px', fontWeight: '900', lineHeight: '1.35', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                {title}
              </h1>

              <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', border: '2px solid #059669', borderRadius: '20px', padding: isMobileFrame ? '20px' : '32px 40px', display: 'flex', flexDirection: isMobileFrame ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobileFrame ? 'flex-start' : 'center', gap: '16px', boxShadow: '0 15px 35px rgba(5, 150, 105, 0.12)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ background: '#059669', color: '#fff', fontSize: '10px', fontWeight: '900', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>POINT 01</span>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669', letterSpacing: '0.05em' }}>想定給与 / 報酬</span>
                  </div>
                  <span style={{ fontSize: isMobileFrame ? '22px' : '30px', fontWeight: '900', color: '#0f172a' }}>
                    {salaryUnit} {salaryMode === '固定' ? Number(salaryFixed).toLocaleString() : `${Number(salaryMin).toLocaleString()}円 〜 ${Number(salaryMax).toLocaleString()}`}円
                  </span>
                  {salaryDetail && <p style={{ margin: '6px 0 0 0', fontSize: isMobileFrame ? '12px' : '13px', color: '#475569' }}>{salaryDetail}</p>}
                </div>
                <div style={{ borderLeft: isMobileFrame ? 'none' : '2px solid #a7f3d0', paddingLeft: isMobileFrame ? '0' : '32px', paddingTop: isMobileFrame ? '10px' : '0', borderTop: isMobileFrame ? '1px solid #e2e8f0' : 'none', width: '100%' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>募集人数</span>
                  <span style={{ fontSize: isMobileFrame ? '15px' : '18px', fontWeight: '900', color: '#0f172a' }}>{headcount}</span>
                </div>
              </div>

              {jobImages.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: isMobileFrame ? '15px' : '18px', fontWeight: '900', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '16px', background: '#059669', borderRadius: '3px', display: 'inline-block' }}></span>
                    職場の雰囲気・チームメンバー
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobileFrame ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                    {jobImages.map((img, idx) => (
                      <div key={idx} style={{ borderRadius: '16px', overflow: 'hidden', height: isMobileFrame ? '180px' : '240px', border: '1px solid #e2e8f0', background: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <img src={img} alt={`職場の様子 ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid #059669', borderRadius: '20px', padding: isMobileFrame ? '20px' : '38px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '10.5px', fontWeight: '900', padding: '2px 8px', borderRadius: '6px' }}>POINT 02</span>
                  <h2 style={{ fontSize: isMobileFrame ? '17px' : '21px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                    私たちが目指すミッション・仕事内容
                  </h2>
                </div>
                <p style={{ fontSize: isMobileFrame ? '13.5px' : '15.5px', lineHeight: '1.85', color: '#334155', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {mission}
                </p>
                {dailyWork && (
                  <div style={{ marginTop: '10px', background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <strong style={{ display: 'block', color: '#0f172a', marginBottom: '6px', fontSize: '13.5px', fontWeight: '800' }}>📌 日々の具体的な業務例</strong>
                    <p style={{ margin: 0, color: '#475569', fontSize: '13.5px', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{dailyWork}</p>
                  </div>
                )}
              </div>

              {teamAtmosphere && (
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid #3b82f6', borderRadius: '20px', padding: isMobileFrame ? '20px' : '38px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '10.5px', fontWeight: '900', padding: '2px 8px', borderRadius: '6px' }}>CULTURE</span>
                    <h2 style={{ fontSize: isMobileFrame ? '17px' : '21px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                      チームの雰囲気・社風
                    </h2>
                  </div>
                  <p style={{ fontSize: isMobileFrame ? '13.5px' : '15.5px', lineHeight: '1.85', color: '#334155', whiteSpace: 'pre-wrap', margin: 0 }}>{teamAtmosphere}</p>
                </div>
              )}

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: isMobileFrame ? '20px' : '38px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <h2 style={{ fontSize: isMobileFrame ? '17px' : '21px', fontWeight: '900', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '18px', background: '#059669', borderRadius: '3px', display: 'inline-block' }}></span>
                  応募要件
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '6px', width: 'fit-content' }}>必須要件（MUST）</span>
                  <p style={{ margin: 0, fontSize: isMobileFrame ? '13.5px' : '15px', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap' }}>{mustRequirements}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: '6px', width: 'fit-content' }}>歓迎要件（WANT）</span>
                  <p style={{ margin: 0, fontSize: isMobileFrame ? '13.5px' : '15px', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap' }}>{wantRequirements}</p>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: isMobileFrame ? '20px' : '38px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <h2 style={{ fontSize: isMobileFrame ? '17px' : '21px', fontWeight: '900', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '18px', background: '#059669', borderRadius: '3px', display: 'inline-block' }}></span>
                  勤務地・働く環境
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px', fontWeight: '800' }}>勤務地</span>
                    <span style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>{prefAndCity} {streetNumber}</span>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px', fontWeight: '800' }}>アクセス</span>
                    <span style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>{accessStation}より{accessMethod}約{accessMinutes}分</span>
                  </div>
                </div>

                <div style={{ marginTop: '6px' }}>
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '900' }}>✨ 福利厚生・手当</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedBenefits.map((b, i) => (
                      <span key={i} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '800' }}>
                        ✓ {b}
                      </span>
                    ))}
                    {benefitsExtra && (
                      <span style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '800' }}>
                        ✓ {benefitsExtra}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: isMobileFrame ? '20px' : '38px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <h2 style={{ fontSize: isMobileFrame ? '17px' : '21px', fontWeight: '900', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '18px', background: '#059669', borderRadius: '3px', display: 'inline-block' }}></span>
                  選考プロセス
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectionSteps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: '#059669', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', flexShrink: 0 }}>
                        {idx + 1}
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', flex: '1', fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid #0284c7', borderRadius: '20px', padding: isMobileFrame ? '20px' : '32px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '10.5px', fontWeight: '900', padding: '2px 8px', borderRadius: '6px' }}>COMPANY / STORE</span>
                  <h3 style={{ fontSize: isMobileFrame ? '16px' : '19px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                    求人掲載拠点情報
                  </h3>
                </div>
                
                <p style={{ fontSize: '12px', color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', padding: '8px 12px', borderRadius: '8px', margin: 0, lineHeight: '1.5', fontWeight: '700' }}>
                  ※勤務先の情報ではありません。勤務地情報に関しては「勤務地・働く環境」になります。
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', fontSize: '13.5px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '2px' }}>店舗名 / 本社</span>
                    <span style={{ fontWeight: '800', color: '#0f172a' }}>{currentPostingLocationDetails.name}</span>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '2px' }}>住所</span>
                    <span style={{ fontWeight: '800', color: '#0f172a' }}>{currentPostingLocationDetails.address || '未登録'}</span>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '2px' }}>電話番号</span>
                    <span style={{ fontWeight: '800', color: '#0f172a' }}>{currentPostingLocationDetails.phone}</span>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '2px' }}>従業員数 / 営業時間</span>
                    <span style={{ fontWeight: '800', color: '#0f172a' }}>従業員数: {currentPostingLocationDetails.employees} / 営業時間: {currentPostingLocationDetails.hours}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px', paddingBottom: '40px' }}>
                <button 
                  type="button" 
                  disabled={loading}
                  onClick={handleConfirmPublish}
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', border: 'none', padding: '16px 24px', borderRadius: '14px', fontSize: '15px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 25px rgba(5, 150, 105, 0.35)', width: '100%' }}
                >
                  {loading ? '公開中...' : 'この内容で求人を公開する'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsPreviewMode(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '14px 24px', borderRadius: '14px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', width: '100%' }}
                >
                  編集画面に戻る
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // 【通常フォーム作成画面】
  // ==========================================
  return (
    <div style={{ minHeight: '90vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '60px 40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#059669', marginBottom: '6px' }}>RECRUITMENT / CREATE</div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>新規求人を作成（テスト用データ入力済み）</h1>
          </div>
          <button 
            type="button"
            onClick={() => { window.location.href = '/jobs'; }} 
            style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
          >
            ← 一覧に戻る
          </button>
        </div>

        <form onSubmit={handleOpenPreview} style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.05)', padding: '52px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <div style={{ background: isFormComplete ? '#f0fdf4' : '#fffbeb', border: `1px solid ${isFormComplete ? '#bbf7d0' : '#fde68a'}`, padding: '18px 22px', borderRadius: '14px', fontSize: '13.5px', color: isFormComplete ? '#065f46' : '#92400e', lineHeight: '1.7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              {isFormComplete 
                ? '✨ テスト用データがすべて入力されています！「公開（プレビュー）する」ボタンから動作確認にお進みください。' 
                : '⚠️ 未入力の項目があります。すべての項目を入力するとボタンがアクティブになります。'}
            </span>
            <span style={{ fontSize: '12px', fontWeight: '800', background: isFormComplete ? '#059669' : '#d97706', color: '#fff', padding: '4px 12px', borderRadius: '20px' }}>
              {isFormComplete ? 'テスト準備完了 🎉' : '入力途中...'}
            </span>
          </div>

          <Section1Basic 
            selectedJobCategories={selectedJobCategories}
            handleJobCategoryToggle={handleJobCategoryToggle}
            title={title} setTitle={setTitle}
            employmentType={employmentType} setEmploymentType={setEmploymentType}
            headcount={headcount} setHeadcount={setHeadcount}
            inputStyle={inputStyle}
          />

          <Section2Salary 
            salaryUnit={salaryUnit} setSalaryUnit={setSalaryUnit}
            salaryMode={salaryMode} setSalaryMode={setSalaryMode}
            salaryFixed={salaryFixed} setSalaryFixed={setSalaryFixed}
            salaryMin={salaryMin} setSalaryMin={setSalaryMin}
            salaryMax={salaryMax} setSalaryMax={setSalaryMax}
            overtimePayMode={overtimePayMode} setOvertimePayMode={setOvertimePayMode}
            overtimePayHours={overtimePayHours} setOvertimePayHours={setOvertimePayHours}
            overtimePayAmount={overtimePayAmount} setOvertimePayAmount={setOvertimePayAmount}
            modelSalaries={modelSalaries} addModelSalary={addModelSalary}
            removeModelSalary={removeModelSalary} updateModelSalary={updateModelSalary}
            salaryDetail={salaryDetail} setSalaryDetail={setSalaryDetail}
            inputStyle={inputStyle} salaryAmountInputStyle={salaryAmountInputStyle}
            centerNumberInputStyle={centerNumberInputStyle}
          />

          <Section3Mission 
            mission={mission} setMission={setMission}
            dailyWork={dailyWork} setDailyWork={setDailyWork}
            careerPath={careerPath} setCareerPath={setCareerPath}
            inputStyle={inputStyle}
          />

          <Section4Requirements 
            mustRequirements={mustRequirements} setMustRequirements={setMustRequirements}
            wantRequirements={wantRequirements} setWantRequirements={setWantRequirements}
            idealPerson={idealPerson} setIdealPerson={setIdealPerson}
            inputStyle={inputStyle}
          />

          <Section5Workplace 
            locationMode={locationMode} setLocationMode={setLocationMode}
            zipcode={zipcode} handleZipChange={handleZipChange}
            prefAndCity={prefAndCity} setPrefAndCity={setPrefAndCity}
            streetNumber={streetNumber} setStreetNumber={setStreetNumber}
            buildingName={buildingName} setBuildingName={setBuildingName}
            mobileArea={mobileArea} setMobileArea={setMobileArea}
            accessMethod={accessMethod} setAccessMethod={setAccessMethod}
            accessStation={accessStation} setAccessStation={setAccessStation}
            accessMinutes={accessMinutes} setAccessMinutes={setAccessMinutes}
            remoteWorkType={remoteWorkType} setRemoteWorkType={setRemoteWorkType}
            remoteWorkDetail={remoteWorkDetail} setRemoteWorkDetail={setRemoteWorkDetail}
            workSchedules={workSchedules} addWorkSchedule={addWorkSchedule}
            removeWorkSchedule={removeWorkSchedule} updateWorkSchedule={updateWorkSchedule}
            hours={hours} minutes={minutes}
            overtimeChoice={overtimeChoice} setOvertimeChoice={setOvertimeChoice}
            overtimeHours={overtimeHours} setOvertimeHours={setOvertimeHours}
            probationChoice={probationChoice} setProbationChoice={setProbationChoice}
            probationDuration={probationDuration} setProbationDuration={setProbationDuration}
            probationUnit={probationUnit} setProbationUnit={setProbationUnit}
            probationChange={probationChange} setProbationChange={setProbationChange}
            probationChangeDetail={probationChangeDetail} setProbationChangeDetail={setProbationChangeDetail}
            holidayType={holidayType} setHolidayType={setHolidayType}
            holidayDetail={holidayDetail} setHolidayDetail={setHolidayDetail}
            inputStyle={inputStyle} disabledInputStyle={disabledInputStyle}
            centerNumberInputStyle={centerNumberInputStyle}
            disabledCenterNumberInputStyle={disabledCenterNumberInputStyle}
            stationInputStyle={stationInputStyle}
          />

          <Section6CompanyCulture 
            teamAtmosphere={teamAtmosphere} setTeamAtmosphere={setTeamAtmosphere}
            selectedBenefits={selectedBenefits} handleBenefitToggle={handleBenefitToggle}
            benefitsExtra={benefitsExtra} setBenefitsExtra={setBenefitsExtra}
            smoking={smoking} setSmoking={setSmoking}
            selectionSteps={selectionSteps}
            addSelectionStep={addSelectionStep}
            removeSelectionStep={removeSelectionStep}
            updateSelectionStep={updateSelectionStep}
            jobImages={jobImages}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
            inputStyle={inputStyle}
            availableLocations={availableLocations}
            selectedPostingLocation={selectedPostingLocation}
            setSelectedPostingLocation={setSelectedPostingLocation}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginTop: '20px' }}>
            <button 
              type="submit" 
              disabled={!isFormComplete}
              style={{ 
                background: isFormComplete ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)' : '#cbd5e1', 
                color: isFormComplete ? '#ffffff' : '#64748b', 
                border: 'none', 
                padding: '18px 52px', 
                borderRadius: '14px', 
                fontSize: '17px', 
                fontWeight: '800', 
                cursor: isFormComplete ? 'pointer' : 'not-allowed', 
                boxShadow: isFormComplete ? '0 10px 25px rgba(5, 150, 105, 0.3)' : 'none', 
                transition: 'all 0.2s ease' 
              }}
            >
              {isFormComplete ? '公開（プレビュー）する' : 'すべての必須項目を入力してください'}
            </button>
            {!isFormComplete && (
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#ef4444' }}>
                ※ 未入力の項目があるためボタンが無効化されています
              </span>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}