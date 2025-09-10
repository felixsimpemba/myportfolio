'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { PublicNavbar } from '@/components/ui/PublicNavbar';
import { ProfileImage } from '@/components/ui/ProfileImage';
import { getCollection } from '@/lib/firestore';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Mail, 
  MapPin, 
  ExternalLink,
  Star,
  Building,
  GraduationCap,
  Code,
  Download,
  Phone,
  Globe,
  Calendar,
  Award,
  ChevronRight,
  Heart,
  File
} from 'lucide-react';

interface PortfolioProfile {
  id: string;
  userId?: string;
  name: string;
  professionalTitle?: string;
  professionalCategory?: string;
  bio?: string;
  location?: string;
  website?: string;
  email?: string;
  profilePicture?: string;
  username?: string;
  cvFile?: string;
  cvFileName?: string;
  cvFileSize?: number;
  contactInfo?: {
    phone?: string;
    alternativeEmail?: string;
    address?: string;
    timezone?: string;
    availability?: string;
    preferredContactMethod?: string;
  };
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    behance?: string;
    dribbble?: string;
    youtube?: string;
    tiktok?: string;
    custom?: { name: string; url: string }[];
  };
}

interface PortfolioSkill {
  name: string;
  level: string;
  category: string;
  proficiency?: number;
}

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  demoLink?: string;
  featured: boolean;
  category?: string;
  status?: string;
}

interface PortfolioExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

interface PortfolioEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
  description: string;
}

