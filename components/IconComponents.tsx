import React from 'react';

export const ReliefQRLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" opacity="0.3"/>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

export const WaterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 2.454.918 4.745 2.44 6.526a.75.75 0 0 0 1.22-.826A8.25 8.25 0 0 1 4.5 12c0-4.53 3.67-8.25 8.25-8.25s8.25 3.67 8.25 8.25c0 1.121-.226 2.193-.644 3.163a.75.75 0 0 0 1.22.826c1.522-1.78 2.44-4.072 2.44-6.526C21.75 6.615 17.385 2.25 12 2.25Z" />
    <path fillRule="evenodd" d="M12 21a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-1.5 0v2.25c0 .414.336.75.75.75Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12 15.75a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);

export const FoodIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.012 2.25c4.956 0 8.988 4.032 8.988 8.988 0 4.956-4.032 8.988-8.988 8.988-4.956 0-8.988-4.032-8.988-8.988 0-4.956 4.032-8.988 8.988-8.988ZM12.012 3.75a7.488 7.488 0 1 0 0 14.976 7.488 7.488 0 0 0 0-14.976Z" />
    <path d="M12.012 7.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1 0-1.5h2.25V8.25a.75.75 0 0 1 .75-.75Z" />
  </svg>
);

export const InjuryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0V9Zm-1.5 9.75a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
  </svg>
);

export const ShelterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.69Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
  </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 9a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" />
        <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.426 1.458 2.426 2.91v8.636c0 1.452-.994 2.67-2.426 2.91a48.778 48.778 0 0 1-1.152.177c-.465.067-.87.327-1.11.71l-.82 1.317a3.25 3.25 0 0 1-2.332-1.39 49.52 49.52 0 0 1-5.312 0 3.25 3.25 0 0 1-2.332-1.39l-.82-1.317a1.75 1.75 0 0 0-1.11-.71 48.775 48.775 0 0 1-1.152-.177c-1.432-.239-2.426-1.458-2.426-2.91V8.636c0 1.452.994 2.67 2.426 2.91a48.775 48.775 0 0 1 1.152-.177c.465-.067.87-.327 1.11-.71l.82-1.317A3.25 3.25 0 0 1 9.344 3.07Z" clipRule="evenodd" />
    </svg>
);

export const GenerateReportIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-1.498.07c-.42-1.583-1.926-2.675-3.752-2.675h-7.5c-1.826 0-3.331 1.092-3.752 2.675a.75.75 0 0 1-1.498-.071Z" clipRule="evenodd" />
    <path d="M16.5 8.25a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM16.5 12a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z" />
  </svg>
);

export const ScanQRIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h6v6H3V3Zm2 2v2h2V5H5Z" />
    <path d="M3 15h6v6H3v-6Zm2 2v2h2v-2H5Z" />
    <path d="M15 3h6v6h-6V3Zm2 2v2h2V5h-2Z" />
    <path d="M15 15h6v6h-6v-6Zm2 2v2h2v-2h-2Z" />
    <path d="M11 3h2v8h-2V3Z" />
    <path d="M11 13h2v8h-2v-8Z" />
  </svg>
);


export const AnalyzeImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875-1.875H3.375A1.875 1.875 0 0 1 1.5 17.625V6.375ZM3 15.375v2.25A1.875 1.875 0 0 0 4.875 19.5h14.25A1.875 1.875 0 0 0 21 17.625v-2.25l-2.09-2.09a.75.75 0 0 0-1.06 0l-3.375 3.375-1.5-1.5a.75.75 0 0 0-1.06 0l-3.75 3.75a.75.75 0 0 0 0 1.06l1.5 1.5a.75.75 0 0 0 1.06 0l2.25-2.25 3.375-3.375a.75.75 0 0 0-1.06-1.06l-1.72 1.72-2.625-2.625a.75.75 0 0 0-1.06 0L3 15.375Z" clipRule="evenodd" />
        <path d="M10.5 7.5a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" />
    </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.981A10.503 10.503 0 0 1 12 22.5a10.5 10.5 0 0 1-10.5-10.5c0-4.308 2.54-8.024 6.362-9.668a.75.75 0 0 1 .819.162Z" clipRule="evenodd" />
    </svg>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.106a.75.75 0 0 1 0 1.06l-1.591 1.592a.75.75 0 0 1-1.06-1.061l1.591-1.591a.75.75 0 0 1 1.06 0ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 .75.75ZM17.803 17.803a.75.75 0 0 1-1.06 0l-1.591-1.591a.75.75 0 0 1 1.06-1.06l1.591 1.591a.75.75 0 0 1 0 1.06ZM12 21a.75.75 0 0 1-.75-.75v-2.25a.75.75 0 0 1 1.5 0v2.25a.75.75 0 0 1-.75.75ZM7.258 17.803a.75.75 0 0 1-1.06-1.06l1.591-1.591a.75.75 0 1 1 1.06 1.06l-1.591 1.591ZM6.106 5.106a.75.75 0 0 1 1.06 0l1.591 1.592a.75.75 0 0 1-1.06 1.06L6.106 6.166a.75.75 0 0 1 0-1.06ZM3 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Z" />
    </svg>
);

