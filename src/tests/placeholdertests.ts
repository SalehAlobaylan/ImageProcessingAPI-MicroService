import request from 'supertest'; // this library to test the servers
import app from '../index'; 



describe('GET /placeholder', () => {
  it('should serve the primary endpoint', async () => {
    const response = await request(app).get('/placeholder');
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('image/jpg');
    console.log("first test");
  });
});





describe('GET /placeholder', () => {
  
  it('should return a resized image with default dimensions', async () => {
    const response = await request(app)
      .get('/placeholder')
      .query({ width: 600, height: 600 });
              console.log("second test")
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('image/jpg'); 
  });


  it('should return a resized image with specified dimensions', async () => {
    const width = 200;
    const height = 200;
    const response = await request(app)
      .get('/placeholder')
      .query({ width, height });

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('image/jpg');
              console.log("third test")
  });

  
});

