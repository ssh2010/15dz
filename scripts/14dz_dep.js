
const hre = require("hardhat");
async function main() {
    const StringComparer = await hre.ethers.getContractFactory("StringComparer");
    const stringComparerInstance = await StringComparer.deploy();  
   
    await stringComparerInstance.deployed();
 //   console.log("stringComparerInstanceAddress:", stringComparerInstance.address);

    const Farmer = await hre.ethers.getContractFactory("Farmer");
    const farmerInstance = await Farmer.deploy();  
    await farmerInstance.deployed();
//    console.log("farmerInstanceAddress:", farmerInstance.address);

    const Horse = await hre.ethers.getContractFactory("Horse", {
        libraries: {
          StringComparer: stringComparerInstance.address,
        },
      });
    const horseInstance = await Horse.deploy("Boxer");
    await horseInstance.deployed();
 //   console.log("horseInstanceAddress:", horseInstance.address);

    const Cow = await hre.ethers.getContractFactory("Cow", {
        libraries: {
          StringComparer: stringComparerInstance.address,
        },
      });
    const cowInstance = await Cow.deploy("Milka");
    await cowInstance.deployed();
 //   console.log("cowInstanceAddress:", cowInstance.address);

    const Wolf = await hre.ethers.getContractFactory("Wolf", {
        libraries: {
          StringComparer: stringComparerInstance.address,
        },
      });
    const wolfInstance = await Wolf.deploy();
    await wolfInstance.deployed();
 //   console.log("wolfInstanceAddress:", wolfInstance.address);

   // await hre.deployer.link(StringComparer, [Cow, Horse, Wolf]);

    console.log("Farmer call cow:", await farmerInstance.call(cowInstance.address));
    console.log("Farmer call horse:", await farmerInstance.call(horseInstance.address));

    try {
        let feedResult = await farmerInstance.feed(wolfInstance.address, "plant");
        console.log(feedResult);
    } catch (error) {
        console.log(error.reason);
    }

    try {
        let feedResult = await farmerInstance.feed(wolfInstance.address, "meat");
        console.log(feedResult);
    } catch (error) {
        console.log(error.reason);
    }   
};
main();
