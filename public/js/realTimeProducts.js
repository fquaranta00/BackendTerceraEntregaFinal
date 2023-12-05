(function () {
  const socket = io();
  const form = document.getElementById('product-form');
  const productList = document.getElementById('product-list');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Formulario enviado');

    const title = document.getElementById('form-title').value;
    const description = document.getElementById('form-description').value;
    const code = document.getElementById('form-code').value;
    const price = document.getElementById('form-price').value;
    const stock = document.getElementById('form-stock').value;
    const category = document.getElementById('form-category').value;

    const body = {
      title: title,
      description: description,
      code: code,
      price: price,
      status: true,
      stock: stock,
      category: category,
      thumbnail: []
    };

    socket.emit('new-product', body);
  });

  //Borrar un producto
  const deleteButton = document.getElementById('delete-product');

  deleteButton.addEventListener('click', () => {
    const deleteId = document.getElementById('form-delete-id').value;

    if (deleteId) {
      const confirmed = confirm(`¿Estás seguro de que deseas eliminar el producto con ID ${deleteId}?`);
      if (confirmed) {
        socket.emit('delete-product', deleteId);
      }
    } else {
      alert('Por favor, ingresa un ID de producto.');
    }
  });


  // Escuchar evento para actualizar la lista de productos
  socket.on('updated-product-list', (products) => {
    productList.innerHTML = '';
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');
      productElement.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.id}</p>
        <p>${product.description}</p>
        <p>Código: ${product.code}</p>
        <p>Precio: ${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Categoría: ${product.category}</p>
      `;
      productList.appendChild(productElement);
    });
  });

})();



