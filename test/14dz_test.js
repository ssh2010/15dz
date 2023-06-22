const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("15_HomeWork tests", async function () {
  
    async function deployHorse() {
      const StringComparer = await ethers.deployContract("StringComparer");
  
      const options = {
        libraries: {
          StringComparer: StringComparer.target
        }
      };
      const Farmer = await ethers.deployContract("Farmer");
      const Horse = await ethers.deployContract("Horse", ["Boxer"], options);
      await Farmer.waitForDeployment;
      await Horse.waitForDeployment;
  
      return { Farmer, Horse};
    }
  
    async function deployDog() {
      const StringComparer = await ethers.deployContract("StringComparer");
 
      const options = {
        libraries: {
          StringComparer: StringComparer.target
        }
      };
      const Farmer = await ethers.deployContract("Farmer");
      const Dog = await ethers.deployContract("Dog", options);
      await Farmer.waitForDeployment;
      await Dog.waitForDeployment;
  
      return { Farmer, Dog };
    }
  
    describe("Horse and Farmer", function () {
      it("Horse has the correct name.", async function () {
        const { Horse } = await loadFixture(deployHorse);
  
        expect(await Horse.getName()).to.equal("Boxer");
      });
      it("Horse can sleep.", async function () {
        const { Horse } = await loadFixture(deployHorse);
  
        expect(await Horse.sleep()).to.equal("Z-z-z...");
      });
      it("Horse can eat “plant”", async function () {
        const { Horse } = await loadFixture(deployHorse);
  
        expect(await Horse.eat("plant")).to.equal("Animal eats plant");
      });
      it("Horse cannot eat ”meat”, ”not-food”, ”plastic”.", async function () {
        const { Horse } = await loadFixture(deployHorse);
  
        await expect(Horse.eat("meat")).to.be.revertedWith("Can only eat plant food");
        await expect(Horse.eat("not-food")).to.be.revertedWith("Can only eat plant food");
        await expect(Horse.eat("plastic")).to.be.revertedWith("Can only eat plant food");
      });
      it("Farmer can call Horse, Horse responds correctly", async function () {
        const { Farmer, Horse } = await loadFixture(deployHorse);
  
        expect(await Farmer.call(Horse.target)).to.equal("Igogo");
      });
      it("Farmer can feed Horse with plant", async function () {
        const { Farmer, Horse } = await loadFixture(deployHorse);
  
        expect(await Farmer.feed(Horse.target, "plant")).to.equal("Animal eats plant");
      });
      it("Farmer cannot feed Horse with anything else(”meat”,”plastic”,”fingers”,etc).", async function () {
        const { Farmer, Horse } = await loadFixture(deployHorse);
  
        await expect(Farmer.feed(Horse.target, "meat")).to.be.revertedWith("Can only eat plant food");
        await expect(Farmer.feed(Horse.target, "plastic")).to.be.revertedWith("Can only eat plant food");
        await expect(Farmer.feed(Horse.target, "fingers")).to.be.revertedWith("Can only eat plant food");
      });
    });
  
    describe("Dog and Farmer", function () {
      it("Dog has the correct name.", async function () {
        const { Dog } = await loadFixture(deployDog);
        let name = "";
        try {
            name = await Dog.getName();
        } catch (e) {
            message = e.message;
        }  
        expect(name).not.equal("Dog");
      });
      it("Dog can sleep.", async function () {
        const { Dog } = await loadFixture(deployDog);
  
        expect(await Dog.sleep()).to.equal("Z-z-z...");
      });
      it("Dog can eat “plant”", async function () {
        const { Dog } = await loadFixture(deployDog);
  
        expect(await Dog.eat("plant")).to.equal("R-R-R... Nya-Nyam");
      });
      it("Dog can eat “meat”", async function () {
        const { Dog } = await loadFixture(deployDog);
  
        expect(await Dog.eat("meat")).to.equal("R-R-R... Nya-Nyam");
      });
      it("Dog cannot eat ”not-food”, ”plastic”, ”chocolate”.", async function () {
        const { Dog } = await loadFixture(deployDog);
  
        await expect(await Dog.eat("not-food")).to.be.equal("Can only eat meat or plant food");
        await expect(await Dog.eat("plastic")).to.be.equal("Can only eat meat or plant food");
        await expect(await Dog.eat("chocolate")).to.be.equal("Can only eat meat or plant food");
      });
      it("Farmer can call Dog, Dog responds correctly", async function () {
        const { Farmer, Dog } = await loadFixture(deployDog);
  
        expect(await Farmer.call(Dog.target)).to.equal("Woof");
      });
      it("Farmer can feed Dog with ”meat”,”plant”.", async function () {
        const { Farmer, Dog } = await loadFixture(deployDog);
  
        expect(await Farmer.feed(Dog.target, "plant")).to.equal("R-R-R... Nya-Nyam");
        expect(await Farmer.feed(Dog.target, "meat")).to.equal("R-R-R... Nya-Nyam");
      });
      it("Farmer cannot feed Dog with ”not-food”, ”plastic” and anything else.", async function () {
        const { Farmer, Dog } = await loadFixture(deployDog);
  
        await expect(await Farmer.feed(Dog.target, "not-food")).to.be.equal("Can only eat meat or plant food");
        await expect(await Farmer.feed(Dog.target, "plastic")).to.be.equal("Can only eat meat or plant food");
        await expect(await Farmer.feed(Dog.target, "fingers")).to.be.equal("Can only eat meat or plant food");
      });
    });
  });