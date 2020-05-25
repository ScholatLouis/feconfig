### 特性
1. 支持项目配置代码片段(code snippets)路径，并在编辑区域进行代码提示
- 在workspace的`settings.json`文件中增加`fe.snippets`配置`对象`，将需要配置的代码片段名称和路径以`key: value`的形式录入。

2. 支持项目配置统一插件并自动安装
- 在workspace的`settings.json`文件中增加`fe.plugin`配置`数组`，将需要配置的插件名称录入。

3. 支持项目统一vscdoe配置
- 在workspace的`settings.json`文件中增加`fe.configure`配置对象，将需要配置vscode配置录入。
```JavaScript
"fe": {
  // 插件配置
  "plugin": [
      "eamodio.gitlens",
      "shengchen.vscode-leetcode",
      "octref.vetur"
  ],
  // vscode配置
  "configure": {
      "editor.tabSize": 4,
      "files.eol": "\r\n",
      "files.associations": {
          "*.wpy": "html",
          "*.cjson": "jsonc",
          "*.wa": "html",
      }
  },
  // 代码片段配置
  "snippets": {
      "WaButton": "src/snippets/index.wa",
      "WaPage": "src/snippets/page.wa"
  }
},
```

### 用法
1. 插件的安装和vscode的配置需要通过vscode界面输入`shift + commad + p`调出命令行输入`FECONFIG`完成。
2. 代码片段则通过路径配置完成后即可使用，目前只支持在`.html .vue .js .ts .jsx`文件格式完成自动提示。
![使用方法](image/demo.gif)

### 版本支持
- vscode版本大于等于1.37.0

### FAQ
在使用该插件时候，请确保环境变量已经配置。
- window环境确保`code`命令能使用，[具体查看该文章](https://code.visualstudio.com/docs/editor/command-line)
- Mac环境确保已经安装`code`命令，[具体查看该文章](https://code.visualstudio.com/docs/setup/mac)
