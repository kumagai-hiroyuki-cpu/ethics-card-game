// パッシブスキルの定義
const passiveSkillLogic = {

  // ==========================================
  // ① バトル開始時（開戦時）に発動するスキル
  // ==========================================
  "onBattleStart": {
    "産婆術": function(pName, card, myTeam, enemyTeam) {
      // 例: 戦闘開始時に自身の攻撃力を+5
      card.atk += 5;
      addLogMessage(`🌱 [パッシブ] ${card.name} の「産婆術」！ 相手の対話を促し攻撃力が 5 上昇！`);
    },
    "神の国": function(pName, card, myTeam, enemyTeam) {
      // 例: 開戦時にチーム全体のHPを+10
      myTeam.cards.forEach(c => c.hp += 10);
      addLogMessage(`🏰 [パッシブ] ${card.name} の「神の国」！ 味方全員の最大生命力が 10 増加した！`);
    }
  },

  // ==========================================
  // ② 毎ターン開始時（または行動前）に発動するスキル
  // ==========================================
  "onTurnStart": {
    "万物は流転する": function(pName, card, myTeam, enemyTeam) {
      // 例: 毎ターンHPが5回復
      if (card.hp > 0) {
        card.hp += 5;
        addLogMessage(`🌊 [パッシブ] ${card.name} の「万物流転」！ HPが 5 回復した！`);
      }
    }
  },

  // ==========================================
  // ③ ダメージを受けた時（被弾時）に発動するスキル
  // ==========================================
  "onTakeDamage": {
    "不動心": function(pName, card, attacker, damage) {
      // 例: 受けるダメージを常時 -5 軽減する
      const reducedDmg = Math.max(1, damage - 5);
      addLogMessage(`🛡️ [パッシブ] ${card.name} の「不動心」！ ダメージを 5 軽減した！`);
      return reducedDmg; // 軽減後のダメージを返す
    }
  },

  // ==========================================
  // ④ 倒れた時（HPが0になった時）に発動するスキル
  // ==========================================
  "onDeath": {
    "遺志継承": function(pName, card, myTeam, enemyTeam) {
      // 例: 自分が倒れた時、味方最弱キャラのATKを+10
      let aliveAllies = myTeam.cards.filter(c => c.hp > 0);
      if (aliveAllies.length > 0) {
        let weakest = aliveAllies.reduce((a, b) => a.atk < b.atk ? a : b);
        weakest.atk += 10;
        addLogMessage(`🕯️ [パッシブ] ${card.name} は倒れ際に「遺志」を ${weakest.name} に託した！（ATK+10）`);
      }
    }
  }
};

/**
 * パッシブスキル呼び出し用共通関数
 * @param {string} trigger - 発動タイミング ("onBattleStart", "onTurnStart", "onTakeDamage", "onDeath")
 * @param {object} card - 発動者カード
 * @param {any} arg1 - 味方チーム or 攻撃者など
 * @param {any} arg2 - 敵チーム or ダメージ量など
 */
function triggerPassive(trigger, card, arg1, arg2) {
  if (!card || !card.passive) return;
  
  const skillName = card.passive;
  const triggerGroup = passiveSkillLogic[trigger];

  if (triggerGroup && typeof triggerGroup[skillName] === "function") {
    return triggerGroup[skillName](card.name, card, arg1, arg2);
  }
}