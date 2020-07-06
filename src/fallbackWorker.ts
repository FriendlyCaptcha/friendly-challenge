// Based on Apache-2.0 licensed pseudo-worker package https://github.com/nolanlawson/pseudo-worker
//
// This can be used as a fallback in case webworkers are not supported. This worker works
// synchronously and uses eval(), leading to a much slower and worse user experience.

export type MessageEventListener = ((msg: MessageEvent & any) => void);

export type WorkerSelf = {
  messageListeners: MessageEventListener[];
  errorListeners: MessageEventListener[];
  postMessage: (msg: any, a: string, transfer?: any) => any,
  addEventListener: (type: "message" | "error", listener: MessageEventListener) => any,
  close: () => any;
  onerror?: () => any;
  onmessage?: () => any;
}


function doEval(self: WorkerSelf, script: string) {
  (function () {
    eval(script);
  }).call(self);
}

export class FallbackWorker {
  private messageListeners: MessageEventListener[] = [];
  private errorListeners: MessageEventListener[] = [];
  private workerMessageListeners: MessageEventListener[] = [];
  private workerErrorListeners: MessageEventListener[] = [];
  private postMessageListeners: MessageEventListener[] = [];
  private terminated = false;
  private script?: string;
  private workerSelf?: WorkerSelf;
  onerror: any;
  onmessage: any;

  constructor(workerCode: string) {
      this.script = workerCode
      this.workerSelf = {
        messageListeners: this.workerMessageListeners,
        errorListeners: this.workerErrorListeners,
        postMessage: (msg) => this.workerPostMessage(msg),
        addEventListener: this.workerAddEventListener,
        close: this.terminate,
      };
      
      doEval(this.workerSelf, this.script);
      var currentListeners = this.postMessageListeners;
      this.postMessageListeners = [];
      for (var i = 0; i < currentListeners.length; i++) {
        this.runPostMessage(currentListeners[i]);
      }
  }

  private callErrorListener(err: Error) {
    return function (listener: MessageEventListener) {
      listener({
        type: 'error',
        error: err,
        message: err.message
      });
    };
  }

  public addEventListener(type: "message" | "error", fun: MessageEventListener) {
    if (type === 'message') {
      this.messageListeners.push(fun);
    } else if (type === 'error') {
      this.errorListeners.push(fun);
    }
  }

  public removeEventListener(type: "message" | "error", fun: MessageEventListener) {
      let listeners;
      if (type === 'message') {
        listeners = this.messageListeners;
      } else if (type === 'error') {
        listeners = this.errorListeners;
      } else {
        return;
      }
      var i = -1;
      while (++i < listeners.length) {
        var listener = listeners[i];
        if (listener === fun) {
          delete listeners[i];
          break;
        }
      }
  }

  private postError(err: Error) {
    console.log("Post error", err)
    var callFun = this.callErrorListener(err);
    if (typeof this.onerror === 'function') {
      callFun(this.onerror);
    }
    if (this.workerSelf && typeof this.workerSelf.onerror === 'function') {
      callFun(this.workerSelf.onerror);
    }
    this.errorListeners.forEach((l) => callFun(l));
    this.workerErrorListeners.forEach(l => callFun(l));
  }

  private runPostMessage(msg: any) {
    console.log("Ran message to worker", msg);
    const callFun = (listener: MessageEventListener) => {
      try {
        listener({data: msg});
      } catch (err) {
        this.postError(err);
      }
    }

    if (this.workerSelf && typeof this.workerSelf.onmessage === 'function') {
      callFun(this.workerSelf.onmessage);
    }
    this.workerMessageListeners.forEach(callFun);
  }

  public postMessage(msg: any, arg0: any) {
    if (typeof msg === 'undefined') {
      throw new Error('postMessage() requires an argument');
    }
    if (this.terminated) {
      return;
    }
    if (!this.script) {
      this.postMessageListeners.push(msg);
      return;
    }
    this.runPostMessage(msg);
  }

  public terminate() {
    this.terminated = true;
  }

  private workerPostMessage(msg: any) {
    console.log("Message from worker", msg);
    if (this.terminated) {
      return;
    }
    function callFun(listener: MessageEventListener) {
      listener({
        data: msg
      });
    }
    if (typeof this.onmessage === 'function') {
      callFun(this.onmessage);
    }
    this.messageListeners.forEach(callFun);
  }

  private workerAddEventListener(type: "message" | "error", fun: MessageEventListener) {
    if (type === 'message') {
      this.workerMessageListeners.push(fun);
    } else if (type === 'error') {
      this.workerErrorListeners.push(fun);
    }
  }

  public onmessageerror() {
    throw Error("Not implemented")
  }

  public dispatchEvent(): boolean {
    throw Error("Not implemented")
  }
}

