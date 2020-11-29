# primoServe
A proxy for Primo, for serving local files. I use it to develop custom components.
Nothing more, nothing less.

This is **not** a replacement for [primo-explore-devenv](https://github.com/ExLibrisGroup/primo-explore-devenv)

#### Usage
```bash
primoServe --vid=NUI --proxy=https://your.primo.url --dir=/directory/to/vids --ve
```
* __vid__: The ViewID that you wish to open
* __proxy__: Base URL to your Primo environment
* __dir__: The directory your data is stored in. The proxy will look in this directory for every path that starts with /primo-explore/custom/. If omitted the current directory will be taken.
* __ve__: Flag to mark this as a Primo VE custom package

#### Install
__with yarn__
```bash
yarn global add primo-serve
```

__with npm__
```bash
npm install -g primo-serve
```
