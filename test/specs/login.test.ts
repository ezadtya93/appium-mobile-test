describe('Login Test', () => {
    it('should click login button', async () => {
      const loginBtn = await $('~login_button') // gunakan accessibilityId
      await loginBtn.click()
    })
  })
  