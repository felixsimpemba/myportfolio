'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProfileImage } from '@/components/ui/ProfileImage';
import { useAuth } from '@/lib/AuthContext';
import { createDocument, updateDocument, getCollection } from '@/lib/firestore';
import { uploadFile, generateFilePath, validateFileType, validateFileSize, compressImage } from '@/lib/storage';
import { uploadFileToPHP } from '@/lib/phpStorage';
import { User, Mail, MapPin, Globe, Github, Linkedin, Twitter, Instagram, Camera, Sparkles, ArrowRight, CheckCircle, FileText, Phone, Plus, X, Download } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    professionalTitle: '',
    professionalCategory: '',
    bio: '',
    location: '',
    website: '',
    contactInfo: {
      phone: '',
      alternativeEmail: '',
      address: '',
      timezone: '',
      availability: '',
      preferredContactMethod: 'email' as 'email' | 'phone' | 'linkedin' | 'website',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    },
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      behance: '',
      dribbble: '',
      youtube: '',
      tiktok: '',
      custom: [] as { name: string; url: string }[]
    },
  });

  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<{
    url: string | null;
    name: string | null;
    size: number | null;
  }>({ url: null, name: null, size: null });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newCustomSocial, setNewCustomSocial] = useState({ name: '', url: '' });

  // Helper function to detect if URL is from PHP storage
  const isPHPStorageUrl = (url: string) => {
    return url.includes('mentalhealthplatform.org') || url.includes('myportfolioCV');
  };

  const professionalCategories = [
    'Developer', 'Designer', 'Writer', 'Marketer', 'Consultant', 
    'Artist', 'Educator', 'Entrepreneur', 'Manager', 'Sales', 
    'Finance', 'Healthcare', 'Legal', 'Other'
  ];

  const timezones = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00',
    'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00',
    'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00',
    'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+06:00', 'UTC+07:00',
    'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
  ];

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Try to get existing profile by userId
        const { data: profilesData } = await getCollection('profiles', [
          { field: 'userId', operator: '==', value: user.uid }
        ]);
        const profileData = profilesData && profilesData.length > 0 ? profilesData[0] : null;
        
        if (profileData) {
          const profile = profileData as any;
          setFormData({
            name: profile.name || user.displayName || '',
            email: profile.email || user.email || '',
            username: profile.username || '',
            professionalTitle: profile.professionalTitle || profile.role || '',
            professionalCategory: profile.professionalCategory || '',
            bio: profile.bio || '',
            location: profile.location || '',
            website: profile.website || '',
            contactInfo: profile.contactInfo || {
              phone: '',
              alternativeEmail: '',
              address: '',
              timezone: '',
              availability: '',
              preferredContactMethod: 'email',
              emergencyContact: {
                name: '',
                phone: '',
                relationship: ''
              }
            },
            socialLinks: profile.socialLinks || {
              github: '',
              linkedin: '',
              twitter: '',
              instagram: '',
              behance: '',
              dribbble: '',
              youtube: '',
              tiktok: '',
              custom: []
            },
          });
          setProfilePicture(profile.profilePicture || null);
          setCvFile({
            url: profile.cvFile || null,
            name: profile.cvFileName || null,
            size: profile.cvFileSize || null
          });
          setProfileId(profile.id);
        } else {
          // Initialize with user data if no profile exists
          setFormData(prev => ({
            ...prev,
            name: user.displayName || '',
            email: user.email || '',
            username: '',
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) return true;
    
    setCheckingUsername(true);
    try {
      const { data: existingProfiles } = await getCollection('profiles', [
        { field: 'username', operator: '==', value: username }
      ]);
      
      // Check if username is taken by someone else (not current user)
      const isAvailable = !existingProfiles || existingProfiles.length === 0 || 
        (existingProfiles.length === 1 && (existingProfiles[0] as unknown as { userId: string }).userId === user?.uid);
      
      return isAvailable;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value,
        },
      }));
    } else if (name.startsWith('contactInfo.')) {
      const contactKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [contactKey]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Check username availability
    if (name === 'username' && value.length >= 3) {
      const isAvailable = await checkUsernameAvailability(value);
      if (!isAvailable) {
        setErrors(prev => ({ ...prev, username: 'Username is already taken' }));
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      console.log('Starting image upload:', file.name, file.size, file.type);
      
      // Clear previous errors
      setErrors(prev => ({ ...prev, profilePicture: '' }));
      
      // Validate file type
      if (!validateFileType(file, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
        setErrors({ profilePicture: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' });
        return;
      }

      // Validate file size (5MB max)
      if (!validateFileSize(file, 5)) {
        setErrors({ profilePicture: 'Image size must be less than 5MB' });
        return;
      }

      setUploadingFile(true);
      
      try {
        // For small files, try direct upload first
        let fileToUpload = file;
        
        // Only compress if file is larger than 1MB
        if (file.size > 1024 * 1024) {
          console.log('Compressing large image...');
          fileToUpload = await compressImage(file);
          console.log('Image compressed:', fileToUpload.name, fileToUpload.size);
        }
        
        // Upload to Firebase Storage
        const filePath = generateFilePath(user.uid, 'profile', fileToUpload.name);
        console.log('Uploading to path:', filePath);
        const uploadResult = await uploadFile(fileToUpload, filePath);
        
        if (uploadResult.error) {
          console.error('Upload error:', uploadResult.error);
          setErrors({ profilePicture: `Upload failed: ${uploadResult.error}` });
        } else {
          console.log('Upload successful:', uploadResult.url);
          setProfilePicture(uploadResult.url);
          setErrors(prev => ({ ...prev, profilePicture: '' }));
        }
      } catch (err) {
        console.error('Upload exception:', err);
        setErrors({ profilePicture: 'Failed to upload image. Please try again.' });
      } finally {
        setUploadingFile(false);
        // Clear the file input
        e.target.value = '';
      }
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      console.log('=== CV Upload Debug ===');
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      console.log('User ID:', user.uid);
      console.log('User authenticated:', !!user);
      
      // Clear previous errors
      setErrors(prev => ({ ...prev, cvFile: '' }));
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      console.log('Allowed types:', allowedTypes);
      console.log('File type valid:', validateFileType(file, allowedTypes));
      
      if (!validateFileType(file, allowedTypes)) {
        setErrors({ cvFile: 'Please upload a valid CV file (PDF, DOC, or DOCX)' });
        return;
      }

      // Validate file size (10MB max)
      console.log('File size valid:', validateFileSize(file, 10));
      if (!validateFileSize(file, 10)) {
        setErrors({ cvFile: 'CV file size must be less than 10MB' });
        return;
      }

      setUploadingFile(true);
      try {
        // Upload to PHP endpoint
        console.log('Uploading CV to PHP endpoint...');
        const uploadResult = await uploadFileToPHP(file, user.uid, 'cv');
        
        if (!uploadResult.success || uploadResult.error) {
          console.error('CV upload error:', uploadResult.error);
          setErrors({ cvFile: `Upload failed: ${uploadResult.error}` });
        } else {
          console.log('CV upload successful!');
          console.log('Download URL:', uploadResult.url);
          setCvFile({
            url: uploadResult.url!,
            name: uploadResult.name!,
            size: uploadResult.size!
          });
          setErrors(prev => ({ ...prev, cvFile: '' }));
        }
      } catch (err) {
        console.error('CV upload exception:', err);
        setErrors({ cvFile: 'Failed to upload CV. Please try again.' });
      } finally {
        setUploadingFile(false);
        // Clear the file input
        e.target.value = '';
      }
    }
  };

  const addCustomSocial = () => {
    if (newCustomSocial.name && newCustomSocial.url) {
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          custom: [...prev.socialLinks.custom, { ...newCustomSocial }]
        }
      }));
      setNewCustomSocial({ name: '', url: '' });
    }
  };

  const removeCustomSocial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        custom: prev.socialLinks.custom.filter((_, i) => i !== index)
      }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required for sharing your portfolio';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    if (!formData.professionalTitle.trim()) {
      newErrors.professionalTitle = 'Professional title is required';
    }

    if (!formData.professionalCategory.trim()) {
      newErrors.professionalCategory = 'Please select a professional category';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setSaving(true);
    try {
      const profileData = {
        userId: user.uid,
        name: formData.name,
        email: formData.email,
        username: formData.username,
        professionalTitle: formData.professionalTitle,
        professionalCategory: formData.professionalCategory,
        bio: formData.bio,
        ...(formData.location ? { location: formData.location } : {}),
        ...(formData.website ? { website: formData.website } : {}),
        contactInfo: formData.contactInfo,
        socialLinks: formData.socialLinks,
        profilePicture: profilePicture,
        ...(cvFile.url ? { 
          cvFile: cvFile.url,
          cvFileName: cvFile.name,
          cvFileSize: cvFile.size
        } : {}),
      };

      if (profileId) {
        // Update existing profile
        const { error } = await updateDocument('profiles', profileId, profileData);
        if (error) {
          setErrors({ general: error });
        } else {
          // Success - could show a toast notification here
          console.log('Profile updated successfully');
        }
      } else {
        // Create new profile
        const { id, error } = await createDocument('profiles', profileData);
        if (error) {
          setErrors({ general: error });
        } else {
          setProfileId(id);
          console.log('Profile created successfully');
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Profile
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 bg-clip-text text-transparent">
              Information
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">Loading your profile...</p>
        </div>
        <div className="animate-pulse space-y-4 sm:space-y-6">
          <div className="h-32 sm:h-40 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
          <div className="h-64 sm:h-80 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Profile
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 bg-clip-text text-transparent">
            Information
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
          Update your personal information and social links
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
            {errors.general}
          </div>
        )}
        {/* Profile Picture Section */}
        <Card className="group relative border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/50 dark:from-emerald-900/20 dark:via-transparent dark:to-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Camera className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">Profile Picture</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="relative group/avatar">
                <ProfileImage
                  src={profilePicture}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-slate-200 dark:border-slate-700 group-hover/avatar:border-emerald-300 dark:group-hover/avatar:border-emerald-600 transition-all duration-300"
                  fallbackText={formData.name}
                />
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full p-2 cursor-pointer hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                >
                  <Camera className="h-4 w-4" />
                </label>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingFile}
                />
              </div>
              
              {errors.profilePicture && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 text-center">
                  {errors.profilePicture}
                </p>
              )}
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                  Upload a professional photo
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="group relative border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-transparent to-emerald-50/50 dark:from-teal-900/20 dark:via-transparent dark:to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/50 dark:to-emerald-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                leftIcon={<User className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                placeholder="Enter your full name"
                required
                className="border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                leftIcon={<Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                placeholder="Enter your email"
                required
                className="border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
              />

              <div className="sm:col-span-2">
                <Input
                  label="Username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  placeholder="your-username"
                  required
                  disabled={checkingUsername}
                  className="border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
                />
                {checkingUsername && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Checking availability...
                  </p>
                )}
                {formData.username && !errors.username && !checkingUsername && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Username is available
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                  Professional Category
                </label>
                <select
                  name="professionalCategory"
                  value={formData.professionalCategory}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-slate-800 dark:text-slate-200 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  required
                >
                  <option value="">Select your profession</option>
                  {professionalCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.professionalCategory && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.professionalCategory}</p>
                )}
              </div>

              <Input
                label="Professional Title"
                name="professionalTitle"
                type="text"
                value={formData.professionalTitle}
                onChange={handleChange}
                error={errors.professionalTitle}
                placeholder="e.g., Full Stack Developer, UI/UX Designer, Marketing Manager"
                required
                className="border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
              />

              <Input
                label="Location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                leftIcon={<MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                placeholder="City, Country"
                className="border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
              />

              <Input
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                leftIcon={<Globe className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                placeholder="https://yourwebsite.com"
                className="border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                placeholder="Tell us about yourself..."
                required
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio}</p>
              )}
            </div>
          </div>
        </Card>

        {/* CV Upload Section */}
        <Card className="group relative border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-indigo-50/50 dark:from-purple-900/20 dark:via-transparent dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">CV/Resume</h3>
            </div>
            
            <div className="space-y-4">
              {cvFile.url ? (
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{cvFile.name}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>{(cvFile.size! / 1024 / 1024).toFixed(2)} MB</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isPHPStorageUrl(cvFile.url) 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {isPHPStorageUrl(cvFile.url) ? 'PHP Storage' : 'Firebase Storage'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={cvFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                      title="Download CV"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    <label
                      htmlFor="cv-upload"
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600/20 rounded-lg transition-colors cursor-pointer"
                      title="Replace CV"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
                  <FileText className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-2">Upload your CV/Resume</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                    PDF, DOC, or DOCX. Max size 10MB.
                  </p>
                  <label
                    htmlFor="cv-upload"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors"
                  >
                    {uploadingFile ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Choose File
                      </>
                    )}
                  </label>
                </div>
              )}
              
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvUpload}
                className="hidden"
                disabled={uploadingFile}
              />
              
              {errors.cvFile && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.cvFile}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="group relative border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-transparent to-blue-50/50 dark:from-cyan-900/20 dark:via-transparent dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">Contact Information</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Phone Number"
                name="contactInfo.phone"
                type="tel"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                leftIcon={<Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                placeholder="+1 (555) 123-4567"
                className="border-slate-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500/20"
              />

              <Input
                label="Alternative Email"
                name="contactInfo.alternativeEmail"
                type="email"
                value={formData.contactInfo.alternativeEmail}
                onChange={handleChange}
                leftIcon={<Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                placeholder="alternative@email.com"
                className="border-slate-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500/20"
              />

              <div className="sm:col-span-2">
                <Input
                  label="Address"
                  name="contactInfo.address"
                  type="text"
                  value={formData.contactInfo.address}
                  onChange={handleChange}
                  leftIcon={<MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                  placeholder="City, State, Country"
                  className="border-slate-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                  Timezone
                </label>
                <select
                  name="contactInfo.timezone"
                  value={formData.contactInfo.timezone}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-slate-800 dark:text-slate-200 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                >
                  <option value="">Select timezone</option>
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                  Availability
                </label>
                <select
                  name="contactInfo.availability"
                  value={formData.contactInfo.availability}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-slate-800 dark:text-slate-200 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                >
                  <option value="">Select availability</option>
                  <option value="available">Available for work</option>
                  <option value="busy">Busy but open to opportunities</option>
                  <option value="not-available">Not available</option>
                  <option value="freelance">Freelance only</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                  Preferred Contact Method
                </label>
                <select
                  name="contactInfo.preferredContactMethod"
                  value={formData.contactInfo.preferredContactMethod}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-slate-800 dark:text-slate-200 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="website">Website</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="group relative border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/50 dark:from-amber-900/20 dark:via-transparent dark:to-orange-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">Social Links</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="GitHub"
                name="socialLinks.github"
                type="url"
                value={formData.socialLinks.github}
                onChange={handleChange}
                leftIcon={<Github className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                placeholder="https://github.com/username"
                className="border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
              />

              <Input
                label="LinkedIn"
                name="socialLinks.linkedin"
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                leftIcon={<Linkedin className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                placeholder="https://linkedin.com/in/username"
                className="border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
              />

              <Input
                label="Twitter"
                name="socialLinks.twitter"
                type="url"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
                leftIcon={<Twitter className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                placeholder="https://twitter.com/username"
                className="border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
              />

              <Input
                label="Instagram"
                name="socialLinks.instagram"
                type="url"
                value={formData.socialLinks.instagram}
                onChange={handleChange}
                leftIcon={<Instagram className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                placeholder="https://instagram.com/username"
                className="border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
              />

              <Input
                label="Behance"
                name="socialLinks.behance"
                type="url"
                value={formData.socialLinks.behance}
                onChange={handleChange}
                placeholder="https://behance.net/username"
                className="border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
              />

              <Input
                label="Dribbble"
                name="socialLinks.dribbble"
                type="url"
                value={formData.socialLinks.dribbble}
                onChange={handleChange}
                placeholder="https://dribbble.com/username"
                className="border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
              />

              <Input
                label="YouTube"
                name="socialLinks.youtube"
                type="url"
                value={formData.socialLinks.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/@username"
                className="border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
              />

              <Input
                label="TikTok"
                name="socialLinks.tiktok"
                type="url"
                value={formData.socialLinks.tiktok}
                onChange={handleChange}
                placeholder="https://tiktok.com/@username"
                className="border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
              />
            </div>

            {/* Custom Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                Custom Social Links
              </h4>
              
              {formData.socialLinks.custom.map((social, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    name={`custom-social-name-${index}`}
                    type="text"
                    value={social.name}
                    onChange={(e) => {
                      const newCustom = [...formData.socialLinks.custom];
                      newCustom[index].name = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, custom: newCustom }
                      }));
                    }}
                    placeholder="Platform name"
                    className="flex-1 border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
                  />
                  <Input
                    name={`custom-social-url-${index}`}
                    type="url"
                    value={social.url}
                    onChange={(e) => {
                      const newCustom = [...formData.socialLinks.custom];
                      newCustom[index].url = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, custom: newCustom }
                      }));
                    }}
                    placeholder="https://..."
                    className="flex-2 border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomSocial(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <Input
                  name="newCustomSocialName"
                  type="text"
                  value={newCustomSocial.name}
                  onChange={(e) => setNewCustomSocial(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Platform name"
                  className="flex-1 border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
                />
                <Input
                  name="newCustomSocialUrl"
                  type="url"
                  value={newCustomSocial.url}
                  onChange={(e) => setNewCustomSocial(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  className="flex-2 border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomSocial}
                  className="border-amber-300 text-amber-600 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            size="lg" 
            loading={saving} 
            disabled={saving}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center">
              {saving ? 'Saving...' : 'Save Changes'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}


