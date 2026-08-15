const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/ProductsManagement.tsx', 'utf-8');

// Update Interface
content = content.replace(
  '  imageUrls?: string[];',
  '  imageUrls?: string[];\n  videoUrl?: string;\n  showInBanner?: boolean;'
);

// Update Initial State
content = content.replace(
  "imageUrl: '', imageUrls: [] as string[]",
  "imageUrl: '', imageUrls: [] as string[], videoUrl: '', showInBanner: false"
);

// Add selectedVideo state
content = content.replace(
  '  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);',
  '  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);\n  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);'
);

// Capture video files in handleSubmit
content = content.replace(
  'const currentSelectedFiles = [...selectedFiles];',
  'const currentSelectedFiles = [...selectedFiles];\n    const currentSelectedVideo = selectedVideo;'
);

// In handleSubmit, handle video upload logic after images
content = content.replace(
  '        // 2. Save to Firestore',
  `        let finalVideoUrl = currentFormData.videoUrl;
        if (currentSelectedVideo) {
          const uploadData = new FormData();
          uploadData.append('file', currentSelectedVideo);
          uploadData.append('upload_preset', 'kwxslhnw');
          const res = await fetch('https://api.cloudinary.com/v1_1/dzsiqw51v/video/upload', {
            method: 'POST',
            body: uploadData
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || 'Failed to upload video');
          finalVideoUrl = data.secure_url;
        }

        // 2. Save to Firestore`
);

// Update dataToSave
content = content.replace(
  '          imageUrl: finalImageUrl,\n          imageUrls: finalImageUrls',
  '          imageUrl: finalImageUrl,\n          imageUrls: finalImageUrls,\n          videoUrl: finalVideoUrl,\n          showInBanner: currentFormData.showInBanner'
);

// Update openEdit
content = content.replace(
  '      imageUrls: product.imageUrls || (product.imageUrl ? [product.imageUrl] : [])',
  '      imageUrls: product.imageUrls || (product.imageUrl ? [product.imageUrl] : []),\n      videoUrl: product.videoUrl || \'\',\n      showInBanner: product.showInBanner || false'
);

content = content.replace(
  '    setSelectedFiles([]);',
  '    setSelectedFiles([]);\n    setSelectedVideo(null);'
);

// Update resetForm
content = content.replace(
  "imageUrl: '', imageUrls: []",
  "imageUrl: '', imageUrls: [], videoUrl: '', showInBanner: false"
);
content = content.replace(
  '    setEditingId(null);',
  '    setEditingId(null);\n    setSelectedVideo(null);'
);

// Add Video Upload UI right after Images block ends.
const targetStr = `                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Add Image via URL</label>
                      <div className="flex gap-2">
                        <input 
                          id="addUrlInput" 
                          placeholder="https://..." 
                          className="flex-1 bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors" 
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const input = document.getElementById('addUrlInput') as HTMLInputElement;
                            if (input && input.value) {
                              const newUrls = [...formData.imageUrls, input.value];
                              setFormData({...formData, imageUrls: newUrls, imageUrl: formData.imageUrl || input.value});
                              input.value = '';
                            }
                          }} 
                          className="bg-surface-container border border-outline-variant px-4 text-xs font-bold uppercase hover:text-primary transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Upload New Image(s)</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={e => setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])}
                        className="w-full bg-surface-container-low border border-outline-variant p-2 text-on-background focus:border-primary outline-none transition-colors file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-surface-container file:text-on-background hover:file:bg-surface-container-high cursor-pointer" 
                      />
                      {selectedFiles.length > 0 && (
                        <p className="text-xs text-primary font-bold mt-2">
                          {selectedFiles.length} new file(s) selected (will be added on save)
                        </p>
                      )}
                    </div>
                  </div>
                </div>`;

const newVideoStr = `${targetStr}

                {/* Video Upload Section */}
                <div className="col-span-2 border border-outline-variant p-4 bg-surface-container/50 mt-4">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-4">Product Video</label>
                  
                  {formData.videoUrl && (
                    <div className="mb-4 relative w-32 h-20 border border-outline-variant group">
                       <video src={formData.videoUrl} className="w-full h-full object-cover" muted playsInline />
                       <button 
                          type="button" 
                          onClick={() => setFormData({...formData, videoUrl: ''})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title="Remove video"
                        >
                          <X className="w-3 h-3" />
                        </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Video URL (Optional)</label>
                      <input 
                        value={formData.videoUrl} 
                        onChange={e => setFormData({...formData, videoUrl: e.target.value})} 
                        placeholder="https://..." 
                        className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">OR Upload Video File</label>
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={e => setSelectedVideo(e.target.files ? e.target.files[0] : null)}
                        className="w-full bg-surface-container-low border border-outline-variant p-2 text-on-background focus:border-primary outline-none transition-colors file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-surface-container file:text-on-background hover:file:bg-surface-container-high cursor-pointer" 
                      />
                      {selectedVideo && (
                        <p className="text-xs text-primary font-bold mt-2">
                          1 video selected (will be added on save)
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2">
                     <input 
                        type="checkbox" 
                        id="showInBanner"
                        checked={formData.showInBanner}
                        onChange={e => setFormData({...formData, showInBanner: e.target.checked})}
                        className="w-4 h-4 accent-primary"
                     />
                     <label htmlFor="showInBanner" className="text-xs uppercase tracking-widest text-on-background font-bold cursor-pointer">
                       Show this video in Homepage Banner
                     </label>
                  </div>
                </div>`;

content = content.replace(targetStr, newVideoStr);

fs.writeFileSync('src/pages/admin/ProductsManagement.tsx', content);
