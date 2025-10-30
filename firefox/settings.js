document.addEventListener('DOMContentLoaded', async () => {
  const serverUrlInput = document.getElementById('serverUrl');
  const siteConfigsInput = document.getElementById('siteConfigs');
  const saveButton = document.getElementById('saveButton');
  const message = document.getElementById('message');

  // デフォルト設定
  const defaultConfigs = [
    { url: 'https://ncode.syosetu.com', pattern: 'https://ncode\\.syosetu\\.com/([^/]+)(/.*)?$', replacement: 'https://ncode.syosetu.com/$1/' },
    { url: 'https://novel18.syosetu.com', pattern: 'https://novel18\\.syosetu\\.com/([^/]+)(/.*)?$', replacement: 'https://novel18.syosetu.com/$1/' },
    { url: 'https://syosetu.org/novel/', pattern: 'https://syosetu\\.org/novel/(\\d+)(/.*)?$', replacement: 'https://syosetu.org/novel/$1/' },
    { url: 'https://kakuyomu.jp/works/', pattern: 'https://kakuyomu\\.jp/works/(\\d+)(/.*)?$', replacement: 'https://kakuyomu.jp/works/$1' },
    { url: 'https://www.akatsuki-novels.com', pattern: 'https://www\\.akatsuki-novels\\.com/.*novel_id~(\\d+).*$', replacement: 'https://www.akatsuki-novels.com/stories/index/novel_id~$1' },
    { url: 'http://www.mai-net.net/bbs/sst/sst.php', pattern: 'https?://www\\.mai-net\\.net/bbs/sst/sst\\.php\\?.*all=(\\d+).*$', replacement: 'http://www.mai-net.net/bbs/sst/sst.php?act=dump&cate=all&all=$1' }
  ];

  // 設定を読み込み
  const settings = await browser.storage.sync.get(['serverUrl', 'siteConfigs']);
  console.log('読み込んだ設定:', settings);
  
  if (settings.serverUrl) {
    serverUrlInput.value = settings.serverUrl;
  }
  
  // siteConfigsが存在し、かつ配列で、かつ要素がある場合のみ既存設定を使用
  if (settings.siteConfigs && Array.isArray(settings.siteConfigs) && settings.siteConfigs.length > 0) {
    console.log('既存の設定を使用');
    const configLines = settings.siteConfigs.map(config => 
      `${config.url}|${config.pattern || ''}|${config.replacement || ''}`
    );
    siteConfigsInput.value = configLines.join('\n');
  } else {
    // デフォルト設定を表示
    console.log('デフォルト設定を表示');
    const configLines = defaultConfigs.map(config => 
      `${config.url}|${config.pattern || ''}|${config.replacement || ''}`
    );
    siteConfigsInput.value = configLines.join('\n');
  }

  // 保存ボタン
  saveButton.addEventListener('click', async () => {
    const serverUrl = serverUrlInput.value.trim();
    const siteConfigsText = siteConfigsInput.value.trim();
    
    const siteConfigs = siteConfigsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split('|');
        return {
          url: parts[0] ? parts[0].trim() : '',
          pattern: parts[1] ? parts[1].trim() : '',
          replacement: parts[2] !== undefined ? parts[2] : ''
        };
      })
      .filter(config => config.url.length > 0);

    console.log('保存する設定:', { serverUrl, siteConfigs });

    await browser.storage.sync.set({
      serverUrl: serverUrl,
      siteConfigs: siteConfigs
    });

    message.textContent = '設定を保存しました';
    message.className = 'message success';
    message.style.display = 'block';

    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
  });
});
