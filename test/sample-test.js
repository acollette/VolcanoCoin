const { expect } = require("chai");
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
})
  
