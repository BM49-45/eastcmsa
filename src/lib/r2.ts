import clientPromise from "./mongodb"
import { ObjectId, WithId, Document } from "mongodb"

// Define types
export interface Category {
  id: string
  name: string
  icon: string
  color: string
  count: number
  description: string
}

export interface AudioFile {
  id: string
  title: string
  speaker: string
  duration: string
  size: string
  downloads: number
  url: string
  category: string
  categoryName?: string
  filename?: string
  createdAt: string
  views?: number
  likes?: number
  [key: string]: any
}

// Define types for database documents (extend Document)
export interface FavoriteDoc extends Document {
  _id: ObjectId
  userId: string
  audioId: string
  audioData: any
  createdAt: Date
  [key: string]: any
}

export interface PlaylistDoc extends Document {
  _id: ObjectId
  userId: string
  name: string
  tracks: any[]
  createdAt: Date
  [key: string]: any
}

// Use string icons instead of Lucide components
export const categories: Category[] = [
  { 
    id: "tawhiid", 
    name: "Tawhiid", 
    icon: "🕌",
    color: "from-purple-500 to-indigo-700", 
    count: 0,
    description: "Umoja wa Mwenyezi Mungu na Misingi ya Imani"
  },
  { 
    id: "sirah", 
    name: "Sirah", 
    icon: "📖",
    color: "from-amber-500 to-orange-700", 
    count: 0,
    description: "Maisha na Mafundisho ya Mtume Muhammad (SAW)"
  },
  { 
    id: "fiqh", 
    name: "Fiqh", 
    icon: "⚖️",
    color: "from-green-500 to-emerald-700", 
    count: 0,
    description: "Sheria za Kiislamu na Hukumu za Kisheria"
  },
  { 
    id: "lecture", 
    name: "Mihadhara", 
    icon: "🎓",
    color: "from-blue-500 to-cyan-700", 
    count: 0,
    description: "Mihadhara na Mafundisho ya Kiislamu"
  }
];

// R2 base URL
const R2_BASE_URL = "https://pub-7729259c73e646759f7039886bf31b23.r2.dev";

