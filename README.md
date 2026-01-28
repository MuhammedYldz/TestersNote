# Testers Note

Testers Note, test uzmanlarının notlarını, bug raporlarını ve test senaryolarını yönetmelerine yardımcı olan bir web uygulamasıdır.

## Özellikler

- Not oluşturma, düzenleme ve silme
- Markdown formatında not yazma
- Kod parçacıkları için syntax highlighting
- Ekran görüntüsü yükleme
- Kategorilere göre filtreleme (Bug, Task, Otomasyon, Genel)
- İlgili task linklerini ekleme

## Teknolojiler

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS
- Headless UI
- React Markdown

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (dosya yükleme)
- Cloudinary (görüntü depolama)

## Kurulum

### Gereksinimler
- Node.js
- MongoDB
- Cloudinary hesabı

### Backend Kurulumu

1. Backend klasörüne gidin:
   ```
   cd backend
   ```

2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

3. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli bilgileri doldurun:
   ```
   cp .env.example .env
   ```

4. Sunucuyu başlatın:
   ```
   npm start
   ```

### Frontend Kurulumu

1. Frontend klasörüne gidin:
   ```
   cd frontend
   ```

2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

3. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli bilgileri doldurun:
   ```
   cp .env.example .env
   ```

4. Geliştirme sunucusunu başlatın:
   ```
   npm run dev
   ```

## Kullanım

1. Tarayıcınızda `http://localhost:5173` adresine gidin
2. "Yeni Not Oluştur" butonuna tıklayarak yeni bir not oluşturun
3. Notlarınızı kategorilere göre filtreleyebilirsiniz
4. Notları düzenlemek veya silmek için ilgili butonları kullanın

## Lisans

MIT