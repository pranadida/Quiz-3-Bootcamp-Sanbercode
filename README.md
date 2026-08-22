# 🚀 OrangeHRM End-to-End Test Automation Suite (Cypress POM)

> **SanberCode QA Automation Bootcamp - Final Assignment**  
> **Author:** Wiryawan Pranawadigda  
> **Target Application:** [OrangeHRM Open Source Demo](https://opensource-demo.orangehrmlive.com/)  
> **Repository GitHub:** [https://github.com/pranadida/Quiz-3-Bootcamp-Sanbercode](https://github.com/pranadida/Quiz-3-Bootcamp-Sanbercode)  
> **Design Pattern:** Page Object Model (Action, Assertion, Data, & Intercept)

---

## 📌 Deskripsi Proyek

Repository ini berisi otomatisasi pengujian *End-to-End (E2E)* pada website **OrangeHRM Demo** dengan mengimplementasikan arsitektur **Page Object Model (POM)** yang terstruktur rapi ke dalam 4 pilar utama:
1. **Action**: Metode interaksi pengguna (navigasi, typing, clicking, selecting dropdown, uploading, filtering, resetting).
2. **Assertion**: Metode validasi (verifikasi URL, kehadiran elemen, teks label, count data, error alerts, required fields, status code).
3. **Data**: *Data-driven testing* menggunakan file fixture JSON terisolasi (`loginData.json`, `directoryData.json`, `recruitmentData.json`, `interceptData.json`).
4. **Intercept**: Pemanfaatan `cy.intercept()` untuk network spying, stubbing/mocking payload response, simulasi latency throttling, dan fault injection (HTTP 500).

Setiap fitur memiliki **8 Test Cases** (Total = **24 Test Cases**) dengan status **100% Passed**.

---

## 🏗️ Struktur Direktori Proyek (POM Architecture)

```plaintext
cypress-orangehrm-sanbercode/
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.js                     # 8 Test Cases: Fitur Login (UI, Validation, Security & Intercept)
│   │   ├── directory.cy.js                 # 8 Test Cases: Menu Directory (Search, Filter, Card & Intercept)
│   │   ├── recruitment.cy.js               # 8 Test Cases: Menu Recruitment (Candidates, Add, Vacancy & Intercept)
│   │   ├── login_orangehrm.cy.js           # 12 Test Cases: E2E Login Regression Suite
│   │   ├── intercept/
│   │   │   └── login_intercept.cy.js       # 10 Test Cases: Cy.Intercept Dedicated Suite
│   │   └── api/
│   │       └── categories_api.cy.js        # 13 Test Cases: Platzi REST API Categories Suite
│   ├── fixtures/
│   │   ├── loginData.json                  # Dataset kredensial & input login
│   │   ├── directoryData.json              # Dataset filter criteria & mock data Directory
│   │   ├── recruitmentData.json            # Dataset candidate payload, filter, & mock data Recruitment
│   │   └── interceptData.json              # Dataset mock server error, shortcuts, & payload API
│   └── support/
│       ├── pages/                          # Page Object Model (Action & Assertion Methods)
│       │   ├── LoginPage.js                # Locators, Actions, & Assertions untuk Login
│       │   ├── DirectoryPage.js            # Locators, Actions, & Assertions untuk Directory
│       │   └── RecruitmentPage.js          # Locators, Actions, & Assertions untuk Recruitment
│       ├── intercepts/                     # Intercept Helper Modules
│       │   ├── LoginIntercept.js           # Spying & Stubbing untuk Authentication API
│       │   ├── DirectoryIntercept.js       # Spying & Stubbing untuk Directory API
│       │   └── RecruitmentIntercept.js     # Spying & Stubbing untuk Recruitment API
│       ├── commands.js                     # Custom Cypress commands
│       └── e2e.js                          # Exception handler & konfigurasi global
├── cypress.config.js                       # Konfigurasi baseUrl, timeout, viewport
├── package.json                            # Dependency & NPM test scripts
└── README.md                               # Dokumentasi lengkap proyek
```

---

## 📊 Matriks 24 Test Cases (8 TC Login, 8 TC Directory, 8 TC Recruitment)

### 🔑 1. Fitur Login (`cypress/e2e/login.cy.js`)

| No | Test Case ID | Kategori | Skenario Pengujian | Komponen POM (Action/Assert/Data/Intercept) | Status |
| :-: | :--- | :---: | :--- | :--- | :-: |
| **1** | `TC-LOG-01` | **Positive / Intercept** | Login dengan kredensial valid, intercept `POST /auth/validate` (Status 302), dan redirect ke dashboard | `loginIntercept.interceptAuthValidate()`, `loginPage.enterUsername()`, `loginPage.enterPassword()`, `loginPage.assertDashboardLoaded()` | **PASSED** |
| **2** | `TC-LOG-02` | **Positive / Keyboard Action** | Login menggunakan tombol keyboard `{enter}` pada input password | `loginPage.submitLoginWithEnterKey()`, `loginPage.assertDashboardLoaded()` | **PASSED** |
| **3** | `TC-LOG-03` | **Negative / Intercept** | Login dengan username & password salah, intercept redirect kembali ke `/auth/login`, dan validasi alert error | `loginIntercept.interceptAuthValidate()`, `loginPage.submitLogin()`, `loginPage.assertAlertError()` | **PASSED** |
| **4** | `TC-LOG-04` | **Negative / Assertion** | Login dengan username valid dan password salah | `loginPage.submitLogin()`, `loginPage.assertAlertError('Invalid credentials')` | **PASSED** |
| **5** | `TC-LOG-05` | **Validation / Assertion** | Submit form login kosong dan validasi label 'Required' pada kedua input | `loginPage.clickLogin()`, `loginPage.assertBothFieldsRequired()` | **PASSED** |
| **6** | `TC-LOG-06` | **Validation / Assertion** | Submit form login hanya dengan username terisi, password kosong | `loginPage.enterUsername()`, `loginPage.clickLogin()`, `loginPage.assertPasswordFieldRequired()` | **PASSED** |
| **7** | `TC-LOG-07` | **Security & Navigation** | Verifikasi masking password (`type="password"`) dan navigasi ke halaman Reset Password | `loginPage.assertPasswordInputMasked()`, `loginPage.clickForgotPassword()`, `loginPage.assertResetPasswordPage()` | **PASSED** |
| **8** | `TC-LOG-08` | **Intercept Mocking** | Fault Injection: Stub response HTTP 500 Internal Server Error pada endpoint autentikasi | `loginIntercept.stubServerError()`, `loginPage.submitLogin()`, asersi response statusCode 500 & error message | **PASSED** |

---

### 👥 2. Menu Directory (`cypress/e2e/directory.cy.js`)

| No | Test Case ID | Kategori | Skenario Pengujian | Komponen POM (Action/Assert/Data/Intercept) | Status |
| :-: | :--- | :---: | :--- | :--- | :-: |
| **1** | `TC-DIR-01` | **Positive / Intercept** | Navigasi ke Directory, intercept `GET /api/v2/directory/employees` (Status 200), dan verifikasi directory cards tampil | `directoryIntercept.interceptGetEmployees()`, `directoryPage.visit()`, `directoryPage.assertDirectoryPageLoaded()`, `directoryPage.assertAtLeastOneCardVisible()` | **PASSED** |
| **2** | `TC-DIR-02` | **Positive / Filter Job Title** | Filter Directory berdasarkan Job Title dropdown dan verifikasi hasil filter | `directoryPage.selectJobTitle()`, `directoryPage.clickSearch()`, `directoryPage.assertRecordsFoundVisible()` | **PASSED** |
| **3** | `TC-DIR-03` | **Positive / Filter Location** | Filter Directory berdasarkan Location dropdown dan verifikasi hasil pencarian | `directoryPage.selectLocation()`, `directoryPage.clickSearch()`, `directoryPage.assertRecordsFoundVisible()` | **PASSED** |
| **4** | `TC-DIR-04` | **Positive / Detail View** | Klik salah satu employee card dan verifikasi detail profile sheet/sidebar terbuka | `directoryPage.clickEmployeeCard(0)`, `directoryPage.assertEmployeeDetailVisible()` | **PASSED** |
| **5** | `TC-DIR-05` | **Action & State / Reset** | Terapkan filter lalu klik tombol Reset; verifikasi form kembali ke state kosong semula | `directoryPage.selectJobTitle()`, `directoryPage.clickReset()`, `directoryPage.assertResetFormState()` | **PASSED** |
| **6** | `TC-DIR-06` | **Intercept Mocking** | Stub `GET /api/v2/directory/employees` dengan data mock dari `directoryData.json` dan verifikasi kartu mock ter-render | `directoryIntercept.stubEmployeesList()`, `directoryPage.assertDirectoryCardsCount(2)`, `directoryPage.assertCardContainsName('Wiryawan')` | **PASSED** |
| **7** | `TC-DIR-07` | **Intercept Mocking** | Stub response data kosong (0 records) dan verifikasi UI menampilkan pesan 'No Records Found' | `directoryIntercept.stubEmptyEmployees()`, `directoryPage.assertNoRecordsFound()` | **PASSED** |
| **8** | `TC-DIR-08` | **Intercept / Latency** | Simulasi network delay (1000ms) pada Directory API dan verifikasi stabilitas pemuatan halaman | `directoryIntercept.interceptDelayedEmployees(1000)`, `directoryPage.assertDirectoryPageLoaded()` | **PASSED** |

---

### 📋 3. Menu Recruitment (`cypress/e2e/recruitment.cy.js`)

| No | Test Case ID | Kategori | Skenario Pengujian | Komponen POM (Action/Assert/Data/Intercept) | Status |
| :-: | :--- | :---: | :--- | :--- | :-: |
| **1** | `TC-REC-01` | **Positive / Intercept** | Navigasi ke Recruitment Candidates, intercept `GET /api/v2/recruitment/candidates` (Status 200), dan validasi tabel data | `recruitmentIntercept.interceptGetCandidates()`, `recruitmentPage.visitCandidates()`, `recruitmentPage.assertCandidateTableHasRows()` | **PASSED** |
| **2** | `TC-REC-02` | **Positive / Filter Status** | Filter kandidat berdasarkan Status dropdown dan validasi hasil pencarian | `recruitmentPage.selectStatusFilter()`, `recruitmentPage.clickSearch()`, `recruitmentPage.assertCandidatesPageLoaded()` | **PASSED** |
| **3** | `TC-REC-03` | **Navigation & UI** | Navigasi ke halaman Add Candidate via tombol `+ Add` dan verifikasi elemen formulir | `recruitmentPage.clickAddCandidateButton()`, `recruitmentPage.assertAddCandidatePageLoaded()` | **PASSED** |
| **4** | `TC-REC-04` | **Validation / Required Fields** | Submit formulir Add Candidate dalam keadaan kosong dan validasi pesan error 'Required' pada field wajib | `recruitmentPage.visitAddCandidate()`, `recruitmentPage.clickSaveCandidate()`, `recruitmentPage.assertRequiredFieldsValidation()` | **PASSED** |
| **5** | `TC-REC-05` | **Validation / Email Format** | Input format email tidak valid (`invalid-email-format`) dan validasi pesan 'Expected format: admin@example.com' | `recruitmentPage.fillCandidateForm()`, `recruitmentPage.clickSaveCandidate()`, `recruitmentPage.assertInvalidEmailFormatError()` | **PASSED** |
| **6** | `TC-REC-06` | **Positive / Candidate Creation** | Input data kandidat lengkap dari fixture, intercept `POST /api/v2/recruitment/candidates` (Status 200), dan simpan data | `recruitmentIntercept.interceptAddCandidate()`, `recruitmentPage.fillCandidateForm()`, `recruitmentPage.clickSaveCandidate()`, `recruitmentPage.assertCandidateCreatedSuccessfully()` | **PASSED** |
| **7** | `TC-REC-07` | **Intercept Mocking** | Stub Candidates API dengan data mock dari `recruitmentData.json` dan validasi rendering baris tabel | `recruitmentIntercept.stubCandidatesList()`, `recruitmentPage.assertTableRowsCount(2)`, `recruitmentPage.assertCandidateInTable('Wiryawan')` | **PASSED** |
| **8** | `TC-REC-08` | **Action & Tab Navigation** | Navigasi antar-tab (Candidates ⇄ Vacancies), intercept `GET /api/v2/recruitment/vacancies`, dan validasi halaman Vacancies | `recruitmentIntercept.interceptGetVacancies()`, `recruitmentPage.clickVacanciesTab()`, `recruitmentPage.assertVacanciesPageLoaded()` | **PASSED** |

---

## ⚙️ Panduan Menjalankan Pengujian (NPM Scripts)

### 1. Instalasi Dependency
```bash
npm install
```

### 2. Menjalankan Test Per Fitur
* **Jalankan Fitur Login (8 Test Cases):**
  ```bash
  npm run cypress:run:login
  ```

* **Jalankan Menu Directory (8 Test Cases):**
  ```bash
  npm run cypress:run:directory
  ```

* **Jalankan Menu Recruitment (8 Test Cases):**
  ```bash
  npm run cypress:run:recruitment
  ```

### 3. Menjalankan Seluruh Test Suite
* **Jalankan Semua Test (Headless Mode):**
  ```bash
  npm test
  ```

* **Jalankan dengan Browser Chrome:**
  ```bash
  npm run cypress:run:chrome
  ```

* **Membuka Cypress UI Test Runner Interaktif:**
  ```bash
  npm run cypress:open
  ```

---

## 📤 Panduan Commit dan Push ke GitHub

Untuk memasukkan hasil automasi ke repository GitHub:

```bash
# 1. Pastikan berada di direktori project
cd C:\Users\MSI\Desktop\cypress-orangehrm-sanbercode

# 2. Tambahkan semua perubahan file
git add .

# 3. Lakukan commit dengan pesan deskriptif
git commit -m "feat: complete POM automation test suite for Login, Directory, and Recruitment features with 24 test cases"

# 4. Push ke branch main di GitHub
git push -u origin main
```

---

## 🏆 Kriteria Penilaian Terpenuhi

- ✅ **Format POM (Page Object Model)**: Pemisahan tegas antara Page Objects (`support/pages/`), Intercepts (`support/intercepts/`), Fixtures (`fixtures/`), dan Test Specs (`e2e/`).
- ✅ **Action**: Metode interaksi pengguna lengkap dan modular.
- ✅ **Assertion**: Validasi eksplisit untuk URL, UI elements, error messages, record counts, dan API status/headers.
- ✅ **Data**: Data testing terpusat pada file JSON fixtures.
- ✅ **Intercept**: Network spying, stubbing/mocking, delay throttling, dan fault injection menggunakan `cy.intercept()`.
- ✅ **Kuantitas Test Case**: Tepat **8 Test Cases untuk Login**, **8 Test Cases untuk Directory**, dan **8 Test Cases untuk Recruitment** (Total 24 Test Cases).
- ✅ **Status Kelulusan**: 100% Passed pada seluruh pengujian.
