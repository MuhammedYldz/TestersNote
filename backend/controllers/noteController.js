const Note = require('../models/Note');
const cloudinary = require('cloudinary').v2;

// Tüm notları getir (kategoriye göre filtreleme opsiyonlu)
exports.getNotes = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    // Eğer kategori belirtilmişse, filtreleme yap
    if (category) {
      query.category = category;
    }
    
    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error('Notlar getirilirken hata oluştu:', error);
    res.status(500).json({ message: 'Notlar getirilirken bir hata oluştu' });
  }
};

// Tekil not getir
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Not bulunamadı' });
    }
    
    res.status(200).json(note);
  } catch (error) {
    console.error('Not getirilirken hata oluştu:', error);
    res.status(500).json({ message: 'Not getirilirken bir hata oluştu' });
  }
};

// Yeni not oluştur
exports.createNote = async (req, res) => {
  try {
    const { title, description, category, codeSnippet, taskLink } = req.body;
    let screenshot = '';
    
    // Eğer dosya yüklendiyse
    if (req.file) {
      // Cloudinary'ye yükle
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'testers-note',
      });
      screenshot = result.secure_url;
    }
    
    const newNote = new Note({
      title,
      description,
      category,
      codeSnippet: codeSnippet || '',
      taskLink: taskLink || '',
      screenshot
    });
    
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Not oluşturulurken hata oluştu:', error);
    res.status(500).json({ message: 'Not oluşturulurken bir hata oluştu' });
  }
};

// Not güncelle
exports.updateNote = async (req, res) => {
  try {
    const { title, description, category, codeSnippet, taskLink, browser, os, device } = req.body;
    let updateData = {
      title,
      description,
      category,
      codeSnippet: codeSnippet || '',
      taskLink: taskLink || '',
      environment: {
        browser: browser || '',
        os: os || '',
        device: device || ''
      },
      updatedAt: Date.now()
    };
    
    // Eğer dosya yüklendiyse
    if (req.file) {
      // Cloudinary'ye yükle
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'testers-note',
      });
      updateData.screenshot = result.secure_url;
    }
    
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedNote) {
      return res.status(404).json({ message: 'Not bulunamadı' });
    }
    
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Not güncellenirken hata oluştu:', error);
    res.status(500).json({ message: 'Not güncellenirken bir hata oluştu' });
  }
};

// Not sil
exports.deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    
    if (!deletedNote) {
      return res.status(404).json({ message: 'Not bulunamadı' });
    }
    
    // Eğer not silinirken ekran görüntüsü varsa, Cloudinary'den de sil
    if (deletedNote.screenshot) {
      // URL'den public_id çıkar
      const publicId = deletedNote.screenshot.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`testers-note/${publicId}`);
    }
    
    res.status(200).json({ message: 'Not başarıyla silindi' });
  } catch (error) {
    console.error('Not silinirken hata oluştu:', error);
    res.status(500).json({ message: 'Not silinirken bir hata oluştu' });
  }
};