class Accepter {
  constructor(path, kind) {
    this.path = path
    this.kind = kind
  }
  handleSuccess = (handleFn) => {
    this.handleSuccessFn = handleFn
    return this
  }
  onSuccess = (data) => {
    if (this.handleSuccessFn) {
      this.handleSuccessFn(data)
    }
  }
  handleError = (handleErrFn) => {
    this.handleErrorFn = handleErrFn
    return this
  }
  onError = (data) => {
    if (this.handleErrorFn) {
      this.handleErrorFn(data)
    }
  }
}

export default class MyChat {
  constructor(url) {
    this.webSocket = new WebSocket(url)
    this.accepts = {}
    this.toSubscriptions = []
    this.webSocket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      const accept = this.accepts[`${data.path}:${data.kind}`]
      if (accept) {
        if (data.status && accept.onSuccess) {
          accept.onSuccess(data)
        } else if (!data.status && accept.onError) {
          accept.onError(data)
        }
      }
    }
    this.webSocket.onopen = () => {
      if (this.handleOpen) {
        this.handleOpen()
      }
      this.toSubscriptions.forEach((subscription) => {
        subscription()
      })
    }
    this.webSocket.onclose = () => {
      if (this.handleClose) {
        this.handleClose()
      }
    }
  }
  broadcast = (path, dataName, content) => {
    this.send({
      path,
      dataName,
      content,
      kind: 'Broadcast',
    })
  }
  subscription = (path) => {
    if (this.webSocket.readyState === 0) {
      this.toSubscriptions(() => {
        this.send({
          path,
          kind: 'Subscription',
        })
      })
    } else {
      this.send({
        path,
        kind: 'Subscription',
      })
    }
    return this.accept(path, 'Subscription')
  }
  accept = (path, kind = 'Broadcast') => {
    const accepter = new Accepter(path, kind)
    this.accepts[`${path}:${kind}`] = accepter
    return accepter
  }
  onopen = (handleOpen) => {
    this.handleOpen = handleOpen
  }
  onclose = (handleClose) => {
    this.handleClose = handleClose
  }
  send = (obj) => {
    this.webSocket.send(JSON.stringify(obj))
  }
}
