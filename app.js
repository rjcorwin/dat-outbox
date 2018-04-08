var addresses = []
var archives = []
var lastMessages = {}

let setup = async function() {
  let me = new DatArchive(window.location.host)
  setTimeout(async function() {
    addressesJson = await me.readFile('addresses.json') 
    setupPartTwo(addressesJson)
  }, 1000)
}

let setupPartTwo = async function(addressesJson) {
  addresses = JSON.parse(addressesJson) 
  addresses.push(window.location.host)

  for (let address of addresses) {
    lastMessages[address] = ''
    archives[address] = new DatArchive(address)
  }

  messageForm.addEventListener('submit', function(event) {
    event.preventDefault()
    let newMessage = event.target.elements.message.value
    event.target.elements.message.value = ''
    archives[window.location.host].writeFile('message.txt', newMessage)

  })

  subscribeForm.addEventListener('submit', function(event) {
    event.preventDefault()
    let newAddress = event.target.elements.address.value
    event.target.elements.address.value = ''
    addresses.push(newAddress)
    archives[window.location.host].writeFile('addresses.json', JSON.stringify(addresses))

  })

}

var appendNewMessage = function(message) {
  let newMessageEl = document.createElement('div')
  newMessageEl.innerHTML = message 
  window.messages.appendChild(newMessageEl)
}

let fetchMessages = async function() {
  for (let address of addresses) {
    let message = await archives[address].readFile('message.txt')
    let nick = await archives[address].readFile('nick.txt')
    if (lastMessages[address] !== message) {
      appendNewMessage(`${nick} (${address.substr(0,5)}): ${message}`)
      lastMessages[address] = message
    }
  }
}

setTimeout(() => {
  setInterval(fetchMessages, 500)  
},2000)
