// Make sure everything is loaded before attempting anything
document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("score").innerHTML = 'SCORE: ' + localStorage.Score;


  // Setting elements of the main elements
  const clicker = document.getElementById('mainclicker');
  const clapper = document.getElementById('clapper'); // Enable along side the clapper code if you want it back
  const scoreCounter = document.getElementById('score')

  const upgradeIDs = ["upgradeClickValue"]

  // Hover texts for the upgrade, according to the id of the element
  const hoverText = new Map([
    ["upgradeClickValue", "Upgrade score per click."],
  ]);
  const upgradeElements = new Map([]) // Create the map for the upgrade elements

  const defaultUpgradeValues = {
    // Example Upgrade:
    // "upgradeName": {
    //   "operation": "1", // The operation to be applied, in this case, it will simply be "1"
    //   "final": "+", // The final operation to be applied, in this case, it will be a sum, in this example, it will be "Base + 1", [num (final) (operation)]
    //   "level": 0, // The level of the upgrade, defaulting to 0 with no upgrades purchased
    //   "cost": 10, // The cost of the upgrade, base value being 10
    //   "costScale": 1.5, // The scale for buying the upgrade, the cost will be equal to 10 * (costScale ^ level)
    // },
    "upgradeClickValue": {
      "operation": "1",
      "final": "+",
      "level": 0,
      "cost": 10,
      "costScale": 1.2,
    },
  }

  // Load and merge values 
  // 
  // (FOR M: DO NOT CHANGE ANY OF THIS!!)
  //
  let upgradeValues;
  if (localStorage.upgradeValues) {
    upgradeValues = JSON.parse(localStorage.upgradeValues);
    // Merge any missing default values
    for (const [key, value] of Object.entries(defaultUpgradeValues)) {
      if (!upgradeValues[key]) {
        upgradeValues[key] = value;
      }
    }
    localStorage.setItem("upgradeValues", JSON.stringify(upgradeValues));
  } else {
    localStorage.setItem("upgradeValues", JSON.stringify(defaultUpgradeValues));
  }

  function RESETDATA(password) {
    if (password == "yes") { // Password to reset the data
      localStorage.clear(); // Clear all localStorage
      localStorage.setItem("upgradeValues", JSON.stringify(defaultUpgradeValues)); // Set the default values
      localStorage.Score = 0; // Set the score to 0
      location.reload(); // Reload the page
    }
  }

  if (localStorage.upgradeValues) {
    const upgradeValues = JSON.parse(localStorage.getItem("upgradeValues")) // Get the local upgrade values from localStorage
  } 

  // Create the tooltip element
  const tooltip = document.createElement("div");
  tooltip.id = "tooltip";
  document.body.appendChild(tooltip);

  function applyOperation(finisher, op, start, level, x, y, z) {
    // Replaces variables with their values (x, y, z), alongside ^ with ** for exponentiation
    let formatted = op.replace(/\^/g, "**").replace(/x/g, `${x}`).replace(/y/g, `${y}`).replace(/z/g, `${z}`);

    try {
      // Use eval to calculate the result, prioritizing the formatted operation
      const result = eval(start + finisher + `(${formatted})*${level+1}`);
      return parseInt(result);
    } catch (e) {
      // Handle any errors that occur during the function
      console.error("Error applying operation:", e);
      return null;
    }
  } 

  for (let i=0; i < upgradeIDs.length; i++) {
    // For each upgradeid, get the element and add it to the map
    id = upgradeIDs[i];
    element = document.getElementById(upgradeIDs[i]);
    upgradeElements.set(id, element);

    if (!element) { // If the element doesn't exist, warn
      console.warn("No element found for ", id)
    }

    if (element) {
      element.addEventListener("mouseenter", (e) => { // Show tooltip on hover
        tooltip.innerHTML = hoverText.get(id) + "<br>Cost: " + Math.floor(upgradeValues[id].cost * Math.pow(upgradeValues[id].costScale, upgradeValues[id].level)) + "<br>Level: " + upgradeValues[id].level;
        tooltip.style.display = "block";
      })
      element.addEventListener("mouseleave", () => { // Hide tooltip on mouse leave
        tooltip.style.display = "none";
      })
      element.addEventListener("mousemove", (e) => { // Move tooltip to the mouse position repeatedly
        const upgradeValues = JSON.parse(localStorage.getItem("upgradeValues")); // Reload upgrade values dynamically
        tooltip.innerHTML = hoverText.get(id) + "<br>Cost: " + Math.floor(upgradeValues[id].cost * Math.pow(upgradeValues[id].costScale, upgradeValues[id].level)) + "<br>Level: " + upgradeValues[id].level;
        tooltip.style.left = `${e.pageX+10}px`;
        tooltip.style.top = `${e.pageY+10}px`;
      })
      element.addEventListener("click", (e) => { // On click, check if the upgrade can be bought
        const upgradeValues = JSON.parse(localStorage.getItem("upgradeValues"));
        const upgrade = upgradeValues[id];
        console.log("Clicked on upgrade: ", id, "Cost", upgrade.cost * Math.pow(upgrade.costScale, upgrade.level));
        const cost = Math.floor(upgrade.cost * Math.pow(upgrade.costScale, upgrade.level));
        if (localStorage.Score >= cost) { // If the score is greater than the cost
          localStorage.Score -= cost; // Subtract the cost from the score
          upgrade.level += 1; // Increase the level of the upgrade
          localStorage.setItem("upgradeValues", JSON.stringify(upgradeValues)); // Save the new values to localStorage
          scoreCounter.innerHTML = 'SCORE: ' + localStorage.Score; // Update the score counter
        } else {
          alert("Not enough points!"); // Send an alert if the score is not enough
        }
      })

    }
  }

  function randomAscii(len) {
    const min = 32;
    const max = 512;
    let string = '';
    for (let i = 0; i < len; i++) {
      const randomAscii = Math.floor(Math.random() * (max - min + 1)) + min; // Gets a random ascii value
      string += String.fromCharCode(randomAscii); // Converts the ascii value to a character
    }
    return string; // And spits it out
  }

  function clicked() { // Main clicker function
    if (localStorage.Score) {
      let base = parseInt(localStorage.Score); // Parse the score as an integer
      let finalValue = 0; // Start with a base value of 1
      for (let i = 0; i < upgradeIDs.length; i++) { // For each upgrade, get the value and apply it
        id = upgradeIDs[i];
        const upgradeValues = JSON.parse(localStorage.getItem("upgradeValues")); // Convert the upgrade data to JSON
        const upgrade = upgradeValues[id]; // Get the proper upgrade
        finalValue += applyOperation(upgrade.final, upgrade.operation, 0, upgrade.level); // Apply the operation to the score
      }
      localStorage.Score = base + parseInt(finalValue); // Add the final value to the base score
      clicker.innerHTML = randomAscii(Math.ceil(Math.random() * 100)); // Make it look weird

      if ((localStorage.Score % 5) == 0) { // The "%" operator is the modulo operator, which returns the remainder of a division, if it returns 0, it means that the score is divisible by x given [num % x]
        clapper.innerHTML = '👏';
      } else {
        clapper.innerHTML = '👐';
      }

    } else { // If the score doesn't exist, create it
      localStorage.Score = 0;
    }
    scoreCounter.innerHTML = 'SCORE: ' + localStorage.Score; // Update the score counter
  }
});