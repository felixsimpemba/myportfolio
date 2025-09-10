'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/lib/AuthContext';
import { createDocument, getCollection, updateDocument, deleteDocument } from '@/lib/firestore';
import { Education } from '@/types';
import { Plus, Edit, Trash2, GraduationCap, Calendar, Award } from 'lucide-react';

export default function EducationPage() {
  const { user } = useAuth();
  const [educations, setEducations] = useState<Education[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    field: '',
    year: '',
    gpa: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load educations from Firestore
  useEffect(() => {
    const loadEducations = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data: educationsData } = await getCollection('educations', [
          { field: 'userId', operator: '==', value: user.uid }
        ]);
        
        if (educationsData) {
          setEducations(educationsData as Education[]);
        }
      } catch (error) {
        console.error('Error loading educations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEducations();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.school.trim()) {
      newErrors.school = 'School name is required';
    }

    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree is required';
    }

    if (!formData.field.trim()) {
      newErrors.field = 'Field of study is required';
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
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
      const educationData = {
        userId: user.uid,
        school: formData.school,
        degree: formData.degree,
        field: formData.field,
        year: formData.year,
        description: formData.description,
        ...(formData.gpa ? { gpa: formData.gpa } : {}),
      };

      if (editingEducation) {
        // Update existing education
        const { error } = await updateDocument('educations', editingEducation.id, educationData);
        if (error) {
          setErrors({ general: error });
        } else {
          setEducations(prev => 
            prev.map(edu => edu.id === editingEducation.id ? { ...educationData, id: editingEducation.id } : edu)
          );
          handleCloseModal();
        }
      } else {
        // Create new education
        const { id, error } = await createDocument('educations', educationData);
        if (error) {
          setErrors({ general: error });
        } else {
          setEducations(prev => [...prev, { ...educationData, id } as Education]);
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error saving education:', error);
      setErrors({ general: 'Failed to save education. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setFormData({
      school: education.school,
      degree: education.degree,
      field: education.field,
      year: education.year,
      gpa: education.gpa || '',
      description: education.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteDocument('educations', id);
      if (error) {
        console.error('Error deleting education:', error);
      } else {
        setEducations(prev => prev.filter(edu => edu.id !== id));
      }
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEducation(null);
    setFormData({
      school: '',
      degree: '',
      field: '',
      year: '',
      gpa: '',
      description: '',
    });
    setErrors({});
  };

  const handleAddNew = () => {
    setEditingEducation(null);
    setFormData({
      school: '',
      degree: '',
      field: '',
      year: '',
      gpa: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Education</h1>
          <p className="mt-2 text-muted-foreground">Loading your education...</p>
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
          <h1 className="text-3xl font-bold text-foreground">Education</h1>
          <p className="mt-2 text-muted-foreground">
            Add your educational background and achievements
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {educations.map((education) => (
          <Card key={education.id} hover>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">
                      {education.degree} in {education.field}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-muted-foreground mb-2">{education.school}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {education.year}
                    </div>
                    {education.gpa && (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        GPA: {education.gpa}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground">{education.description}</p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(education)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(education.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {educations.length === 0 && (
          <Card>
            <div className="p-12 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No education added yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your educational background to showcase your qualifications
              </p>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Education
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Education Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEducation ? 'Edit Education' : 'Add Education'}
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
              label="School/University"
              name="school"
              type="text"
              value={formData.school}
              onChange={handleChange}
              error={errors.school}
              placeholder="e.g., Stanford University"
              required
            />

            <Input
              label="Degree"
              name="degree"
              type="text"
              value={formData.degree}
              onChange={handleChange}
              error={errors.degree}
              placeholder="e.g., Bachelor of Science, Master of Arts"
              required
            />

            <Input
              label="Field of Study"
              name="field"
              type="text"
              value={formData.field}
              onChange={handleChange}
              error={errors.field}
              placeholder="e.g., Computer Science, Business Administration"
              required
            />

            <Input
              label="Graduation Year"
              name="year"
              type="text"
              value={formData.year}
              onChange={handleChange}
              error={errors.year}
              placeholder="e.g., 2020"
              required
            />

            <Input
              label="GPA (Optional)"
              name="gpa"
              type="text"
              value={formData.gpa}
              onChange={handleChange}
              placeholder="e.g., 3.8"
            />
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
              placeholder="Describe your academic achievements, relevant coursework, or projects..."
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
              {saving ? 'Saving...' : editingEducation ? 'Update Education' : 'Add Education'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


