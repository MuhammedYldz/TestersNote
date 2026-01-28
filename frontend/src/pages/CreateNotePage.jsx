import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storage';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, PhotoIcon, CodeBracketIcon, ClockIcon } from '@heroicons/react/24/outline';
import FocusTimer from '../components/FocusTimer';
import { NOTE_TEMPLATES, CATEGORIES } from '../constants/noteTemplates';

function CreateNotePage() {
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
  
  const handleTemplateChange = (e) => {
    const template = NOTE_TEMPLATES[e.target.value];
    if (template) {
      setFormData(prev => ({
        ...prev,
        description: template
      }));
    }
  };

  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);

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
      // Convert to Base64 for local storage
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

      storageService.createNote(noteData);
      
      navigate('/');
    } catch (error) {
      console.error('Not oluşturulurken hata oluştu:', error);
      alert('Not oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {showFocusTimer && <FocusTimer onClose={() => setShowFocusTimer(false)} />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Yeni Not Oluştur</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFocusTimer(true)}
            className="btn btn-secondary gap-2"
          >
            <ClockIcon className="h-5 w-5"/>
            Odak Modu
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`btn ${previewMode ? 'btn-primary' : 'btn-secondary'} gap-2`}
          >
            {previewMode ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
            {previewMode ? 'Düzenlemeye Dön' : 'Önizleme'}
          </button>
        </div>
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
                >
                  {Object.keys(NOTE_TEMPLATES).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">
                  Notunuzu hızlıca oluşturmak için hazır şablonlardan birini seçin.
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
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-primary-500 transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 relative">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-1 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600">
                        <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 hover:text-primary-500">
                          Dosya Seç
                        </span>
                        <p className="pl-1">veya sürükle bırak</p>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                  {imageUploading && <p className="text-sm text-blue-500 mt-2">Yükleniyor...</p>}
                  {formData.screenshot && (
                    <div className="mt-2 relative group">
                      <img src={formData.screenshot} alt="Preview" className="h-20 w-auto rounded border" />
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, screenshot: '', screenshotFile: null }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900 border-b pb-2 flex items-center gap-2">
                  <CodeBracketIcon className="h-5 w-5"/> Kod Parçacığı
                </h3>
                <textarea
                  name="codeSnippet"
                  value={formData.codeSnippet}
                  onChange={handleChange}
                  rows="8"
                  className="input-field font-mono text-xs bg-slate-900 text-slate-300 border-slate-800 focus:border-slate-700"
                  placeholder="// Kod buraya..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full md:w-auto min-w-[150px] justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Kaydediliyor...
                  </>
                ) : 'Notu Kaydet'}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}

export default CreateNotePage;