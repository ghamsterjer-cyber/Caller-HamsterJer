import WebRTCCaller from '@/components/webrtc-caller';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 p-4 font-body">
      <WebRTCCaller />
    </main>
  );
}
