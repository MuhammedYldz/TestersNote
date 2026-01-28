export const CATEGORIES = [
  'Genel',
  'Bug',
  'Task',
  'Otomasyon',
  'Fikir',
  'Hızlı Not',
  'İş Akışı'
];

export const NOTE_TEMPLATES = {
  'Seçiniz...': '',
  
  'Bug Raporu': `### 🐛 Bug Özeti
**ID:** [BUG-001]
**Öncelik:** 🔴 Kritik / 🟡 Orta / 🟢 Düşük
**Etki:** [Kullanıcı login olamıyor / Veri kaybı riski vb.]

### 🌍 Ortam Bilgileri
- **Cihaz:** 
- **OS:** 
- **Tarayıcı:** 
- **Versiyon:** 

### 📋 Ön Koşullar
- Kullanıcı giriş yapmış olmalı
- [Örn: Sepette ürün olmalı]

### 👣 Adımlar
1. [Adım 1]
2. [Adım 2]
3. [Adım 3]

### 🧪 Test Verisi
- **Kullanıcı:** test@example.com
- **Şifre:** 123456

### ✅ Beklenen Sonuç
[Kullanıcı başarıyla giriş yapmalı ve anasayfaya yönlendirilmeli]

### ❌ Gerçekleşen Sonuç
[Hata mesajı alınmadan sayfa yenileniyor]

### 🖼️ Görsel Kanıt
- [Ekran görüntüsü eklendi]
- [Video linki]

### 📝 Console Logları
\`\`\`javascript
Error: Unexpected token...
\`\`\`
`,

  'Test Case': `### 🧪 Test Case
**ID:** [TC-001]
**Amaç:** [Login fonksiyonunun doğrulanması]

### 📋 Ön Koşullar
- Uygulama açık olmalı
- Veritabanı bağlantısı aktif olmalı

### 👣 Test Adımları
1. Uygulamayı aç
2. "Giriş Yap" butonuna tıkla
3. Geçerli kullanıcı adı ve şifre gir
4. "Gönder" butonuna bas

### 📊 Test Verisi
| Parametre | Değer |
|-----------|-------|
| Email | user@test.com |
| Şifre | pass123 |

### ✅ Beklenen Sonuç
- Kullanıcı dashboard'a yönlendirilir
- "Hoşgeldiniz" mesajı görünür

### 🔄 Test Sonrası (Post-conditions)
- Oturum kapatılır
`,

  'Otomasyon Notu': `### 🤖 Otomasyon Senaryosu
**Framework:** [Selenium / Cypress / Playwright]
**Ortam:** [Local / Staging / Prod]

### 📜 Senaryo
[Kullanıcı sepete ürün ekler ve ödeme adımına geçer]

### 🎯 Kullanılan Selectorler
- Login Button: \`#btn-login\`
- Cart Icon: \`.cart-icon[data-id="123"]\`

### ⚠️ Karşılaşılan Sorunlar / Flakiness
- [Zaman zaman timeout hatası veriyor]
- [Pop-up bazen geç yükleniyor]

### 🛠️ Bakım Notları
- Selector güncellenmeli
- Wait süresi artırılmalı

### 📄 Hata Logu
\`\`\`
Element not found...
\`\`\`
`,

  'Fikir / İyileştirme': `### 💡 Fikir / Öneri
**Konu:** [Yeni Dashboard Tasarımı]

### 🚧 Mevcut Durum / Problem
[Mevcut dashboard mobilde çok karışık görünüyor ve yüklenmesi uzun sürüyor]

### ✨ Önerilen Çözüm
- Widget yapısına geçilmeli
- Lazy loading kullanılmalı
- [Referans Linki]

### 💎 Değer / Fayda
- Kullanıcı deneyimi artacak
- Sayfa açılış hızı %40 iyileşecek
`,

  'Hızlı Not / Issue': `### ⚡ Hızlı Not
- **Yer:** [Header Menü]
- **Sorun:** [Logo mobilde kayıyor]
- **Aciliyet:** Yüksek
- **Hızlı Çözüm:** [CSS padding değeri 10px yapılmalı]
`,

  'İş Akışı / Workflow': `### 🔄 İş Akışı
**Süreç:** [Üyelik İptal Süreci]
**Aktör:** [Son Kullanıcı]

### ➡️ Akış Adımları
1. **Başlangıç:** Kullanıcı "Ayarlar" sayfasına gider.
2. **Eylem:** "Hesabı Sil" butonuna tıkla.
3. **Sistem:** "Emin misiniz?" modalını gösterir.
4. **Karar:** 
   - *Evet:* Silme API'sini çağır -> Logout yap -> Anasayfaya at.
   - *Hayır:* Modalı kapat.
5. **Bitiş:** Kullanıcı sistemden silinir.

### 🔗 İlgili Servisler
- AuthService
- UserDeletionJob
`
};

export const CATEGORY_COLORS = {
  'Bug': 'bg-red-100 text-red-700',
  'Task': 'bg-blue-100 text-blue-700',
  'Otomasyon': 'bg-purple-100 text-purple-700',
  'Fikir': 'bg-yellow-100 text-yellow-800',
  'Hızlı Not': 'bg-orange-100 text-orange-800',
  'İş Akışı': 'bg-teal-100 text-teal-800',
  'Genel': 'bg-slate-100 text-slate-700',
  'default': 'bg-slate-100 text-slate-700'
};
