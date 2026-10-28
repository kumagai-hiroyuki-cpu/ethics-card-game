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
// ==========================================
// パッシブスキル一括管理システム (passiveSkills.js)
// ==========================================

// === 1. スペシャルパッシブ個別の実装定義 (61種用) ===
const specialPassiveLogic = {
  // 吉野作造: このキャラクターのHPは7になる
  "yoshino_sakuzo": {
    onBattleStart: (card, pObj, enemyObj) => {
      card.maxHp = 7;
      card.hp = 7;
      card.currentHP = 7;
      addLogMessage(`📜 [${card.name}] のパッシブ発動！HPが 7 に固定された！`);
    }
  },

  // デカルト: HPが0になるダメージを受けた時に1度だけHP1で耐える
  "descartes": {
    onTakeDamage: (card, attacker, damage) => {
      const currentHp = card.currentHP ?? card.hp ?? 0;
      if (currentHp - damage <= 0 && !card.gutsUsed) {
        card.gutsUsed = true;
        addLogMessage(`💭 [デカルト] 「我思う、ゆえに我あり」！食いしばり発動（HP1で踏みとどまった！）`);
        return currentHp - 1; // 残りHPが1になるダメージ量を返す
      }
      return damage;
    }
  },

  // パウロ: 自身が戦闘不能になったとき一度だけ完全復活
  "paul": {
    onDeath: (card, pObj, enemyObj) => {
      if (!card.revived) {
        card.revived = true;
        const maxHpVal = card.maxHp || 100;
        card.hp = maxHpVal;
        card.currentHP = maxHpVal;
        addLogMessage(`⚡ [パウロ] 「回心」！劇的な回心により完全復活を遂げた！（HP ${maxHpVal}）`);
      }
    }
  },

  // エンペドクレス: 毎ターン味方全体HP+5、敵全体にダメージ5
  "empedocles": {
    onTurnEnd: (card, pObj, enemyObj) => {
      addLogMessage(`🌀 [エンペドクレス] 「愛と憎」！味方全体回復＆敵全体に5ダメージ！`);
      pObj.cards.forEach(c => {
        const cHp = c.currentHP ?? c.hp ?? 0;
        if (cHp > 0) {
          c.currentHP = Math.min(c.maxHp || 100, cHp + 5);
          c.hp = c.currentHP;
        }
      });
      enemyObj.cards.forEach(c => {
        const cHp = c.currentHP ?? c.hp ?? 0;
        if (cHp > 0) {
          c.currentHP = Math.max(0, cHp - 5);
          c.hp = c.currentHP;
        }
      });
    }
  }
};

// === 2. メインのフック処理関数 (v3.html から呼び出される) ===
function triggerPassive(hookName, card, pObj, enemyObj, extraVal) {
  if (!card || (card.currentHP ?? card.hp ?? 0) <= 0 && hookName !== "onDeath") return extraVal;

  const pType = card.passiveType || "none";
  const pVal = parseInt(card.passiveVal, 10) || 0;

  // ------------------------------------------
  // A. スペシャルタイプの個別判定
  // ------------------------------------------
  if (pType === "special") {
    const handler = specialPassiveLogic[card.id];
    if (handler && typeof handler[hookName] === "function") {
      return handler[hookName](card, pObj, enemyObj, extraVal);
    }
    return extraVal;
  }

  // ------------------------------------------
  // B. 汎用タイプの自動一括判定
  // ------------------------------------------
  switch (hookName) {
    case "onTurnStart":
      if (pType === "buff") {
        card.atk = (card.atk || 20) + Math.max(1, Math.floor(pVal / 2));
        addLogMessage(`✨ [${card.name}] のパッシブ「${card.passiveName || '強化'}」！ ATKが上昇した！`);
      }
      break;

    case "onTurnEnd":
      if (pType === "self_heal" && pVal > 0) {
        const currentHp = card.currentHP ?? card.hp ?? 0;
        const newHp = Math.min(card.maxHp || 100, currentHp + pVal);
        card.currentHP = newHp;
        card.hp = newHp;
        addLogMessage(`💖 [${card.name}] のパッシブ発動！ 自身のHPが ${pVal} 自動回復！`);
      } else if (pType === "heal" && pVal > 0) {
        pObj.cards.forEach(c => {
          const cHp = c.currentHP ?? c.hp ?? 0;
          if (cHp > 0) {
            c.currentHP = Math.min(c.maxHp || 100, cHp + Math.max(1, Math.floor(pVal / 2)));
            c.hp = c.currentHP;
          }
        });
        addLogMessage(`✨ [${card.name}] のパッシブ発動！ 味方全体のHPが回復！`);
      }
      break;

    case "onTakeDamage":
      // 例: 防御系バフでの被ダメージ軽減
      if (pType === "buff" && pVal > 0 && typeof extraVal === "number") {
        const reduceAmt = Math.floor(extraVal * (pVal / 100));
        if (reduceAmt > 0) {
          addLogMessage(`🛡️ [${card.name}] のパッシブでダメージを ${reduceAmt} 軽減！`);
          return Math.max(0, extraVal - reduceAmt);
        }
      }
      break;
  }

  return extraVal;
}
