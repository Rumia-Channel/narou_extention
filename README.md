# Narou rb URL Sender - ブラウザ拡張機能

対象サイトでShift+Nキーを押すと、現在のURLをサーバーに送信するブラウザ拡張機能です。

## フォルダ構成

- **edge/**: Microsoft Edge用の拡張機能（Manifest V3）
- **firefox/**: Mozilla Firefox用の拡張機能（Manifest V2）

## 機能

- **サーバーURL設定**: URLを送信するサーバーのベースURLを設定
- **サイト別設定**: サイトごとに対象URLとURLマスクパターンを設定
- **URLマスク機能**: サイトごとに正規表現で送信前にURLを変換
- **Shift+Nキー**: 対象サイトでShift+Nを押すと、`サーバーURL/api/download4ssl?target=現在のURL` の形式でリクエストを送信

## インストール方法

### Microsoft Edge

1. Edge ブラウザを開く
2. `edge://extensions/` にアクセス
3. 右上の「開発者モード」をオンにする
4. 「展開して読み込み」ボタンをクリック
5. `edge` フォルダを選択

### Mozilla Firefox

1. Firefox ブラウザを開く
2. `about:debugging#/runtime/this-firefox` にアクセス
3. 「一時的なアドオンを読み込む」ボタンをクリック
4. `firefox` フォルダ内の `manifest.json` ファイルを選択

## 使い方

1. 拡張機能アイコンをクリックして設定画面を開く
2. **サーバーURL** を入力（例: `https://example.com`）
3. **サイト設定** をパイプ区切りで入力（デフォルト設定が既に入力されています）
4. 「保存」ボタンをクリック
5. 対象サイトの**作品ページ**にアクセスして、Shift+Nキーを押す

### デフォルト対応サイト

拡張機能には以下のサイトがデフォルトで設定されています：

**小説家になろう**:
- 対象: `https://ncode.syosetu.com/作品ID/...` の形式のみ
- 例: `https://ncode.syosetu.com/n7961jr/1/` → `https://ncode.syosetu.com/n7961jr/`
- 例: `https://ncode.syosetu.com/ranking/` → 送信されない（形式不一致）

**ノクターンノベルズ（小説家になろう18禁）**:
- 対象: `https://novel18.syosetu.com/作品ID/...` の形式のみ
- 例: `https://novel18.syosetu.com/n1234ab/1/` → `https://novel18.syosetu.com/n1234ab/`

**ハーメルン**:
- 対象: `https://syosetu.org/novel/数字/...` の形式のみ
- 例: `https://syosetu.org/novel/371559/1/` → `https://syosetu.org/novel/371559/`
- 例: `https://syosetu.org/novel/list/` → 送信されない（形式不一致）

**カクヨム**:
- 対象: `https://kakuyomu.jp/works/数字/...` の形式のみ
- 例: `https://kakuyomu.jp/works/1177354054890293039/episodes/xxx` → `https://kakuyomu.jp/works/1177354054890293039`
- 例: `https://kakuyomu.jp/works/1177354054890293039` → `https://kakuyomu.jp/works/1177354054890293039`
- 例: `https://kakuyomu.jp/users/wanpankun` → 送信されない（形式不一致）

**暁（Akatsuki Novels）**:
- 対象: `novel_id~数字` を含むURLのみ
- 例: `https://www.akatsuki-novels.com/stories/index/novel_id~31149` → `https://www.akatsuki-novels.com/stories/index/novel_id~31149`
- 例: `https://www.akatsuki-novels.com/stories/view/313728/novel_id~31149` → `https://www.akatsuki-novels.com/stories/index/novel_id~31149`

**Arcadia**:
- 対象: `all=数字` を含むURLのみ
- 例: `http://www.mai-net.net/bbs/sst/sst.php?act=dump&cate=all&all=6858&n=0&count=1` → `http://www.mai-net.net/bbs/sst/sst.php?act=dump&cate=all&all=6858`
- 例: `http://www.mai-net.net/bbs/sst/sst.php?act=dump&cate=original&all=44086` → `http://www.mai-net.net/bbs/sst/sst.php?act=dump&cate=all&all=44086`

### カスタム設定例

デフォルト設定:
```
https://ncode.syosetu.com|https://ncode\.syosetu\.com/([^/]+)(/.*)?$|https://ncode.syosetu.com/$1/
https://novel18.syosetu.com|https://novel18\.syosetu\.com/([^/]+)(/.*)?$|https://novel18.syosetu.com/$1/
https://syosetu.org/novel/|https://syosetu\.org/novel/(\d+)(/.*)?$|https://syosetu.org/novel/$1/
https://kakuyomu.jp/works/|https://kakuyomu\.jp/works/(\d+)(/.*)?$|https://kakuyomu.jp/works/$1
https://www.akatsuki-novels.com|https://www\.akatsuki-novels\.com/.*novel_id~(\d+).*$|https://www.akatsuki-novels.com/stories/index/novel_id~$1
http://www.mai-net.net/bbs/sst/sst.php|https?://www\.mai-net\.net/bbs/sst/sst\.php\?.*all=(\d+).*$|http://www.mai-net.net/bbs/sst/sst.php?act=dump&cate=all&all=$1
```

## 正規表現の説明

- 正規表現はURL全体にマッチする必要があります
- マッチしないURLでは送信が行われません
- **なろう・ノクターン**: `https://(ncode|novel18)\.syosetu\.com/([^/]+)(/.*)?$` は作品ID部分をキャプチャし、それ以外を除外
- **ハーメルン**: `https://syosetu\.org/novel/(\d+)(/.*)?$` は数字の作品IDをキャプチャ
- **カクヨム**: `https://kakuyomu\.jp/works/(\d+)(/.*)?$` は `/works/数字` の形式のみマッチ
- **暁**: `https://www\.akatsuki-novels\.com/.*novel_id~(\d+).*$` は `novel_id~数字` を含むURLから作品IDを抽出
- **Arcadia**: `https?://www\.mai-net\.net/bbs/sst/sst\.php\?.*all=(\d+).*$` は `all=数字` パラメータを含むURLから作品IDを抽出

## 注意事項

- 対象サイトURLは部分一致で判定されます
- サーバーへのリクエストはバックグラウンドで送信されます
- コンソールログで送信状況を確認できます
- 正規表現で正しいURL形式のみが送信対象となります
