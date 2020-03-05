# qiita_export_all

![Node CI](https://github.com/yumetodo/qiita_export_all/workflows/Node%20CI/badge.svg) [![Greenkeeper badge](https://badges.greenkeeper.io/yumetodo/qiita_export_all.svg)](https://greenkeeper.io/)


Qiita v2 API を使って自身の投稿記事全てをエクスポートするツール。

## Motivation

[stakiran/qiita_exporter](https://github.com/stakiran/qiita_exporter)が類似ツールとしてすでにある。しかし

- Python 2である
- 画像のダウンロードをやってくれない
- 投稿数が100を超えて取得できない
- HTMLデータやコメントなどのMarkdown以外のデータを保存してくれない
- Pythonわからない

という不満があった。自分がよくわかってるのはC++かJavaScriptだ。しかしC++でHTTPS通信とか地獄すぎる。JavaScriptしかないやろ。しかも`async`/`await`がある。これはいい。

## Requirement

- Node.js 10.x以降
- npm

## Installation

### Node.js & npm

[nvm](https://github.com/creationix/nvm) もしくは [nodist](https://github.com/marcelklehr/nodist)を使ってNode.jsとnpmをインストールすることを推奨します。

#### nvm

```plain
nvm install 12.x
nvm use 12.x
```

#### nodist

```plain
nodist + 12.x
nodist 12.x
nodist npm match
```

### Qiita API Access Token

Qiita API Access Tokenを手に入れます。

1. Qiitaにログインする
2. [設定画面](https://qiita.com/settings/applications)から個人用アクセストークンを発行する

説明のため、得たtokenが`9226168a5ef65f8e81153b460e7c78f8b8e53394`とします。各自読み替えてください。

#### cmd.exe

```cmd
set QIITA_ACCESS_TOKEN=9226168a5ef65f8e81153b460e7c78f8b8e53394
```

#### sh

```bash
export QIITA_ACCESS_TOKEN=9226168a5ef65f8e81153b460e7c78f8b8e53394
```

### Use

```plain
npx qiita_export_all
```

## Note

- md ファイルは UTF-8 でエクスポートします
- 投稿数が100を超えていても**取得できます**
- Windowsでは`MAX_PATH`を超えるとエラーになる気がします
- カレントディレクトリにRead/Writeの権限がないとエラーになります
- directory名の一部にQiita記事のタイトルを使用しますが、パスとして無効な文字は削除されます。これは[sanitize-filename](https://www.npmjs.com/package/sanitize-filename)に丸投げしています。

## Output

カレントディレクトリに出力します。生成されるdirectory treeは

```plain
.
├── img
│   ├── 0_7.png
│   ├── 1_7.png
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

## Development

### Download

gitなりzipでDLしてあげればよいです。

```plain
git clone https://github.com/yumetodo/qiita_export_all.git
cd qiita_export_all
```

### Use

```plain
npm start
```

でとりあえずの実行はできます。

### Example

```bash
$ npm start

> qiita_export_all@1.2.0 start /home/yumetodo/qiita_export_all
> node bin/index.js

info: Requesting items...
request limit remain: 995/1000
request limit remain: 994/1000
info: 110 items found.
info: creating image save directory...
info: created.
info: Requesting comments/images...
request limit remain: 993/1000
request limit remain: 992/1000
request limit remain: 991/1000
request limit remain: 990/1000
request limit remain: 989/1000
request limit remain: 988/1000
request limit remain: 987/1000
When fetch https://scan.coverity.com/projects/1316/badge.svg (5886b2c0c421c24c909b/item), FetchError: request to https://scan.coverity.com/projects/1316/badge.svg failed, reason: Parse Error: Invalid header value char
request limit remain: 986/1000
request limit remain: 985/1000
request limit remain: 984/1000
request limit remain: 983/1000
request limit remain: 982/1000
request limit remain: 981/1000
request limit remain: 980/1000
request limit remain: 979/1000
request limit remain: 978/1000
request limit remain: 977/1000
request limit remain: 976/1000
request limit remain: 975/1000
request limit remain: 974/1000
request limit remain: 973/1000
request limit remain: 972/1000
request limit remain: 971/1000
request limit remain: 970/1000
request limit remain: 969/1000
request limit remain: 968/1000
request limit remain: 967/1000
request limit remain: 966/1000
request limit remain: 965/1000
When fetch https://pbs.twimg.com/media/C3kcEbkUcAAsbkn.jpg (34adcaeddaab8b58ab47/item), Error: Request failed with status code 404
request limit remain: 964/1000
request limit remain: 963/1000
request limit remain: 962/1000
request limit remain: 961/1000
request limit remain: 960/1000
request limit remain: 959/1000
request limit remain: 958/1000
request limit remain: 957/1000
request limit remain: 956/1000
request limit remain: 955/1000
request limit remain: 954/1000
request limit remain: 953/1000
request limit remain: 952/1000
request limit remain: 951/1000
request limit remain: 950/1000
request limit remain: 949/1000
request limit remain: 948/1000
request limit remain: 947/1000
request limit remain: 946/1000
request limit remain: 945/1000
request limit remain: 944/1000
request limit remain: 943/1000
request limit remain: 942/1000
request limit remain: 941/1000
request limit remain: 940/1000
request limit remain: 939/1000
request limit remain: 938/1000
request limit remain: 937/1000
request limit remain: 936/1000
request limit remain: 935/1000
info: Request finidhed.
info: Replacing Image path...
info: Replace finished.
info: Writing items/comments...
write finished.
```

## License

Watch [LICENSE](./LICENSE).

## Special thanks

- [stakiran/qiita_exporter](https://github.com/stakiran/qiita_exporter): (紹介記事: [Qiita API v2 を使って自身の全投稿をエクスポートする Python スクリプトを書いた](https://qiita.com/sta/items/5074df5fcb81d890897b))
