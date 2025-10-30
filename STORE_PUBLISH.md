# Narou rb URL Sender - ストア公開について

## 開発中と公開時の違い

### Firefox

**開発中（一時的なアドオン）:**
- `storage.local`を使用
- アドオンIDは不要

**ストア公開時:**
- `storage.sync`を使用（デバイス間で設定を同期）
- `manifest.json`に`browser_specific_settings.gecko.id`を追加
- 公開前に必ず`storage.local`を`storage.sync`に戻すこと

### Edge/Chrome

**常に:**
- `storage.sync`を使用
- 開発中もストア公開時も同じコード

## 公開前チェックリスト

### Firefox版
- [ ] `manifest.json`に`browser_specific_settings.gecko.id`が追加されている
- [ ] すべての`storage.local`を`storage.sync`に変更
- [ ] アドオンIDはユニークなもの（例: `yourname-site-url-sender@example.com`）

### Edge版
- [ ] すでに正しい設定（変更不要）

### 共通
- [ ] アイコン画像が適切なサイズ（16, 48, 128px）
- [ ] README.mdに使い方が記載されている
- [ ] プライバシーポリシー（必要に応じて）
- [ ] バージョン番号が適切

## 現在の状態

- **Edge版**: ストア公開可能（`storage.sync`使用）
- **Firefox版**: アドオンIDを追加済み、`storage.sync`に戻しました

### 注意
開発中にFirefoxで動作確認する場合は、一時的に`storage.sync`を`storage.local`に変更する必要があります。
