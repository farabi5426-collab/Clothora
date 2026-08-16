import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { Trash2, Video, Plus, X, UploadCloud } from 'lucide-react';

interface BannerVideo {
  id: string;
  url: string;
  createdAt: any;
  source?: "hero" | "product";
  productId?: string;
}

export default function BannersManagement() {
  const [heroVideos, setHeroVideos] = useState<BannerVideo[]>([]);
  const [productVideos, setProductVideos] = useState<BannerVideo[]>([]);
  const videos = [...heroVideos, ...productVideos];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'heroVideos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vids: BannerVideo[] = [];
      snapshot.forEach((doc) => vids.push({ id: doc.id, ...doc.data(), source: "hero" } as BannerVideo));
      setHeroVideos(vids);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const pq = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubP = onSnapshot(pq, (snapshot) => {
      const pVids: BannerVideo[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.showInBanner && data.videoUrl) {
          pVids.push({ id: doc.id + '_product', url: data.videoUrl, createdAt: data.createdAt, source: "product", productId: doc.id });
        }
      });
      setProductVideos(pVids);
    });
    return () => unsubP();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl && !selectedVideo) {
      alert('Please provide a video URL or upload a video file.');
      return;
    }
    
    setIsUploading(true);
    let finalUrl = videoUrl;

    try {
      if (selectedVideo) {
        const uploadData = new FormData();
        uploadData.append('file', selectedVideo);
        uploadData.append('upload_preset', 'kwxslhnw');
        
        // Use /video/upload for videos
        const res = await fetch('https://api.cloudinary.com/v1_1/dzsiqw51v/video/upload', {
          method: 'POST',
          body: uploadData
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error?.message || 'Failed to upload video');
        }
        finalUrl = data.secure_url;
      }

      await addDoc(collection(db, 'heroVideos'), {
        url: finalUrl,
        createdAt: new Date()
      });
      
      setIsModalOpen(false);
      setVideoUrl('');
      setSelectedVideo(null);
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Failed to add video.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (video: BannerVideo) => {
    if (window.confirm('Are you sure you want to delete this video from the banner?')) {
      if (video.source === 'product' && video.productId) {
         await updateDoc(doc(db, 'products', video.productId), { showInBanner: false });
      } else {
         await deleteDoc(doc(db, 'heroVideos', video.id));
      }
    }
  };

  const closeAndReset = () => {
    setIsModalOpen(false);
    setVideoUrl('');
    setSelectedVideo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-on-background mb-2">Hero Videos</h1>
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Manage videos displayed in the home banner</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-primary hover:bg-primary-container text-on-primary px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Video
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Video Preview</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">URL</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id} className="border-b border-outline-variant/50 hover:bg-surface-container/50 transition-colors">
                <td className="p-4">
                  <div className="w-32 h-20 bg-surface-container-low border border-outline-variant relative overflow-hidden flex items-center justify-center group">
                    <video src={video.url} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" muted playsInline loop autoPlay />
                    <Video className="w-6 h-6 text-on-surface-variant z-10 relative opacity-50" />
                  </div>
                </td>
                <td className="p-4 text-xs tracking-widest text-on-surface-variant max-w-xs truncate" title={video.url}>
                  {video.url}
                  {video.source === 'product' && (
                    <span className="ml-2 bg-primary/20 text-primary px-2 py-1 text-[10px] rounded-full">Product</span>
                  )}
                </td>
                <td className="p-4 flex justify-end gap-3 h-full items-center pt-8">
                  <button onClick={() => handleDelete(video)} className="text-on-surface-variant hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {videos.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-on-surface-variant uppercase tracking-widest text-xs">No videos found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant w-full max-w-lg p-4 sm:p-8 max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-widest">Add New Video</h2>
              <button onClick={closeAndReset} className="text-on-surface-variant hover:text-on-background" disabled={isUploading}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Video URL (.mp4, .webm)</label>
                <input 
                  type="url"
                  value={videoUrl} 
                  onChange={e => setVideoUrl(e.target.value)} 
                  placeholder="https://example.com/video.mp4" 
                  disabled={!!selectedVideo || isUploading}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors disabled:opacity-50" 
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px bg-outline-variant flex-1"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">OR</span>
                <div className="h-px bg-outline-variant flex-1"></div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Upload Video File</label>
                <div className="relative border-2 border-dashed border-outline-variant hover:border-primary transition-colors p-8 flex flex-col items-center justify-center bg-surface-container/30">
                  <input 
                    type="file" 
                    accept="video/*"
                    onChange={e => setSelectedVideo(e.target.files?.[0] || null)}
                    disabled={!!videoUrl || isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                  />
                  <UploadCloud className={`w-8 h-8 mb-2 ${selectedVideo ? 'text-primary' : 'text-on-surface-variant'}`} />
                  <span className="text-xs font-bold tracking-widest uppercase text-center text-on-surface-variant">
                    {selectedVideo ? selectedVideo.name : 'Click to select or drag video here'}
                  </span>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={(!videoUrl && !selectedVideo) || isUploading}
                className="w-full bg-primary hover:bg-primary-container text-on-primary p-4 text-xs font-bold uppercase tracking-widest mt-6 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-background border-t-transparent rounded-full animate-spin"></div>
                    Uploading Video...
                  </>
                ) : (
                  'Save Video'
                )}
              </button>
            </form>
            
            {/* Overlay if uploading to prevent interactions */}
            {isUploading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                <div className="bg-surface-container border border-outline-variant p-6 flex flex-col items-center gap-4 shadow-2xl">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold tracking-widest uppercase text-primary animate-pulse">
                    Uploading to Cloudinary...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
