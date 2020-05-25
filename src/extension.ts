import * as vscode from "vscode";
import { snippetsProvider } from './provider'
import { globalAgent } from "http";

let globalPlugin : Array<any> = [];
let globalContext : vscode.ExtensionContext;

const CONFIGURE_TYPE = {
	FE: "fe",
	PLUGIN: "fe.plugin",
	CONFIG: "fe.configure",
	SNIPPETS: "fe.snippets"
}

function pluginConfigChange() {
	let feConfigure = vscode.workspace.getConfiguration(CONFIGURE_TYPE.FE);
	let pluginArr : Array<any> = [];
	if(feConfigure && feConfigure.plugin && Array.isArray(feConfigure.plugin)) {
		feConfigure.plugin.forEach((plugin) => {
			pluginArr.push(plugin);
		})
	}
	pluginArr.sort();
	if(pluginArr.toString() === globalPlugin.toString()) {
		return false;
	}
	globalPlugin = pluginArr;
	return true;
}

function installPlugin() {
	if(globalPlugin.length === 0) {
		vscode.window.showWarningMessage("未发现需要安装的插件");
		return ;
	}

	let shellCommandStr : string = "";
	globalPlugin.forEach(plugin => {
		shellCommandStr += `code --install-extension ${plugin}; `;
	})
	let shellCommand = new vscode.ShellExecution(shellCommandStr);
	let task = new vscode.Task(
		{type: "PLUGIN"},
		2,
		"PLUGIN",
		"process",
		shellCommand
	);
	console.log(shellCommand);
	vscode.tasks.executeTask(task).then((res) => {
		console.log('success');
		console.log(res);
	}, (err) => {
		console.log('reject');
		console.log(err);
	});
}

function installSnippets() {
	// 配置代码片段
	globalContext.subscriptions.forEach((target : any) =>  {
		if(target.name !== 'FECONFIG')
			target.dispose()
	});
	let snippetsConfigure = vscode.workspace.getConfiguration(CONFIGURE_TYPE.SNIPPETS);
	let fileSystem = vscode.workspace.fs;
	let pathObj = vscode.workspace.workspaceFolders || [];
	let rootPath = pathObj[0].uri.path;
	for(let key in snippetsConfigure) {
		if(typeof snippetsConfigure[key] !== 'string') {
			continue ;
		}
		fileSystem.readFile(vscode.Uri.file(`${rootPath}/${snippetsConfigure[key]}`))
			.then((res) => {
				let snippets : string = res.toString();
				let provider = new snippetsProvider(key, snippets);
				let providerDisposable = vscode.languages.registerCompletionItemProvider(
					{
						scheme: 'file',
						language: '*'
					},
					provider
				);
				globalContext.subscriptions.push(providerDisposable);
			});
	}
}

vscode.workspace.onDidChangeConfiguration(() => {
	installSnippets();	
})

export function activate(context: vscode.ExtensionContext) {

	console.log("TCFTPCONF is now active!");
	globalContext = context;
	let disposable : any = vscode.commands.registerCommand("FE.CONF", () => {
		// 配置settings.json文件
		vscode.window.showInformationMessage("Start configure settings.json");
		let configure = vscode.workspace.getConfiguration();
		let feConfigure = vscode.workspace.getConfiguration(CONFIGURE_TYPE.CONFIG);
		for(let conf in feConfigure) {
			if(conf !== "plugin" && typeof configure[conf] !== "function") {
				configure.update(conf, feConfigure[conf], vscode.ConfigurationTarget.Workspace)
					.then((res : any) => {
						let result = res ? res : "update success";
						console.log(result);
					})
			}
		}

		// 安装plugin
		if(pluginConfigChange()) {
			vscode.window.showInformationMessage("Start install plugin");
			installPlugin();
		}
	});
	installSnippets();
	disposable.name = 'FECONFIG';
	context.subscriptions.push(disposable);
}

export function deactivate() {
	console.log("deactivated");
}
