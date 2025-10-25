export interface PersonData {
  name: string;
  age: number | null;
  location: string;
  needs: string[];
  injuryDetails: string;
  photoAnalysis: string;
}

export interface VolunteerData {
  volunteerName: string;
  location: string;
  issueType: 'Incident Report' | 'Supply Request' | 'Information Request';
  details: string;
  urgency: 'Low' | 'Medium' | 'High';
}

export type ReportData = PersonData | VolunteerData;

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  isJson?: boolean;
}

export enum UserRole {
  PersonInNeed,
  Volunteer,
}

export enum AppStep {
  LanguageSelect,
  Dashboard,
  RoleSelect,
  Chat,
  Summary,
  QRCode,
  ScanQR,
  DisplayScannedData,
  AnalyzeImage,
  FindHospitals,
  GetHelp,
  EmergencyChat,
}

export enum ChatMode {
  QR,
  Help,
}

export type Language = 'en' | 'hi';

export interface HospitalData {
  name: string;
  mapsUri: string;
}