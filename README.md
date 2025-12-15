## Odaklanma Takibi ve Raporlama Uygulaması

React Native + Expo ile geliştirilmiş, odaklanma seanslarını (Pomodoro benzeri) takip eden,
uygulamadan çıkışları “dikkat dağınıklığı” olarak sayan ve bu verileri grafiklerle raporlayan
bir mobil uygulamadır.

---

## Özellikler

- **⏱️ Odaklanma Zamanlayıcısı**
  - Varsayılan 25 dakika, 1–120 dakika arası ayarlanabilir geri sayım sayacı.
  - Başlat / Duraklat / Sıfırla butonları.

- **📂 Kategori Bazlı Takip**
  - Seans başlamadan önce kategori seçimi zorunludur.
  - Mevcut kategoriler: `Studying`, `Coding`, `Project`, `Reading`, `Revision`, `Break`.

- **🔔 Dikkat Dağınıklığı Tespiti (AppState)**
  - Sayaç çalışırken uygulamadan çıkarsanız (background), sayaç otomatik duraklatılır.
  - Her çıkış bir “dikkat dağınıklığı” olarak sayılır ve sayaç ekranında gösterilir.

- **💾 Yerel Veritabanı (SQLite)**
  - Tüm seanslar cihaz üzerinde SQLite veritabanında saklanır.
  - Veriler çevrimdışı olarak da korunur; uygulama kapansa bile silinmez.

- **📊 Raporlar ve Analitik**
  - Bugünün toplam odaklanma süresi.
  - Tüm zamanların toplam odaklanma süresi.
  - Toplam dikkat dağınıklığı sayısı.
  - Son 7 güne ait odaklanma süreleri için çubuk grafik (Bar Chart).
  - Kategorilere göre odaklanma süreleri için pasta grafik (Pie Chart).

- **🕒 Seans Geçmişi (Session History)**
  - Tüm seansların listesi (kategori, süre, tarih-saat, dikkat dağınıklığı sayısı).

- **🎨 Modern Arayüz + Light / Dark Tema**
  - Profesyonel renk paleti ve kart tabanlı tasarım.
  - Uygulama içinden Light / Dark mod arasında geçiş yapılabilir.

---

## Teknoloji Yığını

- **React Native (Expo Managed Workflow)**
- **React Navigation** – Bottom Tab Navigator ile iki ana ekran:
  - `HomeScreen` (Zamanlayıcı)
  - `ReportsScreen` (Raporlar)
- **Expo SQLite** – Yerel veritabanı, `focus_sessions` tablosu.
- **react-native-chart-kit** – Bar ve Pie chart görselleştirmeleri.
- **React Hooks** – Fonksiyonel bileşen mimarisi.

---

## Kurulum ve Çalıştırma

1. **Depoyu klonla veya proje klasörünü indir**

```bash
git clone <repo-url>
cd mobil_proje
```

2. **Bağımlılıkları yükle**

```bash
npm install
```

3. **Expo geliştirme sunucusunu başlat**

```bash
npx expo start
```

4. **Uygulamayı cihazda / emülatörde aç**
   - Telefonundan **Expo Go** uygulamasını açıp ekrandaki QR kodu tara, veya
   - Terminalde:
     - `a` → Android emülatör
     - `i` → iOS simülatör (macOS üzerinde)

---

## Proje Yapısı

```text
src/
  navigation/
    TabNavigator.js        // Alt menü (Timer & Reports sekmeleri)
  screens/
    HomeScreen.js          // Zamanlayıcı ve kategori seçimi
    ReportsScreen.js       // Raporlar, grafikler ve seans geçmişi
  components/
    TimerDisplay.js        // Geri sayım sayacı bileşeni
    CategoryPicker.js      // Kategori seçim kartları
    SessionSummaryModal.js // Seans özeti modal penceresi
    StatCard.js            // Özet istatistik kartı
  hooks/
    useFocusTimer.js       // Zamanlayıcı + AppState (dikkat dağınıklığı) mantığı
  data/
    database.js            // SQLite veritabanı işlemleri
  utils/
    dateUtils.js           // Tarih/saat ve süre formatlama fonksiyonları
    chartUtils.js          // Grafikler için veri hazırlama ve kategori renkleri
  styles/
    colors.js              // Light/Dark tema renk paletleri
    layout.js              // Layout ve gölge (shadow) sabitleri
```

---

## Kullanım Senaryoları

### 1. Odaklanma Seansı Başlatma

1. `Timer` (veya `Focus Timer`) sekmesine geçin.  
2. Kategorilerden birini seçin (**zorunlu**).  
3. İsterseniz süreyi dakika cinsinden güncelleyin (varsayılan: 25).  
4. **Start** butonuna basarak seansı başlatın.

### 2. Seans Sırasında

- Sayaç otomatik olarak geri sayar.  
- Uygulamadan çıktığınızda:
  - Sayaç duraklatılır.
  - Dikkat dağınıklığı sayacı +1 artar.  
- Uygulamaya döndüğünüzde tekrar **Start** ile devam edebilirsiniz.  
- İstediğiniz anda **Pause** veya **Reset** butonlarını kullanabilirsiniz.

### 3. Seansı Bitirme ve Özet

- Sayaç sıfıra ulaştığında **seans otomatik tamamlanır**:
  - Seans SQLite veritabanına kaydedilir.
  - Ekrana **Session Summary** penceresi gelir.
- Eğer süre bitmeden **Reset** ile seansı sonlandırırsanız:
  - Geçen süre hesaplanır.
  - Bu süreyle birlikte seans kaydı oluşturulur ve yine özet ekranı gösterilir.

### 4. Raporları Görüntüleme

1. `Reports` sekmesine geçin.  
2. Üstteki kartlardan:
   - Bugünkü toplam odaklanma süresini,
   - Tüm zamanların toplam odaklanma süresini,
   - Toplam dikkat dağınıklığı sayısını görebilirsiniz.
3. Aşağıda:
   - Son 7 güne ait çubuk grafiği,
   - Kategori dağılımını gösteren pasta grafiğini inceleyebilirsiniz.
4. En altta **Session History** bölümünde tüm seanslar liste halinde gösterilir.

Verileri güncellemek için ekranı aşağı doğru çekerek **yenileme (pull-to-refresh)** yapabilirsiniz.

---

## Veritabanı Şeması

Uygulama aşağıdaki SQLite tablosunu kullanır:

```sql
focus_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  duration_minutes INTEGER NOT NULL,
  distraction_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
```

Her odaklanma seansı için bir kayıt oluşturulur. Bu kayıtlar rapor ekranında istatistik ve grafik üretmek için kullanılır.

---

## Gereksinimler

- Node.js 14+  
- npm veya yarn paket yöneticisi  
- Expo CLI (global veya `npx` ile)  
- Test için telefonunuzda **Expo Go** uygulaması veya bir Android/iOS emülatörü

---

## Notlar

- Proje **Expo Managed Workflow** ile geliştirilmiştir.  
- Android Studio veya Xcode üzerinde ek native modül kurulumu gerektirmez.  
- Tüm veriler cihazın kendi veritabanında (SQLite) yerel olarak saklanır.  
- Uygulama hem Light hem de Dark temayı destekler.


