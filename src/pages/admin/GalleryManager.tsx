import { useState, useEffect, useRef } from 'react';
import { FiUploadCloud, FiTrash2, FiEye, FiEyeOff, FiEdit2, FiX, FiCheck, FiImage, FiZap } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import api from '../../api';

interface Project {
  _id: string;
  title: string;
  category: string;
  type: string;
  dims: string;
  imageUrl: string;
  altText: string;
  isVisible: boolean;
  gridSpan: string;
}

export default function GalleryManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [error, setError] = useState('');

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop State
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImgSrc, setCropImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const originalFileName = useRef<string>('');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Windows');
  const [type, setType] = useState('');
  const [dims, setDims] = useState('');
  const [altText, setAltText] = useState('');
  const [gridSpan, setGridSpan] = useState('standard');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/api/gallery?limit=100');
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      initCrop(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      initCrop(e.target.files[0]);
    }
  };

  const initCrop = (selectedFile: File) => {
    setCrop(undefined);
    originalFileName.current = selectedFile.name;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setCropImgSrc(reader.result?.toString() || '');
      setShowCropModal(true);
    });
    reader.readAsDataURL(selectedFile);
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) {
      // If they didn't draw a crop box, just proceed with the full image
      setShowCropModal(false);
      if (cropImgSrc) {
         fetch(cropImgSrc)
          .then(res => res.blob())
          .then(blob => {
             const f = new File([blob], originalFileName.current, { type: blob.type });
             processFile(f);
          });
      }
      return;
    }
    
    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const croppedFile = new File([blob], originalFileName.current || 'cropped.jpg', { type: 'image/jpeg' });
      setShowCropModal(false);
      processFile(croppedFile);
    }, 'image/jpeg', 1);
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    // Auto-detect aspect ratio to suggest Grid Layout Span
    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = () => {
      const ratio = img.width / img.height;
      if (ratio >= 1.5) {
        setGridSpan('wide');
      } else if (ratio <= 0.75) {
        setGridSpan('tall');
      } else {
        setGridSpan('standard');
      }
    };

    // AI Analysis
    setAiAnalyzing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await api.post('/api/gallery/analyze-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.data.success && res.data.data) {
        const aiData = res.data.data;
        if (aiData.title) setTitle(aiData.title);
        if (aiData.category) setCategory(aiData.category);
        if (aiData.type) setType(aiData.type);
        if (aiData.dims) setDims(aiData.dims);
        if (aiData.altText) setAltText(aiData.altText);
      }
    } catch (err) {
      console.error('AI analysis failed:', err);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const startEdit = (proj: Project) => {
    setEditingId(proj._id);
    setTitle(proj.title);
    setCategory(proj.category);
    setType(proj.type);
    setDims(proj.dims);
    setAltText(proj.altText || '');
    setGridSpan(proj.gridSpan);
    setFile(null);
    setPreviewUrl(proj.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Windows');
    setType('');
    setDims('');
    setAltText('');
    setGridSpan('standard');
    setFile(null);
    setPreviewUrl(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !file) return; // File is required for new uploads

    setUploading(true);
    setError('');

    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('type', type);
    formData.append('dims', dims);
    formData.append('altText', altText || title);
    formData.append('gridSpan', gridSpan);

    try {
      const token = localStorage.getItem('adminToken');
      
      if (editingId) {
        const res = await api.put(`/api/gallery/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.data.success) {
          cancelEdit();
          fetchProjects();
        }
      } else {
        const res = await api.post('/api/gallery/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.data.success) {
          cancelEdit(); 
          fetchProjects(); 
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (editingId ? 'Update failed' : 'Upload failed'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await api.delete(`/api/gallery/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      // Visibility toggle uses JSON payload
      await api.put(`/api/gallery/${id}`, { isVisible: !currentStatus }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="space-y-8">
      {/* Crop Modal */}
      <AnimatePresence>
        {showCropModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-ink">Crop Image</h3>
                <button onClick={() => setShowCropModal(false)} className="p-2 bg-ink/5 hover:bg-ink/10 rounded-full text-ink transition-colors">
                  <FiX className="text-xl" />
                </button>
              </div>
              <div className="flex-grow overflow-auto bg-ink/5 rounded-2xl flex items-center justify-center p-4 min-h-[50vh]">
                <ReactCrop 
                  crop={crop} 
                  onChange={(_, percentCrop) => setCrop(percentCrop)} 
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img ref={imgRef} src={cropImgSrc} alt="Crop preview" className="max-h-[60vh] object-contain" />
                </ReactCrop>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button onClick={() => setShowCropModal(false)} className="px-6 py-3 font-bold text-ink bg-ink/5 hover:bg-ink/10 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleCropComplete} className="px-6 py-3 font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors">Confirm Crop</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-3xl font-heading font-black tracking-tighter">Gallery Management</h1>
        <p className="text-ink/60 mt-1">Upload, edit, and manage projects shown in the Our Works section.</p>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">{error}</div>}

      {/* Upload/Edit Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-3xl shadow-sm border transition-all duration-300 ${editingId ? 'bg-primary/5 border-primary/20' : 'bg-white border-ink/5'}`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black flex items-center gap-3">
            {editingId ? (
              <><span className="p-2 bg-primary/10 text-primary rounded-xl"><FiEdit2 /></span> Edit Project</>
            ) : (
              <><span className="p-2 bg-ink/5 text-ink rounded-xl"><FiUploadCloud /></span> Add New Project</>
            )}
          </h2>
          {editingId && (
            <button onClick={cancelEdit} className="text-sm font-bold text-ink/50 hover:text-ink flex items-center gap-1 transition-colors">
              <FiX /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Drag & Drop Zone */}
          <div className="lg:col-span-5 flex flex-col">
            <label className="block text-sm font-bold text-ink/70 mb-3">Project Image</label>
            
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-full flex-grow min-h-[300px] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center group
                ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-dashed border-ink/20 hover:border-primary/50 hover:bg-primary/5'}
                ${previewUrl ? 'border-solid border-transparent shadow-md' : ''}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <AnimatePresence>
                {previewUrl ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold flex items-center gap-2">
                        <FiUploadCloud /> Replace Image
                      </span>
                    </div>
                    
                    {/* Premium AI Loader Overlay */}
                    <AnimatePresence>
                      {aiAnalyzing && (
                        <motion.div 
                          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                          animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                          className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center z-10"
                        >
                          <div className="relative w-16 h-16 flex items-center justify-center">
                            <motion.div 
                              animate={{ rotate: 360 }} 
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                              className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-r-primary"
                            />
                            <motion.div 
                              animate={{ rotate: -360 }} 
                              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                              className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-secondary border-l-secondary"
                            />
                            <FiZap className="text-primary text-xl animate-pulse" />
                          </div>
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-sm font-bold text-ink bg-white/80 px-4 py-2 rounded-full shadow-sm"
                          >
                            AI Analyzing Image...
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-ink/40 group-hover:text-primary transition-colors"
                  >
                    <FiImage className="text-4xl mb-3" />
                    <p className="font-bold">Click or drag image here</p>
                    <p className="text-xs mt-1 opacity-70">Supports JPG, PNG, WEBP</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-ink/70 mb-2">Project Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ink/5 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-ink" placeholder="e.g. Corporate Boardroom" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink/70 mb-2">Category</label>
              <div className="relative">
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ink/5 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-ink appearance-none cursor-pointer">
                  <option value="Windows">Windows</option>
                  <option value="Doors">Doors</option>
                  <option value="Partitions">Partitions</option>
                  <option value="Sliders">Sliders</option>
                  <option value="Profiles">Profiles</option>
                  <option value="Tuffan">Tuffan Glass</option>
                  <option value="Custom">Custom Work</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-ink/70 mb-2">Grid Layout Span</label>
              <select value={gridSpan} onChange={e => setGridSpan(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ink/5 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-ink appearance-none cursor-pointer">
                <option value="standard">Standard (1x1)</option>
                <option value="wide">Wide (2x1)</option>
                <option value="tall">Tall (1x2)</option>
                <option value="large">Large (2x2)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-ink/70 mb-2">Specific Type</label>
              <input type="text" value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ink/5 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-ink" placeholder="e.g. Glass & Aluminium Partition" required />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-ink/70 mb-2">Features / Material Tag</label>
              <input type="text" value={dims} onChange={e => setDims(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ink/5 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-ink" placeholder="e.g. Sound Proofed" required />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-ink/70 mb-2">Alt Text (SEO)</label>
              <input type="text" value={altText} onChange={e => setAltText(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ink/5 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-ink" placeholder="Description for screen readers" />
            </div>

            <div className="md:col-span-2 pt-2">
              <button type="submit" disabled={uploading || aiAnalyzing} className="w-full bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-primary-dark transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 text-lg shadow-lg shadow-primary/20">
                {editingId ? <FiCheck className="text-xl" /> : <FiUploadCloud className="text-xl" />} 
                {uploading ? (editingId ? 'Updating...' : 'Uploading...') : (editingId ? 'Update Project' : 'Upload Project to Gallery')}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Gallery Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-ink/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ink/5 text-ink/70 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Image Preview</th>
                <th className="p-4 font-bold">Details</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Span</th>
                <th className="p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-ink/50">Loading projects...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-ink/50">No projects found. Upload one above.</td></tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj._id} className={`border-t border-ink/5 transition-colors ${editingId === proj._id ? 'bg-primary/5' : 'hover:bg-ink/5'}`}>
                    <td className="p-4">
                      {/* Enhanced Image Visibility - larger 40x28 box with object-cover */}
                      <div className="w-40 h-28 rounded-lg overflow-hidden bg-ink/10 relative group">
                        <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        {!proj.isVisible && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Hidden</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-ink">{proj.title}</p>
                      <p className="text-xs text-ink/60 mt-1">{proj.type}</p>
                      <p className="text-xs text-ink/40">{proj.dims}</p>
                    </td>
                    <td className="p-4"><span className="px-3 py-1 bg-ink/5 rounded-full text-xs font-bold">{proj.category}</span></td>
                    <td className="p-4 text-sm font-medium">{proj.gridSpan}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleVisibility(proj._id, proj.isVisible)} className={`p-2 rounded-lg transition-colors ${proj.isVisible ? 'text-primary hover:bg-primary/10' : 'text-ink/40 hover:bg-ink/10'}`} title={proj.isVisible ? "Hide from Gallery" : "Show in Gallery"}>
                          {proj.isVisible ? <FiEye /> : <FiEyeOff />}
                        </button>
                        <button onClick={() => startEdit(proj)} className="p-2 rounded-lg text-ink/50 hover:bg-ink/10 hover:text-ink transition-colors" title="Edit Project">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(proj._id)} className="p-2 rounded-lg text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete Project">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
