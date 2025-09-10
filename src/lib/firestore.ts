import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  Query,
  CollectionReference
} from 'firebase/firestore';
import { db } from './firebase';


// Utility function to remove undefined values from objects
const cleanUndefinedValues = (obj: any): any => {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  return cleaned;
};

// Generic CRUD operations
export const createDocument = async (collectionName: string, data: any) => {
  try {
    const cleanedData = cleanUndefinedValues(data);
    const docRef = await addDoc(collection(db, collectionName), {
      ...cleanedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { data: null, error: 'Document not found' };
    }
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  try {
    const cleanedData = cleanUndefinedValues(data);
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...cleanedData,
      updatedAt: new Date(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getCollection = async (collectionName: string, constraints?: any[]) => {
  try {
    let q: Query<DocumentData, DocumentData> | CollectionReference<DocumentData, DocumentData>;
    
    if (constraints) {
      q = query(collection(db, collectionName), ...constraints);
    } else {
      q = collection(db, collectionName);
    }
    
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return { data: documents, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Portfolio-specific functions
export const getPortfolioData = async (userId: string) => {
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ];
  return await getCollection('portfolios', constraints);
};

export const getProjects = async (userId: string) => {
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ];
  return await getCollection('projects', constraints);
};

export const getEducation = async (userId: string) => {
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ];
  return await getCollection('educations', constraints);
};

export const getExperience = async (userId: string) => {
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ];
  return await getCollection('experiences', constraints);
};

export const getSkills = async (userId: string) => {
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ];
  return await getCollection('skills', constraints);
};

// New functions for enhanced features
export const getProfessionalAssets = async (userId: string) => {
  const constraints = [
    where('userId', '==', userId),
    orderBy('order', 'asc')
  ];
  return await getCollection('professional_assets', constraints);
};

export const getThemes = async (userId: string) => {
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ];
  return await getCollection('themes', constraints);
};

export const getCustomSections = async (userId: string) => {
  const constraints = [
    where('userId', '==', userId),
    where('isVisible', '==', true),
    orderBy('order', 'asc')
  ];
  return await getCollection('custom_sections', constraints);
};

// Profile by username for public portfolio
export const getProfileByUsername = async (username: string) => {
  const constraints = [
    where('username', '==', username)
  ];
  return await getCollection('profiles', constraints);
};

// Dashboard overview and stats
export const getDashboardStats = async (userId: string) => {
  try {
    const [profilesResult, experiencesResult, educationsResult, skillsResult, projectsResult] = await Promise.all([
      getCollection('profiles', [where('userId', '==', userId)]),
      getCollection('experiences', [where('userId', '==', userId)]),
      getCollection('educations', [where('userId', '==', userId)]),
      getCollection('skills', [where('userId', '==', userId)]),
      getCollection('projects', [where('userId', '==', userId)])
    ]);

    const profile = profilesResult.data && profilesResult.data.length > 0 ? profilesResult.data[0] : null;
    const experiences = experiencesResult.data || [];
    const educations = educationsResult.data || [];
    const skills = skillsResult.data || [];
    const projects = projectsResult.data || [];

    // Calculate completion percentage
    const profileComplete = profile ? 100 : 0;
    const experienceComplete = Math.min(100, experiences.length * 20);
    const educationComplete = Math.min(100, educations.length * 25);
    const skillsComplete = Math.min(100, skills.length * 10);
    const projectsComplete = Math.min(100, projects.length * 20);
    const themeComplete = 100; // Always complete as we have default theme

    const overallComplete = Math.round(
      (profileComplete + experienceComplete + educationComplete + skillsComplete + projectsComplete + themeComplete) / 6
    );

    return {
      data: {
        profile,
        experiences,
        educations,
        skills,
        projects,
        stats: {
          profileComplete,
          experienceComplete,
          educationComplete,
          skillsComplete,
          projectsComplete,
          themeComplete,
          overallComplete
        }
      },
      error: null
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Recent activities
export const getRecentActivities = async (userId: string) => {
  try {
    const activities: any[] = [];
    
    // Get recent experiences
    const experiencesResult = await getCollection('experiences', [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
    
    if (experiencesResult.data) {
      experiencesResult.data.slice(0, 3).forEach((exp: any) => {
        activities.push({
          id: exp.id,
          type: 'experience',
          title: `Added experience at ${exp.company}`,
          description: exp.role,
          timestamp: exp.createdAt,
          icon: 'Briefcase'
        });
      });
    }

    // Get recent projects
    const projectsResult = await getCollection('projects', [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
    
    if (projectsResult.data) {
      projectsResult.data.slice(0, 2).forEach((project: any) => {
        activities.push({
          id: project.id,
          type: 'project',
          title: `Added project: ${project.title}`,
          description: project.description?.substring(0, 100) + '...',
          timestamp: project.createdAt,
          icon: 'FolderOpen'
        });
      });
    }

    // Get recent skills
    const skillsResult = await getCollection('skills', [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
    
    if (skillsResult.data) {
      skillsResult.data.slice(0, 2).forEach((skill: any) => {
        activities.push({
          id: skill.id,
          type: 'skill',
          title: `Added skill: ${skill.name}`,
          description: `${skill.level} level`,
          timestamp: skill.createdAt,
          icon: 'Code'
        });
      });
    }

    // Sort by timestamp and return recent 5
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return {
      data: activities.slice(0, 5),
      error: null
    };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};
