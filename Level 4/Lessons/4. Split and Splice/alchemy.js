const ORGANISM_LIST = [
  "Air;None;None",
  "Earth;None;None",
  "Fire;None;None",
  "Water;None;None",
  "Alcohol;Fire;Water",
  "Dust;Air;Earth",
  "Energy;Air;Fire",
  "Lava;Earth;Fire",
  "Swamp;Earth;Water",
  "Mud;Dust:Water",
  "Life;Energy;Swamp",
  "Bacteria;Life;Swamp",
  "Fire Elemental;Fire;Life",
  "Stone;Air;Lava",
  "Metal;Stone;Fire",
  "Electricity;Energy;Metal",
  "Oxygen;Water;Electricity"
]

// the first 4 items of the list have no "parents"
const ORGANISM_OFFSET = 4;

// variables for indices
const NAME = 0, PARENT_1 = 1, PARENT_2 = 2;
const NONE = "None";

function getOrganismData(organism, index) {
  return organism.split(";")[index];
}

function areParents(organism, parent1, parent2) {
  var firstParent = getOrganismData(organism, PARENT_1);
  var secondParent = getOrganismData(organism, PARENT_2);
  var parent1 = getOrganismData(parent1, NAME);
  var parent2 = getOrganismData(parent2, NAME);

  if (parent1 == firstParent || parent1 == secondParent) {
    if (parent2 == firstParent || parent2 == secondParent) {
      return true;
    }
  }

  return false;
}

function findOrganism(name) {
  for (var i in ORGANISM_LIST) {
    if (getOrganismData(ORGANISM_LIST[i], NAME) == name) {
      return ORGANISM_LIST[i];
    }
  }

  return NONE;
}

function findCombo(org1, org2) {
  for (var i in ORGANISM_LIST) {
    if (areParents(ORGANISM_LIST[i], org1, org2)) {
      return ORGANISM_LIST[i];
    }
  }

  return NONE;
}
