'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/lib/AuthContext';
import { createDocument, getCollection, updateDocument, deleteDocument } from '@/lib/firestore';
import { Project } from '@/types';
import { Plus, Edit, Trash2, FolderOpen, ExternalLink, Github, Star, Image as ImageIcon } from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    demoLink: '',
    featured: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load projects from Firestore
  useEffect(() => {
    const loadProjects = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data: projectsData } = await getCollection('projects', [
          { field: 'userId', operator: '==', value: user.uid }
        ]);
        
        if (projectsData) {
          setProjects(projectsData as Project[]);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
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

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.techStack.trim()) {
      newErrors.techStack = 'Tech stack is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setSaving(true);
    try {
      const projectData = {
        userId: user.uid,
        title: formData.title,
        description: formData.description,
        techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech),
        featured: formData.featured,
        ...(formData.githubLink ? { githubLink: formData.githubLink } : {}),
        ...(formData.demoLink ? { demoLink: formData.demoLink } : {}),
      };

      if (editingProject) {
        // Update existing project
        const { error } = await updateDocument('projects', editingProject.id, projectData);
        if (error) {
          setErrors({ general: error });
        } else {
          setProjects(prev => 
            prev.map(project => project.id === editingProject.id ? { ...projectData, id: editingProject.id } : project)
          );
          handleCloseModal();
        }
      } else {
        // Create new project
        const { id, error } = await createDocument('projects', projectData);
        if (error) {
          setErrors({ general: error });
        } else {
          setProjects(prev => [...prev, { ...projectData, id } as Project]);
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setErrors({ general: 'Failed to save project. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      githubLink: project.githubLink || '',
      demoLink: project.demoLink || '',
      featured: project.featured,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteDocument('projects', id);
      if (error) {
        console.error('Error deleting project:', error);
      } else {
        setProjects(prev => prev.filter(project => project.id !== id));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      techStack: '',
      githubLink: '',
      demoLink: '',
      featured: false,
    });
    setErrors({});
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      techStack: '',
      githubLink: '',
      demoLink: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const toggleFeatured = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project || !user) return;

    try {
      const { error } = await updateDocument('projects', id, {
        featured: !project.featured
      });
      if (error) {
        console.error('Error updating featured status:', error);
      } else {
        setProjects(prev => 
          prev.map(p => 
            p.id === id ? { ...p, featured: !p.featured } : p
          )
        );
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="mt-2 text-muted-foreground">Loading your projects...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="animate-pulse h-64 bg-muted rounded-xl"></div>
          <div className="animate-pulse h-64 bg-muted rounded-xl"></div>
          <div className="animate-pulse h-64 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Showcase your work and side projects
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} hover className="overflow-hidden">
            <div className="relative">
              {project.imageUrl && (
                <div className="h-48 bg-muted flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              {project.featured && (
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
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
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFeatured(project.id)}
                  className={project.featured ? 'text-yellow-600' : 'text-muted-foreground'}
                >
                  <Star className={`h-4 w-4 ${project.featured ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No projects added yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your projects to showcase your work and skills
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </div>
        </Card>
      )}

      {/* Add/Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'Add Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}
          
          <Input
            label="Project Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g., E-commerce Platform"
            required
          />

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
              placeholder="Describe your project, its features, and technologies used..."
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <Input
            label="Tech Stack"
            name="techStack"
            type="text"
            value={formData.techStack}
            onChange={handleChange}
            error={errors.techStack}
            placeholder="e.g., React, Node.js, MongoDB, TailwindCSS"
            helperText="Separate technologies with commas"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="GitHub Link (Optional)"
              name="githubLink"
              type="url"
              value={formData.githubLink}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
            />

            <Input
              label="Demo Link (Optional)"
              name="demoLink"
              type="url"
              value={formData.demoLink}
              onChange={handleChange}
              placeholder="https://project-demo.vercel.app"
            />
          </div>

          <div className="flex items-center">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-foreground">
              Mark as featured project
            </label>
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
              {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


