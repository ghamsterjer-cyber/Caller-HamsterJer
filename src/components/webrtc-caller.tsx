
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { database } from "@/lib/firebase";
import { ref, set, onValue, off, push, remove, onChildAdded, update } from "firebase/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import Tutorial, { TutorialStep } from '@/components/tutorial';
import {
  ClipboardCopy,
  Info,
  Loader2,
  Phone,
  PhoneOff,
  PlusCircle,
  LogIn,
  RefreshCw,
  Share2,
} from "lucide-react";

type CallState = "idle" | "creating" | "waiting" | "joining" | "active" | "failed" | "ending";

const RINGTONE_DATA_URI = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjQ1LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGF2YzU4LjkyLjEwMAAAAAAAAAAAAAAAdXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXV1dXV1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1dXR1axA";
const DISCONNECT_TONE_DATA_URI = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjgyLjEwMAAAAAAAAAAAAAAA//tAwxAAAAAAAAAAAAFBTEFNRTMuMTAwAP/n/VAAAAG4AAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/n/VAYAAAMAgAAAAIAAAAAAAD/n/VAYAAAMAgAAAAIAAAAAA==";

const tutorialSteps: TutorialStep[] = [
    {
      elementId: 'roomKey',
      title: 'Шаг 1: Ключ комнаты',
      text: 'Введите сюда уникальный ключ комнаты, чтобы создать новую или присоединиться к существующей. Ключ должен состоять из цифр.',
      position: 'bottom',
    },
    {
      elementId: 'tutorial-generate-key-button',
      title: 'Шаг 2: Сгенерировать ключ',
      text: 'Не хотите придумывать ключ? Нажмите сюда, чтобы сгенерировать случайный 4-значный ключ комнаты.',
      position: 'bottom',
    },
    {
      elementId: 'tutorial-copy-key-button',
      title: 'Шаг 3: Скопировать ключ',
      text: 'Нажмите, чтобы скопировать ключ в буфер обмена и легко поделиться им с собеседником.',
      position: 'bottom',
    },
    {
      elementId: 'tutorial-create-room-button',
      title: 'Шаг 4: Создать комнату',
      text: 'Когда ключ введен, нажмите сюда, чтобы создать комнату для звонка и дождаться собеседника.',
      position: 'top',
    },
    {
      elementId: 'tutorial-join-room-button',
      title: 'Шаг 5: Присоединиться',
      text: 'Если ваш собеседник уже создал комнату, введите его ключ и нажмите эту кнопку, чтобы войти в звонок.',
      position: 'top',
    },
];

const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun.services.mozilla.com" },
  ],
};

