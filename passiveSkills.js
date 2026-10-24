// パッシブスキルの定義辞書
const passiveSkillLogic = {
  onBattleStart: {
    "産婆術": function(pName, card, myTeam, enemyTeam) {
      card.atk += 5;
      addLogMessage(`🍼 [受動] ${card.name} の「産婆術」！ 対話により攻撃力が5上昇！`);
    },
    "神の国": function(pName, card, myTeam, enemyTeam) {
      if (myTeam && myTeam.cards) {
        myTeam.cards.forEach(c => {
          c.maxHp = (c.maxHp || c.hp) + 10;
          c.hp += 10;
        });
      }
      addLogMessage(`🏰 [受動] ${card.name} の「神の国」！ 味方全員の最大HPが10増加！`);
    }
  },
  onTurnStart: {},
  onTurnEnd: {},
  onTakeDamage: {},
  onDeath: {}
};

// パッシブスキル実行用共通関数
function triggerPassive(timing, card, myTeam, enemyTeam, extraVal) {
  if (!card || !card.passiveName) return extraVal;
  
  const timingGroup = passiveSkillLogic[timing];
  if (timingGroup && typeof timingGroup[card.passiveName] === "function") {
    return timingGroup[card.passiveName](myTeam ? myTeam.name : "", card, myTeam, enemyTeam, extraVal);
  }
  return extraVal;
}