interface PublicPortfolioPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function PublicPortfolioPage({ params }: PublicPortfolioPageProps) {
  const [username, setUsername] = useState<string>('');
  const [profile, setProfile] = useState<PortfolioProfile | null>(null);
  const [experience, setExperience] = useState<PortfolioExperience[]>([]);
  const [education, setEducation] = useState<PortfolioEducation[]>([]);
  const [skills, setSkills] = useState<PortfolioSkill[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setUsername(resolvedParams.username);
    };
    resolveParams();
  }, [params]);

  // Load portfolio data by username
  useEffect(() => {
    if (!username) return;
    const loadPortfolioData = async () => {
      setLoading(true);
      try {
        // First, find the profile by username
        const { data: profilesData } = await getCollection('profiles', [
          { field: 'username', operator: '==', value: username }
        ]);
        
        if (!profilesData || profilesData.length === 0) {
          setNotFound(true);
          return;
        }

        const userProfile = profilesData[0] as PortfolioProfile;
        setProfile(userProfile);

        // Load all portfolio data for this user
        const userId = userProfile.userId || userProfile.id;

        // Load experience data
        const { data: experienceData } = await getCollection('experiences', [
          { field: 'userId', operator: '==', value: userId }
        ]);
        setExperience((experienceData as PortfolioExperience[]) || []);

        // Load education data
        const { data: educationData } = await getCollection('educations', [
          { field: 'userId', operator: '==', value: userId }
        ]);
        setEducation((educationData as PortfolioEducation[]) || []);

        // Load skills data
        const { data: skillsData } = await getCollection('skills', [
          { field: 'userId', operator: '==', value: userId }
        ]);
        setSkills((skillsData as unknown as PortfolioSkill[]) || []);

        // Load projects data
        const { data: projectsData } = await getCollection('projects', [
          { field: 'userId', operator: '==', value: userId }
        ]);
        setProjects((projectsData as PortfolioProject[]) || []);

        // Load user theme
        const { data: themesData } = await getCollection('themes', [
          { field: 'userId', operator: '==', value: userId }
        ]);
        if (themesData && themesData.length > 0) {
          const theme = themesData[0] as unknown as {
            primaryColor: string;
            secondaryColor: string;
            backgroundColor: string;
            textColor: string;
            accentColor: string;
            fontFamily: string;
          };
          // Apply theme to the page
          const root = document.documentElement;
          root.style.setProperty('--theme-primary', theme.primaryColor);
          root.style.setProperty('--theme-secondary', theme.secondaryColor);
          root.style.setProperty('--theme-background', theme.backgroundColor);
          root.style.setProperty('--theme-text', theme.textColor);
          root.style.setProperty('--theme-accent', theme.accentColor);
          root.style.setProperty('--theme-font', theme.fontFamily);
        }

      } catch (error) {
        console.error('Error loading portfolio:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, [username]);

  const getAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-50 dark:bg-green-900/10 dark:text-green-400';
      case 'busy': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10 dark:text-yellow-400';
      case 'not-available': return 'text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400';
      case 'freelance': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getAvailabilityText = (availability?: string) => {
    switch (availability) {
      case 'available': return 'Available for work';
      case 'busy': return 'Busy but open to opportunities';
      case 'not-available': return 'Not available';
      case 'freelance': return 'Freelance only';
      default: return 'Contact for availability';
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <PublicNavbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="animate-pulse">
              <div className="h-32 bg-white/50 dark:bg-slate-800/50 rounded-3xl mb-4"></div>
              <div className="h-4 bg-white/50 dark:bg-slate-800/50 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-64 bg-white/50 dark:bg-slate-800/50 rounded-3xl"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-64 bg-white/50 dark:bg-slate-800/50 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
    
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Portfolio Not Found</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
                The portfolio you&apos;re looking for doesn&apos;t exist or the username is incorrect.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <PublicNavbar profileName={profile.name} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl mb-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, var(--theme-primary, #10b981) 0%, transparent 50%), radial-gradient(circle at 75% 75%, var(--theme-secondary, #14b8a6) 0%, transparent 50%)`,
            }}></div>
          </div>
          
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative group">
                <div className="relative">
                  <ProfileImage
                  src={profile.profilePicture}
                  alt={profile.name}
                    width={160}
                    height={160}
                    className="w-40 h-40 rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    fallbackText={profile.name}
                  />
                  {/* Professional Category Badge */}
                  {profile.professionalCategory && (
                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 shadow-lg border border-slate-200 dark:border-slate-700">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {profile.professionalCategory}
                  </span>
                </div>
              )}
                </div>
            </div>
            
              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6">
                  <h1 
                    className="text-4xl md:text-5xl font-bold mb-2"
                    style={{ color: 'var(--theme-text, #1f2937)' }}
                  >
                    {profile.name}
                  </h1>
                  {profile.professionalTitle && (
                    <p 
                      className="text-xl md:text-2xl mb-4"
                      style={{ color: 'var(--theme-accent, #6b7280)' }}
                    >
                      {profile.professionalTitle}
                    </p>
                  )}
                  
                  {/* Availability Status */}
                  {profile.contactInfo?.availability && (
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div className={`px-4 py-2 rounded-2xl text-sm font-medium ${getAvailabilityColor(profile.contactInfo.availability)}`}>
                        {getAvailabilityText(profile.contactInfo.availability)}
                      </div>
                    </div>
                  )}
                </div>
            
            {profile.bio && (
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                  {profile.cvFile && (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Button
                        onClick={() => {
                          // Open CV in new tab with proper error handling
                          try {
                            const cvUrl = profile.cvFile;
                            if (cvUrl) {
                              // Check if it's a valid URL
                              if (cvUrl.startsWith('http://') || cvUrl.startsWith('https://')) {
                                window.open(cvUrl, '_blank', 'noopener,noreferrer');
                              } else {
                                console.error('Invalid CV URL:', cvUrl);
                              }
                            }
                          } catch (error) {
                            console.error('Error opening CV:', error);
                          }
                        }}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-6 py-3"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        {profile.cvFileName ? `Download ${profile.cvFileName}` : 'Download CV'}
                      </Button>
                      
                      {/* CV Details */}
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {profile.cvFileSize && (
                          <span className="inline-flex items-center gap-1">
                            <File className="h-4 w-4" />
                            {(profile.cvFileSize / 1024 / 1024).toFixed(1)} MB
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

            {/* Contact Info */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate-600 dark:text-slate-400">
              {profile.location && (
                    <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
                  {profile.contactInfo?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${profile.contactInfo.phone}`} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        {profile.contactInfo.phone}
                      </a>
                </div>
              )}
              {profile.email && (
                    <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                      <a href={`mailto:${profile.email}`} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    Website
                  </a>
                </div>
              )}
                </div>
              </div>
            </div>
          </div>
            </div>

        {/* Social Links Section */}
        {profile.socialLinks && Object.keys(profile.socialLinks).some(key => profile.socialLinks![key as keyof typeof profile.socialLinks]) && (
          <div className="mb-12">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                <Heart className="h-6 w-6 text-red-500" />
                Connect With Me
              </h2>
              <div className="flex flex-wrap gap-4">
                {profile.socialLinks.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-slate-700 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 group hover:scale-105"
                  >
                    <Github className="h-5 w-5" />
                    <span className="font-medium">GitHub</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-all duration-300 group hover:scale-105"
                  >
                    <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-700 dark:text-blue-300">LinkedIn</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {profile.socialLinks.twitter && (
                  <a
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-sky-100 dark:bg-sky-900/20 rounded-2xl hover:bg-sky-200 dark:hover:bg-sky-900/30 transition-all duration-300 group hover:scale-105"
                  >
                    <Twitter className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    <span className="font-medium text-sky-700 dark:text-sky-300">Twitter</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-pink-100 dark:bg-pink-900/20 rounded-2xl hover:bg-pink-200 dark:hover:bg-pink-900/30 transition-all duration-300 group hover:scale-105"
                  >
                    <Instagram className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    <span className="font-medium text-pink-700 dark:text-pink-300">Instagram</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {profile.socialLinks.behance && (
                  <a
                    href={profile.socialLinks.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-all duration-300 group hover:scale-105"
                  >
                    <span className="font-bold text-blue-600 dark:text-blue-400">B</span>
                    <span className="font-medium text-blue-700 dark:text-blue-300">Behance</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {profile.socialLinks.dribbble && (
                  <a
                    href={profile.socialLinks.dribbble}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-pink-100 dark:bg-pink-900/20 rounded-2xl hover:bg-pink-200 dark:hover:bg-pink-900/30 transition-all duration-300 group hover:scale-105"
                  >
                    <span className="font-bold text-pink-600 dark:text-pink-400">D</span>
                    <span className="font-medium text-pink-700 dark:text-pink-300">Dribbble</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {profile.socialLinks.youtube && (
                  <a
                    href={profile.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-red-100 dark:bg-red-900/20 rounded-2xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-all duration-300 group hover:scale-105"
                  >
                    <span className="font-bold text-red-600 dark:text-red-400">YT</span>
                    <span className="font-medium text-red-700 dark:text-red-300">YouTube</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {profile.socialLinks.custom?.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-slate-700 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 group hover:scale-105"
                  >
                    <Globe className="h-5 w-5" />
                    <span className="font-medium">{social.name}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skills Section */}
        {Object.keys(groupedSkills).length > 0 && (
          <div className="mb-12">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-2xl">
                  <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                Skills & Expertise
              </h2>
              <div className="space-y-8">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category} className="group/skill">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
                      <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                      {category} Skills
                      <span className="text-sm font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                        {categorySkills.length}
                      </span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categorySkills.map((skill, index) => (
                        <div
                          key={index}
                          className="group/skill-item p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                          {skill.name}
                        </span>
                            {skill.level && (
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                skill.level === 'Expert' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                                skill.level === 'Advanced' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                skill.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {skill.level}
                              </span>
                            )}
                          </div>
                          {skill.proficiency && (
                            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="mb-12">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/50 dark:to-pink-800/50 rounded-2xl">
                  <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                Featured Work
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {projects.map((project) => (
                  <div key={project.id} className="group/project bg-slate-50 dark:bg-slate-700/50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover/project:text-purple-600 dark:group-hover/project:text-purple-400 transition-colors">
                              {project.title}
                            </h3>
                        {project.featured && (
                              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                                <Star className="h-3 w-3 text-yellow-600 dark:text-yellow-400 fill-current" />
                                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Featured</span>
                              </div>
                            )}
                          </div>
                          {project.category && (
                            <span className="inline-block px-3 py-1 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-full mb-4">
                              {project.category}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.map((tech: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 group/link hover:scale-105"
                          >
                              <Github className="h-4 w-4" />
                              <span className="text-sm font-medium">Code</span>
                              <ChevronRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        )}
                        {project.demoLink && (
                          <a
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-300 group/link hover:scale-105"
                            >
                              <ExternalLink className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Live Demo</span>
                              <ChevronRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </a>
                          )}
                        </div>
                        
                        {project.status && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            project.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                            project.status === 'planned' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {project.status.replace('-', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <div className="mb-12">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 rounded-2xl">
                  <Building className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                Professional Experience
              </h2>
              <div className="space-y-8">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="relative group/exp">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 rounded-2xl flex items-center justify-center group-hover/exp:scale-110 transition-transform duration-300">
                          <Building className="h-7 w-7 text-green-600 dark:text-green-400" />
                        </div>
                        {index < experience.length - 1 && (
                          <div className="w-0.5 h-20 bg-slate-200 dark:bg-slate-700 mx-auto mt-4"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover/exp:text-green-600 dark:group-hover/exp:text-green-400 transition-colors">
                              {exp.role}
                            </h3>
                            <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                              {exp.company}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-0">
                            <Calendar className="h-4 w-4" />
                            <span>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                            {exp.current && (
                              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <div className="mb-12">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/50 dark:to-purple-800/50 rounded-2xl">
                  <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                Education & Certifications
              </h2>
              <div className="space-y-8">
                {education.map((edu, index) => (
                  <div key={edu.id} className="relative group/edu">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/50 dark:to-purple-800/50 rounded-2xl flex items-center justify-center group-hover/edu:scale-110 transition-transform duration-300">
                          <GraduationCap className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        {index < education.length - 1 && (
                          <div className="w-0.5 h-20 bg-slate-200 dark:bg-slate-700 mx-auto mt-4"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover/edu:text-indigo-600 dark:group-hover/edu:text-indigo-400 transition-colors">
                              {edu.degree}
                            </h3>
                            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                              {edu.institution}
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                              {edu.field}
                            </p>
                    </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-0">
                            <Calendar className="h-4 w-4" />
                            <span>{edu.year}</span>
                    {edu.gpa && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Award className="h-4 w-4" />
                                  <span>GPA: {edu.gpa}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                    {edu.description && (
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {edu.description}
                          </p>
                    )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}