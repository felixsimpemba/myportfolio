export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  professionalTitle?: string;
  professionalCategory?: string;
  location?: string;
  website?: string;
  cvFile?: string;
  cvFileName?: string;
  cvFileSize?: number;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLinks;
}

export interface ContactInfo {
  phone?: string;
  alternativeEmail?: string;
  address?: string;
  timezone?: string;
  availability?: string;
  preferredContactMethod?: 'email' | 'phone' | 'linkedin' | 'website';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  behance?: string;
  dribbble?: string;
  youtube?: string;
  tiktok?: string;
  custom?: { name: string; url: string }[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language' | 'Creative' | 'Business' | 'Other';
  yearsOfExperience?: number;
  lastUsed?: string;
  proficiency?: number; // 1-100 percentage
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  githubLink?: string;
  demoLink?: string;
  featured: boolean;
  category?: 'development' | 'design' | 'writing' | 'marketing' | 'consulting' | 'art' | 'education' | 'business' | 'other';
  tags?: string[];
  startDate?: string;
  endDate?: string;
  status?: 'completed' | 'in-progress' | 'planned' | 'on-hold';
}

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  layout: 'minimal' | 'cards' | 'dark' | 'modern';
}

export interface PortfolioData {
  user: User;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  theme: Theme;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

// Firebase-specific types
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface FirestoreDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface PortfolioDocument extends FirestoreDocument {
  user: User;
  theme: Theme;
  professionalCategory: string;
  isPublic: boolean;
  seoTitle?: string;
  seoDescription?: string;
  customSections?: CustomSection[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'gallery' | 'testimonial' | 'achievement';
  order: number;
  isVisible: boolean;
}

export interface ProfessionalAsset extends FirestoreDocument {
  type: 'cv' | 'portfolio' | 'certificate' | 'award' | 'publication' | 'video' | 'other';
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  isPublic: boolean;
  order: number;
}

export interface ProjectDocument extends FirestoreDocument {
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  githubLink?: string;
  demoLink?: string;
  featured: boolean;
}

export interface ExperienceDocument extends FirestoreDocument {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

export interface EducationDocument extends FirestoreDocument {
  school: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
  description?: string;
}

export interface SkillDocument extends FirestoreDocument {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language' | 'Other';
}


