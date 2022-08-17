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

app.set('view engine', 'pug');
app.set('views', './views');

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

app.get('/hello', (req, res) => {
  res.render('hello.pug', { msg: 'un msg del perrito', link: '/products' });
});

app.get('/products', (req, res) => {
  res.render('products.pug', { title: 'listado de perros', products: productsHC });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = productsHC.find((product) => product.id == id);
  if (product) {
    res.render('product.pug', { product });
  } else {
    res.render('errorTemplate.pug', { errorMsg: 'Producto no encontrado' });
  }
});

app.get('/form', (req, res) => {
  res.render('form.pug');
});

app.post('/products', (req, res) => {
  const { title, price, thumbnail } = req.body;
  const product = { title, price, thumbnail, id: productsHC.length + 1 };
  productsHC.push(product);
  res.redirect('/products');
});
