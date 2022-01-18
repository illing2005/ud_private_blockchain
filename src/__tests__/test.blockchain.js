const BlockClass = require("../block");
const BlockChainClass = require("../blockchain");
const SHA256 = require("crypto-js/sha256");

it("should add block to chain", async () => {
  const data = "This is a test block";
  let block = new BlockClass.Block(data);

  const chain = new BlockChainClass.Blockchain();
  expect(chain.height).toBe(0);
  await chain._addBlock(block);
  expect(chain.height).toBe(1);
  expect(await chain.chain[1].getBData()).toBe("This is a test block");
});

it("should return correct message", async () => {
  const address = "mywallet";
  jest.useFakeTimers().setSystemTime(new Date("2022-01-01").getTime());
  const expected = `${address}:${new Date()
    .getTime()
    .toString()
    .slice(0, -3)}:starRegistry`;
  const chain = new BlockChainClass.Blockchain();
  expect(await chain.requestMessageOwnershipVerification(address)).toBe(
    expected
  );
});

it("should submit a star", async () => {
  jest.useFakeTimers().setSystemTime(new Date("2022-01-01").getTime());
  const star = {
    dec: "68 52' 56.9",
    ra: "16h 29m 1.0s",
    story: "Test Star",
  };
  const address = "n25Cb2Ls7Tg8oABv1Jz6f794zSDnEbh2iT";
  const timestamp = new Date().getTime().toString().slice(0, -3);
  const message = `${address}:${timestamp}:starRegistry`;
  const chain = new BlockChainClass.Blockchain();
  await chain.submitStar(
    address,
    message,
    "H1DzKdyBC/H3Ucy6JYRjXG8nmvw2oCJGVZQi6Gazpkl8f7ZxUZhrSHQ6G0xQV/ODbMdaIfVFMLcykP9O4ARwyAg=",
    star
  );
  expect(chain.height).toBe(1);
  expect(await chain.chain[1].getBData()).toStrictEqual({
    owner: address,
    star,
  });

  // get stars by address
  const myStars = await chain.getStarsByWalletAddress(address);
  expect(myStars).toStrictEqual([{ owner: address, star }]);
});

it("should get block by hash", async () => {
  const chain = new BlockChainClass.Blockchain();
  const searchHash = chain.chain[0].hash;
  const block = await chain.getBlockByHash(searchHash);
  expect(block).toStrictEqual(chain.chain[0]);
});

it("should validate chain", async () => {
  const data = "This is a test block";
  let block = new BlockClass.Block(data);
  const chain = new BlockChainClass.Blockchain();
  expect(chain.height).toBe(0);
  let errors = await chain.validateChain();
  expect(errors.length).toBe(0);
  await chain._addBlock(block);

  errors = await chain.validateChain();
  expect(errors.length).toBe(0);

  // modify genesis block
  chain.chain[0].time = 0;
  errors = await chain.validateChain();
  expect(errors.length).toBe(1);
});
