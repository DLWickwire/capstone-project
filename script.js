//attack speed vairable
let bossAs;
//Combat level variable
let bossCb;
//Examine text data variable
let bossExamine;
//monster size variable
let bossSize;
//monster name variable
let bossName;
//player for each card variable
let player;
//images for first card variable
let currentImage = "";
//images for second card variable
let currentImage2 = "";

//Drop down menus for each player
var selectOne = document.getElementById("bossSelectOne");
var selectTwo = document.getElementById("bossSelectTwo");
console.log(selectOne);
//setting my boss id's and images for each monster which were split on the comma
function createOptions() {
  //creates Array/list of all bosses
  var bosses = Object.keys(bossMap);
  //Loops
  bosses.forEach((boss) => {
    //creates the choices for each drop down menu
    var option = document.createElement("option");
    var option2 = document.createElement("option");
    //sets the text for each boss on the drop down 
    option.textContent = boss;
    option2.textContent = boss;
    //links the picture and I to each boss so when you pick a boss it knows which
    option.value = bossMap[boss] + "," + boss.replaceAll(" ", "") + ".png";
    option2.value = bossMap[boss] + "," + boss.replaceAll(" ", "") + ".png";
    //Creates html element from js of each boss card so they show up in HTML
    selectOne.appendChild(option);
    selectTwo.appendChild(option2);
    //changes all spaces to no spaces for the png in the image folder
    console.log(boss.replaceAll(" ", "") + ".png");
  });
}
//calling text values for each monsters ID when picked on dropdown
createOptions();
function updateBossCards() {
  if (player == 1) {
    setText("bossOneAs", bossAs);
    setText("bossOneSize", bossSize);
    setText("bossOneCb", bossCb);
    setText("bossOneExamine", bossExamine);
  } else {
    setText("bossTwoAs", bossAs);
    setText("bossTwoSize", bossSize);
    setText("bossTwoCb", bossCb);
    setText("bossTwoExamine", bossExamine);
  }
}
//drop down menu one function when player chooses new boss from menu
selectOne.addEventListener("change", function () {
  player = 1;
  //cuts the string in 2 places (at the comma)[0] means it grabs the id
  var id = selectOne.value.split(",")[0];
  //adds the second half of the split and adds /images in front of it to get the full file path
  var image = "images/" + selectOne.value.split(",")[1];
  console.log(image);
  //function that pulls data from the API
  getMonster(id);
  //sets the picture to the screen with matching ID
  setImageURL("img1", image);
});
//drop down menu two
selectTwo.addEventListener("change", function () {
  player = 2;
  var id = selectTwo.value.split(",")[0];
  var image = "images/" + selectTwo.value.split(",")[1];
  console.log(image);
  getMonster(id);
  setImageURL("img2", image);
});
//pulls the id for monster selected
function getMonster(monsterId) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  // api data pulling
  fetch(
    "https://corsproxy.io/?url=https://api.gearscape.net/api/monster/id/" +
      monsterId,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result.monster.name);
      console.log(result.monster.level_cb);
      console.log(result.monster.size);
      console.log(result.monster.examine);
      console.log(result.monster.attack_speed);

      bossName = result.monster.name;
      bossCb = result.monster.level_cb;
      bossSize = result.monster.size;
      bossExamine = result.monster.examine;
      bossAs = result.monster.attack_speed;
      updateBossCards();
    })
    .catch((error) => console.error(error));
}

// AI STUFF
let botReply = "";
setText("chatResponse", "");

onEvent("fightButton", "click", function () {
  // gets the boss names from the dropdowns
  let player1 = selectOne.options[selectOne.selectedIndex].textContent;
  let player2 = selectTwo.options[selectTwo.selectedIndex].textContent;
//checks to see if both players chose a boss from dropdowns
  if (player1 && player2) {
    console.log("Player 1: " + player1 + " | Player 2: " + player2);
    setText("chatResponse", "Diving into the world of Gielinor...");
    //sendToBot(player1, player2);
    sendToBotTest();
  } else {
    console.log("Boss not selected");
  }
});

function sendToBotTest(player1, player2){
  setText("chatResponse", "Dagannoth Rex would defeat the Doom of Moktaiol. Rex is one of the Dagannoth Kings, a powerful trio designed to require specific combat styles. He is only vulnerable to melee attacks, making him highly resistant to the Doom's powerful Ranged and Magic-based attacks. The Doom of Moktaiol has no effective way to damage Rex, whose high defensive bonuses would negate its offensive capabilities. In a direct confrontation, Rex could simply outlast the Doom, landing consistent melee hits until it prevails.");
}

function sendToBot(player1, player2) {
  console.log("sent to bot");

  async function query(data) {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }

  query({
    messages: [
      {
        role: "user",
        content: `Respond in 150 words or less on which Oldschool Runescape boss would win 1 on 1 and why out of ${player1} and ${player2}.`,
      },
    ],
    model: "deepseek-ai/DeepSeek-V3.1:fireworks-ai",
  }).then((response) => {
    botReply = response.choices[0].message.content;
    setText("chatResponse", botReply);
    setStyle("chatResponse", "max-width:70%")
  });
}
