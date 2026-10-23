// specialSkills.js
// 特殊スキル専用のロジック辞書
const specialSkillLogic = {
  
  "socrates": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target) {
      const stealAmt = Math.min(activePt, target.atk);
      target.atk -= stealAmt;
      attacker.atk += stealAmt;
      addLogMessage(`✨ ${attacker.name} は ${target.name} から能力を ${stealAmt} 奪った！ (自分のATK:${attacker.atk} / 相手ATK:${target.atk})`);
    }
  },

  "kant": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target) {
      // 外部の executeDamage 関数をそのまま呼び出せます
      executeDamage(pName, attacker, target, actorObj, targetObj, activePt * 2, true);
    }
  },

  "watsuji": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 味方・敵のステータスを元に戻す処理など
    actorObj.cards.forEach(c => { if(c.atk < c.baseAtk) c.atk = c.baseAtk; });
    if (targetObj) {
      targetObj.cards.forEach(c => { if(c.atk > c.baseAtk) c.atk = c.baseAtk; });
    }
    addLogMessage(`✨ ${attacker.name} の「間柄の理」！ 場のステータス変動がリセットされた！`);
    
    // （途切れていた和辻の残り処理があればここに追記します）
  },

  // ▼ ここに新しい思想家をどんどん追加していけます！ ▼
  "aristotle": function(pName, attacker, target, actorObj, targetObj, activePt) {
      addLogMessage(`📖 ${attacker.name} の「三段論法」が発動した！`);
      // アリストテレスの処理...
  }

};