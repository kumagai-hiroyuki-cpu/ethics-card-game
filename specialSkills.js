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

  "aristotle": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (!target.syllogism) target.syllogism = 0;
    target.syllogism += 1;
    
    if (target.syllogism >= 3) {
      target.hp = 0;
      addLogMessage(`⚡ [${pName}] ${attacker.name} の「三段論法」が完成！結論として ${target.name} に論理的致死ダメージ！`);
      target.syllogism = 0;
    } else {
      addLogMessage(`📖 [${pName}] ${attacker.name} の「三段論法」！ ${target.name} に前提条件${target.syllogism}を付与した。（3つで致死ダメージ）`);
    }
  },

  "jesus": function(pName, attacker, target, actorObj, targetObj, activePt) {
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
    const atkDown = 15;
    target.atk = Math.max(0, target.atk - atkDown); 
    addLogMessage(`🕊️ [${pName}] ${attacker.name} の「不殺生」！ ${target.name} を傷つけず、攻撃力を ${atkDown} 下げた！`);
  },

  "empedocles": function(pName, attacker, target, actorObj, targetObj, activePt) {
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
    // 相手チーム内に「美濃子谷知行」が生きて存在するかチェック
    const hasTarget = targetObj && targetObj.cards && targetObj.cards.some(c => c && c.name && c.name.includes("美濃子谷知行") && (c.currentHP ?? c.hp ?? 0) > 0);
    
    if (hasTarget) {
      const dmg = 50; 
      addLogMessage(`⚔️ [${pName}] ${attacker.name} の「知行合一」！ 相手の美濃子谷知行に反応し、敵全体に ${dmg} の大ダメージ！`);
      
      // 相手チームの表示名を取得
      const enemyPName = pName === "あなた" ? "CPU" : (pName === "P1" ? "P2" : "P1");

      // 相手チームの生存している全カードに対して executeDamage を安全に実行
      targetObj.cards.forEach(enemy => { 
        if (enemy && (enemy.currentHP ?? enemy.hp ?? 0) > 0) {
          // 属性エラーを防ぐための安全補正
          if (!attacker.type) attacker.type = "西洋";
          if (!enemy.type) enemy.type = "西洋";
          
          executeDamage(enemyPName, attacker, enemy, actorObj, targetObj, dmg, true);
        }
      });
    } else {
      addLogMessage(`[${pName}] ${attacker.name} の「知行合一」！ しかし相手に美濃子谷知行はいないようだ…`);
    }
  },

  "gautama_siddhartha": function(pName, attacker, target, actorObj, targetObj, activePt) {
    actorObj.cards.forEach(c => { if (c.hp > 0) c.hp = c.maxHp || 1000; });
    targetObj.cards.forEach(c => { if (c.hp > 0) c.hp = c.maxHp || 1000; });
    addLogMessage(`🌸 [${pName}] ${attacker.name} の「涅槃」！ 敵味方問わず、全ての者の傷が癒えHPがリセットされた！`);
  },

  "confucius": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) enemy.isStunned = true; 
      });
      addLogMessage(`📜 [${pName}] ${attacker.name} の「君子の徳」！ 敵全体が「礼」により平伏し、行動不能になった！`);
    }
  },

  "gorgias": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let aliveEnemies = targetObj.cards.filter(c => c.hp > 0);
    if(aliveEnemies.length > 0) {
      let targetCard = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      targetCard.hp = 0;
      addLogMessage(`🌀 [${pName}] ${attacker.name} の「相手を非存在に」！ ${targetCard.name} は最初から存在しなかったことになった！`);
    }
  },

  "xunzi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const atkDown = 20;
    target.atk = Math.max(0, target.atk - atkDown);
    target.atkBuff = false;
    target.defenseBuff = false;
    addLogMessage(`🎋 [${pName}] ${attacker.name} の「礼」！ ${target.name} の悪を矯正し、攻撃力を ${atkDown} 下げて強化状態も打ち消した！`);
  },

