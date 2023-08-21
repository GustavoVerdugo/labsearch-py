const mysql = require('mysql');
const fs = require('fs');

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'levservice.ddns.net',
  port: 5056,
  user: 'corelabs_neo',
  password: 'core#Password$2023Maxi',
  database: 'labsearch'
});


connection.connect();

// Consulta SQL para obtener los datos
const sqlQuery = 'SELECT product_name, brand_name, category_name, product_price, product_image FROM product';

connection.query(sqlQuery, (error, results) => {
  if (error) throw error;

  // Calcular el número de categorías únicas y marcas únicas
  const uniqueCategories = new Set(results.map(item => item.category_name));
  const uniqueBrands = new Set(results.map(item => item.brand_name));

  const num_categories = uniqueCategories.size;
  const num_brands = uniqueBrands.size;

  // Número de características numéricas (por ejemplo, "product_price")
  const num_numeric_features = 1;  // Actualiza este valor según tus características numéricas

  const preprocessedData = results.map(item => ({
    product_name: item.product_name,
    brand: item.brand_name,
    category: item.category_name,
    price: item.product_price,
    image: item.product_image
  }));
  console.log(results);
  console.log('num_categories:', num_categories);
  console.log('num_brands:', num_brands);
  console.log('num_numeric_features:', num_numeric_features);

  fs.writeFileSync('processed_data.json', JSON.stringify(preprocessedData, null, 2));
  console.log('Procesamiento de datos completado y guardado en processed_data.json');
});

connection.end();