# Custom REST Image Storage Nodejs

This example demonstrates a basic custom RESTful storage solution for user-generated images using Node.js and Express. It shows how to handle file uploads, store them in user-specific directories on the server's file system, and provide endpoints for retrieving and deleting these images. This illustrates the manual effort involved in building a "DIY" storage solution compared to using a managed service like S3, especially concerning per-user content control.

## Language

`javascript`

## How to Run

1. Save the code as `app.js`.
2. Open your terminal in the same directory and run `npm init -y`.
3. Install dependencies: `npm install express multer`.
4. Start the server: `node app.js`.
5. Use a tool like Postman or `curl` to interact with the API:
   - **Upload:** `POST http://localhost:3000/upload/user123` with `form-data` body, key `image`, value `your_image.jpg`.
   - **Retrieve:** `GET http://localhost:3000/images/user123/uploaded_filename.jpg`.
   - **Delete:** `DELETE http://localhost:3000/images/user123/uploaded_filename.jpg`.

## Original Article

This example accompanies the Turkish article: [Kullanıcı Tarafından Oluşturulan Görsel Kontrolleri için S3 mü, Yoksa Kendi REST Depolama Çözümümüz mü? Node.js ve Express ile Karar Verme Rehberi](https://fatihsoysal.com/blog/kullanici-tarafindan-olusturulan-gorsel-kontrolleri-icin-s3-mu-yoksa-kendi-rest-depolama-cozumumuz-mu-node-js-ve-express-ile-karar-verme-rehberi/).

## License

MIT — see [LICENSE](LICENSE).
