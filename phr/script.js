'use strict'

const resourceFromTarget = (target) => {
  return new Promise((resolve, reject) => {
    let url
    try {
      url = new URL(target)
    } catch (err) {
      return reject(err)
    }

    url.protocol = 'https:'
    resolve(url)
  })
}

const showInBox = (response) => {
  return new Promise((resolve, reject) => {
    response.text().then((text) => {
      document.getElementById('content').innerHTML = text
    })
    resolve(response)
  })
}

class MessageBox {
  constructor (parentID) {
    this.list = document.createElement('UL')
    document.getElementById(parentID).appendChild(this.list)
  }

  show (msg, typ) {
    const node = document.createElement('LI')
    node.appendChild(document.createTextNode(msg))
    node.classList.add(typ)
    this.list.appendChild(node)
    return node
  }

  info (msg) {
    return this.show(msg, 'info')
  }

  error (msg) {
    return this.show(msg, 'error')
  }
}

const phrNewTarget = (target, messageBox) => {
  resourceFromTarget(target)
    .then(resource => {
      return new Promise((resolve, reject) => {
        messageBox.info(`Fetching ${resource}...`)
        resolve(resource)
      })
    })
    .then(fetch)
    .then(response => {
      return new Promise((resolve, reject) => {
        messageBox.info(`Target response: ${response.status} ${response.statusText}`)
        resolve(response)
      })
    })
    .then(showInBox)
    .then(console.log)
    .catch(err => {
      messageBox.error(`Failed to fetch resource: ${err}.`)
      console.log(err)
    })
}

const route = (messageBox) => {
  const target = new URLSearchParams(window.location.search).get('target')
  if (target) {
    phrNewTarget(target, messageBox)
  } else {
    messageBox.info('No target detected.')
  }
}

navigator.registerProtocolHandler(
  'web+phr',
  'https://ephri.github.io/phr?target=%s',
  'ephri PHR handler'
)

route(new MessageBox('messagebox'))
