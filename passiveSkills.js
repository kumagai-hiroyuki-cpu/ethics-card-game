// パッシブスキルの定義辞書
const passiveSkillLogic = {
  // ① 戦闘開始時に発動するスキル
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

  // ② ターン開始時に発動するスキル
  onTurnStart: {
    // ターン開始時スキルが必要な場合はここに記述
  },

  // ③ ターン終了時に発動するスキル
  onTurnEnd: {
    // ターン終了時スキルが必要な場合はここに記述
  },

  // ④ 被ダメージ時に発動するスキル
  onTakeDamage: {
    // 被弾時スキルが必要な場合はここに記述
  },

  // ⑤ 死亡時に発動するスキル
  onDeath: {
    // 死亡時スキルが必要な場合はここに記述
  }
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
