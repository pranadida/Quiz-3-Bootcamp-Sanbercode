# 🚀 OrangeHRM & Platzi API Automation Test Suite (Cypress)

> **SanberCode QA Automation Bootcamp**  
> **Author:** Wiryawan Pranawadigda  
> **Target Applications:** 
> 1. [OrangeHRM Open Source Demo](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login) (UI & Intercept Testing)
> 2. [Platzi Fake Store Categories API](https://fakeapi.platzi.com/en/rest/categories) (REST API Testing)  
> **Framework:** Cypress with Page Object Model (POM) & Service Object Pattern

---

## 📌 Project Overview
Repository ini berisi kumpulan otomatisasi pengujian *End-to-End (E2E)* dan *REST API Testing* menggunakan framework **Cypress** dengan arsitektur **Page Object Model (POM)** dan *data-driven testing* berbasis Fixtures JSON:

1. **Quiz 3 Login Suite (`cypress/e2e/login_orangehrm.cy.js`)**: 12 Test Cases (skenario positif, negatif, validasi form, keamanan, dan navigasi UI).
2. **Intercept Suite (`cypress/e2e/intercept/login_intercept.cy.js`)**: 10 Test Cases menggunakan `cy.intercept()` untuk network spying, stubbing/mocking payload, latency throttling, fault injection (HTTP 500), query parameter inspection, dan header/status validation.
3. **Platzi API Categories Suite (`cypress/e2e/api/categories_api.cy.js`)**: 13 Test Cases pengujian REST API pada endpoint Categories (`https://api.escuelajs.co/api/v1/categories`) meliputi Create, Read (All & By ID & By Query), Update, Delete, Filtering, Error Handling (HTTP 400 Bad Request / EntityNotFoundError), dan relasi produk dengan validasi minimal status code dan response body value.

Seluruh test cases telah terverifikasi **100% Passed**.

---

## 🏗️ Struktur Direktori Proyek

```plaintext
cypress-orangehrm-sanbercode/
├── cypress/
│   ├── e2e/
│   │   ├── login_orangehrm.cy.js            # [Quiz 3] 12 E2E Test Cases Login UI & Validasi
│   │   ├── intercept/
│   │   │   └── login_intercept.cy.js        # [Intercept Suite] 10 Test Cases cy.intercept Network Testing
│   │   └── api/
│   │       └── categories_api.cy.js         # [API Suite] 13 Test Cases Platzi Fake Store Categories REST API
│   ├── fixtures/
│   │   ├── loginData.json                  # Dataset kredensial login (valid, invalid, SQL injection)
│   │   ├── interceptData.json              # Dataset mock response (shortcuts, server error 500, rate limit)
│   │   └── categoryData.json               # Dataset payload API (valid, updated, invalid empty, invalid URL)
│   └── support/
│       ├── pages/
│       │   └── LoginPage.js                 # Page Object Model (POM) untuk halaman Login
│       ├── api/
│       │   └── CategoryAPI.js               # Service Object Model untuk REST API Categories
│       ├── commands.js                      # Custom Cypress commands
│       └── e2e.js                           # Konfigurasi exception handler & global setup
├── cypress.config.js                        # Konfigurasi timeout, baseUrl, dan viewport Cypress
├── package.json                             # Dependency & scripts runner
├── .gitignore                               # File exclusion untuk Git
└── README.md                                # Dokumentasi lengkap proyek
```

---

## 🌐 Matriks Test Cases Platzi REST API Categories (`cypress/e2e/api/categories_api.cy.js`)

| No | Test Case ID | HTTP Method | Endpoint | Skenario Pengujian & Asersi | Status Code | Status |
| :-: | :--- | :---: | :--- | :--- | :-: | :-: |
| **1** | `TC-01-API` | `GET` | `/categories` | Ambil semua kategori; validasi array length > 0, schema item (`id`, `name`, `image`, `creationAt`, `updatedAt`) | `200 OK` | **PASSED** |
| **2** | `TC-02-API` | `GET` | `/categories?limit=3` | Query parameter limit; validasi response array memiliki panjang tepat 3 item | `200 OK` | **PASSED** |
| **3** | `TC-03-API` | `GET` | `/categories/1` | Ambil single category by valid ID; validasi `id: 1`, `name` string, `image` valid URL | `200 OK` | **PASSED** |
| **4** | `TC-04-API` | `GET` | `/categories/9999999` | Single category ID tidak terdaftar (Negative); validasi error `EntityNotFoundError` | `400 Bad Request` | **PASSED** |
| **5** | `TC-05-API` | `GET` | `/categories/invalid-id-abc` | Single category ID non-numeric string (Negative); validasi message `numeric string is expected` | `400 Bad Request` | **PASSED** |
| **6** | `TC-06-API` | `POST` | `/categories` | Create kategori baru dengan valid payload; validasi response `name`, `image`, timestamp, dan auto-generated `id` | `201 Created` | **PASSED** |
| **7** | `TC-07-API` | `POST` | `/categories` | Create kategori payload kosong (Negative); validasi message `name should not be empty` & `image should not be empty` | `400 Bad Request` | **PASSED** |
| **8** | `TC-08-API` | `POST` | `/categories` | Create kategori dengan format URL image salah (Negative); validasi message `image must be a URL address` | `400 Bad Request` | **PASSED** |
| **9** | `TC-09-API` | `PUT` | `/categories/{id}` | Update data kategori eksis (nama & image); validasi data berhasil diperbarui sesuai payload | `200 OK` | **PASSED** |
| **10** | `TC-10-API` | `PUT` | `/categories/9999999` | Update kategori ID tidak terdaftar (Negative); validasi error `EntityNotFoundError` | `400 Bad Request` | **PASSED** |
| **11** | `TC-11-API` | `GET` | `/categories/1/products` | Ambil semua produk dalam kategori ID 1; validasi array produk dan `category.id: 1` | `200 OK` | **PASSED** |
| **12** | `TC-12-API` | `DELETE` | `/categories/{id}` | Hapus kategori eksis; validasi response body bernilai `true` | `200 OK` | **PASSED** |
| **13** | `TC-13-API` | `DELETE` | `/categories/9999999` | Hapus kategori ID tidak terdaftar (Negative); validasi error `EntityNotFoundError` | `400 Bad Request` | **PASSED** |

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

* **Menjalankan Platzi Categories API Test Saja (13 Requests/Test Cases):**
  ```bash
  npm run cypress:run:api
  ```

* **Menjalankan Test Intercept Saja (10 Test Cases):**
  ```bash
  npm run cypress:run:intercept
  ```

* **Menjalankan Test Quiz 3 E2E Saja (12 Test Cases):**
  ```bash
  npm run cypress:run:quiz3
  ```

* **Menjalankan Seluruh Test Suite Sekaligus (35 Test Cases):**
  ```bash
  npm run cypress:run
  ```

* **Menjalankan via Cypress Interactive Test Runner UI:**
  ```bash
  npm run cypress:open
  ```
