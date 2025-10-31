// バックグラウンドスクリプト
// content scriptからのメッセージを受信してfetchを実行

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchUrl') {
    console.log('Background: fetchUrl request received:', request.url);
    
    fetch(request.url, {
      method: 'GET'
    })
      .then(response => {
        console.log('Background: Response status:', response.status);
        console.log('Background: Response ok:', response.ok);
        
        return response.text().then(text => ({
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          body: text,
          headers: Object.fromEntries([...response.headers.entries()])
        }));
      })
      .then(data => {
        console.log('Background: Response data:', data);
        sendResponse(data);
      })
      .catch(error => {
        console.error('Background: Fetch error:', error);
        sendResponse({
          ok: false,
          error: error.message
        });
      });
    
    // 非同期レスポンスを返すためtrueを返す
    return true;
  }
});
