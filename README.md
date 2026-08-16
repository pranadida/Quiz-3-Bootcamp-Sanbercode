# 🚀 OrangeHRM Login Automation Test Suite (Cypress)

> **SanberCode QA Automation Bootcamp**  
> **Author:** Wiryawan Pranawadigda  
> **Target Application:** [OrangeHRM Open Source Demo](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login)  
> **Framework:** Cypress E2E with Page Object Model (POM) Design Pattern

---

## 📌 Project Overview
Repository ini berisi otomatisasi pengujian *End-to-End (E2E)* untuk fitur **Autentikasi & Login OrangeHRM** menggunakan framework **Cypress**. Pengujian dirancang dengan arsitektur **Page Object Model (POM)** yang rapi, *data-driven testing* berbasis Fixtures JSON, serta mencakup **12 Test Cases** (skenario positif, negatif, validasi form, keamanan, dan navigasi UI) yang seluruhnya terverifikasi **100% Passed**.

---

## 🏗️ Struktur Direktori Proyek

```plaintext
cypress-orangehrm-sanbercode/
├── cypress/
│   ├── e2e/
│   │   └── login_orangehrm.cy.js    # 12 Test Cases dalam format describe() dan it()
│   ├── fixtures/
│   │   └── loginData.json          # Dataset kredensial & skenario uji (valid, invalid, SQL injection)
│   └── support/
│       ├── pages/
│       │   └── LoginPage.js         # Page Object Model (POM) untuk halaman Login
│       ├── commands.js              # Custom Cypress commands
│       └── e2e.js                   # Konfigurasi exception handler & global setup
├── cypress.config.js                # Konfigurasi timeout, baseUrl, dan viewport Cypress
├── package.json                     # Dependency & scripts runner
├── .gitignore                       # File exclusion untuk Git
└── README.md                        # Dokumentasi lengkap proyek
```

---

## 📊 Matriks 12 Test Cases (Fitur Login)

| No | Test Case ID | Kategori | Skenario Pengujian | Hasil yang Diharapkan | Status |
| :-: | :--- | :---: | :--- | :--- | :-: |
| **1** | `TC-01` | **Positive** | Login dengan username & password valid (`Admin` / `admin123`) | Berhasil redirect ke `/dashboard/index`, header 'Dashboard' tampil | **PASSED** |
| **2** | `TC-12` | **Positive** | Login menggunakan tombol keyboard `{enter}` pada input password | Berhasil submit form dan redirect ke halaman dashboard | **PASSED** |
| **3** | `TC-02` | **Negative** | Login dengan username salah dan password salah | Muncul pesan error alert `"Invalid credentials"` | **PASSED** |
| **4** | `TC-03` | **Negative** | Login dengan username valid dan password salah | Muncul pesan error alert `"Invalid credentials"` | **PASSED** |
| **5** | `TC-04` | **Negative** | Login dengan username salah dan password valid | Muncul pesan error alert `"Invalid credentials"` | **PASSED** |
| **6** | `TC-05` | **Validation** | Submit form login dalam keadaan kedua field kosong | Muncul label validasi `"Required"` di bawah username & password | **PASSED** |
| **7** | `TC-06` | **Validation** | Submit form login dengan username kosong & password terisi | Muncul label validasi `"Required"` hanya di bawah field username | **PASSED** |
| **8** | `TC-07` | **Validation** | Submit form login dengan username terisi & password kosong | Muncul label validasi `"Required"` hanya di bawah field password | **PASSED** |
| **9** | `TC-08` | **Security** | Verifikasi tipe input pada field password | Memiliki atribut `type="password"` untuk masking karakter rahasia | **PASSED** |
| **10** | `TC-09` | **Navigation** | Klik tautan *"Forgot your password?"* | Berhasil navigasi ke halaman Reset Password dan kembali via Cancel | **PASSED** |
| **11** | `TC-10` | **Security** | Pengujian input string SQL Injection (`' OR '1'='1`) | Sistem menolak dengan alert `"Invalid credentials"` tanpa error server | **PASSED** |
| **12** | `TC-11` | **UI Check** | Verifikasi keberadaan komponen utama halaman login | Logo perusahaan, judul 'Login', input fields, tombol login, dan demo box tampil | **PASSED** |

---

## ⚙️ Panduan Instalasi & Menjalankan Pengujian

### 1. Prasyarat
- **Node.js**: v18.x atau versi yang lebih baru
- **NPM**: v9.x atau versi yang lebih baru

### 2. Instalasi Dependency
Buka terminal pada folder proyek ini, lalu jalankan:
```bash
npm install
```

### 3. Menjalankan Test Automation

* **Menjalankan via Terminal (Headless Mode - Cepat & Otomatis):**
  ```bash
  npm test
  ```
  *atau:*
  ```bash
  npm run cypress:run
  ```

* **Menjalankan via Cypress Test Runner UI (Interaktif):**
  ```bash
  npm run cypress:open
  ```

* **Menjalankan pada Browser Google Chrome:**
  ```bash
  npm run cypress:run:chrome
  ```

---



