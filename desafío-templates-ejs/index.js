const express = require('express');
const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on('error', (error) => console.log(`Error en servidor ${error}`));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

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

app.get('/products', (req, res) => {
  res.render('pages/index', { title: 'listado de productos', products: productsHC });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = productsHC.find((product) => product.id == id);
  if (product) {
    res.render('pages/product', { product: product, title: 'Producto: ' + product.title });
  } else {
    res.render('pages/errorTemplate', { errorMsg: 'Producto ' + id + ' no encontrado' });
  }
});

app.get('/form', (req, res) => {
  res.render('pages/form');
});

app.post('/products', (req, res) => {
  const { title, price, thumbnail } = req.body;
  const product = { title, price, thumbnail, id: productsHC.length + 1 };
  productsHC.push(product);
  res.redirect('/products');
});
