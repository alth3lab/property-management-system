import prisma from "@/lib/prisma"; // Adjust the path to your Prisma instance

async function getCitiesByStateId(searchParams) {
  try {
    const stateId = searchParams.get("stateId");
    const cities = await prisma.city.findMany({
      where: {
        stateId: +stateId,
      },
    });
    return cities;
  } catch (error) {
    console.error("Error fetching cities by state ID:", error);
    throw error;
  }
}

async function createCity(data, searchParams) {
  try {
    const stateId = searchParams.get("extraId");
    const city = await prisma.city.create({
      data: {
        ...data,
        state: {
          connect: { id: +stateId },
        },
      },
    });
    return city;
  } catch (error) {
    console.error("Error creating city:", error);
    throw error;
  }
}

async function getStates() {
  try {
    const states = await prisma.state.findMany();
    return states;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
}

async function createState(data) {
  try {
    const state = await prisma.state.create({
      data: data,
    });
    return state;
  } catch (error) {
    console.error("Error creating state:", error);
    throw error;
  }
}

async function getDistrictsByCityId(searchParams) {
  try {
    const cityId = searchParams.get("cityId");
    const districts = await prisma.district.findMany({
      where: {
        cityId: +cityId,
      },
    });
    return districts;
  } catch (error) {
    console.error("Error fetching districts by city ID:", error);
    throw error;
  }
}

async function createDistrict(data, searchParams) {
  try {
    const cityId = searchParams.get("extraId");
    const district = await prisma.district.create({
      data: {
        ...data,
        city: {
          connect: { id: +cityId },
        },
      },
    });
    return district;
  } catch (error) {
    console.error("Error creating district:", error);
    throw error;
  }
}

async function getNeighboursByDistrictId(searchParams) {
  try {
    const districtId = searchParams.get("districtId");
    const neighbours = await prisma.neighbour.findMany({
      where: {
        districtId: +districtId,
      },
    });
    return neighbours;
  } catch (error) {
    console.error("Error fetching neighbours by district ID:", error);
    throw error;
  }
}

async function createNeighbour(data, searchParams) {
  try {
    const districtId = searchParams.get("extraId");
    const neighbour = await prisma.neighbour.create({
      data: {
        ...data,
        district: {
          connect: { id: +districtId },
        },
      },
    });
    return neighbour;
  } catch (error) {
    console.error("Error creating neighbour:", error);
    throw error;
  }
}

async function getBanks() {
  try {
    const banks = await prisma.bank.findMany();
    return banks;
  } catch (error) {
    console.error("Error fetching banks:", error);
    throw error;
  }
}

async function createBank(data) {
  try {
    const bank = await prisma.bank.create({
      data: data,
    });
    return bank;
  } catch (error) {
    console.error("Error creating bank:", error);
    throw error;
  }
}

async function createOwner(data) {
  try {
    const owner = await prisma.client.create({
      data: {
        ...data,
        role: "OWNER",
      },
    });
    return owner;
  } catch (error) {
    console.error("Error creating owner:", error);
    throw error;
  }
}

async function getOwners() {
  try {
    const owners = await prisma.client.findMany({
      where: {
        role: "OWNER",
      },
    });
    return owners;
  } catch (error) {
    console.error("Error fetching owners:", error);
    throw error;
  }
}

async function createRenter(data) {
  try {
    const renter = await prisma.client.create({
      data: {
        ...data,
        role: "RENTER",
      },
    });
    return renter;
  } catch (error) {
    console.error("Error creating renter:", error);
    throw error;
  }
}

async function getRenters() {
  try {
    const renters = await prisma.client.findMany({
      where: {
        role: "RENTER",
      },
    });
    return renters;
  } catch (error) {
    console.error("Error fetching renters:", error);
    throw error;
  }
}

async function createPropertyType(data) {
  try {
    const newPropertyType = await prisma.propertyType.create({
      data: {
        ...data,
      },
    });
    return newPropertyType;
  } catch (error) {
    console.error("Error creating property type:", error);
    throw error;
  }
}

async function getPropertyTypes() {
  try {
    const propertyTypes = await prisma.propertyType.findMany();
    return propertyTypes;
  } catch (error) {
    console.error("Error fetching property types:", error);
    throw error;
  }
}

async function createUnitType(data) {
  try {
    const newUnitType = await prisma.unitType.create({
      data: {
        ...data,
      },
    });
    return newUnitType;
  } catch (error) {
    console.error("Error creating unit type:", error);
    throw error;
  }
}

async function getUnitTypes() {
  try {
    const unitTypes = await prisma.unitType.findMany();
    return unitTypes;
  } catch (error) {
    console.error("Error fetching unit types:", error);
    throw error;
  }
}

async function getProperties() {
  try {
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        name: true,
        client: {
          select: {
            id: true,
          },
        },
      },
    });
    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
}

