# AGENT.md

## Proje Amaci

Bu proje, su anda yalnizca frontend tarafi calisan ve gecmiste Strapi'den veri ceken bir Next.js yapisindan, tamamen bagimsiz calisan bir full-stack Next.js uygulamasina donusturulecektir.

Hedef yapi:

- Tek Next.js proje
- Tek deploy
- Frontend + Admin Panel ayni kod tabani
- MySQL veritabani
- Prisma ORM
- Auth sistemi
- Dosya yukleme sistemi
- Strapi bagimliliginin tamamen kaldirilmasi
- Eski frontend korunarak veri kaynaginin local CMS yapisina donusturulmesi

Bu proje Coolify uzerinde deploy edilebilir sekilde hazirlanmalidir.

---

## Mevcut Durum

Su anda proje yapisi yaklasik olarak su sekildedir:

- Proje kok klasoru: `macework`
- Uygulama klasoru: `frontend`
- Next.js projesi `frontend` altinda calisiyor
- Projede gecmiste Strapi icin yazilmis veri cekme mantiklari olabilir
- Strapi artik kaldirildi
- Eski Strapi fetch mantiklari temizlenmeli
- Yeni yapi Next.js icinde full-stack hale getirilmeli

---

## Genel Hedefler

Agent asagidaki hedefleri yerine getirmelidir:

1. Mevcut `frontend` uygulamasini bozmadan incele
2. Strapi ile ilgili tum bagimliliklari tespit et ve kaldir
3. Projeyi temiz ve profesyonel bir klasor yapisina gecir
4. Admin panel altyapisini ekle
5. MySQL + Prisma entegrasyonunu kur
6. Basit ama genisletilebilir bir auth sistemi ekle
7. Upload sistemi kur
8. Frontend'deki sabit veya Strapi tabanli icerikleri veritabani tabanli yonetime uygun hale getir
9. Tek deploy ile calisacak mimari kur
10. Projeyi production-ready hale yaklastir

---

## Cok Onemli Kurallar

### 1. Mevcut tasarimi koru

Frontend tarafindaki mevcut gorsel yapi, component sistemi ve sayfa akisi mumkun oldugunca korunmalidir.

### 2. Kirip yeniden yazma

Gereksiz yere tum projeyi sifirdan kurma. Once mevcut yapiyi analiz et, sonra kademeli donustur.

### 3. Strapi'yi tamamen kaldir

Projede Strapi'ye ait:

- fetch fonksiyonlari
- endpoint URL'leri
- env degiskenleri
- yardimci dosyalar
- test dosyalari
- gecici scriptler

tamamen kaldirilmali veya yeniden duzenlenmelidir.

### 4. Tek proje yaklasimi

Frontend ve admin panel ayri repo ya da ayri uygulama olmayacak. Her sey tek Next.js uygulamasi icinde olacak.

### 5. Kod yapisi sade olmali

Asiri karmasik enterprise mimari kurma. Kullanilabilir, sade, ajans tipi bir yonetim paneli yapisi kur.

### 6. Dosya isimlendirmeleri duzenli olmali

Tutarli isimlendirme kullanilmali. Gereksiz, test amacli veya artik kullanilmayan dosyalar temizlenmeli.

### 7. Her islem sonrasi calisan sistem hedeflenmeli

Parcali ama calisan adimlar tercih edilmeli.

---

## Istenen Nihai Mimari

Uygulama asagidaki mantikta calismalidir:

- `/` -> kurumsal frontend
- `/admin` -> admin panel
- `/login` -> admin giris
- `/api/*` -> backend islemleri
- `prisma/` -> veritabani semasi ve migrationlar
- `public/uploads/` -> yuklenen medya dosyalari

---

## Istenen Teknolojiler

### Ana Teknolojiler

- Next.js
- TypeScript
- Tailwind CSS
- MySQL
- Prisma ORM
- Auth.js veya benzeri session tabanli auth sistemi
- Server Actions ve/veya Route Handlers
- Local file upload sistemi

### Izin Verilen Yardimci Yapilar

- Zod
- bcrypt
- react-hook-form
- sonner veya benzeri toast sistemi
- shadcn/ui
- lucide-react

### Gereksiz Teknolojilerden Kacin

Asagidaki gibi gereksiz karmasikliklardan kacinilmali:

- Mikroservis mimarisi
- Ayri backend servisi
- Gereksiz Docker karmasasi
- Simdilik S3/Cloudinary zorunlulugu
- Agir CMS cozumleri

