'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/lib/AuthContext';
import { createDocument, getCollection, updateDocument, deleteDocument } from '@/lib/firestore';
import { Experience } from '@/types';
import { Plus, Edit, Trash2, Calendar, Building } from 'lucide-react';

export default function ExperiencePage() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    current: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load experiences from Firestore
  useEffect(() => {
    const loadExperiences = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data: experiencesData } = await getCollection('experiences', [
          { field: 'userId', operator: '==', value: user.uid }
        ]);
        
        if (experiencesData) {
          setExperiences(experiencesData as Experience[]);
        }
      } catch (error) {
        console.error('Error loading experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate && !formData.current) {
      newErrors.endDate = 'End date is required or mark as current';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setSaving(true);
    try {
      const experienceData = {
        userId: user.uid,
        company: formData.company,
        role: formData.role,
        startDate: formData.startDate,
        description: formData.description,
        current: formData.current,
        ...(formData.current ? {} : { endDate: formData.endDate }),
      };

      if (editingExperience) {
        // Update existing experience
        const { error } = await updateDocument('experiences', editingExperience.id, experienceData);
        if (error) {
          setErrors({ general: error });
        } else {
          setExperiences(prev => 
            prev.map(exp => exp.id === editingExperience.id ? { ...experienceData, id: editingExperience.id } : exp)
          );
          handleCloseModal();
        }
      } else {
        // Create new experience
        const { id, error } = await createDocument('experiences', experienceData);
        if (error) {
          setErrors({ general: error });
        } else {
          setExperiences(prev => [...prev, { ...experienceData, id } as Experience]);
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      setErrors({ general: 'Failed to save experience. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      role: experience.role,
      startDate: experience.startDate,
      endDate: experience.endDate || '',
      description: experience.description,
      current: experience.current,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteDocument('experiences', id);
      if (error) {
        console.error('Error deleting experience:', error);
      } else {
        setExperiences(prev => prev.filter(exp => exp.id !== id));
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    setFormData({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    });
    setErrors({});
  };

  const handleAddNew = () => {
    setEditingExperience(null);
    setFormData({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    });
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Work Experience</h1>
          <p className="mt-2 text-muted-foreground">Loading your experiences...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-xl"></div>
          <div className="h-32 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Work Experience</h1>
          <p className="mt-2 text-muted-foreground">
            Add your professional work experience
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((experience) => (
          <Card key={experience.id} hover>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">
                      {experience.role}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-muted-foreground mb-2">{experience.company}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate!)}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">{experience.description}</p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(experience)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(experience.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {experiences.length === 0 && (
          <Card>
            <div className="p-12 text-center">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No experience added yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your work experience to showcase your professional background
              </p>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Experience
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Experience Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExperience ? 'Edit Experience' : 'Add Experience'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
              placeholder="e.g., Google, Microsoft"
              required
            />

            <Input
              label="Job Title"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
              placeholder="e.g., Senior Developer, Product Manager"
              required
            />

            <Input
              label="Start Date"
              name="startDate"
              type="month"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
            />

            <Input
              label="End Date"
              name="endDate"
              type="month"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
              disabled={formData.current}
            />
          </div>

          <div className="flex items-center">
            <input
              id="current"
              name="current"
              type="checkbox"
              checked={formData.current}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label htmlFor="current" className="ml-2 block text-sm text-foreground">
              I currently work here
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-200"
              placeholder="Describe your role, responsibilities, and achievements..."
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving} disabled={saving}>
              {saving ? 'Saving...' : editingExperience ? 'Update Experience' : 'Add Experience'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


