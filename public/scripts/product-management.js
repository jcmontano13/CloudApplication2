const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event) {
    const buttonElement = event.target;
    const productId = buttonElement.dataset.productid; // check data in html
    const csrfToken = buttonElement.dataset.csrf;

    // include domain name if request not hosting the website
    const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, { // delete request
        method: 'DELETE'
    });

    if (!response.ok) {
        // if not 200 or 200+ 
        alert('Something went wrong');
        return;
    }
    // div -> div -> artificle -> li
    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();

}
for (const deleteProductButtonElement of deleteProductButtonElements) {
    deleteProductButtonElement.addEventListener('click', deleteProduct);
}