import WebcamScanner from '@/components/scanner/WebcamScanner';

export default function ScanPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Scan Barcode</h1>
      <WebcamScanner />
    </div>
  );
}