---

## Yeni Klasor Yapisi Hedefi

Mevcut `frontend` klasoru icinde yapi mumkun oldugunca asagidaki standarda yaklastirilmalidir:

```bash
frontend/
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
|-- public/
|   `-- uploads/
|-- src/
|   |-- app/
|   |   |-- (site)/
|   |   |   |-- page.tsx
|   |   |   |-- hakkimizda/
|   |   |   |-- iletisim/
|   |   |   `-- ...
|   |   |-- (admin)/
|   |   |   |-- admin/
|   |   |   |   |-- page.tsx
|   |   |   |   |-- products/
|   |   |   |   |-- services/
|   |   |   |   |-- projects/
|   |   |   |   |-- messages/
|   |   |   |   |-- settings/
|   |   |   |   `-- media/
|   |   |   `-- login/
|   |   |       `-- page.tsx
|   |   |-- api/
|   |   |   |-- auth/
|   |   |   |-- upload/
|   |   |   `-- ...
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   `-- not-found.tsx
|   |-- components/
|   |   |-- site/
|   |   |-- admin/
|   |   |-- ui/
|   |   `-- shared/
|   |-- lib/
|   |   |-- prisma.ts
|   |   |-- auth.ts
|   |   |-- upload.ts
|   |   |-- utils.ts
|   |   |-- validations/
|   |   `-- permissions.ts
|   |-- actions/
|   |   |-- admin/
|   |   |-- auth/
|   |   `-- site/
|   |-- data/
|   |   `-- fallback/
|   |-- types/
|   |-- hooks/
|   `-- middleware.ts
|-- .env.example
|-- package.json
|-- next.config.ts
`-- README.md
```

---

## Admin Panel UX/UI Gelistirme Task Listesi

Asagidaki gorevler admin panelin bir sonraki gelisim yol haritasi olarak 10 ayri faza bolunmustur.
Her faz, tek tek planlanip uygulanabilecek sekilde checklist yapisinda tanimlanmistir.

### Faz 01 - Listeleme Deneyimi

- [x] Urunler, cozumler, projeler, blog ve sablonlar sayfalarina arama ekle
- [x] Yayin durumu, kategori, one cikan, tarih gibi filtreler ekle
- [x] Siralama secenekleri ekle: yeni-eski, A-Z, sira no, yayin durumu
- [x] Liste sayfalarinda sonuc sayisi ve aktif filtre ozetini goster

### Faz 02 - Form Bilgi Mimarisi

- [x] Uzun formlari sekmeli yapiya tasi: Genel, Medya, Icerik, Yayin, SEO
- [x] Alanlari mantiksal gruplar halinde yeniden yerlestir
- [x] Her sekmede kisa aciklayici yardim metinleri ekle
- [x] Form yogunlugunu azaltmak icin ikincil alanlari ikincil bloklara al

### Faz 03 - Sticky Kayit Alani

- [x] Uzun formlarda sabit ust veya alt aksiyon bari ekle
- [x] Bar icine Kaydet, Taslak, Yayinla, Sil gibi islemleri yerlestir
- [x] Degisiklik yapildiginda kaydedilmemis degisiklik durumu goster
- [x] Kayit sirasinda loading ve basari durumu net sekilde goster

### Faz 04 - Duzenleme Akisinin Iyilestirilmesi

- [x] Inline details yapisini degerlendir ve gerekli alanlarda ayri edit sayfasi kullan
- [x] Blog, proje ve sablon gibi uzun iceriklerde ayri edit ekranina gec
- [x] Liste sayfalarinda hizli goruntule ve tam duzenle aksiyonlarini ayir
- [x] Edit sayfalarinda breadcrumb ve geri donus akisi ekle

### Faz 05 - Medya Kutuphanesi V2

- [x] Medya kutuphanesine arama ekle
- [x] Dosya turu filtresi ekle: tumu, sadece gorseller, diger dosyalar
- [x] Dosya boyutu, mime type, olcu gibi metadata gostergeleri ekle
- [x] Gorseller icin alt metin ve aciklama gibi alanlar planla

Faz 05 notu:

- Alt metin ve aciklama icin onerilen veri modeli: `MediaFile.altText String?` ve `MediaFile.description String? @db.Text`
- Bu alanlar sonraki veritabani migration adiminda eklenmeli; mevcut Faz 05 uygulamasi migration riski almadan arama, filtre ve metadata gorunumunu tamamlar
- Alanlar eklendiginde medya kartindan ayri bir medya detay paneli veya modal uzerinden duzenlenmeli

### Faz 06 - Galeri Siralama Deneyimi

- [ ] Proje ve benzeri alanlarda secilen gorseller icin surukle-birak siralama ekle
- [ ] Ilk gorselin kapak veya one cikan gorsel olarak kullanilabilmesini destekle
- [ ] Gorsel kartlari uzerinde kaldir, one al, sona al gibi hizli aksiyonlar ekle
- [ ] Mobilde de calisacak sekilde basit ve stabil bir siralama deneyimi kur

### Faz 07 - Onizleme ve Canli Baglanti

- [x] Her icerik turu icin canli sayfayi ac aksiyonu ekle
- [x] Mumkunse taslak icerikler icin onizleme link yapisi tasarla
- [x] Form ekraninda slug ve public URL iliskisini net goster
- [x] Onizleme akisinda yeni sekmede acilis ve hata durumlarini ele al

Faz 07 notu:

- Taslak onizleme akisi `/admin/preview/[type]/[slug]` route'u uzerinden calisir
- Public sayfa linkleri sadece kayitli ve yayindaki iceriklerde aktif kalir
- Slug bos, kayit henuz olusmamis veya icerik taslak ise ilgili aksiyon disabled durumunda aciklayici title ile gosterilir

### Faz 08 - Mesaj Merkezi Deneyimi

- [x] Mesajlar sayfasini inbox benzeri iki kolonlu yapiya donustur
- [x] Solda mesaj listesi, sagda secili mesaj detayi goster
- [x] Yeni, okundu, arsiv durumlari icin hizli filtreler ekle

### Faz 09 - Dashboard Operasyon Katmani

- [x] Yanit bekleyen mesajlar karti ekle
- [x] Son guncellenen icerikler listesi ekle
- [x] Hizli ekle kisayollari ekle: urun, proje, blog, sablon, medya

### Faz 10 - Geri Bildirim ve Guven Katmani

- [x] Basarili ve hatali islemler icin toast sistemi ekle
- [x] Silme islemleri icin confirm modal ekle
- [x] Formdan cikarken kaydedilmemis degisiklik uyarisi ekle
- [x] Kritik aksiyonlar icin daha guclu durum geri bildirimi sagla

### Faz 11 - Sayfa Yonetimi ve Ana Sayfa CMS Katmani

Bu faz, sitedeki statik veya yari-statik sayfa bolumlerini admin panelden yonetilebilir hale getirmek icin planlanmistir. Once `Sayfalar` admin menusu eklenecek, sonra her sayfa kendi duzenleme ekraniyla kademeli olarak CMS yapisina baglanacaktir.

Faz 11 uygulama alt fazlari:

- [x] Faz 11A - Sayfalar altyapisi: sidebar menusu, `/admin/pages` ana ekrani ve ortak sayfa registry yapisi
- [x] Faz 11B - Ana Sayfa yonetimi: hero, logolar, urun/cozum/proje secimleri, neden/nasil calisiriz ve CTA alanlari
- [x] Faz 11C - Ic sayfa metinleri: Islerimiz, Blog, Iletisim ve Sablonlar ust/alt metin alanlari
- [x] Faz 11D - Hakkimizda yonetimi: metin bloklari, istatistikler, sag alan gorseli/karti ve ekip kartlari
- [x] Faz 11E - Header ve Footer yonetimi: menu, mega menu, hizli linkler, iletisim, sosyal ve yasal alanlar
- [x] Faz 11F - Secim/siralama baglantilari ve final: ortak logo kaynagi, kart secimleri, frontend baglantilari ve testler

- [x] Admin sidebar'a `Sayfalar` menu secenegi ekle
- [x] `/admin/pages` veya benzeri bir sayfa yonetimi ana ekrani tasarla
- [x] Sayfalar bolumunde ilk yonetilebilir ekran olarak `Ana Sayfa` duzenleme ekranini olustur
- [x] Ana Sayfa Hero baslik ve aciklama alanlarini panelden yonetilebilir yap
- [x] Ana Sayfa Hero buton metinleri ve buton linklerini panelden yonetilebilir yap
- [x] `REFERANSLARIMIZ & URUNLERIMIZ` logo alanlarini panelden yonetilebilir yap
- [x] Referans/urun logolari icin medya secimi, siralama ve gerekli metin/link alanlarini planla
- [x] `One Cikan Urunlerimiz` bolumu icin baslik ve aciklama alanlarini panelden yonetilebilir yap
- [x] `One Cikan Urunlerimiz` bolumunde gosterilecek urunleri panelden secilebilir yap
- [x] `Kapsamli Dijital Cozumler` bolumu icin baslik ve aciklama alanlarini panelden yonetilebilir yap
- [x] `Kapsamli Dijital Cozumler` bolumunde gosterilecek cozum kartlarini panelden secilebilir yap
- [x] `Seckin Islerimiz` bolumu icin baslik, aciklama ve buton alanlarini panelden yonetilebilir yap
- [x] `Seckin Islerimiz` bolumunde gosterilecek is/proje kartlarini panelden secilebilir yap
- [x] `Neden Macework` bolumu icin baslik, aciklama ve icerik alanlarini panelden yonetilebilir yap
- [x] `Neden Macework` sag taraf alaninda kart veya gorsel secimi yapilabilmesini destekle
- [x] `Nasil Calisiriz?` bolumu icin baslik alanini panelden yonetilebilir yap
- [x] `Nasil Calisiriz?` adim basliklari ve adim iceriklerini panelden yonetilebilir yap
- [x] `Yeni Bir Projeye Baslayalim` form bolumu icin baslik ve aciklama alanlarini panelden yonetilebilir yap
- [x] Ana Sayfa bolum verilerini mevcut tasarimi bozmadan frontend bilesenlerine bagla
- [x] `Islerimiz` sayfasi icin admin panelde sayfa duzenleme ekrani olustur
- [x] `Islerimiz` sayfasi ust alan rozet/eyebrow metnini panelden yonetilebilir yap: varsayilan `Islerimiz`
- [x] `Islerimiz` sayfasi ust alan basligini panelden yonetilebilir yap: varsayilan `Neler Yaptik?`
- [x] `Islerimiz` sayfasi ust alan aciklamasini panelden yonetilebilir yap: varsayilan `Dijitalde iz birakan, problem cozen ve binlerce kullaniciya ulasan projelerimizden bazilari.`
- [x] `Islerimiz` sayfasi alt CTA bolumu basligini panelden yonetilebilir yap: varsayilan `Sizin Projeniz de Burada Olmali mi?`
- [x] `Islerimiz` sayfasi alt CTA bolumu aciklamasini panelden yonetilebilir yap: varsayilan `Markaniz icin en dogru teknoloji stratejisini belirleyelim ve birlikte dijitalin kurallarini yeniden yazalim.`
- [x] `Islerimiz` sayfasi alt CTA buton metnini panelden yonetilebilir yap: varsayilan `Proje Baslat`
- [x] `Islerimiz` sayfasi alt CTA buton linkini panelden yonetilebilir yap
- [x] `Islerimiz` sayfasi ayarlarini mevcut tasarimi bozmadan frontend sayfasina bagla
- [x] `Hakkimizda` sayfasi icin admin panelde sayfa duzenleme ekrani olustur
- [x] `Hakkimizda` sayfasi ust alan rozet/eyebrow metnini panelden yonetilebilir yap: varsayilan `Hakkimizda`
- [x] `Hakkimizda` sayfasi ust alan basligini panelden yonetilebilir yap: varsayilan `Biz Kimiz?`
- [x] `Hakkimizda` sayfasi ust alan aciklamasini panelden yonetilebilir yap: varsayilan `Yaraticilik ve teknolojinin kesisim noktasinda, gelecegi bugunden insa ediyoruz.`
- [x] `Hakkimizda` sayfasi `Biz Kimiz` icerik alanini panelden yonetilebilir yap
- [x] `Hakkimizda` sayfasi `Misyonumuz` alanini panelden yonetilebilir yap
- [x] `Hakkimizda` sayfasi `Vizyonumuz` alanini panelden yonetilebilir yap
- [x] `Hakkimizda` istatistik alanlarini panelden yonetilebilir yap: `Tamamlanan Proje`, `Mutlu Musteri`, `Gelistirilen Urun`, `Uzman Ekip`
- [x] `Hakkimizda` sag taraftaki kalp ikonlu buyuk kart alanini panelden yonetilebilir yap
- [x] `Hakkimizda` sag taraftaki buyuk alan icin kart veya admin panelden secilen gorsel kullanilabilmesini destekle
- [x] `Uzman Kadromuz` bolumu basligini panelden yonetilebilir yap
- [x] `Uzman Kadromuz` bolumu aciklamasini panelden yonetilebilir yap: varsayilan `Modern teknolojileri kullanan, yaratici ve enerjik ekibimizle tanisin.`
- [x] `Hakkimizda` ekip kisi kartlarini panelden eklenebilir, duzenlenebilir, siralanabilir ve yayindan kaldirilabilir yap
- [x] Ekip kisi kartlari icin ad, rol/unvan, aciklama ve gorsel alanlarini destekle
- [x] `Birlikte Deger Yaratalim` CTA bolumu basligini panelden yonetilebilir yap
- [x] `Birlikte Deger Yaratalim` CTA bolumu aciklamasini panelden yonetilebilir yap: varsayilan `Vizyonunuzu teknik mukemmeliyetle bulusturmak icin buradayiz.`
- [x] `Birlikte Deger Yaratalim` CTA buton metnini panelden yonetilebilir yap: varsayilan `Hemen Baslayalim`
- [x] `Birlikte Deger Yaratalim` CTA buton linkini panelden yonetilebilir yap
- [x] `Hakkimizda` sayfasi ayarlarini mevcut tasarimi bozmadan frontend sayfasina bagla
- [x] `Blog` sayfasi icin admin panelde sayfa duzenleme ekrani olustur
- [x] `Blog` sayfasi ust alan rozet/eyebrow metnini panelden yonetilebilir yap: varsayilan `Blog & Haberler`
- [x] `Blog` sayfasi ust alan basligini panelden yonetilebilir yap: varsayilan `Dunyadan Haberler`
- [x] `Blog` sayfasi ust alan aciklamasini panelden yonetilebilir yap: varsayilan `Teknoloji, tasarim ve dijital urun dunyasindan guncel icerikler, vaka analizleri ve ajans gunlugumuz.`
- [x] `Blog` sayfasi ayarlarini mevcut tasarimi bozmadan frontend sayfasina bagla
- [x] `Iletisim` sayfasi icin admin panelde sayfa duzenleme ekrani olustur
- [x] `Iletisim` sayfasi ust alan rozet/eyebrow metnini panelden yonetilebilir yap: varsayilan `Iletisim`
- [x] `Iletisim` sayfasi ust alan basligini panelden yonetilebilir yap: varsayilan `Bize Ulasin`
- [x] `Iletisim` sayfasi ust alan aciklamasini panelden yonetilebilir yap: varsayilan `Fikrinizi urune donusturmek veya markanizi dijitalde buyutmek icin ilk adimi atin.`
- [x] `Iletisim Bilgileri` blok basligini panelden yonetilebilir yap
- [x] `Iletisim Bilgileri` blok aciklamasini panelden yonetilebilir yap: varsayilan `Markanizi dijitalde parlatmak ve yenilikci teknoloji cozumlerimizle tanismak icin ekibimizle dogrudan iletisime gecin.`
- [x] `Iletisim` telefon etiketini ve telefon degerini panelden yonetilebilir yap
- [x] `Iletisim` e-posta etiketini ve e-posta degerini panelden yonetilebilir yap
- [x] `Iletisim` adres etiketini ve adres degerini panelden yonetilebilir yap: varsayilan `Ihsaniye Mah. Sultan Sok. No: 12`, `Bursa / Turkiye`
- [x] `Iletisim` WhatsApp numarasi ve WhatsApp yardim metnini panelden yonetilebilir yap: varsayilan `Hizli cevap icin`, `WhatsApp'tan ulasin.`
- [x] `Iletisim` form basligi ve form aciklamasini panelden yonetilebilir yap
- [x] `Iletisim` form placeholder alanlarini panelden yonetilebilir yap: ad soyad, firma adi, e-posta, mesaj
- [x] `Iletisim` form buton metnini panelden yonetilebilir yap
- [x] `Iletisim` sayfasi alt marka/proje seridi basligini panelden yonetilebilir yap: varsayilan `GUVENEN MARKALAR & PROJELERIMIZ`
- [x] `Iletisim` sayfasi alt marka/proje seridindeki logolari Ana Sayfa'daki referans/urun logolari ile ayni veri kaynagindan kullan
- [x] `Iletisim` sayfasi ayarlarini mevcut tasarimi bozmadan frontend sayfasina bagla
- [x] `Sablonlar` sayfasi icin admin panelde sayfa duzenleme ekrani olustur
- [x] `Sablonlar` sayfasi ust alan rozet/eyebrow metnini panelden yonetilebilir yap: varsayilan `Sablon Kutuphanesi`
- [x] `Sablonlar` sayfasi ust alan basligini panelden yonetilebilir yap: varsayilan `Hazir Sablonlarimizi Kesfedin`
- [x] `Sablonlar` sayfasi ust alan aciklamasini panelden yonetilebilir yap: varsayilan `Isletmeniz icin ozellestirilebilir, modern ve yuksek performansli hazir web altyapilari.`
- [x] `Sablonlar` sayfasi alt CTA basligini panelden yonetilebilir yap: varsayilan `Size Ozel Bir Sablona mi Ihtiyaciniz Var?`
- [x] `Sablonlar` sayfasi alt CTA aciklamasini panelden yonetilebilir yap: varsayilan `Sablonlarimizi projenize ozel olarak ozellestirebilir veya sifirdan markaniza uygun bir yapi insa edebiliriz.`
- [x] `Sablonlar` sayfasi alt CTA buton metnini panelden yonetilebilir yap: varsayilan `Bizimle Iletisime Gecin`
- [x] `Sablonlar` sayfasi alt CTA buton linkini panelden yonetilebilir yap
- [x] `Sablonlar` sayfasi ayarlarini mevcut tasarimi bozmadan frontend sayfasina bagla
- [x] `Header` yapisi icin admin panelde duzenleme ekrani olustur
- [x] Header logo/metin alanini panelden yonetilebilir yap
- [x] Header ana menu ogelerini panelden eklenebilir, duzenlenebilir, siralanabilir ve yayindan kaldirilabilir yap
- [x] Header ana menu ogeleri icin etiket, link, hedef ve yayin durumu alanlarini destekle
- [x] Header `Sablonlar` buton metni ve linkini panelden yonetilebilir yap
- [x] Header `Cozumler` mega menu yapisini panelden yonetilebilir yap
- [x] Header `Cozumler` alt menu kolon basliklarini panelden yonetilebilir yap
- [x] Header `Cozumler` alt menu ogeleri icin baslik, aciklama, ikon, link ve sira alanlarini destekle
- [x] Header mobil menu yapisini ayni veri kaynagina bagla
- [x] Header ayarlarini mevcut tasarimi bozmadan frontend header bilesenine bagla
- [x] `Footer` yapisi icin admin panelde duzenleme ekrani olustur
- [x] Footer logo/metin alanini panelden yonetilebilir yap
- [x] Footer aciklama metnini panelden yonetilebilir yap
- [x] Footer `Hizli Linkler` menu basligini panelden yonetilebilir yap
- [x] Footer `Hizli Linkler` menu ogelerini panelden eklenebilir, duzenlenebilir, siralanabilir ve yayindan kaldirilabilir yap
- [x] Footer iletisim basligini ve iletisim alanlarini panelden yonetilebilir yap: e-posta, telefon, adres
- [x] Footer sosyal medya linklerini panelden eklenebilir, duzenlenebilir, siralanabilir ve yayindan kaldirilabilir yap
- [x] Footer sosyal medya linkleri icin platform, URL, ikon ve yayin durumu alanlarini destekle
- [x] Footer alt yasal linkleri ve telif metnini panelden yonetilebilir yap
- [x] Footer ayarlarini mevcut tasarimi bozmadan frontend footer bilesenine bagla
- [x] Diger sayfalar icin kullanilacak sayfa yonetimi veri modelini genisletilebilir sekilde planla

## Faz Sirasi Onerisi

1. Faz 01 - Listeleme Deneyimi
2. Faz 02 - Form Bilgi Mimarisi
3. Faz 03 - Sticky Kayit Alani
4. Faz 04 - Duzenleme Akisinin Iyilestirilmesi
5. Faz 05 - Medya Kutuphanesi V2
6. Faz 06 - Galeri Siralama Deneyimi
7. Faz 07 - Onizleme ve Canli Baglanti
8. Faz 08 - Mesaj Merkezi Deneyimi
9. Faz 09 - Dashboard Operasyon Katmani
10. Faz 10 - Geri Bildirim ve Guven Katmani
11. Faz 11 - Sayfa Yonetimi ve Ana Sayfa CMS Katmani
