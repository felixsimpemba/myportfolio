'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DynamicModal as Modal } from '@/components/DynamicModal';
import { useAuth } from '@/lib/AuthContext';
import { createDocument, getCollection, updateDocument, deleteDocument } from '@/lib/firestore';
import { Skill } from '@/types';
import { Plus, Edit, Trash2, Code, Star, StarHalf } from 'lucide-react';

export default function SkillsPage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 'Beginner' as Skill['level'],
    category: 'Technical' as Skill['category'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load skills from Firestore
  useEffect(() => {
    const loadSkills = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data: skillsData } = await getCollection('skills', [
          { field: 'userId', operator: '==', value: user.uid }
        ]);
        
        if (skillsData) {
          setSkills(skillsData as Skill[]);
        }
      } catch (error) {
        console.error('Error loading skills:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Skill name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setSaving(true);
    try {
      const skillData = {
        userId: user.uid,
        name: formData.name,
        level: formData.level,
        category: formData.category,
      };

      if (editingSkill) {
        // Update existing skill
        const { error } = await updateDocument('skills', editingSkill.id, skillData);
        if (error) {
          setErrors({ general: error });
        } else {
          setSkills(prev => 
            prev.map(skill => skill.id === editingSkill.id ? { ...skillData, id: editingSkill.id } : skill)
          );
          handleCloseModal();
        }
      } else {
        // Create new skill
        const { id, error } = await createDocument('skills', skillData);
        if (error) {
          setErrors({ general: error });
        } else {
          setSkills(prev => [...prev, { ...skillData, id } as Skill]);
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      setErrors({ general: 'Failed to save skill. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      level: skill.level,
      category: skill.category,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteDocument('skills', id);
      if (error) {
        console.error('Error deleting skill:', error);
      } else {
        setSkills(prev => prev.filter(skill => skill.id !== id));
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setFormData({
      name: '',
      level: 'Beginner',
      category: 'Technical',
    });
    setErrors({});
  };

  const handleAddNew = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      level: 'Beginner',
      category: 'Technical',
    });
    setIsModalOpen(true);
  };

  const getLevelIcon = (level: Skill['level']) => {
    switch (level) {
      case 'Expert':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'Advanced':
        return <Star className="h-4 w-4 text-blue-500" />;
      case 'Intermediate':
        return <StarHalf className="h-4 w-4 text-green-500" />;
      case 'Beginner':
        return <div className="h-4 w-4 rounded-full bg-muted" />;
      default:
        return null;
    }
  };

  const getLevelColor = (level: Skill['level']) => {
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
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Skills</h1>
          <p className="mt-2 text-muted-foreground">Loading your skills...</p>
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
          <h1 className="text-3xl font-bold text-foreground">Skills</h1>
          <p className="mt-2 text-muted-foreground">
            Showcase your technical and soft skills
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Skills by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <Card key={category}>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 capitalize">
                {category} Skills ({categorySkills.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Code className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{skill.name}</p>
                        <div className="flex items-center space-x-2">
                          {getLevelIcon(skill.level)}
                          <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(skill.level)}`}>
                            {skill.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(skill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(skill.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {skills.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No skills added yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your skills to showcase your expertise
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </div>
        </Card>
      )}

      {/* Add/Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSkill ? 'Edit Skill' : 'Add Skill'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}
          
          <Input
            label="Skill Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g., JavaScript, Leadership, Spanish"
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Skill Level
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-200"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-200"
            >
              <option value="Technical">Technical</option>
              <option value="Soft">Soft Skills</option>
              <option value="Language">Language</option>
              <option value="Other">Other</option>
            </select>
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
              {saving ? 'Saving...' : editingSkill ? 'Update Skill' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}