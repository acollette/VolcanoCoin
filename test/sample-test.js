const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");


describe("VulcanoContract", function () {

  let VulcanoContract, vulcanoContract, owner, addr1, addr2;

  beforeEach(async () =>{
    //Deploy a new instance of the contract
    VulcanoContract = await ethers.getContractFactory("VulcanoCoin");
    vulcanoContract = await VulcanoContract.deploy();
    
    await vulcanoContract.deployed();

    //Get accounts and assign to pre-defined variables
    [owner, addr1, addr2, _] = await ethers.getSigners();
  })

  describe("Deployment", ()=>{
    it("Should be deployed with initial parameters", async () =>{
      expect(await vulcanoContract.totalSupply()).to.equal(10000);
      expect(await vulcanoContract.symbol()).to.equal("VCN");
      expect(await vulcanoContract.balanceOf(owner.address)).to.equal(10000)
    }
  )})

  describe("Increase supply",() => {
    it("Should increase the supply by 1000's", async () =>{
      const totalSupplyBefore = await vulcanoContract.totalSupply();
      await vulcanoContract.increaseTotalSupply();
      const totalSupplyAfter = await vulcanoContract.totalSupply();
      const diff = totalSupplyAfter - totalSupplyBefore;
      expect(diff).to.equal(1000);
    })

    it("Should be the owner only increasing the supply", async () =>{
      await expect(
        vulcanoContract
        .connect(addr1)
        .increaseTotalSupply()
      ).to.be.revertedWith("Ownable: caller is not the owner");}
    )}
    
  )


  it("has a symbol", async () => {
    expect(await vulcanoContract.symbol()).to.equal("VCN");
  });

  it("has 18 decimals", async () => {

    expect(await vulcanoContract.decimals()).to.equal(18);

  });


  it("increases allowance for address1", async () => {
    const initAllowAdd1 = await vulcanoContract.allowance(owner.address, addr1.address);
    await vulcanoContract.increaseAllowance(addr1.address, 100);
    const newAllowAdd1 = await vulcanoContract.allowance(owner.address, addr1.address);
    await expect(newAllowAdd1 - initAllowAdd1).to.equal(100);
    

  });


  it("decreases allowance for address1", async () => {
    await vulcanoContract.increaseAllowance(addr1.address, 100);
    const initAllowAdd1 = await vulcanoContract.allowance(owner.address, addr1.address);
    await vulcanoContract.decreaseAllowance(addr1.address, 100);
    const finalAllowAdd1 = await vulcanoContract.allowance(owner.address, addr1.address);
    await expect(finalAllowAdd1 - initAllowAdd1).to.equal(-100);

  });


  it("emits an event when increasing allowance", async () => {
    expect (await vulcanoContract.approve(addr1.address, 100)).to.emit(vulcanoContract, "Approval").withArgs(owner, addr1.address, 100);
  });


  it("reverts decreaseAllowance when trying decrease below 0", async () => {
    await expect(vulcanoContract.decreaseAllowance(addr2.address, 100)).to.be.reverted;
  });

  it("updates balances on successful transfer from owner to addr1", async () => {
    const initBalOwner = await vulcanoContract.balanceOf(owner.address);
    const initBalAddr1 = await vulcanoContract.balanceOf(addr1.address);
    await vulcanoContract.transfer(addr1.address, 100);
    expect(await vulcanoContract.balanceOf(owner.address)).to.equal(initBalOwner - 100);
    expect(await vulcanoContract.balanceOf(addr1.address)).to.equal(initBalAddr1 + 100);


  });

  it("reverts transfer when sender does not have enough balance", async () => {
    // here we don't have to wait for the promise to be resolved within expect (thus await(expect) and not the opposite).
    // because during that time, the transaction will reject already
    await expect(vulcanoContract.transfer(addr1.address, 15000)).to.be.reverted;
  });

  it("reverts transferFrom addr1 to addr2 called by the owner without setting allowance", async () => {
    await expect(vulcanoContract.transferFrom(addr1.address, addr2.address, 100)).to.be.reverted;
  });

  it("updates balances after transferFrom addr1 to addr2 called by the owner", async () => {
    await vulcanoContract.transfer(addr1.address, 100);
    await vulcanoContract.connect(addr1).approve(owner.address, 100);
    const initBalAddr1 = await vulcanoContract.balanceOf(addr1.address);
    const initBalAddr2 = await vulcanoContract.balanceOf(addr2.address);
    await vulcanoContract.transferFrom(addr1.address, addr2.address, 100);
    expect(await vulcanoContract.balanceOf(addr1.address)).to.equal(initBalAddr1 - 100);
    expect(await vulcanoContract.balanceOf(addr2.address)).to.equal(initBalAddr2 + 100);

  });


})
  
