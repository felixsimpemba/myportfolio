'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouting } from '@/lib/useRouting';
import { useAuth } from '@/lib/AuthContext';
import {
  getDashboardStats,
  getRecentActivities,
} from '@/lib/firestore';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderOpen, 
  Palette,
  Eye,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Star
} from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { PortfolioDocument, ProjectDocument, EducationDocument, ExperienceDocument, SkillDocument } from '@/types';

export default function DashboardPage() {
  const { navigate } = useRouting();
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [statsResult, activitiesResult] = await Promise.all([
            getDashboardStats(user.uid),
            getRecentActivities(user.uid),
          ]);

          setDashboardData(statsResult.data);
          setRecentActivities(activitiesResult.data || []);

        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const stats = dashboardData ? [
    { name: 'Profile Info', value: dashboardData.profile ? 'Complete' : 'Incomplete', icon: User, color: 'text-emerald-600', bgColor: 'from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50', progress: dashboardData.stats.profileComplete },
    { name: 'Experience', value: `${dashboardData.experiences.length} entries`, icon: Briefcase, color: 'text-blue-600', bgColor: 'from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50', progress: dashboardData.stats.experienceComplete },
    { name: 'Education', value: `${dashboardData.educations.length} entries`, icon: GraduationCap, color: 'text-purple-600', bgColor: 'from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50', progress: dashboardData.stats.educationComplete },
    { name: 'Skills', value: `${dashboardData.skills.length} skills`, icon: Code, color: 'text-orange-600', bgColor: 'from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50', progress: dashboardData.stats.skillsComplete },
    { name: 'Projects', value: `${dashboardData.projects.length} projects`, icon: FolderOpen, color: 'text-pink-600', bgColor: 'from-pink-100 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50', progress: dashboardData.stats.projectsComplete },
    { name: 'Theme', value: 'Customizable', icon: Palette, color: 'text-indigo-600', bgColor: 'from-indigo-100 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50', progress: dashboardData.stats.themeComplete },
  ] : [];

  // Recent activities are now loaded from the API

  const portfolioProgress = dashboardData ? dashboardData.stats.overallComplete : 0;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Welcome to your
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 bg-clip-text text-transparent">
                  Professional Dashboard
                </span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
                Build and manage your professional portfolio
              </p>
            </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={() => navigate(`/portfolio/${user?.uid}`)}
            className="flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-300"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview Portfolio
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.name} 
            className="group relative p-4 sm:p-6 border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/50 dark:from-emerald-900/20 dark:via-transparent dark:to-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor} group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/25`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color} group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300`} />
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">{stat.name}</p>
                  <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">{stat.value}</p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-emerald-500/25" 
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{stat.progress}% Complete</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <Card className="group relative border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/50 dark:from-emerald-900/20 dark:via-transparent dark:to-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard/profile')}
                className="w-full justify-start border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
              >
                <User className="h-4 w-4 mr-2" />
                Complete Profile
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard/experience')}
                className="w-full justify-start border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Add Work Experience
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard/skills')}
                className="w-full justify-start border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
              >
                <Code className="h-4 w-4 mr-2" />
                Add Skills
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard/projects')}
                className="w-full justify-start border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Showcase Work
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard/theme')}
                className="w-full justify-start border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
              >
                <Palette className="h-4 w-4 mr-2" />
                Customize Design
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="group relative border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-transparent to-emerald-50/50 dark:from-teal-900/20 dark:via-transparent dark:to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/50 dark:to-emerald-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Star className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 group/item">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 dark:text-slate-200 group-hover/item:text-slate-900 dark:group-hover/item:text-slate-100 transition-colors duration-300">
                        <span className="font-medium">{activity.title}</span>
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-300 transition-colors duration-300">{activity.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 group-hover/item:text-slate-600 dark:group-hover/item:text-slate-400 transition-colors duration-300">{timeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity.</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Portfolio Progress */}
      <Card className="group relative border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/50 dark:from-amber-900/20 dark:via-transparent dark:to-orange-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">Portfolio Progress</h3>
            </div>
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
              <TrendingUp className="h-4 w-4 mr-1" />
              {portfolioProgress}% Complete
            </div>
          </div>
          
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 h-3 rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-amber-500/25" style={{ width: `${portfolioProgress}%` }}></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-sm">
            <div className="flex items-center group/item">
              <div className={`h-2 w-2 rounded-full mr-2 group-hover/item:scale-125 transition-transform duration-300 ${stats[0].progress === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}></div>
              <span className="text-slate-600 dark:text-slate-400 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-300 transition-colors duration-300">Profile</span>
            </div>
            <div className="flex items-center group/item">
              <div className={`h-2 w-2 rounded-full mr-2 group-hover/item:scale-125 transition-transform duration-300 ${stats[1].progress > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}></div>
              <span className="text-slate-600 dark:text-slate-400 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-300 transition-colors duration-300">Experience</span>
            </div>
            <div className="flex items-center group/item">
              <div className={`h-2 w-2 rounded-full mr-2 group-hover/item:scale-125 transition-transform duration-300 ${stats[3].progress > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}></div>
              <span className="text-slate-600 dark:text-slate-400 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-300 transition-colors duration-300">Skills</span>
            </div>
            <div className="flex items-center group/item">
              <div className={`h-2 w-2 rounded-full mr-2 group-hover/item:scale-125 transition-transform duration-300 ${stats[4].progress > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}></div>
              <span className="text-slate-600 dark:text-slate-400 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-300 transition-colors duration-300">Projects</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
