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

  "watsuji": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 1. 両チームの状態異常を解除 (※もし毒などの状態異常フラグを追加している場合はここでリセットします)
    // actorObj.cards.forEach(c => c.statusAilment = null); 
    // targetObj.cards.forEach(c => c.statusAilment = null);

    let stolenAtk = 0;

    // 2. 敵全体のステータス(攻撃力)を半減して奪う
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          let decrease = Math.floor(enemy.atk / 2); // 現在の攻撃力を半分にする
          enemy.atk -= decrease;
          stolenAtk += decrease; // 減らした分を吸収用変数に貯める
        }
      });
    }

    // 3. 奪ったステータスを和辻の攻撃力に加算
    attacker.atk += stolenAtk;

    // 4. ログの出力
    addLogMessage(`🌪️ [${pName}] ${attacker.name} の「風土改変」！`);
    addLogMessage(`敵全体のステータスを半減させ、合計 ${stolenAtk} の攻撃力を奪い取った！`);
  },

"aristotle": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 三段論法: ターゲットに「前提条件」を付与。3回目でHPを0にする
    if (!target.syllogism) target.syllogism = 0;
    target.syllogism += 1;
    
    if (target.syllogism >= 3) {
      target.hp = 0;
      addLogMessage(`⚡ [${pName}] ${attacker.name} の「三段論法」が完成！結論として ${target.name} に論理的致死ダメージ！`);
      target.syllogism = 0; // 完了後にリセット
    } else {
      addLogMessage(`📖 [${pName}] ${attacker.name} の「三段論法」！ ${target.name} に前提条件${target.syllogism}を付与した。（3つで致死ダメージ）`);
    }
  },

  "jesus": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 神の愛: 相手パーティー全員に「1回休み」フラグを付与する
    // ※「前ターンにダメージを受けたか」の厳密な判定はv3.html側の改修が必要なため、まずは確定発動で実装しています
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          enemy.isStunned = true; 
        }
      });
      addLogMessage(`✝️ [${pName}] ${attacker.name} の「神の愛」！ 相手パーティーは罪を悔い改め、次のターン行動不能になる！`);
    }
  },

  "vardhamana": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 不殺生: ダメージを与えず攻撃力を下げる（0未満にはしない）
    const atkDown = 15;
    target.atk = Math.max(0, target.atk - atkDown); 
    addLogMessage(`🕊️ [${pName}] ${attacker.name} の「不殺生」！ ${target.name} を傷つけず、攻撃力を ${atkDown} 下げた！`);
  },

  "empedocles": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 四元素: CPU対戦でも進行できるよう、じゃんけんの代わりに4つの効果からランダムで1つ発動
    const elements = ["火", "水", "土", "空気"];
    const choice = elements[Math.floor(Math.random() * elements.length)];

    if (choice === "火") {
      target.hp -= 20;
      addLogMessage(`🔥 [${pName}] ${attacker.name} の「四元素（火）」！ ${target.name} に20のダメージ！`);
    } else if (choice === "水") {
      attacker.hp += 20;
      addLogMessage(`💧 [${pName}] ${attacker.name} の「四元素（水）」！ 自身のHPを20回復！`);
    } else if (choice === "土") {
      attacker.defenseBuff = true; 
      addLogMessage(`🌍 [${pName}] ${attacker.name} の「四元素（土）」！ 次のターン、受けるダメージを半減する！`);
    } else if (choice === "空気") {
      attacker.atkBuff = true; 
      addLogMessage(`💨 [${pName}] ${attacker.name} の「四元素（空気）」！ 次の攻撃力が2倍になる！`);
    }
  },

  "wang_yangming": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 知行合一: 相手チームに「美濃子谷知行」がいるか判定
    const hasTarget = targetObj.cards.some(c => c.name.includes("美濃子谷知行") && c.hp > 0);
    if (hasTarget) {
      const dmg = 50; 
      targetObj.cards.forEach(enemy => { if (enemy.hp > 0) enemy.hp -= dmg; });
      addLogMessage(`⚔️ [${pName}] ${attacker.name} の「知行合一」！ 相手の美濃子谷知行に反応し、敵全体に ${dmg} の大ダメージ！`);
    } else {
      addLogMessage(`[${pName}] ${attacker.name} の「知行合一」！ しかし相手に美濃子谷知行はいないようだ…`);
    }
  },
