class Group {
  constructor(path) {
    this.path = path
    this.Listeners = {}
  }
  // Listen 设置监听某数据处理行数
  listen(dataName, successHandle, errorHandle) {
    this.Listeners[dataName] = {
      successHandle,
      errorHandle,
    }
    return this
  }
  //  handle 处理接收到的数据,分配到对应的监听器
  handle(data) {
    const listener = this.Listeners[data.dataName]
    if (listener) {
      if ((data.kind === 'Broadcast' || data.kind === 'Unicast') && listener.successHandle) {
        listener.successHandle(data)
      } else if (data.kind === 'Error' && listener.errorHandle) {
        listener.errorHandle(data)
      }
    } else {
      console.log(`no listener for data:"${data.dataName}"`)
    }
  }
}

export default class MySocket {
  constructor(prop) {
    this.webSocket = new WebSocket(prop)
    this.groups = {}
    this.webSocket.onopen = this.onOpen
    this.webSocket.onerror = this.onError
    this.webSocket.onmessage = this.onMessage
    this.webSocket.onclose = this.onClose
  }
  // 加入聊天群
  listen(path, dataName, successHandle, errorHandle) {
    if (!path || !dataName) {
      const err = { msg: 'groupPath or dataName can not empty' }
      throw err
    }
    if (this.isOpened) {
      this.send({
        path,
        dataName,
        kind: 'Listen',
      })
    }
    if (!this.groups[path]) {
      this.groups[path] = new Group(path)
    }
    this.groups[path].listen(dataName, successHandle, errorHandle)
    return this
  }
  // 发送消息
  send(value) {
    this.webSocket.send(JSON.stringify(value))
  }
  onOpen() {
    if (this.onopen) {
      this.onopen()
    }
    // for (const k in this.groups) {
    //   if (this.groups.hasOwnProperty(k)) {
    //     const Listeners = this.groups[k].Listeners
    //     for (const i in Listeners) {
    //       if (Listeners.hasOwnProperty(i)) {
    //         this.send({
    //           path: k,
    //           kind: 'Listen',
    //           dataName: i,
    //         })
    //       }
    //     }
    //   }
    // }
    this.isOpened = true
  }
  onError() {
    if (this.onerror) {
      this.onerror()
    }
  }
  onClose() {
    if (this.onclose) {
      this.onclose()
    }
  }
  onMessage(e) {
    const data = JSON.parse(e.data)
    const group = this.groups[data.path]
    if (group) {
      group.handle(data)
    }
  }
}
