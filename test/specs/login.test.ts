describe('Login from Bottom Sheet', () => {
  it('should login via Akun menu', async () => {
    const akunMenu = await $('~Akun');
    await akunMenu.click();

    const loginButton = await $('android=new UiSelector().textContains("Masuk")');
    await loginButton.waitForDisplayed({ timeout: 5000 });
    await loginButton.click();

    const inputFields = await $$('android.widget.EditText');
    await inputFields[0].setValue('eza.zulfachry@gramedia.id');
    await inputFields[1].setValue('testing123');

    // // Optional: tekan Enter supaya form blur dan tombol aktif
    // await inputFields[1].addValue('\n');

    // // Tutup keyboard jika muncul
    // if (await driver.isKeyboardShown()) {
    //   await driver.hideKeyboard();
    // }

    // Ambil tombol "Masuk" yang kedua
    const allMasukButtons = await $$('android=new UiSelector().text("Masuk")');
    const submitButton = allMasukButtons[allMasukButtons.length - 1];
    await submitButton.click();

    // ✅ Assertion (opsional)
    // const homeIndicator = await $('android=new UiSelector().textContains("Beranda")');
    // await expect(homeIndicator).toBeDisplayed();
  });
});
