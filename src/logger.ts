import * as vscode from 'vscode';

export default class Log {
  // make it accept any number of arguments
  static debug(...args: any[]) {
    if (process.env.NODE_ENV === 'development' || vscode.debug.activeDebugSession) {
      console.log(...args);
    }
  }

  static info(...args: any[]) {
    console.log(...args);
  }

}