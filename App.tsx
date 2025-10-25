import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AppStep, Language, ChatMessage, ReportData, PersonData, UserRole, HospitalData, ChatMode } from './types';
import { UI_TEXT, EMERGENCY_CONTACTS } from './constants';
import * as GeminiService from './services/geminiService';
import { Chat } from '@google/genai';
import { WaterIcon, FoodIcon, InjuryIcon, ShelterIcon, GenerateReportIcon, ScanQRIcon, AnalyzeImageIcon, ReliefQRLogo, MoonIcon, SunIcon, PhoneIcon, HospitalIcon, DirectionsIcon, HelpIcon, AccessibilityIcon, TextToSpeechIcon, SpeechToTextIcon, MicrophoneIcon, MicrophoneOffIcon, EmergencyIcon } from './components/IconComponents';
import { QRCodeSVG } from 'qrcode.react';

// Fix for SpeechRecognition API not being a standard part of TypeScript's DOM library
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  start: () => void;
  stop: () => void;
  onend: () => void;
  onerror: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Speech Recognition Hook
const useSpeechRecognition = (lang: Language) => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // This effect handles cleanup when the component unmounts.
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startListening = () => {
        if (isListening) {
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser.');
            return;
        }

        // A new recognition instance is created for each listening session to prevent cumulative results.
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onresult = (event) => {
            const fullTranscript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join('');
            setTranscript(fullTranscript);
        };

        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            recognitionRef.current = null;
        };

        recognitionRef.current = recognition;

        try {
            setTranscript('');
            recognition.start();
            setIsListening(true);
        } catch (error) {
            console.error('Could not start speech recognition:', error);
            setIsListening(false);
            recognitionRef.current = null;
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            // isListening will be set to false by the 'onend' event handler.
        }
    };

    return { transcript, isListening, startListening, stopListening, setTranscript };
};

const speak = (text: string, lang: Language) => {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
        speechSynthesis.speak(utterance);
    }
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

