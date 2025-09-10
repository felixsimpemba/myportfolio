'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';
import { useAuth } from '@/lib/AuthContext';
import { getCollection } from '@/lib/firestore';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Mail, 
  MapPin, 
  ExternalLink,
  Download,
  Share2,
  Star,
  Calendar,
  Building,
  GraduationCap,
  Code
} from 'lucide-react';

interface PortfolioProfile {
  name: string;
  role?: string;
  bio?: string;
  location?: string;
  website?: string;
  email?: string;
  profilePicture?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

interface PortfolioSkill {
  name: string;
  level: string;
  category: string;
}

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  demoLink?: string;
  featured: boolean;
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
  school: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
  description: string;
}

export default function PortfolioPage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<PortfolioProfile | null>(null);
  const [experience, setExperience] = useState<PortfolioExperience[]>([]);
  const [education, setEducation] = useState<PortfolioEducation[]>([]);
  const [skills, setSkills] = useState<PortfolioSkill[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all portfolio data from Firestore
  useEffect(() => {
    const loadPortfolioData = async () => {
      if (!authUser) return;
      
      setLoading(true);
      try {
        // Load profile data
        const { data: profilesData } = await getCollection('profiles', [
          { field: 'userId', operator: '==', value: authUser.uid }
        ]);
        
        if (profilesData && profilesData.length > 0) {
          setProfile(profilesData[0] as unknown as PortfolioProfile);
        } else {
          // Fallback to auth user data
          setProfile({
            name: authUser.displayName || 'User',
            role: 'Developer',
            bio: 'Welcome to my portfolio!',
            email: authUser.email || undefined,
            profilePicture: authUser.photoURL || undefined,
            socialLinks: {}
          });
        }

        // Load experience data
        const { data: experienceData } = await getCollection('experiences', [
          { field: 'userId', operator: '==', value: authUser.uid }
        ]);
        setExperience((experienceData as PortfolioExperience[]) || []);

        // Load education data
        const { data: educationData } = await getCollection('educations', [
          { field: 'userId', operator: '==', value: authUser.uid }
        ]);
        setEducation((educationData as PortfolioEducation[]) || []);

        // Load skills data
        const { data: skillsData } = await getCollection('skills', [
          { field: 'userId', operator: '==', value: authUser.uid }
        ]);
        setSkills((skillsData as unknown as PortfolioSkill[]) || []);

        // Load projects data
        const { data: projectsData } = await getCollection('projects', [
          { field: 'userId', operator: '==', value: authUser.uid }
        ]);
        setProjects((projectsData as PortfolioProject[]) || []);

      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, [authUser]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Intermediate':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Beginner':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isAuthenticated={true} user={authUser ? { name: authUser.displayName || 'User', profilePicture: authUser.photoURL || undefined } : undefined} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="animate-pulse">
              <div className="h-32 bg-muted rounded-xl mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded-xl"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isAuthenticated={true} user={authUser ? { name: authUser.displayName || 'User', profilePicture: authUser.photoURL || undefined } : undefined} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Portfolio Not Found</h1>
              <p className="text-muted-foreground mb-6">
                Please complete your profile in the dashboard to view your portfolio.
              </p>
              <Button onClick={() => window.location.href = '/dashboard/profile'}>
                Complete Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} user={profile} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <Card className="text-center mb-8">
          <div className="p-8">
            <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
              {profile.profilePicture ? (
                <Image 
                  src={profile.profilePicture} 
                  alt={profile.name || 'Profile'}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-muted-foreground">
                  {profile.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{profile.name}</h1>
            <p className="text-xl text-primary mb-4">{profile.role}</p>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{profile.bio}</p>
            
            <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
              {profile.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profile.location}
                </div>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:text-primary/90"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Website
                </a>
              )}
            </div>
            
            <div className="flex justify-center space-x-4 mb-6">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              )}
              {profile.socialLinks?.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
            </div>
            
            <div className="flex justify-center space-x-3">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download CV
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>

        {/* Skills Section */}
        {skills.length > 0 && (
          <Card className="mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Code className="h-6 w-6 mr-2" />
                Skills
              </h2>
              
              <div className="space-y-6">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-muted-foreground mb-3 capitalize">
                      {category} Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(categorySkills as PortfolioSkill[]).map((skill: PortfolioSkill, index: number) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm ${getLevelColor(skill.level)}`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <Card className="mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Featured Projects</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} hover className="overflow-hidden">
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Project Image</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <div className="flex items-center text-yellow-600">
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {project.demoLink && (
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <Card className="mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Building className="h-6 w-6 mr-2" />
                Experience
              </h2>
              
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-4 border-primary pl-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {exp.role}
                      </h3>
                      <p className="text-muted-foreground font-medium">{exp.company}</p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-3">{exp.description}</p>
                </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <Card className="mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <GraduationCap className="h-6 w-6 mr-2" />
                Education
              </h2>
              
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-muted-foreground font-medium">{edu.school}</p>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {edu.year}
                    {edu.gpa && (
                      <span className="ml-4">GPA: {edu.gpa}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-3">{edu.description}</p>
                </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Contact Section */}
        <Card>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Let&apos;s Connect</h2>
            <p className="text-muted-foreground mb-6">
              I&apos;m always interested in new opportunities and collaborations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              {profile.email && (
                <Button onClick={() => window.location.href = `mailto:${profile.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Get In Touch
                </Button>
              )}
              {profile.socialLinks?.linkedin && (
                <Button 
                  variant="outline"
                  onClick={() => window.open(profile.socialLinks?.linkedin, '_blank')}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  Connect on LinkedIn
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}