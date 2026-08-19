# 🚀 OrangeHRM Login Automation Test Suite (Cypress)

> **SanberCode QA Automation Bootcamp**  
> **Author:** Wiryawan Pranawadigda  
> **Target Application:** [OrangeHRM Open Source Demo](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login)  
> **Framework:** Cypress E2E with Page Object Model (POM) & Network Interception (`cy.intercept`)

---

## 📌 Project Overview
Repository ini berisi otomatisasi pengujian *End-to-End (E2E)* untuk fitur **Autentikasi & Login OrangeHRM** menggunakan framework **Cypress**. Pengujian dirancang dengan arsitektur **Page Object Model (POM)** yang rapi, *data-driven testing* berbasis Fixtures JSON, serta mencakup:
1. **Quiz 3 Login Suite (`login_orangehrm.cy.js`)**: 12 Test Cases (skenario positif, negatif, validasi form, keamanan, dan navigasi UI).
2. **Intercept Suite (`intercept/login_intercept.cy.js`)**: 10 Test Cases menggunakan `cy.intercept()` untuk network spying, stubbing/mocking payload, throttling latency delay, fault injection (HTTP 500), query parameter inspection, dan header/status validation.

Seluruh test cases telah terverifikasi **100% Passed**.

---

## 🏗️ Struktur Direktori Proyek

```plaintext
cypress-orangehrm-sanbercode/
├── cypress/
│   ├── e2e/
│   │   ├── login_orangehrm.cy.js            # [Quiz 3] 12 E2E Test Cases Login UI & Validasi
│   │   └── intercept/
│   │       └── login_intercept.cy.js        # [Intercept Suite] 10 Test Cases cy.intercept Network Testing
│   ├── fixtures/
│   │   ├── loginData.json                  # Dataset kredensial login (valid, invalid, SQL injection)
│   │   └── interceptData.json              # Dataset mock response (shortcuts, server error 500, rate limit)
│   └── support/
│       ├── pages/
│       │   └── LoginPage.js                 # Page Object Model (POM) untuk halaman Login
│       ├── commands.js                      # Custom Cypress commands
│       └── e2e.js                           # Konfigurasi exception handler & global setup
├── cypress.config.js                        # Konfigurasi timeout, baseUrl, dan viewport Cypress
├── package.json                             # Dependency & scripts runner
├── .gitignore                               # File exclusion untuk Git
└── README.md                                # Dokumentasi lengkap proyek
```

---

## 📡 Matriks Test Cases Cy.Intercept (`cypress/e2e/intercept/login_intercept.cy.js`)

| No | Test Case ID | Target Endpoint | HTTP Method | Jenis Intercept / Validasi | Hasil yang Diharapkan | Status |
| :-: | :--- | :--- | :---: | :--- | :--- | :-: |
| **1** | `TC-01-INT` | `**/auth/validate` | `POST` | **Auth Request & Redirect Assertion** | Method `POST`, Content-Type URL-encoded, Status `302`, redirect ke `/dashboard/index` | **PASSED** |
| **2** | `TC-02-INT` | `**/api/v2/dashboard/employees/action-summary` | `GET` | **API Spying & Response Schema Validation** | Status `200`, Content-Type `application/json`, body memiliki property `data` | **PASSED** |
| **3** | `TC-03-INT` | `**/api/v2/dashboard/shortcuts` | `GET` | **Mocking / Stubbing Custom Response** | Response diganti dengan fixture mock data (`Sanbercode Custom Leave List`), status `200` | **PASSED** |
| **4** | `TC-04-INT` | `**/api/v2/dashboard/employees/subunit` | `GET` | **Network Throttling / Latency Simulation** | Simulasi delay `1000ms`, verifikasi UI tangguh dan respon `200` | **PASSED** |
| **5** | `TC-05-INT` | `**/auth/validate` | `POST` | **Negative Auth Spy (Invalid Credentials)** | Status `302`, redirect location kembali ke `/auth/login`, UI alert `"Invalid credentials"` | **PASSED** |
| **6** | `TC-06-INT` | `**/auth/validate` | `POST` | **Fault Injection (HTTP 500 Internal Error)** | Stubbing response status `500` & custom header `x-mock-error`, verifikasi ketahanan error | **PASSED** |
| **7** | `TC-07-INT` | `**/core/i18n/messages` | `GET` | **Localization Dictionary Stubbing** | Stubbing dictionary bahasa i18n (`Sanbercode Custom Login Text`), status `200` | **PASSED** |
| **8** | `TC-08-INT` | `**/api/v2/dashboard/employees/time-at-work**` | `GET` | **Query Parameter Matching & Headers** | Validasi query parameter time-tracking API, status `200`, content-type header valid | **PASSED** |
| **9** | `TC-09-INT` | `**/api/v2/dashboard/employees/locations` | `GET` | **Distribution Data API Assertion** | Status `200`, body mengandung list data lokasi karyawan | **PASSED** |
| **10** | `TC-10-INT` | `**/api/v2/dashboard/employees/leaves**` | `GET` | **Leaves on Date API Schema Validation** | Status `200`, content-type `application/json`, property `data` tervalidasi | **PASSED** |

---

## 📊 Matriks 12 Test Cases Quiz 3 (`cypress/e2e/login_orangehrm.cy.js`)

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

## ⚙️ Panduan Menjalankan Pengujian

### 1. Instalasi Dependency
```bash
npm install
```

### 2. Menjalankan Test Suite

* **Menjalankan Test Intercept Saja (10 Test Cases):**
  ```bash
  npm run cypress:run:intercept
  ```

* **Menjalankan Test Quiz 3 E2E Saja (12 Test Cases):**
  ```bash
  npm run cypress:run:quiz3
  ```

* **Menjalankan Seluruh Test Suite Sekaligus (All 22 Test Cases):**
  ```bash
  npm run cypress:run
  ```

* **Menjalankan via Cypress Interactive Test Runner UI:**
  ```bash
  npm run cypress:open
  ```