export async function fetchCategoryMetadata(category: string): Promise<any> {
  try {
    // Try multiple possible paths - but ensure full URLs
    const paths = [
      `${R2_BASE_URL}/audio/${category}/metadata.json`,
      `${R2_BASE_URL}/audio/${category}/.mp3/metadata.json`,
    ];

    for (const path of paths) {
      try {
        console.log(`Trying to fetch: ${path}`);
        // Use force-cache for build time to avoid dynamic server usage errors
        const res = await fetch(path, { 
          cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
          headers: { 'Accept': 'application/json' }
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log(`Successfully fetched ${category} metadata:`, data);
          return data;
        }
      } catch (e) {
        console.log(`Failed to fetch ${path}:`, e);
        continue;
      }
    }
    
    console.log(`No metadata found for category: ${category}`);
    
    // Return empty files array instead of null
    return { files: [] };
  } catch (error) {
    console.error(`Error fetching ${category} metadata:`, error);
    return { files: [] };
  }
}

// Add the missing getCategoryData function
export async function getCategoryData(category: Category | string): Promise<any> {
  try {
    // Handle both Category object and string input
    const categoryId = typeof category === 'string' ? category : category.id;
    const data = await fetchCategoryMetadata(categoryId);
    
    if (data?.files && Array.isArray(data.files)) {
      return {
        ...data,
        files: data.files.map((file: any) => ({
          ...file,
          category: categoryId
        }))
      };
    }
    
    return { files: [] };
  } catch (error) {
    console.error(`Error getting data for category:`, error);
    return { files: [] };
  }
}

export async function getAllAudioFiles(): Promise<AudioFile[]> {
  const allAudio: AudioFile[] = [];
  
  for (const cat of categories) {
    try {
      const data = await fetchCategoryMetadata(cat.id);
      if (data?.files && Array.isArray(data.files) && data.files.length > 0) {
        const filesWithCategory = data.files.map((file: any, index: number) => ({
          ...file,
          category: cat.id,
          categoryName: cat.name,
          id: file.id || `${cat.id}-${file.title || file.filename || index}`,
          title: file.title || file.filename || 'Untitled',
          speaker: file.speaker || 'Unknown',
          duration: file.duration || '00:00',
          size: file.size ? 
            (typeof file.size === 'number' ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : file.size) 
            : '0 MB',
          downloads: file.downloads || 0,
          views: file.views || 0,
          likes: file.likes || 0,
          url: file.url || `${R2_BASE_URL}/audio/${cat.id}/${file.filename || file.title}.mp3`,
          createdAt: file.createdAt || new Date().toISOString()
        }));
        allAudio.push(...filesWithCategory);
        
        // Update category count
        const categoryIndex = categories.findIndex(c => c.id === cat.id);
        if (categoryIndex !== -1) {
          categories[categoryIndex].count = data.files.length;
        }
      }
    } catch (error) {
      console.error(`Error processing ${cat.id}:`, error);
    }
  }
  
  return allAudio;
}

export async function getCategoryFiles(category: string): Promise<AudioFile[]> {
  try {
    const data = await fetchCategoryMetadata(category);
    if (data?.files && Array.isArray(data.files) && data.files.length > 0) {
      const categoryInfo = categories.find(c => c.id === category);
      
      return data.files.map((file: any, index: number) => ({
        ...file,
        category,
        categoryName: categoryInfo?.name || category,
        id: file.id || `${category}-${file.title || file.filename || index}`,
        title: file.title || file.filename || 'Untitled',
        speaker: file.speaker || 'Unknown',
        duration: file.duration || '00:00',
        size: file.size ? 
          (typeof file.size === 'number' ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : file.size) 
          : '0 MB',
        downloads: file.downloads || 0,
        views: file.views || 0,
        likes: file.likes || 0,
        url: file.url || `${R2_BASE_URL}/audio/${category}/${file.filename || file.title}.mp3`,
        createdAt: file.createdAt || new Date().toISOString()
      }));
    }
    return [];
  } catch (error) {
    console.error(`Error getting ${category} files:`, error);
    return [];
  }
}

export async function getUserFavorites(userId: string): Promise<any[]> {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const favorites = await db
      .collection("favorites")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Use type assertion or map safely - WITHOUT spread operator
    return favorites.map((doc: WithId<Document>) => {
      // Return only the fields we need, not spreading the whole doc
      return {
        _id: doc._id.toString(),  // Convert ObjectId to string
        userId: (doc as any).userId || userId,
        audioId: (doc as any).audioId || '',
        audioData: (doc as any).audioData || {},
        createdAt: (doc as any).createdAt || new Date(),
        // Add any other fields you need individually
      };
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}

export async function getUserPlaylists(userId: string): Promise<any[]> {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const playlists = await db
      .collection("playlists")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Use type assertion or map safely - WITHOUT spread operator
    return playlists.map((doc: WithId<Document>) => {
      return {
        _id: doc._id.toString(),  // Convert ObjectId to string
        userId: (doc as any).userId || userId,
        name: (doc as any).name || 'Untitled Playlist',
        tracks: (doc as any).tracks || [],
        createdAt: (doc as any).createdAt || new Date(),
        // Add any other fields you need individually
      };
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}

export async function getAllStats() {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    // Get counts from database collections
    const [usersCount, categoriesCount, speakersCount] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("categories").countDocuments(),
      db.collection("speakers").countDocuments()
    ]);
    
    // Get audio files count from R2 metadata
    const audioFiles = await getAllAudioFiles();
    const audiosCount = audioFiles.length;
    
    return {
      users: usersCount,
      audios: audiosCount,
      categories: categoriesCount,
      speakers: speakersCount
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    
    // Return default values if there's an error
    return {
      users: 0,
      audios: 0,
      categories: 0,
      speakers: 0
    };
  }
}