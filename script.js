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


//variable that sets the id when chosen for each monster in the dropdown
var selectOne = document.getElementById("bossSelectOne");
var selectTwo = document.getElementById("bossSelectTwo");
console.log(selectOne);
//setting my boss id's and images for each monster which were split on the comma 
function createOptions() {
  //creates Array
  var bosses = Object.keys(bossMap);
  //Loops
  bosses.forEach((boss) => {
    var option = document.createElement("option");
    var option2 = document.createElement("option");
    option.textContent = boss;
    option2.textContent = boss;
    option.value = bossMap[boss] + "," + boss.replaceAll(" ", "") + ".png";
    option2.value = bossMap[boss] + "," + boss.replaceAll(" ", "") + ".png";
    //Creates html element from js
    selectOne.appendChild(option);
    selectTwo.appendChild(option2);
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
//drop down menu one
selectOne.addEventListener("change", function () {
  player = 1;
  var id = selectOne.value.split(",")[0];
  var image = "images/" + selectOne.value.split(",")[1];
  console.log(image);
  getMonster(id);
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

let userInput = "";

onEvent("fightButton", "click", function () {
  userInput = getValue("userInput");
  if (userInput) {
    console.log(userInput);
    setText("chatResponse", "Diving into Gilenor lore...");
    setText("errorCode", "");
    //sendToBot();
  } else {
    console.log("under else: " + userInput);
    setText("errorCode", "You didnt pick enough bosses");
  }
});

function sendToBot() {
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
        content: " respond in 100 words or less on which Oldschool Runescape boss would win 1 on 1 and why out of " +player1+ " and " +player2
      },
    ],
    model: "deepseek-ai/DeepSeek-V3.1:fireworks-ai",
  }).then((response) => {
    let botReply = response.choices[0].message.content;
    setText("chatResponse", botReply);
  });
}


