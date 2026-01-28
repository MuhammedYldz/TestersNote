import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Tab } from '@headlessui/react';
import { PencilIcon, TrashIcon, ClipboardDocumentIcon, PlusIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, CATEGORY_COLORS } from '../constants/noteTemplates';

function HomePage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categories = ['Tümü', ...CATEGORIES];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = (category = '') => {
    try {
      setLoading(true);
      let allNotes = storageService.getNotes();
      
      if (category && category !== 'Tümü') {
        allNotes = allNotes.filter(note => note.category === category);
      }
      
      setNotes(allNotes);
      setError(null);
    } catch (err) {
      console.error('Notlar yüklenirken hata oluştu:', err);
      setError('Notlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu notu silmek istediğinize emin misiniz?')) {
      try {
        storageService.deleteNote(id);
        // Notu listeden kaldır
        setNotes(notes.filter(note => note._id !== id));
      } catch (err) {
        console.error('Not silinirken hata oluştu:', err);
        alert('Not silinirken bir hata oluştu.');
      }
    }
  };

  const handleCopy = (note) => {
    const envText = note.environment ? `\n*Ortam:* ${note.environment.os || '-'} / ${note.environment.browser || '-'} / ${note.environment.device || '-'}` : '';
    const text = `*[${note.category}] ${note.title}*\n\n${note.description}${envText}\n\n*Link:* ${note.taskLink || '-'}`;
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Not panoya kopyalandı!');
    }).catch(err => {
      console.error('Kopyalama hatası:', err);
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const renderNoteCard = (note) => (
    <motion.div 
      variants={item}
      key={note._id} 
      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 
            ${CATEGORY_COLORS[note.category] || CATEGORY_COLORS['default']}`}>
            {note.category}
          </span>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-1">{note.title}</h3>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => handleCopy(note)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Kopyala">
            <ClipboardDocumentIcon className="h-4 w-4" />
          </button>
          <Link to={`/edit/${note._id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Düzenle">
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button onClick={() => handleDelete(note._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {note.environment && (note.environment.browser || note.environment.os) && (
        <div className="flex items-center gap-2 mb-3 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
          <span className="font-medium">Ortam:</span>
          {note.environment.os} {note.environment.browser} {note.environment.device}
        </div>
      )}
      
      <div className="prose prose-sm prose-slate mb-4 line-clamp-3 max-h-24 overflow-hidden">
        <ReactMarkdown
          children={note.description}
          components={{
            code({node, inline, className, children, ...props}) {
              return <code className="bg-slate-100 px-1 py-0.5 rounded text-xs" {...props}>{children}</code>
            }
          }}
        />
      </div>
      
      {note.screenshot && (
        <div className="mb-4 rounded-lg overflow-hidden border border-slate-100">
          <img 
            src={note.screenshot} 
            alt="Ekran görüntüsü" 
            className="w-full h-32 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="flex justify-between items-center pt-3 border-t border-slate-50">
        <div className="text-xs text-slate-400 font-medium">
          {new Date(note.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </div>
        {note.taskLink && (
          <a 
            href={note.taskLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-xs font-semibold flex items-center gap-1"
          >
            Taska Git &rarr;
          </a>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notlarım</h1>
            <p className="text-slate-500 mt-1">Test notlarınızı yönetin ve düzenleyin</p>
          </div>
          <Link to="/create" className="btn btn-primary shadow-lg shadow-primary-500/30">
            <PlusIcon className="h-5 w-5 mr-2" />
            Yeni Not
          </Link>
        </div>
        
        <Tab.Group>
          <Tab.List className="flex space-x-2 rounded-xl bg-white p-1.5 shadow-sm border border-slate-200 mb-8 max-w-2xl">
            {categories.map((category) => (
              <Tab
                key={category}
                onClick={() => fetchNotes(category)}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 focus:outline-none
                   ${selected
                    ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          
          <Tab.Panels>
            {categories.map((category, idx) => (
              <Tab.Panel key={idx}>
                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-red-600 font-medium">{error}</p>
                  </div>
                ) : notes.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300"
                  >
                    <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ClipboardDocumentIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Henüz not bulunmuyor</h3>
                    <p className="text-slate-500 mt-1 mb-6">Bu kategoride henüz bir not oluşturmadınız.</p>
                    <Link 
                      to="/create" 
                      className="btn btn-primary"
                    >
                      İlk Notu Oluştur
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    <AnimatePresence>
                      {notes.map(note => renderNoteCard(note))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

export default HomePage;