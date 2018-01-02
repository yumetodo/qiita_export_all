# qiita_export_all

Qiita v2 API を使って自身の投稿記事全てをエクスポートするツール。

## Motivation

[stakiran/qiita_exporter](https://github.com/stakiran/qiita_exporter)が類似ツールとしてすでにある。しかし

- Python 2である
- 画像のダウンロードをやってくれない
- 投稿数が100を超えて取得できない
- Pythonわからない

という不満があった。自分がよくわかってるのはC++かJavaScriptだ。しかしC++でHTTPS通信とか地獄すぎる。JavaScriptしかないやろ。しかも`async`/`await`がある。これはいい。

## Requirement

- Node.js 8.x以降
- npm

## Installation

### Node.js & npm

[nvm](https://github.com/creationix/nvm) もしくは [nodist](https://github.com/marcelklehr/nodist)を使ってNode.jsとnpmをインストールすることを推奨します。

#### nvm

```plain
nvm install 8.x
nvm use 8.x
```

#### nodist

```plain
nodist + 8.x
nodist 8.x
nodist npm match
```

## Download

gitなりzipでDLしてあげればよいです。

```plain
git clone https://github.com/yumetodo/qiita_export_all.git
cd qiita_export_all
```

## Qiita API Access Token

Qiita API Access Tokenを手に入れます。

1. Qiitaにログインする
2. [設定画面](https://qiita.com/settings/applications)から個人用アクセストークンを発行する

説明のため、得たtokenが`9226168a5ef65f8e81153b460e7c78f8b8e53394`とします。各自読み替えてください。

### Windows

```cmd
set QIITA_ACCESS_TOKEN=9226168a5ef65f8e81153b460e7c78f8b8e53394
```

### Unix like system

```bash
export QIITA_ACCESS_TOKEN=9226168a5ef65f8e81153b460e7c78f8b8e53394
```

## Use

```plain
npm start
```

でとりあえずの実行はできます。

`qiita_export_all`をコマンドとしてインストールするには

```plain
npm link
```

とすると

```plain
qiita_export_all
```

のように実行できます。

## Sample

```plain
npm start
info: Requesting items...
request limit remain: 810/1000
info: 72 items found.
info: creating image save directory...
info: created.
info: Requesting comments/images...
request limit remain: 809/1000
request limit remain: 808/1000
request limit remain: 807/1000
request limit remain: 806/1000
request limit remain: 805/1000
request limit remain: 804/1000
request limit remain: 803/1000
request limit remain: 802/1000
request limit remain: 801/1000
request limit remain: 800/1000
request limit remain: 799/1000
request limit remain: 798/1000
request limit remain: 797/1000
request limit remain: 796/1000
request limit remain: 795/1000
request limit remain: 794/1000
request limit remain: 793/1000
request limit remain: 792/1000
request limit remain: 791/1000
request limit remain: 790/1000
request limit remain: 789/1000
request limit remain: 788/1000
request limit remain: 787/1000
request limit remain: 786/1000
request limit remain: 785/1000
request limit remain: 784/1000
request limit remain: 783/1000
request limit remain: 782/1000
request limit remain: 781/1000
request limit remain: 780/1000
request limit remain: 779/1000
request limit remain: 778/1000
request limit remain: 777/1000
request limit remain: 776/1000
request limit remain: 775/1000
request limit remain: 774/1000
request limit remain: 773/1000
request limit remain: 772/1000
request limit remain: 771/1000
request limit remain: 770/1000
info: Request finidhed.
info: Replacing Image path...
info: Replace finished.
info: Writing items/comments...
write finished.
```

## Output

カレントディレクトリに出力します。生成されるdirectory treeは

```plain
.
├── img
│   ├── 0_7.tmp
│   ├── 1_7.tmp
┊   ┊
├── items
│   ├── [ネタ]私のTLのみんながpure HTMLが何かを理解してくれない件
│   │   ├── comments
│   │   │   ├── 2017-02-02T145121+0900
│   │   │   │   ├── index.html
│   │   │   │   ├── info.json
│   │   │   │   └── README.md
│   │   │   ├── 2017-02-02T153542+0900
│   │   │   │   ├── index.html
│   │   │   │   ├── info.json
│   │   │   │   └── README.md
│   │   │   ├── 2017-02-02T160946+0900
│   │   │   │   ├── index.html
│   │   │   │   ├── info.json
│   │   │   │   └── README.md
│   │   │   ├── 2017-02-02T173054+0900
│   │   │   │   ├── index.html
│   │   │   │   ├── info.json
│   │   │   │   └── README.md
│   │   │   └── 2017-02-02T181039+0900
│   │   │       ├── index.html
│   │   │       ├── info.json
│   │   │       └── README.md
│   │   ├── index.html
│   │   ├── info.json
│   │   └── README.md
┊   ┊
```

のようなものです。

## Notification

- md ファイルは UTF-8 でエクスポートします
- 投稿数が100を超えていても**取得できます**
- Windowsでは`MAX_PATH`を超えるとエラーになる気がします
- カレントディレクトリにRead/Writeの権限がないとエラーになります
- directory名の一部にQiita記事のタイトルを使用しますが、パスとして無効な文字は削除されます。これは[sanitize-filename](https://www.npmjs.com/package/sanitize-filename)に丸投げしています。

## License

Watch [LICENSE](./LICENSE).

## Special thanks

- [stakiran/qiita_exporter](https://github.com/stakiran/qiita_exporter): (紹介記事: [Qiita API v2 を使って自身の全投稿をエクスポートする Python スクリプトを書いた](https://qiita.com/sta/items/5074df5fcb81d890897b))