async function getUnits(searchParams) {
  const propertyId = searchParams.get("propertyId");
  let whereClause = {};
  if (propertyId) {
    whereClause.propertyId = +propertyId;
  }
  try {
    const units = await prisma.unit.findMany({
      where: whereClause,

      select: {
        id: true,
        unitId: true,
        rentAgreements: true,
        number: true,
      },
    });
    console.log(units, "units");
    return units;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
}

async function createUnit(data) {
  try {
    const newUnit = await prisma.unit.create({
      data: {
        number: data.number,
        yearlyRentPrice: +data.yearlyRentPrice,
        electricityMeter: data.electricityMeter,
        numBedrooms: +data.numBedrooms,
        floor: +data.floor,
        numBathrooms: +data.numBathrooms,
        numACs: +data.numACs,
        numLivingRooms: +data.numLivingRooms,
        numKitchens: +data.numKitchens,
        numSaloons: +data.numSaloons,
        unitId: data.unitId,
        notes: data.notes,
        type: {
          connect: {
            id: +data.typeId,
          },
        },
        property: {
          connect: { id: +data.propertyId },
        },
      },
      include: {
        type: {
          select: {
            id: true,
            name: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return newUnit;
  } catch (error) {
    console.error("Error creating unit:", error);
    throw error;
  }
}

async function getCollectors() {
  try {
    const collectors = await prisma.collector.findMany();
    return collectors;
  } catch (error) {
    console.error("Error fetching collectors:", error);
    throw error;
  }
}

async function createCollector(data) {
  try {
    const collector = await prisma.collector.create({
      data: data,
    });
    return collector;
  } catch (error) {
    console.error("Error creating collector:", error);
    throw error;
  }
}

async function getRentTypes() {
  try {
    const rentTypes = await prisma.RentAgreementType.findMany({
      select: {
        id: true,
        title: true,
      },
    });
    console.log(rentTypes, "rentTypes");
    return rentTypes;
  } catch (error) {
    console.error("Error fetching rent types:", error);
    throw error;
  }
}

async function createRentType(data) {
  try {
    const rentType = await prisma.RentAgreementType.create({
      data: data,
    });
    return rentType;
  } catch (error) {
    console.error("Error creating rent type:", error);
    throw error;
  }
}

async function createContractExpense(data) {
  data = {
    name: data.name,
    value: +data.value,
  };
  return await prisma.contractExpense.create({ data });
}

async function getContractExpenses() {
  const contractExpenses = await prisma.contractExpense.findMany();

  return contractExpenses;
}

async function getExpenseTypes() {
  const expenseTypes = await prisma.propertyExpenseType.findMany();
  return expenseTypes;
}

export {
  createState,
  getStates,
  createCity,
  getCitiesByStateId,
  getDistrictsByCityId,
  createDistrict,
  getNeighboursByDistrictId,
  createNeighbour,
  getBanks,
  createBank,
  createOwner,
  getOwners,
  createRenter,
  getRenters,
  getPropertyTypes,
  createPropertyType,
  createUnitType,
  getUnitTypes,
  getProperties,
  getUnits,
  createUnit,
  getCollectors,
  createCollector,
  getRentTypes,
  createRentType,
  getContractExpenses,
  createContractExpense,
  getExpenseTypes,
};
