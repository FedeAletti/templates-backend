const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const PORT = 8080;

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: { origin: '*' },
});

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

let productsHC = [
  {
    title: 'Zomo Dry Zahara',
    price: 680,
    thumbnail: 'https://cdn.zomoofficial.com/wp-content/uploads/2020/02/ZOMO_2019_PY_50G_DRY_SAHARA.jpg',
    id: 1,
  },
  {
    title: 'Zomo Framboera',
    price: 600,
    thumbnail: 'https://cdn.zomoofficial.com/wp-content/uploads/2020/11/ZOMO_2019_PY_50G_FRAMBOERA.png',
    id: 2,
  },
  {
    title: 'Zomo Cola Mint',
    price: 680,
    thumbnail: 'https://cdn.zomoofficial.com/wp-content/uploads/2020/02/ZOMO_2019_PY_50G_COLA_MINT.jpg',
    id: 3,
  },
];

let chat = [
  {
    email: 'admin@admin.com',
    message: 'Bienvenido al chat',
    date: new Date().toLocaleDateString(),
  },
];

app.get('/', (req, res) => {
  //sirve productslist.hbs en index.hbs (index.hbs es la plantilla por defecto donde arranca todo)
  res.render('productslist', { root: __dirname + '/public' });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  const found = productsHC.find((product) => product.id == id);

  try {
    const found = productsHC.find((product) => product.id == id);
    if (found) {
      res.render('product', { product: found, productsExist: true });
    } else {
      res.render('errorTemplate', { errorMessage: `Producto de id ${id} no encontrado` });
    }
  } catch (error) {
    res.render('product', { productsExist: false });
  }
});

app.get('/form', (req, res) => {
  res.render('formulario');
});

app.post('/products', (req, res) => {
  const { title, price, thumbnail } = req.body;
  const newProduct = {
    title,
    price,
    thumbnail,
    id: productsHC.length + 1,
  };
  productsHC.push(newProduct);
  res.redirect('/products');
});

io.on('connection', (socket) => {
  console.log('Usuario Conectado ' + socket.id);
  io.sockets.emit('products', productsHC);
  io.sockets.emit('chat', chat);
  // chat.push({ nombre: 'Server', msg: 'se unió al chat ' + socket.id });
  // io.sockets.emit('arr-chat', chat);

  socket.on('newMessage', (msg) => {
    chat.push(msg);
    io.sockets.emit('chat', chat);
  });

  socket.on('addProduct', (product) => {
    productsHC.push(product);
    io.sockets.emit('products', productsHC);
  });
});

httpServer.listen(process.env.PORT || 8080, () => console.log('SERVER ON'));
