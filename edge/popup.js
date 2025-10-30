document.addEventListener('DOMContentLoaded', () => {
  const openSettingsButton = document.getElementById('openSettings');
  
  openSettingsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'settings.html' });
  });
});
