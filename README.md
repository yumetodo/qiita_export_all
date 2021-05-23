# qiita_export_all

![Node CI](https://github.com/yumetodo/qiita_export_all/workflows/Node%20CI/badge.svg) [![CircleCI](https://circleci.com/gh/yumetodo/qiita_export_all.svg?style=svg)](https://circleci.com/gh/yumetodo/qiita_export_all) [![Known Vulnerabilities](https://snyk.io/test/github/yumetodo/qiita_export_all/badge.svg?targetFile=package.json)](https://snyk.io/test/github/yumetodo/qiita_export_all?targetFile=package.json)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fyumetodo%2Fqiita_export_all.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fyumetodo%2Fqiita_export_all?ref=badge_shield)

[![NPM](https://nodei.co/npm/qiita_export_all.png)](https://nodei.co/npm/qiita_export_all/)

Qiita v2 API を使って自身の投稿記事全てをエクスポートするツール。

## Motivation

[stakiran/qiita_exporter](https://github.com/stakiran/qiita_exporter)が類似ツールとしてすでにある。しかし

- Python 2 である
- 画像のダウンロードをやってくれない
- 投稿数が 100 を超えて取得できない
- HTML データやコメントなどの Markdown 以外のデータを保存してくれない
- Python わからない

という不満があった。自分がよくわかってるのは C++か JavaScript だ。しかし C++で HTTPS 通信とか地獄すぎる。JavaScript しかないやろ。しかも`async`/`await`がある。これはいい。

## Requirement

- Node.js 12.x 以降
- npm

## Installation

### Node.js & npm

[nvm](https://github.com/creationix/nvm) もしくは [nodist](https://github.com/marcelklehr/nodist) を使って Node.js と npm をインストールすることを推奨します。

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

Qiita API Access Token を手に入れます。

1. Qiita にログインする
2. [設定画面](https://qiita.com/settings/applications)から個人用アクセストークンを発行する

説明のため、得た token が`9226168a5ef65f8e81153b460e7c78f8b8e53394`とします。各自読み替えてください。

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

## Docker

Node.js 環境がない場合でも Docker が利用可能な場合は、Docker で Qiita 記事のバックアップができます。

```shellsession
$ # リポジトリのクローンと移動
$ git clone https://github.com/yumetodo/qiita_export_all.git
$ cd qiita_export_all
$ # コンテナの作成
$ docker build -t qiita_export_all:local .
$ # コンテナの起動とアプリの実行。./export に出力されます（token は要置き換え）
$ docker run \
    --rm \
    --env QIITA_ACCESS_TOKEN=9226168a5ef65f8e81153b460e7c78f8b8e53394 \
    -v $(pwd)/export:/home/node/export \
    qiita_export_all:local
...
$ # 出力されたファイルの確認
$ tree ./export
...
```

- 確認済み Docker version v19.03.5 (Intel, x86_64, AMD64)

## Command Line options

```plain
Usage: qiita_export_all [options]

Options:
  -V, --version        output the version number
  -u, --user-id <id>   Qiita user id you want to download(default: the user who get QIITA_ACCESS_TOKEN).
  -o, --output <path>  Write output to <path> instead of current directory.
  --no-debug           disable print api limit per request
  -h, --help           output usage information
```

## Note

- md ファイルは UTF-8 でエクスポートします
- 投稿数が 100 を超えていても**取得できます**
- Windows では`MAX_PATH`を超えるとエラーになる気がします
- カレントディレクトリに Read/Write の権限がないとエラーになります
- directory 名の一部に Qiita 記事のタイトルを使用しますが、パスとして無効な文字は削除されます。これは[sanitize-filename](https://www.npmjs.com/package/sanitize-filename)に丸投げしています。

## Output

カレントディレクトリに出力します。生成される directory tree は

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

git なり zip で DL してあげればよいです。

```plain
git clone https://github.com/yumetodo/qiita_export_all.git
cd qiita_export_all
npm ci
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

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fyumetodo%2Fqiita_export_all.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fyumetodo%2Fqiita_export_all?ref=badge_large)

## Special thanks

- [stakiran/qiita_exporter](https://github.com/stakiran/qiita_exporter): (紹介記事: [Qiita API v2 を使って自身の全投稿をエクスポートする Python スクリプトを書いた](https://qiita.com/sta/items/5074df5fcb81d890897b))
