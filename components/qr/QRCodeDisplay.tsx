'use client';

import { QRCodeSVG } from 'react-qr-code';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
  className?: string;
}

export function QRCodeDisplay({
  value,
  size = 200,
  label,
  className = ''
}: QRCodeDisplayProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className="bg-white p-4 rounded-lg shadow-md"
        style={{
          width: 'fit-content',
          maxWidth: '100%'
        }}
      >
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          className="w-full h-auto"
          style={{ maxWidth: `${size}px` }}
        />
      </div>
      {label && (
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
          {label}
        </p>
      )}
    </div>
  );
}
