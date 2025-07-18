describe('Register from Akun', function () {
    this.timeout(30000); // ⏱️ Tambah timeout jadi 30 detik

    it('should register via Akun menu', async () => {
      
        const timestamp = Date.now();
        const email = `eza.zulfachry+${timestamp}@gramedia.id`;
        const randomPhone = `0812${Math.floor(1000000 + Math.random() * 9000000)}`; // 0812XXXXXXX
        const password = 'testing123?';
    
        console.log(`▶ Memulai test Register`);

        const akunMenu = await $('~Akun');
      await akunMenu.click();
  
      const loginButton = await $('android=new UiSelector().textContains("Daftar")');
      await loginButton.waitForDisplayed({ timeout: 5000 });
      await loginButton.click();
  
      const inputFields = await $$('android.widget.EditText');
      await inputFields[0].setValue(email);
      await inputFields[1].setValue(randomPhone)
      await inputFields[2].setValue(password);

      // Tutup keyboard jika muncul
      if (await driver.isKeyboardShown()) {
        await driver.hideKeyboard();
      }
  
      // ✅ Ambil tombol submit (yang berlabel "Daftar")
    const daftarButtons = await $$('android=new UiSelector().text("Daftar")');
    const submitButton = daftarButtons[daftarButtons.length - 1]; // Ambil tombol terakhir

    // ✅ Pastikan tombol aktif lalu klik
    await submitButton.waitForEnabled({ timeout: 5000 });
    await submitButton.click();
  
    // ✅ Assertion: pastikan diarahkan ke halaman Registrasi Sukses
    const successTitle = await $('android=new UiSelector().textContains("Registrasi Sukses")');
    await successTitle.waitForDisplayed({ timeout: 30000 });
    await expect(successTitle).toBeDisplayed();
    });
  });
  