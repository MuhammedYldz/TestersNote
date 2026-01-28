import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storageService } from '../services/storage';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, PhotoIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { NOTE_TEMPLATES, CATEGORIES } from '../constants/noteTemplates';

function EditNotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Genel',
    description: '',
    codeSnippet: '',
    taskLink: '',
    browser: '',
    os: '',
    device: '',
    screenshot: '',
    screenshotFile: null
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
        try {
          setFetchLoading(true);
          const note = storageService.getNoteById(id);
          
          if (!note) {
            alert('Not bulunamadı');
            navigate('/');
            return;
          }
    
          setFormData({
            ...note,
            browser: note.environment?.browser || '',
            os: note.environment?.os || '',
            device: note.environment?.device || ''
          });
        } catch (err) {
          console.error('Not yüklenirken hata oluştu:', err);
          alert('Not yüklenirken bir hata oluştu.');
        } finally {
          setFetchLoading(false);
        }
      };
      
    fetchNote();
  }, [id, navigate]);

  const handleTemplateChange = (e) => {
    const template = NOTE_TEMPLATES[e.target.value];
    if (template) {
      if(window.confirm('Mevcut açıklama silinecek. Devam etmek istiyor musunuz?')) {
        setFormData(prev => ({
            ...prev,
            description: template
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const base64 = await convertToBase64(file);
      
      setFormData(prev => ({
        ...prev,
        screenshot: base64,
        screenshotFile: file
      }));
    } catch (error) {
      console.error("Görüntü dönüştürme hatası:", error);
      alert("Görüntü yüklenirken bir hata oluştu.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const noteData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        codeSnippet: formData.codeSnippet || '',
        taskLink: formData.taskLink || '',
        environment: {
          browser: formData.browser || '',
          os: formData.os || '',
          device: formData.device || ''
        },
        screenshot: formData.screenshot || ''
      };

      storageService.updateNote(id, noteData);
      
      navigate('/');
    } catch (error) {
      console.error('Not güncellenirken hata oluştu:', error);
      alert('Not güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
      return <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Notu Düzenle</h1>
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className={`btn ${previewMode ? 'btn-primary' : 'btn-secondary'} gap-2`}
        >
          {previewMode ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
          {previewMode ? 'Düzenlemeye Dön' : 'Önizleme'}
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {previewMode ? (
          <div className="p-8 prose prose-slate max-w-none">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{formData.title || 'Başlıksız Not'}</h1>
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600 font-medium">
                {formData.category}
              </span>
              {(formData.os || formData.browser || formData.device) && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {[formData.os, formData.browser, formData.device].filter(Boolean).join(' • ')}
                </span>
              )}
            </div>
            
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 mb-6">
              <ReactMarkdown
                children={formData.description || '*Açıklama girilmedi*'}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        children={String(children).replace(/\n$/, '')}
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      />
                    ) : (
                      <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 text-sm" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              />
            </div>

            {formData.codeSnippet && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Kod Parçacığı</h3>
                <SyntaxHighlighter 
                  language="javascript" 
                  style={tomorrow}
                  className="rounded-xl !bg-slate-900"
                >
                  {formData.codeSnippet}
                </SyntaxHighlighter>
              </div>
            )}

            {formData.screenshot && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ekran Görüntüsü</h3>
                <img src={formData.screenshot} alt="Preview" className="rounded-xl border border-slate-200 shadow-sm" />
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="Not başlığı..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                  Hızlı Şablonlar
                </h3>
                <select 
                  onChange={handleTemplateChange}
                  className="input-field"
                  defaultValue="Seçiniz..."
                >
                  {Object.keys(NOTE_TEMPLATES).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">
                  Şablon seçimi mevcut açıklamayı değiştirecektir.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama (Markdown destekler)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="8"
                className="input-field font-mono text-sm"
                required
                placeholder="# Başlık&#10;- Liste öğesi&#10;**Kalın yazı**"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900 border-b pb-2">Ortam Bilgileri</h3>
                <input
                  type="text"
                  name="browser"
                  value={formData.browser}
                  onChange={handleChange}
                  placeholder="Browser (Chrome 120...)"
                  className="input-field"
                />
                <input
                  type="text"
                  name="os"
                  value={formData.os}
                  onChange={handleChange}
                  placeholder="OS (macOS, Windows...)"
                  className="input-field"
                />
                <input
                  type="text"
                  name="device"
                  value={formData.device}
                  onChange={handleChange}
                  placeholder="Cihaz (iPhone 14...)"
                  className="input-field"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900 border-b pb-2">Ekler</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Task Linki</label>
                  <input
                    type="url"
                    name="taskLink"
                    value={formData.taskLink}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://jira..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ekran Görüntüsü</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors">
                      <PhotoIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Görsel Seç</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {imageUploading && <span className="text-xs text-slate-500">Yükleniyor...</span>}
                    {formData.screenshot && !imageUploading && (
                      <span className="text-xs text-green-600 font-medium">✓ Seçildi</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="font-medium text-slate-900 border-b pb-2">Kod</h3>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kod Parçacığı</label>
                  <div className="relative">
                    <textarea
                        name="codeSnippet"
                        value={formData.codeSnippet}
                        onChange={handleChange}
                        rows="5"
                        className="input-field font-mono text-sm"
                        placeholder="// Kod buraya..."
                    ></textarea>
                    <CodeBracketIcon className="absolute top-3 right-3 w-5 h-5 text-slate-400" />
                  </div>
                 </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}

export default EditNotePage;