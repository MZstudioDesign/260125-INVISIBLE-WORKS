'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuoteSettings, DEFAULT_SETTINGS } from './settings';

const STORAGE_KEY = 'invisible-quote-settings';

/**
 * Quote Settings Hook
 * - localStorage에 설정 저장
 * - 기본값 제공
 * - 부분 업데이트 지원
 */
export function useQuoteSettings() {
  const [settings, setSettings] = useState<QuoteSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기 로드
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // 기본값과 병합 (새 필드가 추가되어도 안전하게)
        setSettings(mergeSettings(DEFAULT_SETTINGS, parsed));
      }
    } catch (error) {
      console.warn('Failed to load quote settings:', error);
    }
    setIsLoaded(true);
  }, []);

  // 설정 저장
  const saveSettings = useCallback((newSettings: QuoteSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.warn('Failed to save quote settings:', error);
    }
  }, []);

  // 부분 업데이트
  const updateSettings = useCallback(
    (partial: Partial<QuoteSettings>) => {
      const newSettings = { ...settings, ...partial };
      saveSettings(newSettings);
    },
    [settings, saveSettings]
  );

  // 페이지 비용 업데이트
  const updatePageCost = useCallback(
    (pageCost: Partial<QuoteSettings['pageCost']>) => {
      updateSettings({ pageCost: { ...settings.pageCost, ...pageCost } });
    },
    [settings.pageCost, updateSettings]
  );

  // UIUX 배율 업데이트
  const updateUiuxMultiplier = useCallback(
    (uiuxMultiplier: Partial<QuoteSettings['uiuxMultiplier']>) => {
      updateSettings({
        uiuxMultiplier: { ...settings.uiuxMultiplier, ...uiuxMultiplier },
      });
    },
    [settings.uiuxMultiplier, updateSettings]
  );

  // 기능 비용 업데이트
  const updateFeatureCost = useCallback(
    (featureCost: Partial<QuoteSettings['featureCost']>) => {
      updateSettings({
        featureCost: { ...settings.featureCost, ...featureCost },
      });
    },
    [settings.featureCost, updateSettings]
  );

  // 서버 비용 업데이트
  const updateServerCost = useCallback(
    (serverCost: Partial<QuoteSettings['serverCost']>) => {
      updateSettings({
        serverCost: { ...settings.serverCost, ...serverCost },
      });
    },
    [settings.serverCost, updateSettings]
  );

  // 도메인 비용 업데이트
  const updateDomainCost = useCallback(
    (domainCost: Partial<QuoteSettings['domainCost']>) => {
      updateSettings({
        domainCost: { ...settings.domainCost, ...domainCost },
      });
    },
    [settings.domainCost, updateSettings]
  );

  // 수정 비용 업데이트
  const updateRevisionCost = useCallback(
    (revisionCost: Partial<QuoteSettings['revisionCost']>) => {
      updateSettings({
        revisionCost: { ...settings.revisionCost, ...revisionCost },
      });
    },
    [settings.revisionCost, updateSettings]
  );

  // 회사 정보 업데이트
  const updateCompanyInfo = useCallback(
    (companyInfo: Partial<QuoteSettings['companyInfo']>) => {
      updateSettings({
        companyInfo: { ...settings.companyInfo, ...companyInfo },
      });
    },
    [settings.companyInfo, updateSettings]
  );

  // 결제 계좌 업데이트
  const updateBankInfo = useCallback(
    (bankInfo: Partial<QuoteSettings['bankInfo']>) => {
      updateSettings({
        bankInfo: { ...settings.bankInfo, ...bankInfo },
      });
    },
    [settings.bankInfo, updateSettings]
  );

  // 커스텀 필드 추가
  const addCustomField = useCallback(
    (label: string, value: string) => {
      const newFields = [...settings.customFields, { label, value }];
      updateSettings({ customFields: newFields });
    },
    [settings.customFields, updateSettings]
  );

  // 커스텀 필드 삭제
  const removeCustomField = useCallback(
    (index: number) => {
      const newFields = settings.customFields.filter((_, i) => i !== index);
      updateSettings({ customFields: newFields });
    },
    [settings.customFields, updateSettings]
  );

  // 커스텀 필드 수정
  const updateCustomField = useCallback(
    (index: number, label: string, value: string) => {
      const newFields = [...settings.customFields];
      newFields[index] = { label, value };
      updateSettings({ customFields: newFields });
    },
    [settings.customFields, updateSettings]
  );

  // 기본값으로 초기화
  const resetToDefaults = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS);
  }, [saveSettings]);

  return {
    settings,
    isLoaded,
    updateSettings,
    updatePageCost,
    updateUiuxMultiplier,
    updateFeatureCost,
    updateServerCost,
    updateDomainCost,
    updateRevisionCost,
    updateCompanyInfo,
    updateBankInfo,
    addCustomField,
    removeCustomField,
    updateCustomField,
    resetToDefaults,
  };
}

/**
 * 기본값과 저장된 값 병합
 * 새로운 필드가 추가되어도 안전하게 처리
 */
function mergeSettings(
  defaults: QuoteSettings,
  stored: Partial<QuoteSettings>
): QuoteSettings {
  return {
    pageCost: { ...defaults.pageCost, ...stored.pageCost },
    uiuxMultiplier: { ...defaults.uiuxMultiplier, ...stored.uiuxMultiplier },
    featureCost: { ...defaults.featureCost, ...stored.featureCost },
    serverCost: { ...defaults.serverCost, ...stored.serverCost },
    domainCost: { ...defaults.domainCost, ...stored.domainCost },
    revisionCost: { ...defaults.revisionCost, ...stored.revisionCost },
    companyInfo: { ...defaults.companyInfo, ...stored.companyInfo },
    bankInfo: { ...defaults.bankInfo, ...stored.bankInfo },
    customFields: stored.customFields ?? defaults.customFields,
  };
}
