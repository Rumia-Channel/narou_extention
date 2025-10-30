// 通知を表示する関数
function showNotification(message, type = 'success') {
  // 既存の通知を削除
  const existingNotification = document.getElementById('site-url-sender-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // 通知要素を作成
  const notification = document.createElement('div');
  notification.id = 'site-url-sender-notification';
  notification.textContent = message;
  
  // スタイルを適用
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px 20px',
    backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#ff9800',
    color: 'white',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    zIndex: '999999',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '400px',
    wordWrap: 'break-word',
    animation: 'slideIn 0.3s ease-out',
    transition: 'opacity 0.3s ease-out'
  });

  // アニメーションを追加
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // DOMに追加
  document.body.appendChild(notification);

  // 3秒後に自動で消える
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 300);
  }, 3000);
}

// Shift+Nキーの監視
document.addEventListener('keydown', async (event) => {
  // Shift+Nキーの組み合わせをチェック
  if (event.shiftKey && event.key === 'N') {
    // 設定を取得
    const settings = await browser.storage.sync.get(['serverUrl', 'siteConfigs']);
    
    if (!settings.serverUrl || !settings.siteConfigs || settings.siteConfigs.length === 0) {
      return;
    }
    
    let currentUrl = window.location.href;
    
    // 現在のURLに一致するサイト設定を検索
    const matchedConfig = settings.siteConfigs.find(config => 
      currentUrl.includes(config.url)
    );
    
    // 対象サイトでない場合は何もしない（Shift+Nを通常動作させる）
    if (!matchedConfig) {
      return;
    }
    
    // 対象サイトの場合のみpreventDefaultを実行
    console.log('Shift+N が検出されました');
    event.preventDefault();
    console.log('取得した設定:', settings);
    console.log('現在のURL:', currentUrl);
    console.log('マッチした設定:', matchedConfig);
    console.log('マッチした設定:', matchedConfig);
    
    // URLマスク処理（サイトごとの設定を使用）
    let maskedUrl = currentUrl;
    if (matchedConfig.pattern) {
      try {
        const regex = new RegExp(matchedConfig.pattern);
        console.log('正規表現パターン:', matchedConfig.pattern);
        console.log('正規表現テスト結果:', regex.test(currentUrl));
        
        // パターンにマッチしない場合は送信しない
        if (!regex.test(currentUrl)) {
          console.log('URLが正しい形式ではありません:', currentUrl);
          showNotification('URLが正しい形式ではありません', 'warning');
          return;
        }
        const replacement = matchedConfig.replacement !== undefined ? matchedConfig.replacement : '';
        maskedUrl = currentUrl.replace(regex, replacement);
        console.log('URLマスク適用:', currentUrl, '->', maskedUrl);
      } catch (error) {
        console.error('URLマスク正規表現エラー:', error);
        showNotification('URLマスク正規表現エラー: ' + error.message, 'error');
        return;
      }
    }
    
    // サーバーにリクエストを送信
    const requestUrl = `${settings.serverUrl}/api/download4ssl?target=${encodeURIComponent(maskedUrl)}`;
    console.log('送信URL:', requestUrl);
    
    showNotification('送信中...', 'warning');
    
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        mode: 'no-cors'  // CORS制限を回避
      });
      console.log('リクエスト送信完了');
      console.log('Response type:', response.type);
      
      // no-corsモードではレスポンスの詳細が取得できないため、成功と見なす
      if (response.type === 'opaque') {
        console.log('URLを送信しました（no-corsモード）:', requestUrl);
        showNotification('URLを送信しました✓', 'success');
      } else if (response.ok) {
        console.log('URLを送信しました:', requestUrl);
        showNotification('URLを送信しました✓', 'success');
      } else {
        console.error('送信に失敗しました:', response.status, response.statusText);
        showNotification('送信に失敗しました: ' + response.status, 'error');
      }
    } catch (error) {
      console.error('送信エラー:', error);
      showNotification('送信エラー: ' + error.message, 'error');
    }
  }
});

console.log('Site URL Sender: content.js が読み込まれました');