const Header: React.FC<{ 
    lang: Language, 
    onBack?: () => void, 
    showBackButton: boolean,
    theme: 'light' | 'dark',
    onThemeToggle: () => void,
}> = ({ lang, onBack, showBackButton, theme, onThemeToggle }) => {
    const text = UI_TEXT[lang];
    return (
        <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <div className="flex items-center space-x-3">
                <ReliefQRLogo className="w-12 h-12 text-red-500" />
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 drop-shadow-sm">{text.appName}</span>
            </div>
            <div className="flex items-center space-x-4">
                {showBackButton && (
                    <button onClick={onBack} className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all">
                        {text.backToDashboard}
                    </button>
                )}
                <button onClick={onThemeToggle} className="p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-full shadow-md hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all">
                    {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-700" />}
                </button>
            </div>
        </header>
    );
};

const LanguageSelector: React.FC<{ onSelect: (lang: Language) => void }> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <ReliefQRLogo className="w-24 h-24 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-red-400 mb-2 drop-shadow-md">{UI_TEXT['en'].appName} / {UI_TEXT['hi'].appName}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">{UI_TEXT['en'].tagline}</p>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-8">{UI_TEXT['en'].selectLanguage} / {UI_TEXT['hi'].selectLanguage}</h2>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <button onClick={() => onSelect('en')} className="px-10 py-5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">{UI_TEXT['en'].english}</button>
        <button onClick={() => onSelect('hi')} className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">{UI_TEXT['hi'].hindi}</button>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ lang: Language; onActionSelect: (step: AppStep) => void; }> = ({ lang, onActionSelect }) => {
  const text = UI_TEXT[lang];
  const ActionButton: React.FC<{ title: string; desc: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, desc, icon, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all transform hover:-translate-y-2">
      <div className="text-red-600 dark:text-red-400 mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-md text-gray-600 dark:text-gray-400 mt-2 text-center">{desc}</p>
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 overflow-y-auto">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-12 drop-shadow-md">{text.dashboardTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        <ActionButton title={text.generateReport} desc={text.generateReportDesc} icon={<GenerateReportIcon className="w-20 h-20" />} onClick={() => onActionSelect(AppStep.Chat)} />
        <ActionButton title={text.getHelp} desc={text.getHelpDesc} icon={<HelpIcon className="w-20 h-20" />} onClick={() => onActionSelect(AppStep.GetHelp)} />
        <ActionButton title={text.scanQR} desc={text.scanQRDesc} icon={<ScanQRIcon className="w-20 h-20" />} onClick={() => onActionSelect(AppStep.ScanQR)} />
        <ActionButton title={text.analyzeScene} desc={text.analyzeSceneDesc} icon={<AnalyzeImageIcon className="w-20 h-20" />} onClick={() => onActionSelect(AppStep.AnalyzeImage)} />
        <ActionButton title={text.findHospitals} desc={text.findHospitalsDesc} icon={<HospitalIcon className="w-20 h-20" />} onClick={() => onActionSelect(AppStep.FindHospitals)} />
      </div>
      <div className="w-full max-w-5xl mt-16">
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">{text.emergencyContacts}</h3>
        <div className="flex justify-center">
            {EMERGENCY_CONTACTS.map((contact) => (
                <div key={contact.number} className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md text-center flex flex-col justify-between max-w-xs">
                    <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{text[contact.nameKey]}</p>
                        <p className="text-2xl font-mono my-2 text-red-600 dark:text-red-400">{contact.number}</p>
                    </div>
                    <a 
                      href={`tel:${contact.number}`} 
                      className="mt-2 inline-flex items-center justify-center w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
                    >
                      <PhoneIcon className="w-5 h-5 mr-2" />
                      {text.call}
                    </a>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const RoleSelector: React.FC<{ lang: Language, onSelect: (role: UserRole) => void }> = ({ lang, onSelect }) => {
  const text = UI_TEXT[lang];
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-10 drop-shadow-md">{text.roleSelectTitle}</h2>
      <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8">
        <button onClick={() => onSelect(UserRole.PersonInNeed)} className="px-12 py-8 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-2xl rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">{text.personInNeed}</button>
        <button onClick={() => onSelect(UserRole.Volunteer)} className="px-12 py-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-2xl rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">{text.volunteer}</button>
      </div>
    </div>
  );
};

const QRScanner: React.FC<{ lang: Language; onScanComplete: (data: ReportData) => void; }> = ({ lang, onScanComplete }) => {
    const text = UI_TEXT[lang];
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };
        startCamera();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);
    
    const handleSimulatedScan = () => {
        const mockData: PersonData = {
            name: "John Doe (Simulated)",
            age: 35,
            location: "Simulated Location, Zone A",
            needs: ["Water", "First Aid"],
            injuryDetails: "Laceration on left arm.",
            photoAnalysis: "Image shows a deep cut, approximately 3 inches long."
        };
        onScanComplete(mockData);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="relative w-full max-w-lg bg-black rounded-2xl overflow-hidden shadow-2xl">
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                <div className="absolute inset-0 border-8 border-red-500/70 rounded-2xl animate-pulse"></div>
            </div>
            <p className="mt-6 text-center text-lg font-semibold">{text.scanInstruction}</p>
            <div className="mt-6">
                <button onClick={handleSimulatedScan} className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">{text.captureAndDecode}</button>
            </div>
        </div>
    );
};

const Card: React.FC<{children: React.ReactNode}> = ({children}) => (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-lg w-full">
        {children}
    </div>
);

const ScannedDataDisplay: React.FC<{ lang: Language; data: ReportData; }> = ({ lang, data }) => {
    const text = UI_TEXT[lang];
    const isPersonData = (d: ReportData): d is PersonData => 'name' in d;

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <Card>
                <h2 className="text-3xl font-bold text-center mb-6">{text.scannedDataTitle}</h2>
                 <div className="space-y-4 text-gray-800 dark:text-gray-200">
                    {isPersonData(data) ? (
                        <>
                            <div className="flex justify-between text-lg"><strong>{text.name}:</strong> <span>{data.name || 'N/A'}</span></div>
                            <div className="flex justify-between text-lg"><strong>{text.age}:</strong> <span>{data.age || 'N/A'}</span></div>
                            <div className="flex justify-between text-lg"><strong>{text.location}:</strong> <span>{data.location || 'N/A'}</span></div>
                            <div><strong className="text-lg">{text.needs}:</strong> <div className="text-right text-lg">{data.needs?.join(', ') || 'N/A'}</div></div>
                            <div><strong className="text-lg">{text.injuryDetails}:</strong> <p className="text-md text-gray-600 dark:text-gray-400 mt-1">{data.injuryDetails || 'N/A'}</p></div>
                            <div><strong className="text-lg">{text.photoAnalysis}:</strong> <p className="text-md text-gray-600 dark:text-gray-400 mt-1">{data.photoAnalysis || 'N/A'}</p></div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between text-lg"><strong>{text.volunteerName}:</strong> <span>{data.volunteerName || 'N/A'}</span></div>
                            <div className="flex justify-between text-lg"><strong>{text.location}:</strong> <span>{data.location || 'N/A'}</span></div>
                            <div className="flex justify-between text-lg"><strong>{text.issueType}:</strong> <span>{data.issueType || 'N/A'}</span></div>
                            <div className="flex justify-between text-lg"><strong>{text.urgency}:</strong> <span>{data.urgency || 'N/A'}</span></div>
                            <div><strong className="text-lg">{text.details}:</strong> <p className="text-md text-gray-600 dark:text-gray-400 mt-1">{data.details || 'N/A'}</p></div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

const ImageAnalyzer: React.FC<{ lang: Language; }> = ({ lang }) => {
    const text = UI_TEXT[lang];
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setAnalysisResult('');
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };

    const handleAnalysis = async () => {
      if (!imageFile) return;
      setIsLoading(true);
      setAnalysisResult('');
      try {
        const base64Image = await fileToBase64(imageFile);
        const result = await GeminiService.analyzeImage(base64Image, imageFile.type);
        setAnalysisResult(result);
      } catch (error) {
        setAnalysisResult(text.imageError);
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <Card>
                <h2 className="text-3xl font-bold text-center mb-6">{text.analyzeImageTitle}</h2>
                <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleImageUpload} className="hidden"/>
                
                <div className="border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-xl p-4 text-center cursor-pointer hover:border-red-500" onClick={() => fileInputRef.current?.click()}>
                    {imagePreview ? (
                        <img src={imagePreview} alt="upload preview" className="max-h-60 rounded-lg mx-auto mb-4"/>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 p-8">{text.uploadPhoto}</p>
                    )}
                </div>

                <div className="flex space-x-4 mt-6">
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg shadow-sm hover:shadow-md transition">{text.uploadImage}</button>
                  <button onClick={handleAnalysis} disabled={!imageFile || isLoading} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none">
                    {isLoading ? text.analyzing : text.analyzeScene}
                  </button>
                </div>
                
                {analysisResult && (
                    <div className="mt-6">
                        <h3 className="font-bold text-lg">{text.imageAnalysisResult}</h3>
                        <p className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">{analysisResult}</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

const ChatWindow: React.FC<{ lang: Language; role: UserRole; onComplete: (data: ReportData) => void; isTtsEnabled: boolean; }> = ({ lang, role, onComplete, isTtsEnabled }) => {
    const text = UI_TEXT[lang];
    const welcomeMsg = role === UserRole.Volunteer ? text.volunteerChatWelcome : text.chatWelcome;
    const [messages, setMessages] = useState<ChatMessage[]>([{ sender: 'bot', text: welcomeMsg }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageStatus, setImageStatus] = useState('');
    
    const chatRef = useRef<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { transcript, isListening, startListening, stopListening, setTranscript } = useSpeechRecognition(lang);

    useEffect(() => { setInput(transcript); }, [transcript]);

    useEffect(() => { 
        chatRef.current = GeminiService.startChat(lang, role, ChatMode.QR); 
        if(isTtsEnabled) speak(welcomeMsg, lang);
    }, [lang, role, isTtsEnabled, welcomeMsg]);

    useEffect(() => { if(chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; } }, [messages]);

    const handleSend = useCallback(async (messageText: string) => {
        if (!messageText.trim() || isLoading || !chatRef.current) return;
        
        const userMessage: ChatMessage = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setTranscript('');
        setIsLoading(true);

        try {
            const botResponseText = await GeminiService.sendMessage(chatRef.current, messageText);
            
            if (isTtsEnabled) speak(botResponseText, lang);

            if (botResponseText.includes("UPLOAD_PHOTO")) {
              setShowImageUpload(true);
              setMessages(prev => [...prev, {sender: 'bot', text: text.uploadPhoto}]);
            } else if (botResponseText.includes('{"name"') || botResponseText.includes('{"volunteerName"')) {
                const jsonText = botResponseText.substring(botResponseText.indexOf('{'), botResponseText.lastIndexOf('}') + 1);
                const parsedData = JSON.parse(jsonText);
                onComplete(parsedData);
            } else {
                 setMessages(prev => [...prev, { sender: 'bot', text: botResponseText }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: text.error }]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, onComplete, text.error, text.uploadPhoto, lang, isTtsEnabled, setTranscript]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
    
    const handleMicToggle = () => {
        if (isListening) {
            stopListening();
            if (transcript) {
                handleSend(transcript);
            }
        } else {
            startListening();
        }
    };

    const handleImageAnalysis = async () => {
      if (!imageFile) return;
      setImageStatus(text.analyzing);
      setIsLoading(true);
      try {
        const base64Image = await fileToBase64(imageFile);
        const analysisResult = await GeminiService.analyzeImage(base64Image, imageFile.type);
        const message = `[Image analysis complete: ${analysisResult}] Please use this information to update the user's injury details and then provide the final JSON summary.`;
        await handleSend(message);
      } catch (error) {
        setMessages(prev => [...prev, { sender: 'bot', text: text.imageError }]);
      } finally {
        setShowImageUpload(false);
        setImageFile(null);
        setImagePreview(null);
        setImageStatus('');
        setIsLoading(false);
      }
    };

    const QuickReplyButton: React.FC<{ text: string; icon?: React.ReactNode; onClick: () => void }> = ({ text, icon, onClick }) => (
      <button onClick={onClick} disabled={isLoading} className="flex-1 flex flex-col items-center justify-center p-2 bg-white/80 dark:bg-gray-700/80 rounded-lg text-center text-sm disabled:opacity-50 hover:bg-red-100 dark:hover:bg-red-800/80 transition-all shadow-sm hover:shadow-md">
          {icon}
          <span className="mt-1 font-semibold">{text}</span>
      </button>
  );

    return (
        <div className="flex flex-col h-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="flex justify-start"><div className="px-4 py-3 rounded-2xl shadow-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">...</div></div>}
            </div>
            {showImageUpload && (
              <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="mb-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200 transition"/>
                {imagePreview && <img src={imagePreview} alt="upload preview" className="max-h-40 rounded-lg mx-auto mb-2 shadow-md"/>}
                <button onClick={handleImageAnalysis} disabled={!imageFile || isLoading} className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg disabled:from-gray-400">
                  {imageStatus || text.analysisComplete}
                </button>
              </div>
            )}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-900/30">
                <div className="flex space-x-2 mb-3 text-gray-800 dark:text-gray-200">
                    {role === UserRole.PersonInNeed ? (
                        <>
                            <QuickReplyButton text={text.needWater} icon={<WaterIcon className="w-6 h-6 text-sky-500"/>} onClick={() => handleSend(text.needWater)} />
                            <QuickReplyButton text={text.needFood} icon={<FoodIcon className="w-6 h-6 text-yellow-600"/>} onClick={() => handleSend(text.needFood)} />
                            <QuickReplyButton text={text.imInjured} icon={<InjuryIcon className="w-6 h-6 text-red-500"/>} onClick={() => handleSend(text.imInjured)} />
                            <QuickReplyButton text={text.needShelter} icon={<ShelterIcon className="w-6 h-6 text-green-600"/>} onClick={() => handleSend(text.needShelter)} />
                        </>
                    ) : (
                         <>
                            <QuickReplyButton text={text.reportIncident} onClick={() => handleSend(text.reportIncident)} />
                            <QuickReplyButton text={text.requestSupplies} onClick={() => handleSend(text.requestSupplies)} />
                            <QuickReplyButton text={text.situationUpdate} onClick={() => handleSend(text.situationUpdate)} />
                        </>
                    )}
                </div>
                <div className="flex">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend(input)} placeholder={text.yourTurn} className="flex-1 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-red-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-inner" />
                     <button onClick={handleMicToggle} className={`px-4 py-3 ${isListening ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'} text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg transition-all`}>
                        {isListening ? <MicrophoneOffIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
                    </button>
                    <button onClick={() => handleSend(input)} disabled={isLoading} className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-r-lg shadow-md hover:shadow-lg disabled:from-gray-400 transition-shadow">{text.send}</button>
                </div>
            </div>
        </div>
    );
};

const HelpChatWindow: React.FC<{ lang: Language; isTtsEnabled: boolean; }> = ({ lang, isTtsEnabled }) => {
    const text = UI_TEXT[lang];
    const [messages, setMessages] = useState<ChatMessage[]>([{ sender: 'bot', text: text.helpChatWelcome }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const chatRef = useRef<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { transcript, isListening, startListening, stopListening, setTranscript } = useSpeechRecognition(lang);

    useEffect(() => { setInput(transcript); }, [transcript]);

    useEffect(() => { 
        chatRef.current = GeminiService.startChat(lang, UserRole.PersonInNeed, ChatMode.Help);
        if(isTtsEnabled) speak(text.helpChatWelcome, lang);
    }, [lang, isTtsEnabled, text.helpChatWelcome]);

    useEffect(() => { if(chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; } }, [messages]);

    const handleSend = useCallback(async (messageText: string) => {
        if (!messageText.trim() || isLoading || !chatRef.current) return;
        
        const userMessage: ChatMessage = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setTranscript('');
        setIsLoading(true);

        try {
            const botResponseText = await GeminiService.sendMessage(chatRef.current, messageText);
            if (isTtsEnabled) speak(botResponseText, lang);
            setMessages(prev => [...prev, { sender: 'bot', text: botResponseText }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: text.error }]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, text.error, isTtsEnabled, lang, setTranscript]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };

    const handleMicToggle = () => {
        if (isListening) {
            stopListening();
            if (transcript) {
                handleSend(transcript);
            }
        } else {
            startListening();
        }
    };

    const handleImageAnalysisAndSend = async () => {
      if (!imageFile) return;
      setIsLoading(true);
      try {
        const base64Image = await fileToBase64(imageFile);
        const analysisResult = await GeminiService.analyzeImage(base64Image, imageFile.type);
        const message = `I have uploaded an image. The analysis is: ${analysisResult}. What should I do?`;
        setMessages(prev => [...prev, { sender: 'user', text: `(Image Uploaded)` }]);
        await handleSend(message);
      } catch (error) {
        setMessages(prev => [...prev, { sender: 'bot', text: text.imageError }]);
      } finally {
        setImageFile(null);
        setImagePreview(null);
        setIsLoading(false);
      }
    };

    const QuickReplyButton: React.FC<{ text: string; icon?: React.ReactNode; onClick: () => void }> = ({ text, icon, onClick }) => (
      <button onClick={onClick} disabled={isLoading} className="flex-1 flex flex-col items-center justify-center p-2 bg-white/80 dark:bg-gray-700/80 rounded-lg text-center text-sm disabled:opacity-50 hover:bg-red-100 dark:hover:bg-red-800/80 transition-all shadow-sm hover:shadow-md">
          {icon}
          <span className="mt-1 font-semibold">{text}</span>
      </button>
  );

    return (
        <div className="flex flex-col h-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                 {imagePreview && <div className="flex justify-end"><img src={imagePreview} alt="upload preview" className="max-h-40 rounded-lg mb-2 shadow-md"/></div>}
                {isLoading && <div className="flex justify-start"><div className="px-4 py-3 rounded-2xl shadow-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">...</div></div>}
            </div>
            
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-900/30">
                <div className="flex space-x-2 mb-3 text-gray-800 dark:text-gray-200">
                    <QuickReplyButton text={text.someoneBleeding} onClick={() => handleSend(text.someoneBleeding)} />
                    <QuickReplyButton text={text.fireHazard} onClick={() => handleSend(text.fireHazard)} />
                    <QuickReplyButton text={text.structuralDamage} onClick={() => handleSend(text.structuralDamage)} />
                </div>
                 <div className="flex items-center space-x-2 mb-3">
                    <input type="file" id="help-file-upload" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden"/>
                    <label htmlFor="help-file-upload" className="flex-1 text-center px-4 py-2 bg-gray-200 dark:bg-gray-700 font-semibold rounded-lg shadow-sm cursor-pointer hover:shadow-md transition">
                        {imageFile ? imageFile.name : text.uploadPhoto}
                    </label>
                    <button onClick={handleImageAnalysisAndSend} disabled={!imageFile || isLoading} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg disabled:from-gray-400">
                      {text.send}
                    </button>
                 </div>
                <div className="flex">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend(input)} placeholder={text.yourTurn} className="flex-1 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-red-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-inner" />
                    <button onClick={handleMicToggle} className={`px-4 py-3 ${isListening ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'} text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg transition-all`}>
                        {isListening ? <MicrophoneOffIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
                    </button>
                    <button onClick={() => handleSend(input)} disabled={isLoading} className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-r-lg shadow-md hover:shadow-lg disabled:from-gray-400 transition-shadow">{text.send}</button>
                </div>
            </div>
        </div>
    );
};

const SummaryPage: React.FC<{ lang: Language; data: ReportData; onConfirm: () => void; onEdit: () => void; }> = ({ lang, data, onConfirm, onEdit }) => {
  const text = UI_TEXT[lang];
  const isPersonData = (d: ReportData): d is PersonData => 'name' in d;

  return (
    <div className="flex items-center justify-center h-full">
        <Card>
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">{text.summaryTitle}</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">{text.summaryIntro}</p>
            <div className="space-y-4 text-gray-800 dark:text-gray-200">
              {isPersonData(data) ? (
                <>
                  <div className="flex justify-between text-lg"><strong>{text.name}:</strong> <span>{data.name || 'N/A'}</span></div>
                  <div className="flex justify-between text-lg"><strong>{text.age}:</strong> <span>{data.age || 'N/A'}</span></div>
                  <div className="flex justify-between text-lg"><strong>{text.location}:</strong> <span>{data.location || 'N/A'}</span></div>
                  <div><strong className="text-lg">{text.needs}:</strong> <div className="text-right text-lg">{data.needs?.join(', ') || 'N/A'}</div></div>
                  <div><strong className="text-lg">{text.injuryDetails}:</strong> <p className="text-md text-gray-600 dark:text-gray-400 mt-1">{data.injuryDetails || 'N/A'}</p></div>
                  <div><strong className="text-lg">{text.photoAnalysis}:</strong> <p className="text-md text-gray-600 dark:text-gray-400 mt-1">{data.photoAnalysis || 'N/A'}</p></div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-lg"><strong>{text.volunteerName}:</strong> <span>{data.volunteerName || 'N/A'}</span></div>
                  <div className="flex justify-between text-lg"><strong>{text.location}:</strong> <span>{data.location || 'N/A'}</span></div>
                  <div className="flex justify-between text-lg"><strong>{text.issueType}:</strong> <span>{data.issueType || 'N/A'}</span></div>
                  <div className="flex justify-between text-lg"><strong>{text.urgency}:</strong> <span>{data.urgency || 'N/A'}</span></div>
                  <div><strong className="text-lg">{text.details}:</strong> <p className="text-md text-gray-600 dark:text-gray-400 mt-1">{data.details || 'N/A'}</p></div>
                </>
              )}
            </div>
            <div className="mt-10 flex space-x-4">
              <button onClick={onEdit} className="flex-1 py-3 px-4 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 hover:shadow-lg transition-all">{text.edit}</button>
              <button onClick={onConfirm} className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transition-all">{text.confirm}</button>
            </div>
        </Card>
    </div>
  );
};

const QRCodeDisplay: React.FC<{ lang: Language; data: ReportData; onStartOver: () => void; }> = ({ lang, data, onStartOver }) => {
  const text = UI_TEXT[lang];
  const qrData = JSON.stringify(data);
  const isPersonData = (d: ReportData): d is PersonData => 'name' in d;

  return (
     <div className="flex items-center justify-center h-full">
        <Card>
            <div className="printable-content text-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 print:text-black">{text.qrTitle}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 print:hidden">{text.qrInstruction}</p>
              <div className="p-4 bg-white inline-block rounded-lg shadow-inner">
                <QRCodeSVG value={qrData} size={256} level="H" />
              </div>
              <div className="mt-4 text-left hidden print:block text-black">
                <h3 className="text-xl font-bold mb-2">{text.summaryTitle}</h3>
                {isPersonData(data) ? (
                  <>
                    <p><strong>{text.name}:</strong> {data.name}</p>
                    <p><strong>{text.age}:</strong> {data.age}</p>
                    <p><strong>{text.location}:</strong> {data.location}</p>
                    <p><strong>{text.needs}:</strong> {data.needs?.join(', ')}</p>
                    <p><strong>{text.injuryDetails}:</strong> {data.injuryDetails}</p>
                    <p><strong>{text.photoAnalysis}:</strong> {data.photoAnalysis}</p>
                  </>
                ) : (
                  <>
                    <p><strong>{text.volunteerName}:</strong> {data.volunteerName}</p>
                    <p><strong>{text.location}:</strong> {data.location}</p>
                    <p><strong>{text.issueType}:</strong> {data.issueType}</p>
                    <p><strong>{text.urgency}:</strong> {data.urgency}</p>
                    <p><strong>{text.details}:</strong> {data.details}</p>
                  </>
                )}
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 print:hidden">
              <button onClick={() => window.print()} className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all">{text.printReport}</button>
              <button onClick={onStartOver} className="flex-1 py-3 px-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all">{text.startOver}</button>
            </div>
            <style>{` @media print { body * { visibility: hidden; } .printable-content, .printable-content * { visibility: visible; } .printable-content { position: absolute; left: 0; top: 0; width: 100%; } } `}</style>
        </Card>
    </div>
  );
};

const FindHospitals: React.FC<{ lang: Language; }> = ({ lang }) => {
    const text = UI_TEXT[lang];
    const [hospitals, setHospitals] = useState<HospitalData[]>([]);
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
    const [statusMessage, setStatusMessage] = useState(text.gettingLocation);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setStatusMessage(text.findingHospitals);
                    try {
                        const hospitalData = await GeminiService.findNearbyHospitals(position.coords.latitude, position.coords.longitude);
                        setHospitals(hospitalData);
                        setStatus('success');
                    } catch (err) {
                        setStatusMessage(text.error);
                        setStatus('error');
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setStatusMessage(text.locationError);
                    setStatus('error');
                }
            );
        } else {
            setStatusMessage(text.locationError);
            setStatus('error');
        }
    }, [lang, text]);

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <h2 className="text-3xl font-bold text-center mb-6">{text.nearbyHospitals}</h2>
            {status === 'loading' && (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p>{statusMessage}</p>
                </div>
            )}
            {status === 'error' && <p className="text-red-500 text-center">{statusMessage}</p>}
            {status === 'success' && (
                <div className="w-full max-w-2xl space-y-4">
                    {hospitals.length > 0 ? hospitals.map((hospital, index) => (
                        <div key={index} className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg shadow-md flex items-center justify-between">
                            <p className="font-bold text-lg">{hospital.name}</p>
                            <a href={hospital.mapsUri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
                                <DirectionsIcon className="w-5 h-5 mr-2" />
                                {text.directions}
                            </a>
                        </div>
                    )) : <p className="text-center">{text.error}</p>}
                </div>
            )}
        </div>
    );
};

const EmergencyChatWindow: React.FC<{ lang: Language, onComplete: () => void }> = ({ lang, onComplete }) => {
    const text = UI_TEXT[lang];
    const [stage, setStage] = useState(0); // 0: initial question, 1: confirmation, 2: calling, 3: cancelled
    const [statusText, setStatusText] = useState(text.listening);
    const { transcript, startListening, stopListening, setTranscript } = useSpeechRecognition(lang);

    useEffect(() => {
        // Stage 0: Ask initial question
        if (stage === 0) {
            speak(text.emergencyQuestion1, lang);
            startListening();
        }
    }, [stage, lang, text.emergencyQuestion1, startListening]);

    useEffect(() => {
        if (!transcript) return;

        const affirmative = transcript.toLowerCase().includes('yes') || transcript.toLowerCase().includes('हाँ');
        const negative = transcript.toLowerCase().includes('no') || transcript.toLowerCase().includes('नहीं');

        if (stage === 0) {
            if (affirmative) {
                setTranscript('');
                stopListening();
                setStage(1); // Move to confirmation stage
                speak(text.emergencyQuestion2, lang);
                startListening();
            } else if (negative) {
                stopListening();
                setStatusText(text.emergencyCancelled);
                setTimeout(onComplete, 2000);
            }
        } else if (stage === 1) {
            if (affirmative) {
                stopListening();
                setStage(2); // Move to calling stage
                setStatusText(text.callingForHelp);
                window.location.href = `tel:${EMERGENCY_CONTACTS[0].number}`;
                setTimeout(onComplete, 3000); // Go back after initiating call
            } else if (negative) {
                stopListening();
                setStatusText(text.emergencyCancelled);
                setTimeout(onComplete, 2000);
            }
        }
    }, [transcript, stage, lang, text.emergencyQuestion2, onComplete, setTranscript, startListening, stopListening, text.callingForHelp, text.emergencyCancelled]);

    return (
        <div className="fixed inset-0 bg-red-900/90 backdrop-blur-lg flex flex-col items-center justify-center z-50">
            <div className="animate-ping absolute inline-flex h-64 w-64 rounded-full bg-red-400 opacity-75"></div>
            <EmergencyIcon className="w-32 h-32 text-white mb-8" />
            <p className="text-4xl font-bold text-white text-center drop-shadow-lg">{statusText}</p>
            <p className="text-xl text-white/80 mt-4 text-center">{transcript}</p>
             <button onClick={onComplete} className="mt-12 px-6 py-3 bg-white/20 text-white font-semibold rounded-lg shadow-md hover:bg-white/40 transition-colors">
                {text.emergencyCancelled}
            </button>
        </div>
    );
};


const AccessibilityMenu: React.FC<{
    lang: Language;
    isTtsEnabled: boolean;
    onTtsToggle: () => void;
    isSttEnabled: boolean;
    onSttToggle: () => void;
    onEmergency: () => void;
}> = ({ lang, isTtsEnabled, onTtsToggle, isSttEnabled, onSttToggle, onEmergency }) => {
    const text = UI_TEXT[lang];
    const [isOpen, setIsOpen] = useState(false);

    const Toggle: React.FC<{label: string, enabled: boolean, onToggle: () => void, icon: React.ReactNode}> = ({label, enabled, onToggle, icon}) => (
        <button onClick={onToggle} className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div className="flex items-center">
                {icon}
                <span className="ml-3 font-semibold">{label}</span>
            </div>
            <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
            </div>
        </button>
    );

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 w-72 mb-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-lg mb-3 px-2">{text.accessibility}</h3>
                    <div className="space-y-2">
                        <Toggle label={text.textToSpeech} enabled={isTtsEnabled} onToggle={onTtsToggle} icon={<TextToSpeechIcon className="w-6 h-6" />} />
                        <Toggle label={text.speechToText} enabled={isSttEnabled} onToggle={onSttToggle} icon={<SpeechToTextIcon className="w-6 h-6" />} />
                    </div>
                     <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button onClick={onEmergency} className="flex items-center w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md animate-pulse">
                            <EmergencyIcon className="w-6 h-6" />
                            <span className="ml-3 font-bold">{text.emergencySOS}</span>
                        </button>
                    </div>
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all"
                aria-label={text.accessibility}
            >
                <AccessibilityIcon className="w-8 h-8" />
            </button>
        </div>
    );
};


export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.LanguageSelect);
  const [language, setLanguage] = useState<Language>('en');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [scannedData, setScannedData] = useState<ReportData | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return 'dark';
        }
    }
    return 'light';
  });

  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [isSttEnabled, setIsSttEnabled] = useState(false);


  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setStep(AppStep.Dashboard);
  };
  
  const handleDashboardAction = (selectedStep: AppStep) => {
     if (selectedStep === AppStep.Chat) {
      setStep(AppStep.RoleSelect);
    } else {
      setStep(selectedStep);
    }
  };
  
  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    setStep(AppStep.Chat);
  };

  const handleChatComplete = (data: ReportData) => {
    setReportData(data);
    setStep(AppStep.Summary);
  };
  
  const handleSummaryConfirm = () => {
    setStep(AppStep.QRCode);
  };
  
  const handleEdit = () => {
    setStep(AppStep.Chat);
  };

  const handleStartOver = () => {
    setReportData(null);
    setScannedData(null);
    setUserRole(null);
    setStep(AppStep.LanguageSelect);
  };

  const handleBackToDashboard = () => {
    setStep(AppStep.Dashboard);
    setScannedData(null);
  };

  const handleScanComplete = (data: ReportData) => {
    setScannedData(data);
    setStep(AppStep.DisplayScannedData);
  };

  const renderStep = () => {
    switch (step) {
      case AppStep.LanguageSelect:
        return <LanguageSelector onSelect={handleLanguageSelect} />;
      case AppStep.Dashboard:
        return <Dashboard lang={language} onActionSelect={handleDashboardAction} />;
      case AppStep.RoleSelect:
        return <RoleSelector lang={language} onSelect={handleRoleSelect} />;
      case AppStep.Chat:
        if (userRole === null) return <RoleSelector lang={language} onSelect={handleRoleSelect} />;
        return <ChatWindow lang={language} role={userRole} onComplete={handleChatComplete} isTtsEnabled={isTtsEnabled} />;
      case AppStep.Summary:
         if (!reportData) return <Dashboard lang={language} onActionSelect={handleDashboardAction} />;
        return <SummaryPage lang={language} data={reportData} onConfirm={handleSummaryConfirm} onEdit={handleEdit} />;
      case AppStep.QRCode:
        if (!reportData) return <Dashboard lang={language} onActionSelect={handleDashboardAction} />;
        return <QRCodeDisplay lang={language} data={reportData} onStartOver={handleStartOver} />;
      case AppStep.ScanQR:
        return <QRScanner lang={language} onScanComplete={handleScanComplete} />;
      case AppStep.DisplayScannedData:
        return scannedData ? <ScannedDataDisplay lang={language} data={scannedData} /> : <Dashboard lang={language} onActionSelect={handleDashboardAction} />;
      case AppStep.AnalyzeImage:
        return <ImageAnalyzer lang={language} />;
      case AppStep.FindHospitals:
        return <FindHospitals lang={language} />;
      case AppStep.GetHelp:
        return <HelpChatWindow lang={language} isTtsEnabled={isTtsEnabled} />;
      case AppStep.EmergencyChat:
        return <EmergencyChatWindow lang={language} onComplete={handleBackToDashboard} />;
      default:
        return <LanguageSelector onSelect={handleLanguageSelect} />;
    }
  };

  return (
    <main className="container mx-auto p-2 sm:p-4 h-screen max-h-screen text-gray-800 dark:text-gray-200 relative">
      <Header 
        lang={language}
        showBackButton={step !== AppStep.LanguageSelect && step !== AppStep.Dashboard && step !== AppStep.EmergencyChat}
        onBack={handleBackToDashboard}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      {step !== AppStep.LanguageSelect && step !== AppStep.EmergencyChat && (
        <AccessibilityMenu
            lang={language}
            isTtsEnabled={isTtsEnabled}
            onTtsToggle={() => setIsTtsEnabled(!isTtsEnabled)}
            isSttEnabled={isSttEnabled}
            onSttToggle={() => setIsSttEnabled(!isSttEnabled)}
            onEmergency={() => setStep(AppStep.EmergencyChat)}
        />
      )}
      <div className="h-full pt-16 sm:pt-20">
        {renderStep()}
      </div>
    </main>
  );
}
