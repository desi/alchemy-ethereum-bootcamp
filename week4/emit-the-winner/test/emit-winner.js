
const { expect, assert } = require("chai");

describe("TestEmitWinner", function () {
  let emitWinner, otherContract;
  beforeEach(async () => {
    const EmitWinner = await ethers.getContractFactory("EmitWinner");
    emitWinner = await EmitWinner.deploy();

    const OtherContract = await ethers.getContractFactory("Contract");
    otherContract = await OtherContract.deploy();
  });

  it("should call emit the event", async function () {
    await expect(emitWinner.emitWinner(otherContract.address)).to.emit(otherContract, "Winner");
  });
  
  it("should not emit when called directly", async function () {
    await expect(otherContract.attempt()).to.be.revertedWith('msg.sender is equal to tx.origin');
  });
});