"zeno": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dmg = 40;
    
    // 相手へのダメージ処理（executeDamage で UI更新・死亡処理を連動）
    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      if (!attacker.type) attacker.type = "西洋";
      if (!target.type) target.type = "西洋";
      executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
    }

    // 自身のHP回復処理（currentHP と hp を両方更新）
    const maxHpVal = attacker.maxHp || attacker.maxHP || 100;
    const curHp = attacker.currentHP ?? attacker.hp ?? 0;
    const newHp = Math.min(maxHpVal, curHp + dmg);
    attacker.hp = newHp;
    attacker.currentHP = newHp;

    addLogMessage(`🧘 [${pName}] ${attacker.name} の「アパテイア」！ ${target.name} に ${dmg} のダメージを与え、同量のHPを回復した！`);
  },

  "zhuangzi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const reduceVal = 20;
    actorObj.cards.forEach(c => { if(c.hp > 0) c.atk = Math.max(0, c.atk - reduceVal); });
    targetObj.cards.forEach(c => { if(c.hp > 0) c.atk = Math.max(0, c.atk - reduceVal); });
    addLogMessage(`🦋 [${pName}] ${attacker.name} の「万物斉同」！ 敵味方の境界が消え、全員の攻撃力が低下した！`);
  },

  "democritus": function(pName, attacker, target, actorObj, targetObj, activePt) {
    target.isStunned = true;
    const atkDown = 15;
    target.atk = Math.max(0, target.atk - atkDown);
    addLogMessage(`😂 [${pName}] ${attacker.name} の「笑う哲学者の嘲笑」！ ${target.name} はペースを乱され、次ターン行動不能＆攻撃力ダウン！`);
  },

  "dong_zhongshu": function(pName, attacker, target, actorObj, targetObj, activePt) {
    actorObj.cards.forEach(c => {
      if (c.hp > 0) { c.atkBuff = true; c.defenseBuff = true; }
    });
    targetObj.cards.forEach(c => {
      if (c.hp > 0) {
        c.atkBuff = false; 
        c.defenseBuff = false;
        c.atk = Math.floor(c.atk / 2);
      }
    });
    addLogMessage(`⛅ [${pName}]${attacker.name} の「天人相関」！ 味方全体が強化され、敵全体の強化解除＆攻撃力半減！`);
  },

  "thomas_aquinas": function(pName, attacker, target, actorObj, targetObj, activePt) {
    target.atk = Math.floor(target.atk / 2);
    addLogMessage(`⛪ [${pName}]${attacker.name} の「信仰と理性の調和」！ ${target.name} の攻撃力が半減した！`);
  },

  "parmenides": function(pName, attacker, target, actorObj, targetObj, activePt) {
    attacker.nullifyCount = 3;
    addLogMessage(`🛡️ [${pName}] ${attacker.name} の「ないものはない」！ 自身への攻撃を3回まで無効化する状態になった！`);
  },

 "pythagoras": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target) {
      const randomNum = Math.floor(Math.random() * 10);
      target.atk = randomNum;
      addLogMessage(`🔢 [${pName}] ${attacker.name} の「万物は数なり」！ ${target.name} の攻撃力が【${randomNum}】に書き換えられた！`);
    }
  },

 "pythagoras": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target) {
      const randomNum = Math.floor(Math.random() * 10);
      target.atk = randomNum;
      addLogMessage(`🔢 [${pName}] ${attacker.name} の「万物は数なり」！ ${target.name} の攻撃力が【${randomNum}】に書き換えられた！`);
    }
  },

  "platon": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      target.atk = 20;
      target.atkBuff = false;
      target.defenseBuff = false;
      const dmg = 40; 
      
      if (!attacker.type) attacker.type = "西洋";
      if (!target.type) target.type = "西洋";

      // 修正: executeDamage を使用してHP減少とUI更新を確実に連動
      executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
      addLogMessage(`💡 [${pName}] ${attacker.name} の「イデア支配」！ ${target.name} をイデア界に引き戻して弱体化させた！`);
    }
  },

  "protagoras": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target) {
      attacker.atk = Math.max(attacker.atk || 0, target.atk || 0);
      addLogMessage(`📏 [${pName}] ${attacker.name} の「人間は万物の尺度である」！ ${target.name} を尺度とし、自身の攻撃力を同等に引き上げた！`);
    }
  },

  "homer": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dmg = 10;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy && (enemy.currentHP ?? enemy.hp ?? 0) > 0) {
          if (!attacker.type) attacker.type = "西洋";
          if (!enemy.type) enemy.type = "西洋";
          // 修正: 敵全員へのダメージを executeDamage で実行
          executeDamage(pName, attacker, enemy, actorObj, targetObj, dmg, true);
        }
      });
    }
    // 自身の死亡処理（自分自身を倒れた状態にする）
    const selfHp = attacker.currentHP ?? attacker.hp ?? 0;
    if (selfHp > 0) {
      executeDamage(pName, attacker, attacker, actorObj, actorObj, selfHp, true);
    }
    addLogMessage(`🏛️ [${pName}] ${attacker.name} は命を懸けて「ギリシア神話」を書き上げた！ 自身の命と引き換えに敵全体へダメージ！`);
  },

  "mushi_sekai": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy && (enemy.currentHP ?? enemy.hp ?? 0) > 0) {
          enemy.activeVal = 0;
        }
      });
    }
    addLogMessage(`🪷 [${pName}] ${attacker.name} の「一切が空」！ 相手全体に悟りをもたらし、スキルの発動を封じた！`);
  },

  "muhammad": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const isWin = Math.random() < 0.5;
    if (isWin) {
      const dmg = 10;
      if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
        if (!attacker.type) attacker.type = "西洋";
        if (!target.type) target.type = "西洋";
        // 修正: 追加ダメージを executeDamage で安全に処理
        executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
      }
      attacker.atk = (attacker.atk || 0) + 10;
      addLogMessage(`✊ [${pName}] ${attacker.name} は神の啓示を受け、ジャンケンに勝利！ 攻撃力UP＆追加ダメージ！`);
    } else {
      addLogMessage(`✋ [${pName}] ${attacker.name} は神の啓示を受けたが、今回は神を味方につけられなかった...`);
    }
  },

 "mencius": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let aliveEnemies = targetObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) > 0);
    if (aliveEnemies.length >= 2) {
      let highestAtkEnemy = aliveEnemies.reduce((a, b) => (a.atk || 0) > (b.atk || 0) ? a : b);
      let highestHpEnemy = aliveEnemies.reduce((a, b) => (a.currentHP ?? a.hp ?? 0) > (b.currentHP ?? b.hp ?? 0) ? a : b);
      const dmg = highestAtkEnemy.atk || 20;

      if (!highestAtkEnemy.type) highestAtkEnemy.type = "西洋";
      if (!highestHpEnemy.type) highestHpEnemy.type = "西洋";

      // 修正: 敵同士の相打ちダメージを executeDamage で安全に処理
      const enemyPName = pName === "あなた" ? "CPU" : (pName === "P1" ? "P2" : "P1");
      executeDamage(enemyPName, highestAtkEnemy, highestHpEnemy, targetObj, targetObj, dmg, true);

      addLogMessage(`👑 [${pName}] ${attacker.name} の「王道政治」！ ${highestAtkEnemy.name} が魅了され、味方である ${highestHpEnemy.name} に ${dmg} のダメージを与えてしまった！`);
    } else {
      addLogMessage(`👑 [${pName}] ${attacker.name} の「王道政治」が発動したが、敵の数が足りず効果が薄かった！`);
    }
  },

 "nagarjuna": function(pName, attacker, target, actorObj, targetObj, activePt) {
    attacker.nullifyCount = 1;
    if (target) {
      target.atk = 0;
      addLogMessage(`🌪️ [${pName}] ${attacker.name} の「空」！ 自身の次への攻撃を無効化状態にし、${target.name} の能力値を0（無）に帰した！`);
    } else {
      addLogMessage(`🌪️ [${pName}] ${attacker.name} の「空」！ 自身の次への攻撃を無効化状態にした！`);
    }
  },
 "laozi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const confucianIds = ["confucius", "mencius", "xunzi", "dong_zhongshu"]; 
    let confucianEnemies = targetObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) > 0 && confucianIds.includes(c.id));
    
    if (confucianEnemies.length > 0) {
      let confTarget = confucianEnemies[0];
      const dmg = (attacker.atk || 20) * 2;
      
      if (!attacker.type) attacker.type = "西洋";
      if (!confTarget.type) confTarget.type = "西洋";

      // 修正: executeDamage を使用してHP減少とUI更新を確実に連動
      executeDamage(pName, attacker, confTarget, actorObj, targetObj, dmg, true);
      addLogMessage(`☯️ [${pName}] ${attacker.name} が痛烈に儒家を批判！ 儒家の ${confTarget.name} を論破し ${dmg} の大ダメージ！`);
    } else {
      addLogMessage(`☯️ [${pName}] ${attacker.name} は儒家を批判しようとしたが、敵陣営に儒家の思想家はいなかった！`);
    }
  },

  "cassirer": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target) {
      target.activeVal = 0;
      addLogMessage(`🔣 [${pName}] ${attacker.name} の「アニマル・シンボリクム」！ ${target.name} の象徴操る力を封じ、スキルの発動を阻止した！`);
    }
  },

  "kohlberg": function(pName, attacker, target, actorObj, targetObj, activePt) {
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
    addLogMessage(`⚖️ [${pName}] ${attacker.name} の「罰の回避」！ 次受ける攻撃を1回無効化する状態になった！`);
  },

  "said": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const easternIds = ["gautama_siddhartha", "confucius", "mencius", "laozi", "nagarjuna", "watsuji", "wang_yangming", "mushi_sekai", "xunzi", "dong_zhongshu", "zhuangzi"];
    let affected = false;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(c => {
        if (c && (c.currentHP ?? c.hp ?? 0) > 0 && easternIds.includes(c.id)) {
          c.atk = 0;
          affected = true;
        }
      });
    }
    if (affected) {
      addLogMessage(`🕌 [${pName}] ${attacker.name} の「オリエンタリズム」！ 敵陣の東洋思想家たちはステレオタイプに囚われ、攻撃力が0になった！`);
    } else {
      addLogMessage(`🕌 [${pName}] ${attacker.name} のスキル発動！ しかし対象となる東洋の思想家は敵陣にいなかった。`);
    }
  },

  "sen": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (actorObj && actorObj.cards) {
      actorObj.cards.forEach(c => {
        if (c && (c.currentHP ?? c.hp ?? 0) > 0) c.defenseBuff = true;
      });
    }
    addLogMessage(`🕊️ [${pName}] ${attacker.name} の「人間の安全保障」！ 味方全員の安全が保障され、受けるダメージが半減する！`);
  },

  "huizinga": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dice = Math.floor(Math.random() * 6) + 1;
    if (dice <= 4) {
      const dmg = 30;
      if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
        if (!attacker.type) attacker.type = "西洋";
        if (!target.type) target.type = "西洋";
        executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
      }
      attacker.isStunned = false;
      addLogMessage(`🎲 [${pName}] ${attacker.name} の「ジャッジメントダイス」！ 出目【${dice}】！ 運命を引き寄せ ${target.name} に ${dmg} ダメージを与え、さらに連続行動！`);
    } else {
      addLogMessage(`🎲 [${pName}] ${attacker.name} の「ジャッジメントダイス」！ 出目【${dice}】... 運命に見放されターンを終えた。`);
    }
  },

  "jonas": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const currentTurn = (gameState && gameState.turnCount) || window.gameTurnCount || 1;
    const totalDmg = currentTurn * 20;
    let aliveEnemies = targetObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) > 0);
    
    if (aliveEnemies.length > 0) {
      const dmgPerEnemy = Math.floor(totalDmg / aliveEnemies.length);
      aliveEnemies.forEach(e => {
        if (!attacker.type) attacker.type = "西洋";
        if (!e.type) e.type = "西洋";
        executeDamage(pName, attacker, e, actorObj, targetObj, dmgPerEnemy, true);
      });
      addLogMessage(`⏳ [${pName}] ${attacker.name} の「未来世代の審判」！ 経過 ${currentTurn} ターン分の責任（計 ${totalDmg} ダメージ）が敵全体に均等に下された！`);
    }
  },

  "arendt": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dmg = attacker.atk || 20;
    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      if (!attacker.type) attacker.type = "西洋";
      if (!target.type) target.type = "西洋";
      executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
      target.isStunned = true;
    }
    addLogMessage(`⛓️ [${pName}] ${attacker.name} の「悪の凡庸さ」！ ${target ? target.name : ''} に ${dmg} ダメージを与え、思考停止状態（行動不能）にした！`);
  },

  "adam_smith": function(pName, attacker, target, actorObj, targetObj, activePt) {
    [actorObj, targetObj].forEach(side => {
      if (side && side.cards) {
        side.cards.forEach(c => {
          if (c && (c.currentHP ?? c.hp ?? 0) > 0) {
            c.atkBuff = false;
            c.defenseBuff = false;
            c.nullifyCount = 0;
            c.isStunned = false;
          }
        });
      }
    });
    addLogMessage(`⚖️ [${pName}] ${attacker.name} の「神の見えざる手」！ 市場の自動調節機能により、場に存在した全ての強化・弱体化効果が完全に平準化された！`);
  },

