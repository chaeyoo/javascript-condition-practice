const ATTACK_VALUE = 10; //global value
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK"; // MODE_ATTACK = 0
const MODE_STROND_ATTACK = "STRONG_ATTACK"; // MODE_STRONG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
let battleLog = [];

function getMaxLifeValues() {
  const enteredValue = prompt("Maximum life for you and the monster", 100);

  let parsedValue = parseInt(enteredValue);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: "Invalid user input, not a number" };
  }

  return parsedValue;
}
let chosenMaxLife;
try {
  chosenMaxLife = getMaxLifeValues();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100; // 폴백코드, 시스템 오류가 나지 않아 애플리케이션이 정상 작동
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  // if (ev === LOG_EVENT_PLAYER_ATTACK) {
  //   logEntry.target = "MONSTER";
  //   // battleLog.push(logEntry);
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntry.target = "MONSTER";
  //   //   battleLog.push(logEntry);
  // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry.target = "PLAYER";
  //   //   battleLog.push(logEntry);
  // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
  //   logEntry.target = "PLAYER";
  //   //   battleLog.push(logEntry);
  // } else if (ev === LOG_EVENT_GAME_OVER) {
  //   // 이 부분은 없어도 되지만 가독서을 위해 남겨둠
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // }

  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = "PLAYER";
      break;
    default:
      logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
  }
  battleLog.push(logEntry);
}

adjustHealthBars(chosenMaxLife);

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert("You would be dead but the bonus life saved you!");
    setPlayerHealth(initialPlayerHealth);
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER_WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER_WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("You have a draw");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A_DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (
    (currentMonsterHealth <= 0 && currentPlayerHealth > 0) ||
    (currentPlayerHealth <= 0 && currentMonsterHealth > 0) ||
    (currentMonsterHealth <= 0 && currentPlayerHealth <= 0)
  ) {
    reset();
  }
}

function attackMonter(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  //   if (mode === MODE_ATTACK) {
  //     maxDamage = ATTACK_VALUE;
  //     logEvent = LOG_EVENT_PLAYER_ATTACK;
  //   } else if (mode === MODE_STROND_ATTACK) {
  //     maxDamage = STRONG_ATTACK_VALUE;
  //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  //   }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;

  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

  endRound();
}

function attackHandler() {
  attackMonter(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonter(MODE_STROND_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You cannot heal to more than your max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  for (let i = 0; i < battleLog.length; i++) {
    // console.log(battleLog[i]);
    console.log(`#${i}`);
    for (const key in battleLog[i]) {
      console.log(key, ":::", battleLog[i][key]);
    }
  }
}

function printLogHandler2() {
  let j = 0;
  while (j < battleLog.length) {
    console.log(`#${j + 1}`);
    for (const key in battleLog[j]) {
      console.log(key, ":::", battleLog[j][key]);
    }
    j++;
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
