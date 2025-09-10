import { createDocument } from './firestore';

// Sample data for testing the portfolio platform
export const createSampleData = async (userId: string) => {
  try {
    // Create sample profile
    const profileData = {
      userId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      professionalTitle: 'Full Stack Developer',
      professionalCategory: 'Developer',
      bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. I love creating innovative solutions and working with cutting-edge technologies.',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      contactInfo: {
        phone: '+1 (555) 123-4567',
        alternativeEmail: 'john@johndoe.dev',
        address: '123 Tech Street, San Francisco, CA 94105',
        timezone: 'UTC-08:00',
        availability: 'available',
        preferredContactMethod: 'email'
      },
      socialLinks: {
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: 'https://twitter.com/johndoe',
        instagram: 'https://instagram.com/johndoe',
        behance: 'https://behance.net/johndoe',
        custom: [
          { name: 'Personal Blog', url: 'https://blog.johndoe.dev' },
          { name: 'Dev.to', url: 'https://dev.to/johndoe' }
        ]
      },
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      cvFile: 'https://example.com/cv.pdf',
      cvFileName: 'John_Doe_CV.pdf',
      cvFileSize: 1024000
    };

    const { id: profileId } = await createDocument('profiles', profileData);

    // Create sample experience
    const experienceData = [
      {
        userId,
        company: 'TechCorp Inc.',
        role: 'Senior Full Stack Developer',
        startDate: '2022-01',
        endDate: '',
        description: 'Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines and mentored junior developers.',
        current: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId,
        company: 'StartupXYZ',
        role: 'Full Stack Developer',
        startDate: '2020-06',
        endDate: '2021-12',
        description: 'Built responsive web applications using React, Node.js, and PostgreSQL. Collaborated with design team to implement pixel-perfect UIs.',
        current: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId,
        company: 'WebDev Agency',
        role: 'Frontend Developer',
        startDate: '2019-01',
        endDate: '2020-05',
        description: 'Developed custom WordPress themes and React applications for various clients. Focused on performance optimization and accessibility.',
        current: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const exp of experienceData) {
      await createDocument('experiences', exp);
    }

    // Create sample education
    const educationData = [
      {
        userId,
        school: 'Stanford University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        year: '2018',
        gpa: '3.8',
        description: 'Graduated magna cum laude with focus on software engineering and data structures. Completed senior project on machine learning applications.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId,
        school: 'FreeCodeCamp',
        degree: 'Certification',
        field: 'Full Stack Web Development',
        year: '2019',
        description: 'Completed comprehensive program covering HTML, CSS, JavaScript, React, Node.js, and database management.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const edu of educationData) {
      await createDocument('educations', edu);
    }

    // Create sample skills
    const skillsData = [
      // Technical Skills
      { userId, name: 'JavaScript', level: 'Expert', category: 'Technical', yearsOfExperience: 5, proficiency: 95 },
      { userId, name: 'TypeScript', level: 'Advanced', category: 'Technical', yearsOfExperience: 3, proficiency: 85 },
      { userId, name: 'React', level: 'Expert', category: 'Technical', yearsOfExperience: 4, proficiency: 90 },
      { userId, name: 'Node.js', level: 'Advanced', category: 'Technical', yearsOfExperience: 3, proficiency: 80 },
      { userId, name: 'Python', level: 'Intermediate', category: 'Technical', yearsOfExperience: 2, proficiency: 70 },
      { userId, name: 'PostgreSQL', level: 'Advanced', category: 'Technical', yearsOfExperience: 3, proficiency: 85 },
      { userId, name: 'AWS', level: 'Intermediate', category: 'Technical', yearsOfExperience: 2, proficiency: 65 },
      { userId, name: 'Docker', level: 'Intermediate', category: 'Technical', yearsOfExperience: 2, proficiency: 70 },
      
      // Soft Skills
      { userId, name: 'Leadership', level: 'Advanced', category: 'Soft', yearsOfExperience: 3, proficiency: 80 },
      { userId, name: 'Communication', level: 'Expert', category: 'Soft', yearsOfExperience: 5, proficiency: 90 },
      { userId, name: 'Problem Solving', level: 'Expert', category: 'Soft', yearsOfExperience: 5, proficiency: 95 },
      { userId, name: 'Team Collaboration', level: 'Advanced', category: 'Soft', yearsOfExperience: 4, proficiency: 85 },
      
      // Creative Skills
      { userId, name: 'UI/UX Design', level: 'Intermediate', category: 'Creative', yearsOfExperience: 2, proficiency: 70 },
      { userId, name: 'Figma', level: 'Intermediate', category: 'Creative', yearsOfExperience: 1, proficiency: 65 },
      
      // Languages
      { userId, name: 'English', level: 'Expert', category: 'Language', yearsOfExperience: 25, proficiency: 100 },
      { userId, name: 'Spanish', level: 'Intermediate', category: 'Language', yearsOfExperience: 3, proficiency: 60 }
    ];

    for (const skill of skillsData) {
      await createDocument('skills', { ...skill, createdAt: new Date(), updatedAt: new Date() });
    }

    // Create sample projects
    const projectsData = [
      {
        userId,
        title: 'E-Commerce Platform',
        description: 'Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, inventory management, and admin dashboard.',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker', 'AWS'],
        githubLink: 'https://github.com/johndoe/ecommerce-platform',
        demoLink: 'https://ecommerce-demo.vercel.app',
        featured: true,
        category: 'development',
        status: 'completed',
        startDate: '2023-01',
        endDate: '2023-06'
      },
      {
        userId,
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
        techStack: ['React', 'TypeScript', 'Socket.io', 'MongoDB', 'Express'],
        githubLink: 'https://github.com/johndoe/task-manager',
        demoLink: 'https://taskmanager-demo.vercel.app',
        featured: true,
        category: 'development',
        status: 'completed',
        startDate: '2022-08',
        endDate: '2022-12'
      },
      {
        userId,
        title: 'Portfolio Website',
        description: 'A responsive portfolio website built with Next.js and Tailwind CSS. Features dark mode, animations, and contact form integration.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        githubLink: 'https://github.com/johndoe/portfolio',
        demoLink: 'https://johndoe.dev',
        featured: false,
        category: 'development',
        status: 'completed',
        startDate: '2023-03',
        endDate: '2023-04'
      },
      {
        userId,
        title: 'AI Chatbot',
        description: 'An intelligent chatbot powered by OpenAI API with natural language processing capabilities and context awareness.',
        techStack: ['Python', 'OpenAI API', 'FastAPI', 'React', 'WebSocket'],
        githubLink: 'https://github.com/johndoe/ai-chatbot',
        demoLink: 'https://ai-chatbot-demo.vercel.app',
        featured: false,
        category: 'development',
        status: 'in-progress',
        startDate: '2023-07'
      }
    ];

    for (const project of projectsData) {
      await createDocument('projects', { ...project, createdAt: new Date(), updatedAt: new Date() });
    }

    // Create sample theme
    const themeData = {
      userId,
      primaryColor: '#10b981',
      secondaryColor: '#14b8a6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#f59e0b',
      fontFamily: 'Inter',
      layout: 'modern',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await createDocument('themes', themeData);

    console.log('Sample data created successfully!');
    return { success: true, profileId };
  } catch (error) {
    console.error('Error creating sample data:', error);
    return { success: false, error };
  }
};

// Function to clear all user data
export const clearUserData = async (userId: string) => {
  try {
    // Note: In a real implementation, you'd want to delete documents from collections
    // This is a placeholder for the clear functionality
    console.log(`Clearing data for user: ${userId}`);
    return { success: true };
  } catch (error) {
    console.error('Error clearing user data:', error);
    return { success: false, error };
  }
};
