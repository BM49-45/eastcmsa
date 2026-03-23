import clientPromise from "./mongodb"

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
    id: "mihadhara", 
    name: "Mihadhara", 
    icon: "🎓",
    color: "from-blue-500 to-cyan-700", 
    count: 0,
    description: "Mihadhara na Mafundisho ya Kiislamu"
  }
];

const R2_BASE_URL = "https://pub-7729259c73e646759f7039886bf31b23.r2.dev";

export async function fetchCategoryMetadata(category: string): Promise<any> {
  try {
    // ✅ Path sahihi kwa R2
    const path = `${R2_BASE_URL}/audio/${category}/metadata.json`;
    
    console.log(`📡 Fetching: ${path}`);
    const res = await fetch(path, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Successfully fetched ${category} metadata: ${data.files?.length || 0} files`);
      return data;
    }
    
    console.log(`⚠️ No metadata found for category: ${category} (${res.status})`);
    return { files: [] };
  } catch (error) {
    console.error(`❌ Error fetching ${category} metadata:`, error);
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
        
        const categoryIndex = categories.findIndex(c => c.id === cat.id);
        if (categoryIndex !== -1) {
          categories[categoryIndex].count = data.files.length;
        }
      }
    } catch (error) {
      console.error(`Error processing ${cat.id}:`, error);
    }
  }
  
  console.log(`📊 Total audio files: ${allAudio.length}`);
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
  if (typeof window !== 'undefined') {
    return [];
  }
  
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const favorites = await db
      .collection("favorites")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return favorites.map((fav: any) => ({
      ...fav,
      _id: fav._id.toString()
    }));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}

export async function getUserPlaylists(userId: string): Promise<any[]> {
  if (typeof window !== 'undefined') {
    return [];
  }
  
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const playlists = await db
      .collection("playlists")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return playlists.map((pl: any) => ({
      ...pl,
      _id: pl._id.toString()
    }));
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}