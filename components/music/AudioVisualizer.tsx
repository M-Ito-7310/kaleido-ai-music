'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  audioUrl: string;
  waveColor?: string;
  progressColor?: string;
  height?: number;
  barWidth?: number;
  barGap?: number;
  onReady?: (wavesurfer: WaveSurfer) => void;
  onSeek?: (time: number) => void;
}

export function AudioVisualizer({
  audioUrl,
  waveColor = '#94A3B8',
  progressColor = '#0284c7',
  height = 80,
  barWidth = 2,
  barGap = 1,
  onReady,
  onSeek,
}: AudioVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      wavesurferRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor,
        progressColor,
        height,
        barWidth,
        barGap,
        barRadius: 3,
        normalize: true,
        interact: true,
        cursorWidth: 2,
        cursorColor: progressColor,
      });

      wavesurferRef.current.load(audioUrl);

      wavesurferRef.current.on('ready', () => {
        setIsLoading(false);
        if (onReady && wavesurferRef.current) {
          onReady(wavesurferRef.current);
        }
      });

      wavesurferRef.current.on('error', (err) => {
        console.error('WaveSurfer error:', err);
        setError('波形の読み込みに失敗しました');
        setIsLoading(false);
      });

      wavesurferRef.current.on('seeking', (progress) => {
        if (onSeek && wavesurferRef.current) {
          const duration = wavesurferRef.current.getDuration();
          onSeek(progress * duration);
        }
      });
    } catch (err) {
      console.error('WaveSurfer initialization error:', err);
      setError('ビジュアライザーの初期化に失敗しました');
      setIsLoading(false);
    }

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [audioUrl, waveColor, progressColor, height, barWidth, barGap, onReady, onSeek]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-20 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full rounded-lg overflow-hidden" />
    </motion.div>
  );
}
