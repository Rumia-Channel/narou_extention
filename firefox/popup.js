document.addEventListener('DOMContentLoaded', () => {
  const openSettingsButton = document.getElementById('openSettings');
  
  openSettingsButton.addEventListener('click', () => {
    browser.tabs.create({ url: 'settings.html' });
  });
});
