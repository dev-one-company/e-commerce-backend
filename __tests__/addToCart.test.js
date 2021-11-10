require('dotenv/config');
const { User } = require('../src/models/User');
const { Product } = require('../src/models/Product');
const { Dislikes } = require('../src/models/Dislikes');
const { Likes } = require('../src/models/Likes');
const { Cart } = require('../src/models/Cart');

const { AddToCartService } = require('../src/services/AddToCartService');
const { CreateUserService } = require('../src/services/CreateUserService');
const { GetProductService } = require('../src/services/GetProductService');
const { CreateProductService } = require('../src/services/CreateProductService');

const { image } = require('./file.use');

jest.setTimeout(10000);

beforeAll(async () => {
  await User.destroy({ truncate: true });
  await Product.destroy({ truncate: true });
  await Dislikes.destroy({ truncate: true });
  await Likes.destroy({ truncate: true });
  await Cart.destroy({ truncate: true });
});

describe("TEST 'ADD/UPDATE TO/IN CART' SERVICE", () => {
  let userId;
  let productId;
  test('Create user', async () => {
    const createUserService = new CreateUserService();

    const result = await createUserService.execute('marcos', 'marcos@gmail.com', '12345678', image);

    expect(result).not.toBeInstanceOf(Error);

    if (!(result instanceof Error)) {
      userId = result.data.id;
    }
  });

  test('Create product', async () => {
    const createProductService = new CreateProductService();

    const result = await createProductService.execute({
      description: 'product desc',
      name: 'TV_TEST',
      price: 2500,
      quantity: 5,
      user_id: userId,
      photo: image,
    });

    expect(result).not.toBeInstanceOf(Error);

    if (!(result instanceof Error)) {
      productId = result.id;
    }
  });

  test('Add product into cart', async () => {
    const addToCartService = new AddToCartService(productId, userId, 2);

    const result = await addToCartService.execute();

    expect(result).not.toBeInstanceOf(Error);

    if (!(result instanceof Error)) {
      expect(result.quantity).toBe(2);
    }

    const getProductService = new GetProductService();

    const product = await getProductService.execute(userId, productId);

    expect(product).not.toBeInstanceOf(Error);

    if (!(product instanceof Error)) {
      expect(product.quantity).toBe(3);
    }
  });

  test('Update cart', async () => {
    const addToCartService = new AddToCartService(productId, userId, 1);

    const result = await addToCartService.execute();

    expect(result).not.toBeInstanceOf(Error);

    if (!(result instanceof Error)) {
      expect(result.quantity).toBe(3);
    }

    const getProductService = new GetProductService();

    const product = await getProductService.execute(userId, productId);

    expect(product).not.toBeInstanceOf(Error);

    if (!(product instanceof Error)) {
      expect(product.quantity).toBe(2);
    }
  });
});
