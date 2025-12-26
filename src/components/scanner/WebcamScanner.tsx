'use client';

import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useRouter } from 'next/navigation';

interface ScanResult {
  barcode: string;
  format: string;
  timestamp: Date;
}

export default function WebcamScanner() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    scannerRef.current = new BrowserMultiFormatReader();
    
    navigator.mediaDevices.enumerateDevices()
      .then((deviceList) => {
        const videoDevices = deviceList.filter(d => d.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      })
      .catch((err) => {
        setError('Tidak dapat mengakses daftar kamera: ' + err.message);
      });

    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    if (!scannerRef.current || !videoRef.current) return;

    try {
      setError(null);
      setScanning(true);
      setResult(null);

      await scannerRef.current.decodeFromVideoDevice(
        selectedDevice || null,
        videoRef.current,
        (detectedResult, err) => {
          if (detectedResult) {
            const scanResult: ScanResult = {
              barcode: detectedResult.getText(),
              format: detectedResult.getBarcodeFormat().toString(),
              timestamp: new Date()
            };
            
            setResult(scanResult);
            setScanning(false);
            stopScanning();
            playSuccessSound();
          }
          
          if (err && !(err instanceof NotFoundException)) {
            console.error('Scan error:', err);
          }
        }
      );
    } catch (err: any) {
      setError('Error mengakses kamera: ' + err.message);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.reset();
    }
    setScanning(false);
  };

  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 100);
    } catch (err) {
      console.error('Audio error:', err);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setError(null);
    stopScanning();
  };

  const handleProcessTransaction = () => {
    if (result) {
      router.push(`/dashboard/transactions/new?barcode=${result.barcode}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            📷 Webcam Barcode Scanner
          </h2>
          <p className="text-blue-100 mt-2">
            Arahkan barcode ke kamera untuk scan otomatis
          </p>
        </div>

        {devices.length > 1 && !scanning && !result && (
          <div className="p-4 bg-gray-50 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Kamera:
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {devices.map((device, idx) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Kamera ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="relative bg-black aspect-video">
          {!scanning && !result && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-lg">Klik tombol "Mulai Scan" untuk membuka kamera</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${!scanning ? 'hidden' : ''}`}
            playsInline
          />

          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-64 h-40 border-4 border-green-500 rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 -translate-x-2 -translate-y-2"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 translate-x-2 -translate-y-2"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 -translate-x-2 translate-y-2"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 translate-x-2 translate-y-2"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-400 animate-scan"></div>
              </div>
              
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <div className="inline-block bg-black bg-opacity-75 text-white px-6 py-3 rounded-full">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Scanning barcode...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Barcode Detected! ✅
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Barcode ID:</p>
                  <p className="text-2xl font-mono font-bold text-blue-600 break-all">
                    {result.barcode}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Format: {result.format}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={resetScanner}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                  >
                    Scan Lagi
                  </button>
                  <button
                    onClick={handleProcessTransaction}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                  >
                    Proses Transaksi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 bg-gray-50">
          {!scanning && !result && (
            <button
              onClick={startScanning}
              disabled={devices.length === 0}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg transition shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              Mulai Scan Barcode
            </button>
          )}

          {scanning && (
            <button
              onClick={stopScanning}
              className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop Scanning
            </button>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              💡 Tips Scan Barcode:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Pastikan pencahayaan cukup</li>
              <li>✅ Jarak ideal: 10-20 cm dari kamera</li>
              <li>✅ Letakkan barcode di area hijau</li>
              <li>✅ Tahan steady (jangan goyang)</li>
              <li>✅ Browser akan minta izin akses kamera</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
            <strong>✅ Compatible Browsers:</strong> Chrome, Firefox, Edge, Safari (iOS 11+)
            <br />
            <strong>⚠️ Requirement:</strong> HTTPS connection (auto di Vercel)
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          100% {
            top: 100%;
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