"wittgenstein": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const silenceDmg = 25;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy && (enemy.currentHP ?? enemy.hp ?? 0) > 0) {
          if (!attacker.type) attacker.type = "西洋";
          if (!enemy.type) enemy.type = "西洋";
          executeDamage(pName, attacker, enemy, actorObj, targetObj, silenceDmg, true);
        }
      });
    }
    addLogMessage(`🤫 [${pName}] ${attacker.name} の「沈黙の命題」！ 語り得ぬものを排除し、敵全体に ${silenceDmg} のダメージを与えた！`);
  },

  "m_weber": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let sacrificedHp = 0;
    if (actorObj && actorObj.cards) {
      actorObj.cards.forEach(ally => {
        if (ally) {
          const curHp = ally.currentHP ?? ally.hp ?? 0;
          if (curHp > 1) {
            sacrificedHp += (curHp - 1);
            ally.hp = 1;
            ally.currentHP = 1;
          }
        }
      });
    }
    attacker.atk = (attacker.atk || 0) + sacrificedHp;
    addLogMessage(`💥 [${pName}] ${attacker.name} の「支配者の重撃(ドミネイション・インパクト)」！ 味方全員の命を極限（HP1）まで捧げ、自身の攻撃力が【+${sacrificedHp}】上昇した！！`);

    if (typeof updateGameUI === "function") {
      updateGameUI();
    }
  },

  "erasmus": function(pName, attacker, target, actorObj, targetObj, activePt) {
    [actorObj, targetObj].forEach(side => {
      if (side && side.cards) {
        side.cards.forEach(c => {
          if (c && (c.currentHP ?? c.hp ?? 0) > 0 && c.type === "西洋") {
            const diff = Math.floor(Math.random() * 31) - 15;
            c.atk = Math.max(1, (c.atk || 0) + diff);
          }
        });
      }
    });
    addLogMessage(`🃏 [${pName}] ${attacker.name} の「痴愚神礼讃」！ 場の西洋思想家たちのステータスが狂乱し乱高下した！`);
  },

  "calvin": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let killedCount = 0;
    const allSides = [
      { sideObj: actorObj, sidePName: pName },
      { sideObj: targetObj, sidePName: pName === "あなた" ? "CPU" : (pName === "P1" ? "P2" : "P1") }
    ];

    allSides.forEach(({ sideObj, sidePName }) => {
      if (sideObj && sideObj.cards) {
        sideObj.cards.forEach(c => {
          const curHp = c ? (c.currentHP ?? c.hp ?? 0) : 0;
          if (c && curHp > 0 && curHp <= 40) {
            if (!attacker.type) attacker.type = "西洋";
            if (!c.type) c.type = "西洋";
            executeDamage(sidePName, attacker, c, actorObj, sideObj, curHp, true);
            killedCount++;
          }
        });
      }
    });
    addLogMessage(`⚡ [${pName}] ${attacker.name} の「神の権力」！ HP40以下の弱者 ${killedCount} 体に神の審判が下り、HPが0となった！`);
  },

 "kierkegaard": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (Math.random() < 0.66) {
      let aliveEnemies = targetObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) > 0);
      if (aliveEnemies.length > 1) {
        for (let i = 1; i < aliveEnemies.length; i++) {
          aliveEnemies[i].isStunned = true;
        }
        addLogMessage(`🧗 [${pName}] ${attacker.name} の「単独者」！ 絶望の果てに敵陣営を分断し、1体を除く全員を孤立・絶句（行動不能）させた！`);
      }
    } else {
      addLogMessage(`🧗 [${pName}] ${attacker.name} の「単独者」！ 単独者への試みは不発に終わった...`);
    }
  },

  "sartre": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target) {
      target.activeVal = 0;
      target.isSkillSealed = true;
      addLogMessage(`☕ [${pName}] ${attacker.name} の「実存は本質に先立つ」！ ${target.name} の本質（固有スキル）を消去し、スキルを封じる！`);
    }
  },

  "james": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let aliveEnemies = targetObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) > 0);
    if (aliveEnemies.length > 0) {
      let lowestHpEnemy = aliveEnemies.reduce((a, b) => (a.currentHP ?? a.hp ?? 0) < (b.currentHP ?? b.hp ?? 0) ? a : b);
      const curHp = lowestHpEnemy.currentHP ?? lowestHpEnemy.hp ?? 0;
      let dmg = curHp <= 50 ? 80 : 25;

      if (!attacker.type) attacker.type = "西洋";
      if (!lowestHpEnemy.type) lowestHpEnemy.type = "西洋";

      // 修正: executeDamage を使用して極大ダメージを処理
      executeDamage(pName, attacker, lowestHpEnemy, actorObj, targetObj, dmg, true);
      addLogMessage(`🛠️ [${pName}] ${attacker.name} の「プラグマティズム」！ 最も弱った ${lowestHpEnemy.name} へ実用的な極大撃滅（${dmg} ダメージ）！`);
    }
  },

  "spinoza": function(pName, attacker, target, actorObj, targetObj, activePt) {
    attacker.fixedDamageVal = 5;
    addLogMessage(`📐 [${pName}] ${attacker.name} の「決定論」！ 必至の法則により、次回受ける被ダメージを【5】に決定（固定）した！`);
  },

  "spencer": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dmg = 30;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy && (enemy.currentHP ?? enemy.hp ?? 0) > 0) {
          if (!attacker.type) attacker.type = "西洋";
          if (!enemy.type) enemy.type = "西洋";

          // 修正: 敵全体へのダメージを executeDamage で処理
          executeDamage(pName, attacker, enemy, actorObj, targetObj, dmg, true);
          enemy.activeVal = 0;
        }
      });
    }
    addLogMessage(`🦖 [${pName}] ${attacker.name} の「社会進化論」！ 適者生存の進化圧力を叩き込み、敵全体に ${dmg} ダメージ＆スキルポイント奪取！`);
  },

  "saussure": function(pName, attacker, target, actorObj, targetObj, activePt) {
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 2;
    addLogMessage(`🗣️ [${pName}] ${attacker.name} の「ラングの相違」！ 構造的ギャップにより相手の認識を狂わせ、攻撃を2回分遮断した！`);
  },

  "da_vinci": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      const stolenAtk = Math.floor((target.atk || 0) / 2);
      attacker.atk = (attacker.atk || 0) + stolenAtk;
      const dmg = attacker.atk;

      if (!attacker.type) attacker.type = "西洋";
      if (!target.type) target.type = "西洋";

      // 修正: executeDamage を使用してダメージ処理とUI更新を連動
      executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
      addLogMessage(`🎨 [${pName}] ${attacker.name} の「万能人だからね」！ ${target.name} のスキル技術を完全模倣して吸収（ATK+${stolenAtk}）し、${dmg} ダメージ！`);
    }
  },

  "dewey": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (Math.random() < 0.5) {
      attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
      addLogMessage(`⚙️ [${pName}] ${attacker.name} の「道具主義」！ 相手の攻撃パターンを学習し、回避姿勢をとった（無効化獲得）！`);
    } else {
      addLogMessage(`⚙️ [${pName}] ${attacker.name} の「道具主義」！ 実験的観察を行ったが、回避のタイミングを逃した。`);
    }
  },

  "nietzsche": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let deadAllies = actorObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) <= 0);
    if (deadAllies.length > 0) {
      let revived = deadAllies[0];
      revived.hp = 25;
      revived.currentHP = 25;
      addLogMessage(`🍷 [${pName}] ${attacker.name} の「永劫回帰」！ 倒れていた ${revived.name} がHP25で戦場に復活した！`);
    } else {
      const maxHpVal = attacker.maxHp || attacker.maxHP || 100;
      const curHp = attacker.currentHP ?? attacker.hp ?? 0;
      const newHp = Math.min(maxHpVal, curHp + 25);
      attacker.hp = newHp;
      attacker.currentHP = newHp;
      addLogMessage(`🍷 [${pName}] ${attacker.name} の「永劫回帰」！ 倒れた味方はおらず、自身のHPを25回復した！`);
    }

    // 回復・復活を即時UI反映
    if (typeof updateGameUI === "function") {
      updateGameUI();
    }
  },

  "habermas": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dmg = attacker.atk || 20;
    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      if (!attacker.type) attacker.type = "西洋";
      if (!target.type) target.type = "西洋";

      // 修正: executeDamage を使用してダメージ処理を安全に実行
      executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
    }

    // 双方のスキル発動ポイントをリセット
    [actorObj, targetObj].forEach(side => {
      if (side && side.cards) {
        side.cards.forEach(c => {
          if (c && (c.currentHP ?? c.hp ?? 0) > 0) c.activeVal = 0;
        });
      }
    });

    addLogMessage(`🗣️ [${pName}] ${attacker.name} の「対話的理性」！ ${target ? target.name : ''} に ${dmg} ダメージを与え、双方のスキル発動を抑制した！`);
  },

 "heidegger": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dmg = attacker.atk || 20;
    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      if (!attacker.type) attacker.type = "西洋";
      if (!target.type) target.type = "西洋";

      // 修正: executeDamage を使用してダメージ処理を連動
      executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
    }

    let injuredAllies = actorObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) > 0);
    if (injuredAllies.length > 0) {
      let targetAlly = injuredAllies.reduce((a, b) => (a.currentHP ?? a.hp ?? 0) < (b.currentHP ?? b.hp ?? 0) ? a : b);
      const maxHpVal = targetAlly.maxHp || targetAlly.maxHP || 100;
      const curHp = targetAlly.currentHP ?? targetAlly.hp ?? 0;
      const newHp = Math.min(maxHpVal, curHp + 40);
      targetAlly.hp = newHp;
      targetAlly.currentHP = newHp;

      if (typeof updateGameUI === "function") {
        updateGameUI();
      }
      addLogMessage(`⏳ [${pName}] ${attacker.name} の「存在と時間」！ ${target ? target.name : ''} に ${dmg} ダメージを与え、${targetAlly.name} の時間を巻き戻し回復！`);
    } else {
      addLogMessage(`⏳ [${pName}] ${attacker.name} の「存在と時間」！ ${target ? target.name : ''} に ${dmg} ダメージを与えた！`);
    }
  },

  "pascal": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        const curHp = enemy ? (enemy.currentHP ?? enemy.hp ?? 0) : 0;
        if (enemy && curHp > 0) {
          const cutDmg = Math.floor(curHp / 2);
          if (!attacker.type) attacker.type = "西洋";
          if (!enemy.type) enemy.type = "西洋";

          // 修正: HP半減分のダメージを executeDamage で安全に付与
          executeDamage(pName, attacker, enemy, actorObj, targetObj, cutDmg, true);
        }
      });
    }
    addLogMessage(`🌾 [${pName}] ${attacker.name} の「考える葦」！ 敵全体が無限の深淵に呑まれ、現在のHPが半減した！`);
  },

  "foucault": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy && (enemy.currentHP ?? enemy.hp ?? 0) > 0) {
          enemy.atkBuff = false;
          enemy.defenseBuff = false;
          enemy.atk = Math.min(enemy.atk || 0, 20);
        }
      });
    }
    addLogMessage(`👁️ [${pName}] ${attacker.name} の「人間の終焉」！ パノプティコンの支配構造を解体し、敵全体の強化状態を完全リセット！`);
  },

  "mill": function(pName, attacker, target, actorObj, targetObj, activePt) {
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
    addLogMessage(`⚖️ [${pName}] ${attacker.name} の「他者危害の原理」！ 他者への危害を抑止し、次の被ダメージを1回無効化した！`);
  },

  "montaigne": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let totalDrained = 0;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        const curHp = enemy ? (enemy.currentHP ?? enemy.hp ?? 0) : 0;
        if (enemy && curHp > 0) {
          let drain = Math.floor(curHp / 4);
          if (!attacker.type) attacker.type = "西洋";
          if (!enemy.type) enemy.type = "西洋";

          // 修正: 吸収分のダメージを executeDamage で処理
          executeDamage(pName, attacker, enemy, actorObj, targetObj, drain, true);
          totalDrained += drain;
        }
      });
    }

    // 自身のHP回復（両プロパティ同期＆上限処理）
    const maxHpVal = attacker.maxHp || attacker.maxHP || 100;
    const selfCurHp = attacker.currentHP ?? attacker.hp ?? 0;
    const newHp = Math.min(maxHpVal, selfCurHp + totalDrained);
    attacker.hp = newHp;
    attacker.currentHP = newHp;

    if (typeof updateGameUI === "function") {
      updateGameUI();
    }
    addLogMessage(`🤔 [${pName}] ${attacker.name} の「ク・セ・ジュ（私は何を知るか）」！ 敵全員からHPを1/4ずつ（計 ${totalDrained}）吸収した！`);
  },

  "jung": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy && (enemy.currentHP ?? enemy.hp ?? 0) > 0) {
          enemy.isStunned = true;
        }
      });
    }
    addLogMessage(`🌀 [${pName}] ${attacker.name} の「集合的無意識」！ 共通の無意識領域を刺激し、敵全体を精神的混乱（行動不能）に陥れた！`);
  },

  "leibniz": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      target.defenseBuff = false;
      const hits = 3;
      const dmgPerHit = 12;
      const totalDmg = hits * dmgPerHit;

      if (!attacker.type) attacker.type = "西洋";
      if (!target.type) target.type = "西洋";

      // 修正: executeDamage を使用してダメージ処理を連動
      executeDamage(pName, attacker, target, actorObj, targetObj, totalDmg, true);
      addLogMessage(`∫ [${pName}] ${attacker.name} の「無限小解析」！ 防御を無限に分解し、極小の微小ダメージを瞬時に重ねて ${totalDmg} ダメージ！`);
    }
  },

  "rousseau": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 自身のHP削りコスト（両プロパティ同期）
    const selfCurHp = attacker.currentHP ?? attacker.hp ?? 0;
    const newSelfHp = Math.max(1, selfCurHp - 10);
    attacker.hp = newSelfHp;
    attacker.currentHP = newSelfHp;

    const reduceVal = activePt || 25;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy && (enemy.currentHP ?? enemy.hp ?? 0) > 0) {
          if (!attacker.type) attacker.type = "西洋";
          if (!enemy.type) enemy.type = "西洋";

          // 修正: 敵全体へのダメージを executeDamage で安全に処理
          executeDamage(pName, attacker, enemy, actorObj, targetObj, reduceVal, true);
        }
      });
    }

    if (typeof updateGameUI === "function") {
      updateGameUI();
    }
    addLogMessage(`📜 [${pName}] ${attacker.name} の「社会契約説」！ 自身のHPを10差し出し、一般意志により敵全員のHPを ${reduceVal} 減少させた！`);
  },

  "luther": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dmg = 45;
    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      if (!attacker.type) attacker.type = "西洋";
      if (!target.type) target.type = "西洋";

      // 修正: executeDamage を使用してダメージ処理を連動
      executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
      addLogMessage(`✝️ [${pName}] ${attacker.name} の「宗教改革」！ 95ヶ条の論題を叩きつけ、${target.name} に ${dmg} の審判ダメージ！`);
    }
  },

  "levi_strauss": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target) {
      target.activeVal = 0;
      addLogMessage(`🦴 [${pName}] ${attacker.name} の「構造分析」！ ${target.name} の思考構造を解体し、固有スキルを封殺した！`);
    }
  },

  "levinas": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const westernIds = ["socrates", "platon", "aristoteles", "kant", "hegel", "descartes", "nietzsche", "spinoza"];
    let hasWestern = targetObj && targetObj.cards && targetObj.cards.some(c => c && (c.currentHP ?? c.hp ?? 0) > 0 && westernIds.includes(c.id));
    
    if (hasWestern) {
      const dmg = 30;
      targetObj.cards.forEach(enemy => {
        if (enemy && (enemy.currentHP ?? enemy.hp ?? 0) > 0) {
          if (!attacker.type) attacker.type = "西洋";
          if (!enemy.type) enemy.type = "西洋";

          // 修正: 西洋思想家存在時の敵全体ダメージを executeDamage で連動
          executeDamage(pName, attacker, enemy, actorObj, targetObj, dmg, true);
        }
      });
      addLogMessage(`👤 [${pName}] ${attacker.name} の「他者の倫理（西洋批判）」！ 敵陣の自我中心主義を批判し、全体に ${dmg} ダメージ！`);
    } else {
      addLogMessage(`👤 [${pName}] ${attacker.name} のスキル発動！ 対象となる西洋哲学の系譜は存在しなかった。`);
    }
  },

 "rawls": function(pName, attacker, target, actorObj, targetObj, activePt) {
    [actorObj, targetObj].forEach(side => {
      if (side && side.cards) {
        side.cards.forEach(c => {
          if (c && (c.currentHP ?? c.hp ?? 0) > 0) {
            c.atk = 20;
            c.atkBuff = false;
            c.defenseBuff = false;
          }
        });
      }
    });
    addLogMessage(`⚖️ [${pName}] ${attacker.name} の「無知のヴェール」！ 公正な機会均等により、敵味方すべての攻撃力が平準化（20に統一）された！`);
  },

  "ando_shoeki": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let aliveEnemies = targetObj && targetObj.cards ? targetObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) > 0) : [];
    if (aliveEnemies.length > 0) {
      let highestAtkEnemy = aliveEnemies.reduce((a, b) => (a.atk || 0) > (b.atk || 0) ? a : b);
      highestAtkEnemy.atk = Math.floor((highestAtkEnemy.atk || 0) / 2);
      addLogMessage(`🌾 [${pName}] ${attacker.name} の「自然真営道」！ 不耕貪食を咎め、最高火力を持つ ${highestAtkEnemy.name} の攻撃力を半減させた！`);
    }
  },

  "freud": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (Math.random() < 0.5) {
      [actorObj, targetObj].forEach(side => {
        if (side && side.cards) {
          side.cards.forEach(c => {
            if (c) {
              c.atkBuff = false;
              c.defenseBuff = false;
              c.activeVal = 0;
            }
          });
        }
      });
      addLogMessage(`🧠 [${pName}] ${attacker.name} の「超自我」が発動！ 本能(エス)を完璧に抑圧し、双方のバフ・スキル効果を無に帰した！`);
    } else {
      addLogMessage(`🧠 [${pName}] ${attacker.name} は精神分析を試みたが、欲望の抑圧に失敗した...`);
    }
  },

  "fromm": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dmg = (attacker.atk || 20) + 10;
    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      if (!attacker.type) attacker.type = "西洋";
      if (!target.type) target.type = "西洋";

      // 修正: executeDamage を使用してダメージ処理を連動
      executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
    }
    attacker.isStunned = true;
    addLogMessage(`🏃 [${pName}] ${attacker.name} の「自由からの逃走」！ ${target ? target.name : ''} に ${dmg} ダメージを与え、安全な領域へ退避した！`);
  },

  "hegel": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let deadAllies = actorObj && actorObj.cards ? actorObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) <= 0) : [];
    if (deadAllies.length > 0) {
      let revived = deadAllies[0];
      revived.hp = 40;
      revived.currentHP = 40;
      addLogMessage(`🌀 [${pName}] ${attacker.name} の「アウフヘーベン」！ 止揚の果てに ${revived.name} をHP40の新たな段階で復活させた！`);
    } else {
      attacker.atk = (attacker.atk || 0) + 15;
      addLogMessage(`🌀 [${pName}] ${attacker.name} の「アウフヘーベン」！ 倒れた味方はおらず、自身の存在を高めて攻撃力UP！`);
    }

    // UI表示の即時反映
    if (typeof updateGameUI === "function") {
      updateGameUI();
    } else if (typeof updateBattleUI === "function") {
      updateBattleUI();
    }
  },


 "beauvoir": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const maleIds = ["socrates", "platon", "aristoteles", "kant", "hegel", "nietzsche", "descartes", "hobbes", "marx", "freud"];
    let affected = 0;
    const enemyPName = pName === "あなた" ? "CPU" : (pName === "P1" ? "P2" : "P1");

    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(c => {
        if (c && (c.currentHP ?? c.hp ?? 0) > 0 && maleIds.includes(c.id)) {
          c.atk = Math.max(0, (c.atk || 0) - 10);
          if (!attacker.type) attacker.type = "西洋";
          if (!c.type) c.type = "西洋";

          // 修正: executeDamage でHP減少処理とUI更新を連動
          executeDamage(enemyPName, attacker, c, actorObj, targetObj, 10, true);
          affected++;
        }
      });
    }
    addLogMessage(`♀️ [${pName}] ${attacker.name} の「女性解放運動」！ 敵陣の男性思想家 ${affected} 体の偏見を打破し、攻撃力とHPを10低下させた！`);
  },

  "hobbes": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dmg = 15;
    const allSides = [
      { sideObj: actorObj, sidePName: pName },
      { sideObj: targetObj, sidePName: pName === "あなた" ? "CPU" : (pName === "P1" ? "P2" : "P1") }
    ];

    allSides.forEach(({ sideObj, sidePName }) => {
      if (sideObj && sideObj.cards) {
        sideObj.cards.forEach(c => {
          if (c && (c.currentHP ?? c.hp ?? 0) > 0) {
            if (!attacker.type) attacker.type = "西洋";
            if (!c.type) c.type = "西洋";

            // 修正: 敵味方全員へのダメージを executeDamage で安全に処理
            executeDamage(sidePName, attacker, c, actorObj, sideObj, dmg, true);
          }
        });
      }
    });
    addLogMessage(`⚔️ [${pName}] ${attacker.name} の「万人の万人に対する闘争」！ 自然状態の混乱が発生し、敵味方全員が ${dmg} ダメージを受けた！`);
  },

  "marx": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let seizedAtk = 0;
    targetObj.cards.forEach(enemy => {
      if (enemy.hp > 0 && enemy.atk > 20) {
        let diff = enemy.atk - 20;
        seizedAtk += diff;
        enemy.atk = 20;
        enemy.atkBuff = false;
      }
    });
    
    let aliveAllies = actorObj.cards.filter(c => c.hp > 0);
    if (aliveAllies.length > 0 && seizedAtk > 0) {
      let share = Math.floor(seizedAtk / aliveAllies.length);
      aliveAllies.forEach(ally => ally.atk += share);
      addLogMessage(`☭ [${pName}] ${attacker.name} の「階級闘争」！ 資本（敵のバフ・超過火力）を没収し、味方全員に公平に再分配（ATK+${share}）した！`);
    } else {
      addLogMessage(`☭ [${pName}]${attacker.name} の「階級闘争」！ 敵陣営に搾取すべき超過した富（バフ）は存在しなかった。`);
    }
  },

  "ippen": function(pName, attacker, target, actorObj, targetObj, activePt) {
    attacker.isStunned = true;
    addLogMessage(`📿 [${pName}]${attacker.name} の「踊り念仏」！ 歓喜の踊りとともにどこかへ去り、1ターン行動不能になった！`);
  },

  "ito_jinsai": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let affected = false;
    [actorObj, targetObj].forEach(side => {
      side.cards.forEach(c => {
        if (c.hp > 0 && (c.id === "confucius" || c.id === "mencius")) {
          c.hp += 25;
          affected = true;
        }
      });
    });
    if (affected) {
      addLogMessage(`📖 [${pName}]${attacker.name} の「古義学」！ 聖賢たる孔子・孟子の徳が称えられ、二人のHPが25増加した！`);
    } else {
      addLogMessage(`📖 [${pName}]${attacker.name} のスキル発動！ しかし場に孔子も孟子も存在しなかった。`);
    }
  },

  "ihara_saikaku": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let aliveEnemies = targetObj.cards.filter(c => c.hp > 0);
    if (aliveEnemies.length > 0) {
      let maxHpEnemy = aliveEnemies.reduce((a, b) => a.hp > b.hp ? a : b);
      const cutDmg = Math.round(maxHpEnemy.hp / 2);
      maxHpEnemy.hp -= cutDmg;
      if (maxHpEnemy.hp < 0) maxHpEnemy.hp = 0;
      addLogMessage(`💰 [${pName}]${attacker.name} の「世間胸算用」！ 大晦日の厳しい取り立てにより、${maxHpEnemy.name} のHPが半分（${cutDmg}削削）になった！`);
    }
  },

  "uchimura_kanzo": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (attacker) {
      attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
      addLogMessage(`🕊️ [${pName}] ${attacker.name} の「非戦論」！ 刀を捨て平和を主張し、次受ける攻撃を完全無効化する状態になった！`);
    }
  },

 "kamo_no_mabuchi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const japaneseIds = ["ippen", "ito_jinsai", "ihara_saikaku", "uchimura_kanzo", "kamo_no_mabuchi", "kitamura_tokoku", "kukai", "kotoku_shusui", "kobayashi_hideo", "saicho", "watsuji", "ando_shoeki", "motoori_norinaga"];
    let absorbedAtk = 0;
    const enemyPName = pName === "あなた" ? "CPU" : (pName === "P1" ? "P2" : "P1");
    
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(c => {
        if (c && (c.currentHP ?? c.hp ?? 0) > 0 && !japaneseIds.includes(c.id)) {
          if (!attacker.type) attacker.type = "和";
          if (!c.type) c.type = "西洋";
          
          // executeDamage で海外思想家へのダメージを連動
          executeDamage(enemyPName, attacker, c, actorObj, targetObj, 5, true);
          c.atk = Math.max(0, (c.atk || 0) - 5);
          absorbedAtk += 5;
        }
      });
    }

    attacker.atk = (attacker.atk || 0) + absorbedAtk;
    let extraText = "";

    let hasNorinaga = actorObj && actorObj.cards ? actorObj.cards.some(c => c && (c.currentHP ?? c.hp ?? 0) > 0 && c.id === "motoori_norinaga") : false;
    if (hasNorinaga) {
      attacker.atk += 5;
      extraText = " さらに本居宣長と同席のため攻撃力+5！";
    }

    addLogMessage(`🌸 [${pName}] ${attacker.name} の「国学」！ 海外の思想家から力を吸収（ATK+${absorbedAtk}）！${extraText}`);
  },
