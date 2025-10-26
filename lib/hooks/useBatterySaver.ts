'use client';

import { useState, useEffect } from 'react';

/**
 * Battery Saver Hook
 *
 * Monitors battery level and enables battery saver mode when low
 * Uses Battery Status API when available
 * https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API
 */

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: 'chargingchange' | 'levelchange', listener: () => void): void;
  removeEventListener(type: 'chargingchange' | 'levelchange', listener: () => void): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

const LOW_BATTERY_THRESHOLD = 0.2; // 20%

export function useBatterySaver() {
  const [batteryLevel, setBatteryLevel] = useState<number>(1);
  const [isCharging, setIsCharging] = useState<boolean>(true);
  const [isLowBattery, setIsLowBattery] = useState<boolean>(false);
  const [batterySaverEnabled, setBatterySaverEnabled] = useState<boolean>(false);

  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;

    if (!nav.getBattery) {
      // Battery API not supported
      return;
    }

    const updateBatteryStatus = (batteryManager: BatteryManager) => {
      setBatteryLevel(batteryManager.level);
      setIsCharging(batteryManager.charging);

      const isLow = batteryManager.level < LOW_BATTERY_THRESHOLD && !batteryManager.charging;
      setIsLowBattery(isLow);

      // Auto-enable battery saver when battery is low
      if (isLow) {
        setBatterySaverEnabled(true);
      }
    };

    nav.getBattery().then((batteryManager) => {
      updateBatteryStatus(batteryManager);

      const onLevelChange = () => updateBatteryStatus(batteryManager);
      const onChargingChange = () => updateBatteryStatus(batteryManager);

      batteryManager.addEventListener('levelchange', onLevelChange);
      batteryManager.addEventListener('chargingchange', onChargingChange);

      return () => {
        batteryManager.removeEventListener('levelchange', onLevelChange);
        batteryManager.removeEventListener('chargingchange', onChargingChange);
      };
    }).catch((error) => {
      console.warn('Battery API not available:', error);
    });
  }, []);

  const toggleBatterySaver = () => {
    setBatterySaverEnabled((prev) => !prev);
  };

  return {
    batteryLevel,
    isCharging,
    isLowBattery,
    batterySaverEnabled,
    toggleBatterySaver,
  };
}
