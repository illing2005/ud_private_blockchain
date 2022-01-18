const BlockClass = require("../block");
const SHA256 = require('crypto-js/sha256');

it("should validate hash", async  () => {
    const data = "This is a test block";
    let block = new BlockClass.Block(data);
    block.hash = SHA256(JSON.stringify(block)).toString()
    await expect(block.validate()).resolves.toBeTruthy()

});

it("should invalidate hash", async  () => {
    const data = "This is a test block";
    let block = new BlockClass.Block(data);
    block.hash = SHA256(JSON.stringify(block)).toString()
    block.height = 1
    await expect(block.validate()).resolves.toBeFalsy()
});

it("should decode block data", async () => {
  const data = "This is a test block";
  let block = new BlockClass.Block(data);
  await expect(block.getBData()).resolves.toBe(data);
});

it("should reject genesis block", async () => {
  const data = "Genesis Block";
  let block = new BlockClass.Block(data);
  await expect(block.getBData()).rejects.toEqual("Cant decode Genesis Block");
});