export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.29-.073.43l.09.142a11.25 11.25 0 0 0 6.314 6.314l.142.09c.14.09.329.062.43-.073l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.819V19.5a3 3 0 0 1-3 3h-2.25C6.55 22.5 1.5 17.45 1.5 10.5V8.25a3 3 0 0 1 3-3H6Z" clipRule="evenodd" />
    </svg>
);

export const HospitalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
    </svg>
);

export const DirectionsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634h5.25c.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866s-.059-.605-.189-.866c-.108-.215-.395-.634-.936-.634h-5.25Zm0 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634h5.25c.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866s-.059-.605-.189-.866c-.108-.215-.395-.634-.936-.634h-5.25Z" clipRule="evenodd" />
    </svg>
);

export const HelpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 1.5a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5ZM12 6a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm0 1.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Z" clipRule="evenodd" />
        <path d="M5.106 5.106a.75.75 0 0 1 1.06 0l1.25 1.25a.75.75 0 1 1-1.06 1.06l-1.25-1.25a.75.75 0 0 1 0-1.06Zm12.728 12.728a.75.75 0 0 1 1.06 0l1.25 1.25a.75.75 0 1 1-1.06 1.06l-1.25-1.25a.75.75 0 0 1 0-1.06ZM5.106 18.894a.75.75 0 0 1 0-1.06l1.25-1.25a.75.75 0 0 1 1.06 1.06l-1.25 1.25a.75.75 0 0 1-1.06 0ZM18.894 5.106a.75.75 0 0 1 0 1.06l-1.25 1.25a.75.75 0 0 1-1.06-1.06l1.25-1.25a.75.75 0 0 1 1.06 0Z" />
    </svg>
);

export const AccessibilityIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.25a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Z" />
        <path fillRule="evenodd" d="M12 6a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 12 6Zm0 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75A.75.75 0 0 1 12 9Zm0 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75A.75.75 0 0 1 12 12Zm0 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75A.75.75 0 0 1 12 15Zm0 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75A.75.75 0 0 1 12 18Zm0 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V21.75A.75.75 0 0 1 12 21Z" clipRule="evenodd" />
        <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.063 12a7.937 7.937 0 0 1 7.937-7.937V12H4.063Zm0 0V12a7.937 7.937 0 0 1 7.937 7.937V12H4.063Z" />
    </svg>
);

export const TextToSpeechIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M11.72 2.22a.75.75 0 0 1 .56 1.25l-2.128 3.039a.75.75 0 0 1-1.12 0L6.904 3.47a.75.75 0 0 1 .56-1.25h4.256ZM13.828 2.5a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0V3.25a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
        <path d="M10.5 13.5a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
        <path fillRule="evenodd" d="M3 8.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 8.25Zm0 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 3a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
        <path d="M17.25 14.25a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Z" />
        <path fillRule="evenodd" d="M15.75 18a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H16.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
);

export const SpeechToTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
        <path d="M6 10.5a.75.75 0 0 1 .75.75v.75a4.5 4.5 0 0 0 9 0v-.75a.75.75 0 0 1 1.5 0v.75a6 6 0 1 1-12 0v-.75a.75.75 0 0 1 .75-.75Z" />
    </svg>
);

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
        <path d="M6 10.5a.75.75 0 0 1 .75.75v.75a4.5 4.5 0 0 0 9 0v-.75a.75.75 0 0 1 1.5 0v.75a6 6 0 1 1-12 0v-.75a.75.75 0 0 1 .75-.75Z" />
    </svg>
);

export const MicrophoneOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
        <path d="M6 10.5a.75.75 0 0 1 .75.75v.75a4.5 4.5 0 0 0 9 0v-.75a.75.75 0 0 1 1.5 0v.75a6 6 0 1 1-12 0v-.75a.75.75 0 0 1 .75-.75Z" />
        <path fillRule="evenodd" d="M2.543 3.543a.75.75 0 0 1 1.06 0l17.854 17.854a.75.75 0 1 1-1.06 1.06L2.543 4.603a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

export const EmergencyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0V6Z" clipRule="evenodd" />
        <path d="M12 15a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008a.75.75 0 0 1 .75-.75Z" />
    </svg>
);