"kitamura_tokoku": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dice = Math.floor(Math.random() * 6) + 1;
    let resultMsg = "";
    
    if (dice === 1) {
      let aliveEnemies = targetObj && targetObj.cards ? targetObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) > 0) : [];
      if (aliveEnemies.length > 0) {
        let targetEnemy = aliveEnemies.reduce((a, b) => (a.currentHP ?? a.hp ?? 0) > (b.currentHP ?? b.hp ?? 0) ? a : b);
        const curHp = targetEnemy.currentHP ?? targetEnemy.hp ?? 0;
        
        if (!attacker.type) attacker.type = "和";
        if (!targetEnemy.type) targetEnemy.type = "西洋";
        
        // executeDamage で敵を即死処理
        executeDamage(pName, attacker, targetEnemy, actorObj, targetObj, curHp, true);
        resultMsg = ` 出目【1】！ 理想の想世界が完成し、${targetEnemy.name} を道連れに即死させた！`;
      }
    } else {
      resultMsg = ` 出目【${dice}】... 理想は現実を穿てなかった。`;
    }

    // 透谷自身の退場処理（両プロパティ同期＆UI即時更新）
    attacker.hp = 0;
    attacker.currentHP = 0;
    if (typeof updateGameUI === "function") {
      updateGameUI();
    }

    addLogMessage(`❄️ [${pName}] ${attacker.name} の「想世界の完成」！${resultMsg} (透谷は命を絶ち退場した)`);
  },

  "saicho": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dmg = 15;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          enemy.hp -= dmg;
          if (enemy.hp < 0) enemy.hp = 0;
        }
      });
    }
    actorObj.cards.forEach(c => {
      if (c.hp > 0) c.hasSaichoBuff = true;
    });
    addLogMessage(`🔔 [${pName}] ${attacker.name} の「一切衆生悉有仏性」！ 敵全体に ${dmg} ダメージを与え、万物が仏性を持つ慈悲の導きを付与した！`);
  },

 "sakaguchi_ango": function(pName, attacker, target, actorObj, targetObj, activePt) {
    [actorObj, targetObj].forEach(side => {
      if (side && side.cards) {
        side.cards.forEach(c => {
          if (c && (c.currentHP ?? c.hp ?? 0) > 0) {
            c.atkBuff = false;
            c.defenseBuff = false;
            c.nullifyCount = 0;
            c.isStunned = false;
          }
        });
      }
    });
    addLogMessage(`🍷 [${pName}] ${attacker.name} の「堕落論」！ 生きよ、堕ちよ！ 敵味方すべてのバフ・デバフがリセットされた！`);
  },

  "sakuma_shozan": function(pName, attacker, target, actorObj, targetObj, activePt) {
    attacker.atk = (attacker.atk || 0) + 15;
    const dmg = attacker.atk;
    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      if (!attacker.type) attacker.type = "和";
      if (!target.type) target.type = "西洋";
      executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
    }
    addLogMessage(`⚙️ [${pName}] ${attacker.name} の「和魂洋才」！ 東洋の精神と西洋の技術を融合し、${target ? target.name : ''} に ${dmg} ダメージ！`);
  },

  "shotoku_taishi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (attacker) {
      attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
      addLogMessage(`📜 [${pName}] ${attacker.name} の「憲法十七条」！ 「以和為貴」の教えにより、次の攻撃を1回完全回避する！`);
    }
  },

  "takano_choei": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (attacker) {
      attacker.nullifyCount = (attacker.nullifyCount || 0) + 2;
      addLogMessage(`🕯️ [${pName}] ${attacker.name} の「戊戌夢物語」！ 卓越した脱獄の知恵により身を隠し、敵の攻撃を2回まで絶対回避！`);
    }
  },

  "chikamatsu_monzaemon": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      target.nullifyCount = 0;
      target.defenseBuff = false;
      const targetCurHp = target.currentHP ?? target.hp ?? 0;
      
      if (!attacker.type) attacker.type = "和";
      if (!target.type) target.type = "西洋";

      // executeDamage で対象を即死処理
      executeDamage(pName, attacker, target, actorObj, targetObj, targetCurHp, true);
    }

    // 近松近松（自身）も道連れで退場（両プロパティ同期＆UI更新）
    attacker.hp = 0;
    attacker.currentHP = 0;
    if (typeof updateGameUI === "function") {
      updateGameUI();
    }

    addLogMessage(`🎭 [${pName}] ${attacker.name} の「曽根崎心中」！ 絆の極致により ${target ? target.name : ''} を道連れにし、共に命を絶った...！`);
  },

  "dogen": function(pName, attacker, target, actorObj, targetObj, activePt) {
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 2;
    const dmg = (attacker.atk || 20) + 20;

    if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
      if (!attacker.type) attacker.type = "和";
      if (!target.type) target.type = "西洋";
      executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
    }
    attacker.isStunned = true;
    addLogMessage(`🧘 [${pName}] ${attacker.name} の「身心脱落」！ 執着を捨て去り ${dmg} ダメージ＆2回無敵を得たが、反動で深き沈黙（行動不能）に入った！`);
  },

  "tokutomi_soho": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const nobleIds = ["platon", "aristoteles", "hegel", "descartes", "nietzsche", "hobbes"];
    let nobleEnemies = targetObj && targetObj.cards ? targetObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) > 0 && nobleIds.includes(c.id)) : [];
    
    if (!attacker.type) attacker.type = "和";

    if (nobleEnemies.length > 0) {
      let nobleTarget = nobleEnemies[0];
      const dmg = (attacker.atk || 20) * 2;
      if (!nobleTarget.type) nobleTarget.type = "西洋";
      
      executeDamage(pName, attacker, nobleTarget, actorObj, targetObj, dmg, true);
      addLogMessage(`📢 [${pName}] ${attacker.name} の「平民主義」！ 特権階級たる ${nobleTarget.name} を激しく批判し、${dmg} の大ダメージ！`);
    } else {
      const dmg = attacker.atk || 20;
      if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
        if (!target.type) target.type = "西洋";
        executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
      }
      addLogMessage(`📢 [${pName}] ${attacker.name} の「平民主義」！ ${target ? target.name : ''} に ${dmg} ダメージを与えた！`);
    }
  },

  "tominaga_nakamoto": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let confucius = targetObj && targetObj.cards ? targetObj.cards.find(c => c && (c.currentHP ?? c.hp ?? 0) > 0 && c.id === "confucius") : null;
    if (confucius) {
      const dmg = 45;
      if (!attacker.type) attacker.type = "和";
      if (!confucius.type) confucius.type = "西洋";

      executeDamage(pName, attacker, confucius, actorObj, targetObj, dmg, true);
      addLogMessage(`📜 [${pName}] ${attacker.name} の「出定後語（儒教批判）」！ 敵陣の孔子へ痛烈な論破を行い、${dmg} ダメージを与えた！`);
    } else {
      addLogMessage(`📜 [${pName}] ${attacker.name} は儒教批判を展開したが、敵陣に孔子はいなかった。`);
    }
  },

  "nakae_chomin": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const tyrantIds = ["hobbes", "machiavelli", "han_feizi"];
    let tyrantEnemies = targetObj && targetObj.cards ? targetObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) > 0 && tyrantIds.includes(c.id)) : [];
    
    if (!attacker.type) attacker.type = "和";

    if (tyrantEnemies.length > 0) {
      let tyrant = tyrantEnemies[0];
      const curHp = tyrant.currentHP ?? tyrant.hp ?? 0;
      if (!tyrant.type) tyrant.type = "西洋";

      executeDamage(pName, attacker, tyrant, actorObj, targetObj, curHp, true);
      addLogMessage(`🔔 [${pName}] ${attacker.name} の「東洋のルソー（自由民権運動）」！ 専制政治を唱える ${tyrant.name} を打倒し、即死（HP0）せしめた！`);
    } else {
      const dmg = 25;
      if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
        if (!target.type) target.type = "西洋";
        executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
      }
      addLogMessage(`🔔 [${pName}] ${attacker.name} の「自由民権運動」！ 民衆の権利を訴え、${target ? target.name : ''} に ${dmg} ダメージ！`);
    }
  },

  "natsume_soseki": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let kTargets = targetObj && targetObj.cards ? targetObj.cards.filter(c => c && (c.currentHP ?? c.hp ?? 0) > 0 && (c.name.includes("K") || c.name.includes("k") || c.id.includes("k"))) : [];
    if (!attacker.type) attacker.type = "和";

    if (kTargets.length > 0) {
      kTargets.forEach(c => {
        if (!c.type) c.type = "西洋";
        executeDamage(pName, attacker, c, actorObj, targetObj, 40, true);
      });
      addLogMessage(`📖 [${pName}] ${attacker.name} の「精神的に向上心のない奴は馬鹿だ」！ Kの影を持つものたちに 40 ダメージ！（漱石は無傷）`);
    } else {
      const dmg = attacker.atk || 20;
      if (target && (target.currentHP ?? target.hp ?? 0) > 0) {
        if (!target.type) target.type = "西洋";
        executeDamage(pName, attacker, target, actorObj, targetObj, dmg, true);
      }
      addLogMessage(`📖 [${pName}] ${attacker.name} の「こころ」！ ${target ? target.name : ''} に ${dmg} ダメージ！`);
    }
  },

  "nishida_kitaro": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const modernWesternIds = ["kant", "hegel", "nietzsche", "sartre", "husserl", "heidegger"];
    targetObj.cards.forEach(c => {
      if (c.hp > 0 && modernWesternIds.includes(c.id)) {
        c.hp = Math.max(0, c.hp - 20);
      }
    });
    addLogMessage(`🧘 [${pName}] ${attacker.name} の「主客未分」！ 主語と述語の対立を超克し、敵陣の近代西洋思想家のHPを20低下させた！`);
  },

  "ninomiya_sontoku": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let aliveAllies = actorObj.cards.filter(c => c.hp > 0 && c !== attacker);
    if (aliveAllies.length > 0) {
      const shareAtk = Math.floor(attacker.atk / aliveAllies.length);
      aliveAllies.forEach(a => a.atk += shareAtk);
      addLogMessage(`🌾 [${pName}] ${attacker.name} の「積小為大・推譲」！ 自身の能力値（ATK）を味方に譲渡（各+${shareAtk}）した！`);
    }
  },

  "fukuzawa_yukichi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let allCards = [];
    [actorObj, targetObj].forEach(side => {
      side.cards.forEach(c => { if (c.hp > 0) allCards.push(c); });
    });
    
    if (allCards.length > 0) {
      let totalHp = allCards.reduce((sum, c) => sum + c.hp, 0);
      let avgHp = Math.floor(totalHp / allCards.length);
      allCards.forEach(c => c.hp = avgHp);
      addLogMessage(`💴 [${pName}] ${attacker.name} の「学問のすゝめ」！ 万民平等の理により、敵味方全員のHPが【${avgHp}】に平均化された！`);
    }
  },

  "maruyama_masao": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const imperialIds = ["motoori_norinaga", "yamaga_soko", "yokoi_shonan", "shotoku_taishi"];
    let imperialEnemies = targetObj.cards.filter(c => c.hp > 0 && imperialIds.includes(c.id));
    
    if (imperialEnemies.length > 0) {
      imperialEnemies.forEach(e => e.hp = 0);
      addLogMessage(`🏛️ [${pName}] ${attacker.name} の「無知・無責任の体系批判」！ 支配構造に縛られた思想家を解体し即死（HP0）させた！`);
    } else {
      const dmg = 25;
      target.hp -= dmg;
      if (target.hp < 0) target.hp = 0;
      addLogMessage(`🏛️ [${pName}] ${attacker.name} の「日本の思想」！ ${target.name} に ${dmg} ダメージ！`);
    }
  },

  "miyazawa_kenji": function(pName, attacker, target, actorObj, targetObj, activePt) {
    actorObj.cards.forEach(c => {
      if (c.hp > 0) c.nullifyCount = (c.nullifyCount || 0) + 1;
    });
    addLogMessage(`🌧️ [${pName}] ${attacker.name} の「雨ニモマケズ」！ 苦難を引き受け、味方全員に攻撃を1回防ぐバリア（肩代わり）を張った！`);
  },

  "motoori_norinaga": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const japaneseIds = ["ippen", "ito_jinsai", "ihara_saikaku", "uchimura_kanzo", "kamo_no_mabuchi", "kitamura_tokoku", "kukai", "kotoku_shusui", "kobayashi_hideo", "saicho", "watsuji", "ando_shoeki", "motoori_norinaga", "natsume_soseki", "nishida_kitaro", "ninomiya_sontoku", "fukuzawa_yukichi", "maruyama_masao", "miyazawa_kenji", "yamaga_soko", "yokoi_shonan", "yoshino_sakuzo"];
    
    let jpCount = actorObj.cards.filter(c => c.hp > 0 && japaneseIds.includes(c.id)).length;
    let boost = jpCount * 5;
    
    let hasMabuchi = actorObj.cards.some(c => c.hp > 0 && c.id === "kamo_no_mabuchi");
    if (hasMabuchi) boost += 5;

    attacker.atk += boost;
    addLogMessage(`🌸 [${pName}] ${attacker.name} の「もののあはれ（国学）」！ 大和心の結集により攻撃力が【+${boost}】上昇した！`);
  },

  "yamaga_soko": function(pName, attacker, target, actorObj, targetObj, activePt) {
    let extraHp = Math.floor(attacker.hp * 0.2);
    attacker.hp += extraHp;
    addLogMessage(`⚔️ [${pName}] ${attacker.name} の「聖教要録（古学派）」！ 武士道の原点を見直し、自身のHPが1.2倍（+${extraHp}）に増加した！`);
  },

  "yokoi_shonan": function(pName, attacker, target, actorObj, targetObj, activePt) {
    targetObj.cards.forEach(c => {
      if (c.hp > 0) {
        c.atkBuff = false;
        c.defenseBuff = false;
        c.atk = Math.max(0, c.atk - 10);
      }
    });
    addLogMessage(`🤝 [${pName}] ${attacker.name} の「公武合体・富国強兵」！ 敵陣の体制を崩して強化を解除し、攻撃力を10低下させた！`);
  },

  "yoshino_sakuzo": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const isSuccess = Math.random() < 0.5;
    if (isSuccess) {
      targetObj.cards.forEach(c => {
        // 生存しており、かつタイプが「日本」の思想家が対象
        if (c.hp > 0 && c.type === "日本") {
          c.atk = 0;
          c.isStunned = true;
        }
      });
      addLogMessage(`🗳️ [${pName}] ${attacker.name} の「民本主義」！ 運命の憲政が結実！ 敵陣の日本思想家を行動不能＆攻撃力0にした！`);
    } else {
      attacker.hp = 0;
      addLogMessage(`🗳️ [${pName}] ${attacker.name} の「民本主義」！ 倒幕・大正デモクラシーの挫折により、吉野自身が倒れた（HP0）...`);
    }
  },