export default function WebRTCCaller() {
  const [roomKey, setRoomKey] = useState("");
  const [callState, setCallState] = useState<CallState>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);


  const { toast } = useToast();

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const ringingAudioRef = useRef<HTMLAudioElement>(null);
  const disconnectAudioRef = useRef<HTMLAudioElement>(null);
  const firebaseListenersRef = useRef<Array<{ path: string; type: any }>>([]);
  const isInitiatorRef = useRef(false);
  const callStateRef = useRef(callState);
  const candidateBufferRef = useRef<RTCIceCandidate[]>([]);
  const answerHandledRef = useRef(false);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);
  
  useEffect(() => {
      const tutorialShown = localStorage.getItem('webrtc-tutorial-shown');
      if (!tutorialShown) {
        setShowTutorial(true);
        localStorage.setItem('webrtc-tutorial-shown', 'true');
      }
  }, []);

  useEffect(() => {
    if (ringingAudioRef.current) {
      ringingAudioRef.current.src = RINGTONE_DATA_URI;
    }
    if (disconnectAudioRef.current) {
      disconnectAudioRef.current.src = DISCONNECT_TONE_DATA_URI;
    }
  }, []);

  const addLog = useCallback((message: string) => {
    const timestampedMessage = `${new Date().toLocaleTimeString()}: ${message}`;
    console.log(timestampedMessage);
    setLogs((prev) => [...prev, timestampedMessage]);
  }, []);
  
  const cleanup = useCallback(async () => {
    if (callStateRef.current === 'idle' || callStateRef.current === 'ending') {
      return;
    }

    const previousState = callStateRef.current;
    setCallState('ending');
    addLog('Запускаю очистку ресурсов...');

    if (ringingAudioRef.current) {
      ringingAudioRef.current.pause();
      ringingAudioRef.current.currentTime = 0;
    }

    if (
      disconnectAudioRef.current &&
      (previousState === 'active' || previousState === 'waiting')
    ) {
      disconnectAudioRef.current
        .play()
        .catch((e) =>
          addLog(`Не удалось воспроизвести звук отключения: ${e.message}`)
        );
    }

    firebaseListenersRef.current.forEach(({ path, type }) => {
      const dbRef = ref(database, path);
      off(dbRef, type);
    });
    firebaseListenersRef.current = [];
    addLog("Слушатели Firebase удалены.");

    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      addLog("PeerConnection закрыт.");
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      addLog("Локальный медиапоток остановлен.");
    }
    
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    
    isInitiatorRef.current = false;
    answerHandledRef.current = false;
    setCallState("idle");
    toast({ title: "Вызов завершен", description: "Вы можете начать новый вызов." });
  }, [addLog, toast]);

  const handleEndCall = useCallback(async () => {
    if (callStateRef.current === 'idle' || callStateRef.current === 'ending') {
        return;
    }
    addLog("Завершение вызова по кнопке...");
    if (roomKey) {
        addLog(`Удаление комнаты rooms/${roomKey} из базы данных.`);
        const roomRef = ref(database, `rooms/${roomKey}`);
        await remove(roomRef).then(() => {
            addLog(`Комната rooms/${roomKey} успешно удалена.`);
        }).catch(e => {
            addLog(`Ошибка при удалении комнаты: ${e.message}`);
        });
    } else {
        await cleanup();
    }
  }, [roomKey, cleanup, addLog]);


  const setAudioOutputToEarpiece = useCallback(async () => {
    if (!remoteAudioRef.current) {
        addLog('Remote audio element not ready.');
        return;
    };
    
    if (typeof (remoteAudioRef.current as any).setSinkId !== 'function') {
      addLog('Выбор аудиоустройства вывода не поддерживается этим браузером.');
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
      
      addLog(`Найдено аудиоустройств вывода: ${audioOutputDevices.length}`);
      audioOutputDevices.forEach(d => addLog(`- ${d.label} (ID: ${d.deviceId})`));

      const earpiece = audioOutputDevices.find(device => device.deviceId === 'communications');
      
      if (earpiece) {
        addLog('Найден разговорный динамик ("communications"). Устанавливаю его.');
        await (remoteAudioRef.current as any).setSinkId(earpiece.deviceId);
        addLog('Аудиовыход успешно установлен на разговорный динамик.');
        toast({ title: 'Звук переключен на разговорный динамик' });
      } else {
        addLog('Разговорный динамик ("communications") не найден. Будет использовано устройство по умолчанию.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addLog(`Ошибка при установке аудиовыхода: ${message}`);
      toast({
        variant: 'destructive',
        title: 'Ошибка аудиовыхода',
        description: `Не удалось переключить динамик: ${message}`,
      });
    }
  }, [addLog, toast]);

  const initializePeerConnection = useCallback(() => {
    try {
      addLog("Инициализация RTCPeerConnection...");
      const pc = new RTCPeerConnection(iceServers);
      candidateBufferRef.current = [];
      answerHandledRef.current = false;
      
      pc.onicecandidate = (event) => {
        if (event.candidate && roomKey) {
          addLog("Сгенерирован новый ICE-кандидат.");
          const candidatesRefPath = `rooms/${roomKey}/${ isInitiatorRef.current ? "callerCandidates" : "calleeCandidates"}`;
          push(ref(database, candidatesRefPath), event.candidate.toJSON());
        }
      };

      pc.ontrack = (event) => {
        addLog("Получен удаленный медиапоток.");
        if (event.streams && event.streams[0] && remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
          remoteAudioRef.current.play().catch(e => addLog(`Ошибка воспроизведения аудио: ${e.message}`));
        }
      };

      pc.onconnectionstatechange = async () => {
        addLog(`Состояние соединения: ${pc.connectionState}`);
        switch (pc.connectionState) {
          case "connected":
            ringingAudioRef.current?.pause();
            setCallState("active");
            await setAudioOutputToEarpiece();
            break;
          case "disconnected":
          case "closed":
          case "failed":
            if (['active', 'waiting', 'joining', 'creating'].includes(callStateRef.current)) {
                addLog(`Соединение разорвано (состояние: ${pc.connectionState}). Завершение вызова.`);
                await cleanup();
            }
            break;
        }
      };
      
      localStreamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });

      peerConnectionRef.current = pc;
      addLog("RTCPeerConnection успешно инициализирован.");
      return pc;
    } catch (error) {
        addLog(`Ошибка создания PeerConnection: ${error}`);
        setCallState("failed");
        toast({variant: "destructive", title: "Критическая ошибка", description: "Не удалось создать WebRTC соединение."});
    }
  }, [roomKey, addLog, cleanup, setAudioOutputToEarpiece, toast]);
  
  const setupFirebaseListener = (path: string, callback: (snapshot: any) => void) => {
    const dbRef = ref(database, path);
    onValue(dbRef, callback, (error) => {
        addLog(`Firebase listener error at ${path}: ${error.message}`);
    });
    firebaseListenersRef.current.push({ path, type: 'value' });
  };

  const setupFirebaseChildListener = (path: string, callback: (snapshot: any) => void) => {
    const dbRef = ref(database, path);
    onChildAdded(dbRef, callback, (error) => {
        addLog(`Firebase child listener error at ${path}: ${error.message}`);
    });
    firebaseListenersRef.current.push({ path, type: 'child_added' });
  };

  const initLocalStream = async () => {
    try {
      addLog("Запрос доступа к микрофону...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
      localStreamRef.current = stream;
      addLog("Доступ к микрофону получен.");
      return stream;
    } catch (error) {
      addLog(`Ошибка доступа к микрофону: ${error}`);
      setCallState("failed");
      toast({
        variant: "destructive",
        title: "Ошибка микрофона",
        description: "Не удалось получить доступ к микрофону. Проверьте разрешения в браузере.",
      });
      throw error;
    }
  };

  const handleCreateCall = async () => {
    if (!roomKey) {
      toast({ variant: "destructive", title: "Введите ключ комнаты" });
      return;
    }
    setCallState("creating");
    addLog(`Создание комнаты: ${roomKey}`);
    isInitiatorRef.current = true;
    
    await initLocalStream();
    const pc = initializePeerConnection();
    if (!pc) return;

    const roomRef = ref(database, `rooms/${roomKey}`);
    await remove(roomRef);

    // Listen for room changes (answer and deletion)
    setupFirebaseListener(`rooms/${roomKey}`, async (snapshot) => {
        if (!snapshot.exists()) {
            addLog("Комната удалена, завершение вызова.");
            await cleanup();
            return;
        }
        const roomData = snapshot.val();
        if (roomData.answer && !answerHandledRef.current) {
            answerHandledRef.current = true;
            addLog("Получен Answer.");
            try {
              if (pc.signalingState !== 'stable') {
                await pc.setRemoteDescription(new RTCSessionDescription(roomData.answer));
              } else {
                addLog("Состояние уже stable, setRemoteDescription(answer) пропущен.");
              }
              addLog(`Обработка ${candidateBufferRef.current.length} буферизированных ICE кандидатов.`);
              for(const candidate of candidateBufferRef.current) {
                await pc.addIceCandidate(candidate);
              }
              candidateBufferRef.current = [];
            } catch(e) {
                addLog(`Ошибка установки remote description или ICE: ${e}`);
            }
        }
    });

    // Listen for callee's ICE candidates
    setupFirebaseChildListener(`rooms/${roomKey}/calleeCandidates`, (snapshot) => {
        if (snapshot.exists()) {
            const candidate = new RTCIceCandidate(snapshot.val());
            addLog("Получен ICE-кандидат от собеседника.");
            if (pc.remoteDescription) {
              pc.addIceCandidate(candidate).catch(e => addLog(`Ошибка при добавлении ICE кандидата: ${e}`));
            } else {
              addLog("Буферизация ICE кандидата (remoteDescription еще не установлен).");
              candidateBufferRef.current.push(candidate);
            }
        }
    });
    
    try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
    
        await set(roomRef, { offer: { sdp: offer.sdp, type: offer.type } });
        addLog("Offer создан и сохранен в Firebase.");
    
        setCallState("waiting");
        if (ringingAudioRef.current) {
          ringingAudioRef.current.load();
          ringingAudioRef.current.play().catch(e => addLog(`Ошибка воспроизведения гудков: ${e.message}`));
        }
    } catch(e) {
        addLog(`Ошибка создания Offer: ${e}`);
        setCallState('failed');
    }
  };
  
  const handleJoinCall = async () => {
    if (!roomKey) {
      toast({ variant: "destructive", title: "Введите ключ комнаты" });
      return;
    }
    setCallState("joining");
    addLog(`Присоединение к комнате: ${roomKey}`);
    isInitiatorRef.current = false;
    let offerHandled = false;

    await initLocalStream();
    const pc = initializePeerConnection();
    if (!pc) return;

    const roomRef = ref(database, `rooms/${roomKey}`);
    
    // Listen for caller's ICE candidates
    setupFirebaseChildListener(`rooms/${roomKey}/callerCandidates`, (snapshot) => {
        if (snapshot.exists()) {
            const candidate = new RTCIceCandidate(snapshot.val());
             addLog("Получен ICE-кандидат от создателя.");
            if (pc.remoteDescription) {
              pc.addIceCandidate(candidate).catch(e => addLog(`Ошибка при добавлении ICE кандидата: ${e}`));
            } else {
              addLog("Буферизация ICE кандидата (remoteDescription еще не установлен).");
              candidateBufferRef.current.push(candidate);
            }
        }
    });

    setupFirebaseListener(`rooms/${roomKey}`, async (snapshot) => {
      if (!snapshot.exists()) {
        addLog("Комната была удалена создателем. Завершение вызова.");
        await cleanup();
        return;
      }

      const roomData = snapshot.val();
      if (roomData.offer && !offerHandled) {
          offerHandled = true;
          addLog("Получен Offer.");
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(roomData.offer));
            
            addLog(`Обработка ${candidateBufferRef.current.length} буферизированных ICE кандидатов.`);
            for(const candidate of candidateBufferRef.current) {
                await pc.addIceCandidate(candidate);
            }
            candidateBufferRef.current = [];

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            await update(roomRef, { answer: { sdp: answer.sdp, type: answer.type } });
            addLog("Answer создан и отправлен.");
          } catch(e) {
             addLog(`Ошибка при обработке Offer или создании Answer: ${e}`);
             setCallState('failed');
          }
      }
    });
  };

  const generateRoomKey = () => {
    const key = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomKey(key);
    toast({ title: "Ключ комнаты сгенерирован", description: `Ключ: ${key}` });
  };
  
  const copyRoomKey = () => {
    if (!roomKey) return;
    navigator.clipboard.writeText(roomKey).then(() => {
        toast({ title: "Ключ комнаты скопирован!" });
    });
  };
  
  const handleLogoClick = () => {
    const newClickCount = logoClickCount + 1;
    if (newClickCount >= 10) {
      setShowLogs(prev => {
        toast({ title: `Логи ${!prev ? 'показаны' : 'скрыты'}` });
        return !prev;
      });
      setLogoClickCount(0);
    } else {
      setLogoClickCount(newClickCount);
    }
  };


  useEffect(() => {
    return () => {
      if (roomKey && callStateRef.current !== 'idle' && callStateRef.current !== 'ending') {
          remove(ref(database, `rooms/${roomKey}`));
      }
      cleanup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StatusContent = () => {
    switch (callState) {
      case "idle":
        return { icon: <Info/>, title: "Готов к работе", desc: "Создайте комнату или присоединитесь к существующей." };
      case "creating":
      case "joining":
        return { icon: <Loader2 className="animate-spin" />, title: "Подключение...", desc: "Инициализация вызова, пожалуйста, подождите." };
      case "waiting":
        return { icon: <Loader2 className="animate-spin" />, title: "Ожидание собеседника...", desc: `Поделитесь ключом комнаты: ${roomKey}` };
      case "active":
        return { icon: <Phone className="text-green-500 animate-pulse" />, title: "Вызов активен", desc: "Вы в эфире. Говорите." };
      case "failed":
        return { icon: <PhoneOff className="text-red-500" />, title: "Сбой соединения", desc: "Проверьте подключение или попробуйте еще раз." };
      case "ending":
        return { icon: <PhoneOff />, title: "Завершение...", desc: "Завершение вызова и очистка ресурсов." };
      default:
        return { icon: <Info/>, title: "Статус неизвестен", desc: "" };
    }
  };

  const { icon, title, desc } = StatusContent();

  return (
    <>
      <Tutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} steps={tutorialSteps} />
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <audio ref={ringingAudioRef} loop playsInline style={{ display: "none" }} />
        <audio ref={disconnectAudioRef} playsInline style={{ display: "none" }} />
        <Card className="w-full shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <Share2 className="text-primary cursor-pointer" onClick={handleLogoClick}/> HJWebRTC Звонилка
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowTutorial(true)}>
                <Info className="h-5 w-5" />
              </Button>
            </div>
            <CardDescription>P2P-звонки через интернет с помощью WebRTC</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="roomKey" className="font-medium">Ключ комнаты</label>
              <div className="flex gap-2">
                <Input
                  id="roomKey"
                  placeholder="Напр. 1234"
                  value={roomKey}
                  onChange={(e) => setRoomKey(e.target.value)}
                  disabled={callState !== "idle"}
                />
                <Button id="tutorial-generate-key-button" variant="outline" size="icon" onClick={generateRoomKey} disabled={callState !== 'idle'}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button id="tutorial-copy-key-button" variant="outline" size="icon" onClick={copyRoomKey} disabled={!roomKey}>
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Alert>
              <div className="flex items-center">{icon}<AlertTitle className="ml-2">{title}</AlertTitle></div>
              <AlertDescription>{desc}</AlertDescription>
            </Alert>
            <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: "none" }} />
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            {callState === "idle" && (
              <>
                <Button id="tutorial-create-room-button" onClick={handleCreateCall} className="w-full bg-accent hover:bg-accent/80 text-accent-foreground">
                  <PlusCircle className="mr-2" />
                  Создать комнату
                </Button>
                <Button id="tutorial-join-room-button" onClick={handleJoinCall} className="w-full">
                  <LogIn className="mr-2" />
                  Присоединиться
                </Button>
              </>
            )}
            {["waiting", "active", "failed", "joining", "creating"].includes(callState) && (
              <Button onClick={handleEndCall} variant="destructive" className="w-full">
                <PhoneOff className="mr-2" />
                Завершить вызов
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {showLogs && (
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Логи отладки</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48 w-full rounded-md border p-4 font-mono text-xs">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
                {logs.length === 0 && <div className="text-muted-foreground">Здесь будут отображаться логи событий...</div>}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

    
