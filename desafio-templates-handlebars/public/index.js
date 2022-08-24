const socket = io();

socket.on('connection', () => {
  console.log('Usuario Conectado');
});

function renderProds(products) {
  const html = products.reduce(
    (html, item) =>
      `
            <div class="product">
                <img src="${item.thumbnail}" alt="${item.title}">
                <h3>${item.title}</h3>
                <p>${item.price}</p>
            </div>
        ` + html,
    ''
  );
  document.getElementById('products').innerHTML = html;
}

function addMessage(messageData) {
  let messageToAdd = {
    email: messageData.email.value,
    message: messageData.message.value,
    date: new Date().toLocaleDateString(),
  };
  socket.emit('newMessage', messageToAdd);
}

function addProduct(productData) {
  let productToAdd = {
    title: productData.title.value,
    price: productData.price.value,
    thumbnail: productData.price.value,
  };
  socket.emit('addProduct', productToAdd);
}

socket.on('products', (data) => {
  renderProds(data);
});

socket.on('chat', (data) => {
  const html = data.reduce(
    (html, item) =>
      `
                <div class="message">
                    <strong>${item.email}</strong>: ${item.message}
                    <br>
                    <small>${item.date}</small>
                </div>
            ` + html,
    ''
  );
  document.getElementById('chat').innerHTML = html;
});