"watsuji": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 1. 全カードのバフ・状態異常をリセット
    [actorObj, targetObj].forEach(side => {
      side.cards.forEach(c => {
        c.atkBuff = false;
        c.defenseBuff = false;
        c.nullifyCount = 0;
        c.isStunned = false;
      });
    });

    let totalStolenHp = 0;
    let totalStolenAtk = 0;

    // 2. 敵陣全員からHPとATKを半分ずつ奪う
    targetObj.cards.forEach(enemy => {
      // プロパティ名の表記揺れ（currentHP / hp）に対応
      let currentEnemyHp = enemy.currentHP !== undefined ? enemy.currentHP : enemy.hp;
      
      if (currentEnemyHp > 0) {
        let hpCut = Math.floor(currentEnemyHp / 2);
        let atkCut = Math.floor(enemy.atk / 2);
        
        // 敵のHPを減算（両方のプロパティを更新）
        if (enemy.currentHP !== undefined) enemy.currentHP -= hpCut;
        enemy.hp = (enemy.hp !== undefined ? enemy.hp : currentEnemyHp) - hpCut;
        
        enemy.atk -= atkCut;
        totalStolenHp += hpCut;
        totalStolenAtk += atkCut;
      }
    });

    // 3. 奪ったHPを自身に回復（applyHeal または直接加算）
    if (typeof applyHeal === "function") {
      applyHeal(attacker, totalStolenHp);
    } else {
      // applyHealがない場合直接回復（最大HPで頭打ち）
      let maxHpVal = attacker.maxHP !== undefined ? attacker.maxHP : (attacker.maxHp || 100);
      
      if (attacker.currentHP !== undefined) {
        attacker.currentHP = Math.min(maxHpVal, attacker.currentHP + totalStolenHp);
      }
      if (attacker.hp !== undefined) {
        attacker.hp = Math.min(maxHpVal, attacker.hp + totalStolenHp);
      }
    }

    // 4. 奪ったATKを加算
    attacker.atk += totalStolenAtk;

    // 5. ログ出力
    addLogMessage(`👥 [${pName}] ${attacker.name} の「間柄的存在」！ 敵陣から能力を削ぎ落とし、自身のHPを回復＆ATKを${totalStolenAtk}上昇させた！`);

    // 6. 【重要】画面UIの再描画を呼び出し
    if (typeof updateBattleUI === "function") {
      updateBattleUI();
    }
  },

 "miyoshi_keiko": function(pName, attacker, target, actorObj, targetObj, activePt) {
    const dmg = attacker.atk;
    target.hp -= dmg;
    if (target.hp < 0) target.hp = 0;
    attacker.hp += dmg;
    addLogMessage(`🇺🇸 [${pName}] ${attacker.name} の「トランプ氏召喚」！ ${target.name} に ${dmg} ダメージを与え、同等のHP (+${dmg}) を獲得した！`);
  },

  "epicurus": function(pName, attacker, target, actorObj, targetObj, activePt) {
    if (Math.random() < 0.5) {
      attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
      addLogMessage(`🌱 [${pName}] ${attacker.name} の「隠れて生きよ」！ 庭園の隠道により敵の攻撃回避バリア (1回) を獲得！`);
    } else {
      addLogMessage(`🌱 [${pName}] ${attacker.name} は隠れようとしたが、見つかってしまった！`);
    }
  },

  "ganjin": function(pName, attacker, target, actorObj, targetObj, activePt) {
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 5;
    addLogMessage(`🌊 [${pName}] ${attacker.name} の「渡航失敗を糧に！」！ 5度の失明と荒波を乗り越えた不屈の精神により、攻撃を5回無効化する絶対鉄壁を展開！`);
  }
};
