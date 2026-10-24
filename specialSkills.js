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
    // 1. 両チームの状態異常を解除 (※もし毒などの状態異常フラグを使用している場合はここでリセット)
    // actorObj.cards.forEach(c => c.statusAilment = null); 
    // targetObj.cards.forEach(c => c.statusAilment = null);

    let stolenHp = 0;

    // 2. 敵全体のHPを半減して奪う
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          let decrease = Math.floor(enemy.hp / 2); // 現在のHPを半分にする
          enemy.hp -= decrease;
          stolenHp += decrease; // 減らした分を吸収用変数に貯める
        }
      });
    }

   // 3. 奪ったHPを自身のHPに加算
  attacker.hp += stolenHp;

  addLogMessage(`🔯 [${pName}] ${attacker.name} のスキル発動！敵全体のHPを半減させ、合計 ${stolenHp} のHPを吸収した！`);

  // 3. 奪ったステータスを和辻の攻撃力に加算
  if (typeof stolenAtk !== 'undefined') {
    attacker.atk += stolenAtk;
  }

  // 4. ログの出力
  addLogMessage(`🌪️ [${pName}] ${attacker.name} の「風土改変」！`);
  addLogMessage(`敵全体のステータスを半減させ、合計 ${stolenAtk || 0} の攻撃力を奪い取った！`);
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
"gautama_siddhartha": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 涅槃: 全員のHPを回復（リセット）
    actorObj.cards.forEach(c => { if (c.hp > 0) c.hp = c.maxHp || 1000; });
    targetObj.cards.forEach(c => { if (c.hp > 0) c.hp = c.maxHp || 1000; });
    addLogMessage(`🌸 [${pName}] ${attacker.name} の「涅槃」！ 敵味方問わず、全ての者の傷が癒えHPがリセットされた！`);
  },

  "confucius": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 君子の徳: 相手パーティー全員を行動不能にする
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) enemy.isStunned = true; 
      });
      addLogMessage(`📜 [${pName}] ${attacker.name} の「君子の徳」！ 敵全体が「礼」により平伏し、行動不能になった！`);
    }
  },

  "gorgias": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 相手を非存在に: ランダムな敵1体を非存在(HP0)にする
    let aliveEnemies = targetObj.cards.filter(c => c.hp > 0);
    if(aliveEnemies.length > 0) {
      let targetCard = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      targetCard.hp = 0;
      addLogMessage(`🌀 [${pName}] ${attacker.name} の「相手を非存在に」！ ${targetCard.name} は最初から存在しなかったことになった！`);
    }
  },

  "xunzi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 礼: 悪を矯正する（攻撃力ダウン ＆ バフ解除）
    const atkDown = 20;
    target.atk = Math.max(0, target.atk - atkDown);
    target.atkBuff = false;
    target.defenseBuff = false;
    addLogMessage(`🎋 [${pName}] ${attacker.name} の「礼」！ ${target.name} の悪を矯正し、攻撃力を ${atkDown} 下げて強化状態も打ち消した！`);
  },

  "zeno": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // アパテイア: ダメージを与え、同量を回復
    const dmg = 40; // 与えるダメージ量（調整可能）
    target.hp -= dmg;
    attacker.hp += dmg;
    addLogMessage(`🧘 [${pName}] ${attacker.name} の「アパテイア」！ ${target.name} に ${dmg} のダメージを与え、同量のHPを回復した！`);
  },
"zhuangzi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 万物斉同: 敵味方全員の攻撃力を20下げて、擬似的にダメージを軽減する
    const reduceVal = 20;
    actorObj.cards.forEach(c => { if(c.hp > 0) c.atk = Math.max(0, c.atk - reduceVal); });
    targetObj.cards.forEach(c => { if(c.hp > 0) c.atk = Math.max(0, c.atk - reduceVal); });
    addLogMessage(`🦋 [${pName}] ${attacker.name} の「万物斉同」！ 敵味方の境界が消え、全員の攻撃力が低下した！`);
  },

  "democritus": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 笑う哲学者の嘲笑: 相手を次ターン行動不能にし、攻撃力を下げる
    target.isStunned = true;
    const atkDown = 15;
    target.atk = Math.max(0, target.atk - atkDown);
    addLogMessage(`😂 [${pName}] ${attacker.name} の「笑う哲学者の嘲笑」！ ${target.name} はペースを乱され、次ターン行動不能＆攻撃力ダウン！`);
  },

  "dong_zhongshu": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 天人相関: 味方全員にバフ付与、敵全体のバフ解除＆攻撃力半減
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
    addLogMessage(`⛅ [${pName}] ${attacker.name} の「天人相関」！ 味方全体が強化され、敵全体の強化解除＆攻撃力半減！`);
  },

  "thomas_aquinas": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 信仰と理性の調和: 相手1体の攻撃力を半減（永続）
    target.atk = Math.floor(target.atk / 2);
    addLogMessage(`⛪ [${pName}] ${attacker.name} の「信仰と理性の調和」！ ${target.name} の攻撃力が半減した！`);
  },

  "parmenides": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // ないものはない: 自身に3回の無効化バリアを付与
    attacker.nullifyCount = 3;
    addLogMessage(`🛡️ [${pName}] ${attacker.name} の「ないものはない」！ 自身への攻撃を3回まで無効化する状態になった！`);
  },
"pythagoras": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 万物は数なり: 相手の攻撃力を0〜9のランダムな数字に書き換える
    const randomNum = Math.floor(Math.random() * 10); // 0〜9
    target.atk = randomNum;
    addLogMessage(`🔢 [${pName}] ${attacker.name} の「万物は数なり」！ ${target.name} の攻撃力が【${randomNum}】に書き換えられた！`);
  },

  "platon": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // イデア支配: 相手のバフと攻撃力をリセットし、ダメージを与える
    target.atk = 20; // 攻撃力を初期水準に強制セット
    target.atkBuff = false;
    target.defenseBuff = false;
    const dmg = 40; 
    target.hp -= dmg;
    if (target.hp < 0) target.hp = 0;
    addLogMessage(`💡 [${pName}] ${attacker.name} の「イデア支配」！ ${target.name} をイデア界に引き戻して弱体化させ、${dmg} のダメージを与えた！`);
  },

  "protagoras": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 人間は万物の尺度である: 相手の攻撃力をコピーする
    attacker.atk = Math.max(attacker.atk, target.atk); // 相手の攻撃力の方が高ければコピー
    addLogMessage(`📏 [${pName}] ${attacker.name} の「人間は万物の尺度である」！ ${target.name} を尺度とし、自身の攻撃力を同等に引き上げた！`);
  },

  "homer": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // ギリシア神話を書く: 自身は倒れ、敵全体に10ダメージ
    const dmg = 10;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          enemy.hp -= dmg;
          if (enemy.hp < 0) enemy.hp = 0;
        }
      });
    }
    attacker.hp = 0; // 自身は死亡
    addLogMessage(`🏛️ [${pName}] ${attacker.name} は命を懸けて「ギリシア神話」を書き上げた！ 敵全体に ${dmg} のダメージを与え、自身は倒れた...！`);
  },

  "mushi_sekai": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 一切が空であることについて: 敵全体のスキル発動用ポイントを0にする
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          enemy.activeVal = 0; // スキルポイントを「空(ゼロ)」にする
        }
      });
    }
    addLogMessage(`🪷 [${pName}] ${attacker.name} の「一切が空」！ 相手全体に悟りをもたらし、スキルの発動を封じた！`);
  },
"muhammad": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 啓示をうける: 50%の確率で神の啓示(ジャンケン勝利)となり追加ダメージ
    const isWin = Math.random() < 0.5;
    if (isWin) {
      const dmg = 10;
      target.hp -= dmg;
      if (target.hp < 0) target.hp = 0;
      attacker.atk += 10; // アクティブなステータスも強化
      addLogMessage(`✊ [${pName}] ${attacker.name} は神の啓示を受け、ジャンケンに勝利！ ${target.name} に ${dmg} の追加ダメージを与え、自身の攻撃力もUPした！`);
    } else {
      addLogMessage(`✋ [${pName}] ${attacker.name} は神の啓示を受けたが、今回は神を味方につけられなかった...`);
    }
  },

  "mencius": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 王道政治: 敵の最高ATKキャラが、敵の最高HPキャラを攻撃する
    let aliveEnemies = targetObj.cards.filter(c => c.hp > 0);
    if (aliveEnemies.length >= 2) {
      let highestAtkEnemy = aliveEnemies.reduce((a, b) => a.atk > b.atk ? a : b);
      let highestHpEnemy = aliveEnemies.reduce((a, b) => a.hp > b.hp ? a : b);
      const dmg = highestAtkEnemy.atk;
      highestHpEnemy.hp -= dmg;
      if (highestHpEnemy.hp < 0) highestHpEnemy.hp = 0;
      addLogMessage(`👑 [${pName}] ${attacker.name} の「王道政治」！ ${highestAtkEnemy.name} が魅了され、味方である ${highestHpEnemy.name} に ${dmg} のダメージを与えてしまった！`);
    } else {
      addLogMessage(`👑 [${pName}] ${attacker.name} の「王道政治」が発動したが、敵の数が足りず効果が薄かった！`);
    }
  },

  "nagarjuna": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 空(くう): 自身の次への攻撃を無効化し、相手の攻撃力を0にする
    attacker.nullifyCount = 1;
    target.atk = 0;
    addLogMessage(`🌪️ [${pName}] ${attacker.name} の「空」！ 自身の次への攻撃を無効化状態にし、${target.name} の能力値を0（無）に帰した！`);
  },

  "laozi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 儒家を批判する: 敵に儒家（孔子、孟子、荀子、董仲舒）がいれば狙い撃ち
    const confucianIds = ["confucius", "mencius", "xunzi", "dong_zhongshu"]; 
    let confucianEnemies = targetObj.cards.filter(c => c.hp > 0 && confucianIds.includes(c.id));
    
    if (confucianEnemies.length > 0) {
      let confTarget = confucianEnemies[0];
      const dmg = attacker.atk * 2; // 儒家への特効ダメージ
      confTarget.hp -= dmg;
      if (confTarget.hp < 0) confTarget.hp = 0;
      addLogMessage(`☯️ [${pName}] ${attacker.name} が痛烈に儒家を批判！ 儒家の ${confTarget.name} を論破し ${dmg} の大ダメージ！`);
    } else {
      addLogMessage(`☯️ [${pName}] ${attacker.name} は儒家を批判しようとしたが、敵陣営に儒家の思想家はいなかった！`);
    }
  },

  "cassirer": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // アニマル・シンボリクム: 敵のアクティブスキルを封印(ポイントリセット)
    target.activeVal = 0;
    addLogMessage(`🔣 [${pName}] ${attacker.name} の「アニマル・シンボリクム」！ ${target.name} の象徴操る力を封じ、スキルの発動を阻止した！`);
  },
"kohlberg": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 第一段階 [罰の回避]: 次の攻撃を無効化
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
    addLogMessage(`⚖️ [${pName}] ${attacker.name} の「罰の回避」！ 次受ける攻撃を1回無効化する状態になった！`);
  },

  "said": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 「従順でエキゾチックな東洋」: 敵陣営の東洋思想家の攻撃力を0にする
    const easternIds = ["gautama_siddhartha", "confucius", "mencius", "laozi", "nagarjuna", "watsuji", "wang_yangming", "mushi_sekai", "xunzi", "dong_zhongshu", "zhuangzi"];
    let affected = false;
    targetObj.cards.forEach(c => {
      if (c.hp > 0 && easternIds.includes(c.id)) {
        c.atk = 0;
        affected = true;
      }
    });
    if (affected) {
      addLogMessage(`🕌 [${pName}] ${attacker.name} の「オリエンタリズム」！ 敵陣の東洋思想家たちはステレオタイプに囚われ、攻撃力が0になった！`);
    } else {
      addLogMessage(`🕌 [${pName}] ${attacker.name} のスキル発動！ しかし対象となる東洋の思想家は敵陣にいなかった。`);
    }
  },

  "sen": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 人間の安全保障: 味方全員に防御バフ(ダメージ半減)を付与
    actorObj.cards.forEach(c => {
      if (c.hp > 0) c.defenseBuff = true;
    });
    addLogMessage(`🕊️ [${pName}] ${attacker.name} の「人間の安全保障」！ 味方全員の安全が保障され、受けるダメージが半減する！`);
  },

  "huizinga": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // ジャッジメントダイス: 1~4ならダメージ+連撃、5~6なら失敗
    const dice = Math.floor(Math.random() * 6) + 1;
    if (dice <= 4) {
      const dmg = 30;
      target.hp -= dmg;
      if (target.hp < 0) target.hp = 0;
      attacker.isStunned = false; // 再び連続行動可能にする
      addLogMessage(`🎲 [${pName}] ${attacker.name} の「ジャッジメントダイス」！ 出目【${dice}】！ 運命を引き寄せ ${target.name} に ${dmg} ダメージを与え、さらに連続行動！`);
    } else {
      addLogMessage(`🎲 [${pName}] ${attacker.name} の「ジャッジメントダイス」！ 出目【${dice}】... 運命に見放されターンを終えた。`);
    }
  },

  "jonas": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 未来世代の審判: (ターン数 × 20) の総ダメージを敵全体で均等分配
    const currentTurn = window.gameTurnCount || 1; // ターンカウントが取得できなければデフォルト1
    const totalDmg = currentTurn * 20;
    let aliveEnemies = targetObj.cards.filter(c => c.hp > 0);
    
    if (aliveEnemies.length > 0) {
      const dmgPerEnemy = Math.floor(totalDmg / aliveEnemies.length);
      aliveEnemies.forEach(e => {
        e.hp -= dmgPerEnemy;
        if (e.hp < 0) e.hp = 0;
      });
      addLogMessage(`⏳ [${pName}] ${attacker.name} の「未来世代の審判」！ 経過 ${currentTurn} ターン分の責任（計 ${totalDmg} ダメージ）が敵全体に均等に下された！`);
    }
  },

  "arendt": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 悪の凡庸さ: ダメージを与え、対象の次ターン思考/スキルを奪う(1回休み)
    const dmg = attacker.atk;
    target.hp -= dmg;
    if (target.hp < 0) target.hp = 0;
    target.isStunned = true; // 思考停止（通常攻撃すら封じる1回休み）
    addLogMessage(`⛓️ [${pName}] ${attacker.name} の「悪の凡庸さ」！ ${target.name} に ${dmg} ダメージを与え、思考停止状態（行動不能）にした！`);
  },

  "adam_smith": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 神の見えざる手: 敵味方すべてのバフ・デバフをリセット
    [actorObj, targetObj].forEach(side => {
      side.cards.forEach(c => {
        c.atkBuff = false;
        c.defenseBuff = false;
        c.nullifyCount = 0;
        c.isStunned = false;
      });
    });
    addLogMessage(`⚖️ [${pName}] ${attacker.name} の「神の見えざる手」！ 市場の自動調節機能により、場に存在した全ての強化・弱体化効果が完全に平準化された！`);
  },

  "wittgenstein": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 語り得ないことについては沈黙しなければならない: 敵全体のHPを減少させる
    const silenceDmg = 25;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          enemy.hp -= silenceDmg;
          if (enemy.hp < 0) enemy.hp = 0;
        }
      });
    }
    addLogMessage(`🤫 [${pName}] ${attacker.name} の「沈黙の命題」！ 語り得ぬものを排除し、敵全体に ${silenceDmg} のHP減少を与えた！`);
  },

  "m_weber": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 支配者の重撃: チーム全員のHPを1残して吸い上げ、自身の攻撃力に加算するロマン砲
    let sacrificedHp = 0;
    actorObj.cards.forEach(ally => {
      if (ally.hp > 1) {
        sacrificedHp += (ally.hp - 1);
        ally.hp = 1; // 限界まで削る
      }
    });
    attacker.atk += sacrificedHp; // 吸い上げたHP分、攻撃力を永久爆発上昇！
    addLogMessage(`💥 [${pName}] ${attacker.name} の「支配者の重撃(ドミネイション・インパクト)」！ 味方全員の命を極限（HP1）まで捧げ、自身の攻撃力が【+${sacrificedHp}】上昇した！！`);
  },
"erasmus": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 痴愚神礼讃: 西洋思想家全員の攻撃力をランダムに ±15 変動
    const westernIds = ["socrates", "platon", "aristoteles", "kant", "hegel", "descartes", "nietzsche", "erasmus", "spinoza", "sartre"];
    [actorObj, targetObj].forEach(side => {
      side.cards.forEach(c => {
        if (c.hp > 0 && westernIds.includes(c.id)) {
          const diff = Math.floor(Math.random() * 31) - 15; // -15 〜 +15
          c.atk = Math.max(1, c.atk + diff);
        }
      });
    });
    addLogMessage(`🃏 [${pName}] ${attacker.name} の「痴愚神礼讃」！ 場の西洋思想家たちのステータスが狂乱し乱高下した！`);
  },

  "calvin": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 神の権力(予定説): 敵味方問わず HP40以下の思想家を神の決定により即死(HP0)にする
    let killedCount = 0;
    [actorObj, targetObj].forEach(side => {
      side.cards.forEach(c => {
        if (c.hp > 0 && c.hp <= 40) {
          c.hp = 0;
          killedCount++;
        }
      });
    });
    addLogMessage(`⚡ [${pName}] ${attacker.name} の「神の権力」！ HP40以下の弱者 ${killedCount} 体に神の審判が下り、HPが0となった！`);
  },

  "kierkegaard": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 単独者: 66%の確率で相手の1体以外全員を行動不能(孤独)にする
    if (Math.random() < 0.66) {
      let aliveEnemies = targetObj.cards.filter(c => c.hp > 0);
      if (aliveEnemies.length > 1) {
        // 1体だけ残して残りを1回休みに
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
    // 実存は本質に先立つ: 相手のスキルを永久封印( activeVal = 0 )
    target.activeVal = 0;
    target.isSkillSealed = true; // スキル使用不可フラグ
    addLogMessage(`☕ [${pName}] ${attacker.name} の「実存は本質に先立つ」！ ${target.name} の本質（固有スキル）を消去し、スキルを封じる！`);
  },

  "james": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // プラグマティズム: 最もHPが低い敵を狙い、確実に倒せる（撃破圏内）なら超威力
    let aliveEnemies = targetObj.cards.filter(c => c.hp > 0);
    if (aliveEnemies.length > 0) {
      let lowestHpEnemy = aliveEnemies.reduce((a, b) => a.hp < b.hp ? a : b);
      let dmg = 25;
      if (lowestHpEnemy.hp <= 50) {
        dmg = 80; // 確実な撃破を狙うハイパワー攻撃
      }
      lowestHpEnemy.hp -= dmg;
      if (lowestHpEnemy.hp < 0) lowestHpEnemy.hp = 0;
      addLogMessage(`🛠️ [${pName}] ${attacker.name} の「プラグマティズム」！ 最も弱った ${lowestHpEnemy.name} へ実用的な極大撃滅（${dmg} ダメージ）！`);
    }
  },

  "spinoza": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 決定論: 自身が次回受けるダメージを5に固定する防御効果
    attacker.fixedDamageVal = 5;
    addLogMessage(`📐 [${pName}] ${attacker.name} の「決定論」！ 必至の法則により、次回受ける被ダメージを【5】に決定（固定）した！`);
  },

  "spencer": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 社会進化論の本領: 敵全員に30ダメージを与えるか、全体スキル封印の脅威を与える
    const dmg = 30;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          enemy.hp -= dmg;
          if (enemy.hp < 0) enemy.hp = 0;
          enemy.activeVal = 0; // スキルも阻害
        }
      });
    }
    addLogMessage(`🦖 [${pName}] ${attacker.name} の「社会進化論」！ 適者生存の進化圧力を叩き込み、敵全体に ${dmg} ダメージ＆スキルポイント奪取！`);
  },

  "saussure": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // ラングの相違: 自身に2回分のダメージ完全無効バリアを展開
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 2;
    addLogMessage(`🗣️ [${pName}] ${attacker.name} の「ラングの相違」！ 構造的ギャップにより相手の認識を狂わせ、攻撃を2回分遮断した！`);
  },

  "da_vinci": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 万能人だからね: 相手の能力を奪い取り、自身の攻撃力に加算して大打撃
    const stolenAtk = Math.floor(target.atk / 2);
    attacker.atk += stolenAtk;
    const dmg = attacker.atk;
    target.hp -= dmg;
    if (target.hp < 0) target.hp = 0;
    addLogMessage(`🎨 [${pName}] ${attacker.name} の「万能人だからね」！ ${target.name} のスキル技術を完全模倣して吸収（ATK+${stolenAtk}）し、${dmg} ダメージ！`);
  },

  "dewey": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 道具主義: 50%の確率でスキル学習（無効化バリア習得）
    if (Math.random() < 0.5) {
      attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
      addLogMessage(`⚙️ [${pName}] ${attacker.name} の「道具主義」！ 相手の攻撃パターンを学習し、回避姿勢をとった（無効化獲得）！`);
    } else {
      addLogMessage(`⚙️ [${pName}] ${attacker.name} の「道具主義」！ 実験的観察を行ったが、回避のタイミングを逃した。`);
    }
  },
"nietzsche": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // これが人生か、さればもう一度: 倒れた味方1体をHP25で復活
    let deadAllies = actorObj.cards.filter(c => c.hp <= 0);
    if (deadAllies.length > 0) {
      let revived = deadAllies[0];
      revived.hp = 25;
      addLogMessage(`🍷 [${pName}]${attacker.name} の「永劫回帰」！ 倒れていた ${revived.name} がHP25で戦場に復活した！`); } else { attacker.hp += 25; addLogMessage(`🍷 [${pName}] ${attacker.name} の「永劫回帰」！ 倒れた味方はおらず、自身のHPを25回復した！`); } },  "habermas": function(pName, attacker, target, actorObj, targetObj, activePt) { // コミュニケーション的理性: ダメージを与え、お互い次ターンのスキル使用不可 const dmg = attacker.atk; target.hp -= dmg; if (target.hp < 0) target.hp = 0; // お互いのスキルポイントを0にする actorObj.cards.forEach(c => c.activeVal = 0); targetObj.cards.forEach(c => c.activeVal = 0); addLogMessage(`🗣️ [${pName}] ${attacker.name} の「対話的理性」！ ${target.name} に ${dmg} ダメージを与え、双方のスキル発動を抑制した！`); },  "heidegger": function(pName, attacker, target, actorObj, targetObj, activePt) { // 存在と時間: ダメージを与え、味方1体の時間を巻き戻して回復 const dmg = attacker.atk; target.hp -= dmg; if (target.hp < 0) target.hp = 0;  let injuredAllies = actorObj.cards.filter(c => c.hp > 0); if (injuredAllies.length > 0) { let targetAlly = injuredAllies.reduce((a, b) => a.hp < b.hp ? a : b); targetAlly.hp += 40; // 時間逆行による大幅回復 addLogMessage(`⏳ [${pName}] ${attacker.name} の「存在と時間」！ ${target.name} に ${dmg} ダメージを与え、${targetAlly.name} の時間を巻き戻し回復！`);
    }
  },

  "pascal": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 人間の無限の可能性: 敵全体のHPを半減
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          enemy.hp = Math.floor(enemy.hp / 2);
        }
      });
    }
    addLogMessage(`🌾 [${pName}]${attacker.name} の「考える葦」！ 敵全体が無限の深淵に呑まれ、現在のHPが半減した！`);
  },

  "foucault": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 人間の終焉: 相手の優位性・バフを完全リセット＆弱体化
    targetObj.cards.forEach(enemy => {
      if (enemy.hp > 0) {
        enemy.atkBuff = false;
        enemy.defenseBuff = false;
        enemy.atk = Math.min(enemy.atk, 20); // 支配構造を解体し攻撃力を制限
      }
    });
    addLogMessage(`👁️ [${pName}]${attacker.name} の「人間の終焉」！ パノプティコンの支配構造を解体し、敵全体の強化状態を完全リセット！`);
  },

  "mill": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 他者危害の原理: 次の攻撃を1回無効化
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
    addLogMessage(`⚖️ [${pName}] ${attacker.name} の「他者危害の原理」！ 他者への危害を抑止し、次の被ダメージを1回無効化した！`);
  },

  "montaigne": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // ク・セ・ジュ: 敵全員のHPを1/4削り、それを自身のHPとして加算
    let totalDrained = 0;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          let drain = Math.floor(enemy.hp / 4);
          enemy.hp -= drain;
          totalDrained += drain;
        }
      });
    }
    attacker.hp += totalDrained; // 上限超過して回復
    addLogMessage(`🤔 [${pName}] ${attacker.name} の「ク・セ・ジュ（私は何を知るか）」！ 敵全員からHPを1/4ずつ（計 ${totalDrained}）吸収した！`);
  },

  "jung": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 集合的無意識: 敵全体を1ターン行動不能（1回休み）にする
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) enemy.isStunned = true;
      });
    }
    addLogMessage(`🌀 [${pName}] ${attacker.name} の「集合的無意識」！ 共通の無意識領域を刺激し、敵全体を精神的混乱（行動不能）に陥れた！`);
  },

  "leibniz": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 無限小解析: 防御無視の連続ダメージ
    target.defenseBuff = false; // 防御バフを無効化
    const hits = 3;
    const dmgPerHit = 12;
    const totalDmg = hits * dmgPerHit;
    target.hp -= totalDmg;
    if (target.hp < 0) target.hp = 0;
    addLogMessage(`∫ [${pName}] ${attacker.name} の「無限小解析」！ 防御を無限に分解し、極小の微小ダメージを瞬時に重ねて ${totalDmg} ダメージ！`);
  },

  "rousseau": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 社会契約説: 自身のHPを10削り、相手全員のHPをスキルポイント分直接削る
    attacker.hp = Math.max(1, attacker.hp - 10);
    const reduceVal = activePt || 25;
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          enemy.hp = Math.max(0, enemy.hp - reduceVal);
        }
      });
    }
    addLogMessage(`📜 [${pName}] ${attacker.name} の「社会契約説」！ 自身のHPを10差し出し、一般意志により敵全員のHPを ${reduceVal} 減少させた！`);
  },

  "luther": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 宗教改革: 信仰に根ざした一撃（特効ダメージ）
    const dmg = 45;
    target.hp -= dmg;
    if (target.hp < 0) target.hp = 0;
    addLogMessage(`✝️ [${pName}] ${attacker.name} の「宗教改革」！ 95ヶ条の論題を叩きつけ、${target.name} に ${dmg} の審判ダメージ！`);
  },

  "levi_strauss": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 構造分析: 相手のスキルを解体・消去( activeVal = 0 )
    target.activeVal = 0;
    addLogMessage(`🦴 [${pName}] ${attacker.name} の「構造分析」！ ${target.name} の思考構造を解体し、固有スキルを封殺した！`);
  },

  "levinas": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 西洋の哲学批判: 西洋思想家が敵陣にいる場合、全体攻撃
    const westernIds = ["socrates", "platon", "aristoteles", "kant", "hegel", "descartes", "nietzsche", "spinoza"];
    let hasWestern = targetObj.cards.some(c => c.hp > 0 && westernIds.includes(c.id));
    
    if (hasWestern) {
      const dmg = 30;
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          enemy.hp -= dmg;
          if (enemy.hp < 0) enemy.hp = 0;
        }
      });
      addLogMessage(`👤 [${pName}] ${attacker.name} の「他者の倫理（西洋批判）」！ 敵陣の自我中心主義を批判し、全体に ${dmg} ダメージ！`);
    } else {
      addLogMessage(`👤 [${pName}] ${attacker.name} のスキル発動！ 対象となる西洋哲学の系譜は存在しなかった。`);
    }
  },

  "rawls": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 公正な機会均等の原理: 全員のステータスをランクC基準（ATK20）に強制補正
    [actorObj, targetObj].forEach(side => {
      side.cards.forEach(c => {
        if (c.hp > 0) {
          c.atk = 20; // 均等化
          c.atkBuff = false;
          c.defenseBuff = false;
        }
      });
    });
    addLogMessage(`⚖️ [${pName}] ${attacker.name} の「無知のヴェール」！ 公正な機会均等により、敵味方すべての攻撃力が平準化（20に統一）された！`);
  },

  "ando_shoeki": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 万人直耕の自然世: 最も攻撃力が高い（不耕貪食している）敵の攻撃力を大幅に削り落とす
    let aliveEnemies = targetObj.cards.filter(c => c.hp > 0);
    if (aliveEnemies.length > 0) {
      let highestAtkEnemy = aliveEnemies.reduce((a, b) => a.atk > b.atk ? a : b);
      highestAtkEnemy.atk = Math.floor(highestAtkEnemy.atk / 2);
      addLogMessage(`🌾 [${pName}] ${attacker.name} の「自然真営道」！ 不耕貪食を咎め、最高火力を持つ ${highestAtkEnemy.name} の攻撃力を半減させた！`);
    }
  },

"freud": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 超自我とエス: 50%で成功、敵味方の欲望(アクティブ効果)を抑圧・初期化
    if (Math.random() < 0.5) {
      [actorObj, targetObj].forEach(side => {
        side.cards.forEach(c => {
          c.atkBuff = false;
          c.defenseBuff = false;
          c.activeVal = 0;
        });
      });
      addLogMessage(`🧠 [${pName}] ${attacker.name} の「超自我」が発動！ 本能(エス)を完璧に抑圧し、双方のバフ・スキル効果を無に帰した！`);
    } else {
      addLogMessage(`🧠 [${pName}] ${attacker.name} は精神分析を試みたが、欲望の抑圧に失敗した...`);
    }
  },

  "fromm": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 戦う自由からの逃走: 敵にダメージを与え、自身は一時退避(1回休み)
    const dmg = attacker.atk + 10;
    target.hp -= dmg;
    if (target.hp < 0) target.hp = 0;
    attacker.isStunned = true; // 逃走して身を隠す
    addLogMessage(`🏃 [${pName}] ${attacker.name} の「自由からの逃走」！ ${target.name} に ${dmg} ダメージを与え、安全な領域へ退避した！`);
  },

  "hegel": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // アウフヘーベン: 倒れた味方1体を高HPでアウフヘーベン(弁証法的復活)
    let deadAllies = actorObj.cards.filter(c => c.hp <= 0);
    if (deadAllies.length > 0) {
      let revived = deadAllies[0];
      revived.hp = 40;
      addLogMessage(`螺旋 [${pName}] ${attacker.name} の「アウフヘーベン」！ 止揚の果てに ${revived.name} をHP40の新たな段階で復活させた！`);
    } else {
      attacker.atk += 15;
      addLogMessage(`螺旋 [${pName}] ${attacker.name} の「アウフヘーベン」！ 倒れた味方はおらず、自身の存在を高めて攻撃力UP！`);
    }
  },

  "beauvoir": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 女性解放運動: 男性思想家の攻撃力とHPを10削減
    const maleIds = ["socrates", "platon", "aristoteles", "kant", "hegel", "nietzsche", "descartes", "hobbes", "marx", "freud"];
    let affected = 0;
    targetObj.cards.forEach(c => {
      if (c.hp > 0 && maleIds.includes(c.id)) {
        c.atk = Math.max(0, c.atk - 10);
        c.hp = Math.max(0, c.hp - 10);
        affected++;
      }
    });
    addLogMessage(`♀️ [${pName}] ${attacker.name} の「女性解放運動」！ 敵陣の男性思想家 ${affected} 体の偏見を打破し、攻撃力とHPを10低下させた！`);
  },

  "hobbes": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 万人の万人に対する闘争: 敵味方関係なく全員に15ダメージ
    const dmg = 15;
    [actorObj, targetObj].forEach(side => {
      side.cards.forEach(c => {
        if (c.hp > 0) {
          c.hp -= dmg;
          if (c.hp < 0) c.hp = 0;
        }
      });
    });
    addLogMessage(`⚔️ [${pName}] ${attacker.name} の「万人の万人に対する闘争」！ 自然状態の混乱が発生し、敵味方全員が ${dmg} ダメージを受けた！`);
  },

  "marx": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 階級闘争: 敵のバフを剥ぎ取り、味方全体に攻撃力として分配
    let seizedAtk = 0;
    targetObj.cards.forEach(enemy => {
      if (enemy.hp > 0 && enemy.atk > 20) {
        let diff = enemy.atk - 20; // 超過分の富(攻撃力)を没収
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
      addLogMessage(`☭ [${pName}] ${attacker.name} の「階級闘争」！ 敵陣営に搾取すべき超過した富（バフ）は存在しなかった。`);
    }
  },
"ippen": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 踊り念仏: どこかへ行くため1ターン行動不能（1回休み）
    attacker.isStunned = true;
    addLogMessage(`📿 [${pName}] ${attacker.name} の「踊り念仏」！ 歓喜の踊りとともにどこかへ去り、1ターン行動不能になった！`);
  },

  "ito_jinsai": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 「論語」「孟子」: 孔子・孟子がいればHPを増加
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
      addLogMessage(`📖 [${pName}] ${attacker.name} の「古義学」！ 聖賢たる孔子・孟子の徳が称えられ、二人のHPが25増加した！`);
    } else {
      addLogMessage(`📖 [${pName}] ${attacker.name} のスキル発動！ しかし場に孔子も孟子も存在しなかった。`);
    }
  },

  "ihara_saikaku": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 大晦日チェック 『世間胸算用』: 最高HP思想家のHPを半分削る(四捨五入)
    let aliveEnemies = targetObj.cards.filter(c => c.hp > 0);
    if (aliveEnemies.length > 0) {
      let maxHpEnemy = aliveEnemies.reduce((a, b) => a.hp > b.hp ? a : b);
      const cutDmg = Math.round(maxHpEnemy.hp / 2);
      maxHpEnemy.hp -= cutDmg;
      if (maxHpEnemy.hp < 0) maxHpEnemy.hp = 0;
      addLogMessage(`💰 [${pName}] ${attacker.name} の「世間胸算用」！ 大晦日の厳しい取り立てにより、${maxHpEnemy.name} のHPが半分（${cutDmg}削削）になった！`);
    }
  },

  "uchimura_kanzo": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 非戦論: 次の攻撃を無効化
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
    addLogMessage(`🕊️ [${pName}] ${attacker.name} の「非戦論」！ 刀を捨て平和を主張し、次受ける攻撃を完全無効化する状態になった！`);
  },

  "kamo_no_mabuchi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 国学: 非日本人思想家からステータス吸収 ＋ 本居宣長と同席でさらにATK+5
    const japaneseIds = ["ippen", "ito_jinsai", "ihara_saikaku", "uchimura_kanzo", "kamo_no_mabuchi", "kitamura_tokoku", "kukai", "kotoku_shusui", "kobayashi_hideo", "saicho", "watsuji", "ando_shoeki", "motoori_norinaga"];
    let absorbedAtk = 0;
    
    targetObj.cards.forEach(c => {
      if (c.hp > 0 && !japaneseIds.includes(c.id)) {
        c.hp = Math.max(0, c.hp - 5);
        c.atk = Math.max(0, c.atk - 5);
        absorbedAtk += 5;
      }
    });

    attacker.atk += absorbedAtk;
    let extraText = "";

    // 本居宣長の同席チェック
    let hasNorinaga = actorObj.cards.some(c => c.hp > 0 && c.id === "motoori_norinaga");
    if (hasNorinaga) {
      attacker.atk += 5;
      extraText = " さらに本居宣長と同席のため攻撃力+5！";
    }

    addLogMessage(`🌸 [${pName}] ${attacker.name} の「国学」！ 海外の思想家から力を吸収（ATK+${absorbedAtk}）！${extraText}`);
  },

  "kitamura_tokoku": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 想世界の完成: ダイス1で最大HP敵を即死。出目に関わらず自身は退場(自滅)
    const dice = Math.floor(Math.random() * 6) + 1;
    let resultMsg = "";
    
    if (dice === 1) {
      let aliveEnemies = targetObj.cards.filter(c => c.hp > 0);
      if (aliveEnemies.length > 0) {
        let targetEnemy = aliveEnemies.reduce((a, b) => a.hp > b.hp ? a : b);
        targetEnemy.hp = 0;
        resultMsg = ` 出目【1】！ 理想の想世界が完成し、${targetEnemy.name} を道連れに即死させた！`;
      }
    } else {
      resultMsg = ` 出目【${dice}】... 理想は現実を穿てなかった。`;
    }

    attacker.hp = 0; // 北村透谷自身は確実に退場
    addLogMessage(`❄️ [${pName}] ${attacker.name} の「想世界の完成」！${resultMsg} (透谷は命を絶ち退場した)`);
  },

  "kukai": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 即身成仏: 復活の加護を味方全体に付与
    actorObj.cards.forEach(c => {
      if (c.hp > 0) c.canKukaiRevive = true;
    });
    addLogMessage(`☸️ [${pName}] ${attacker.name} の「即身成仏」！ 味方全体に密教の加護が与えられ、倒れた際一度だけHP半分で復活する権能を得た！`);
  },

  "kotoku_shusui": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 直接行動: 相手の防御解除 ＆ 攻撃力を直接奪う
    target.atkBuff = false;
    target.defenseBuff = false;
    const stolenAtk = Math.min(target.atk, 15);
    target.atk -= stolenAtk;
    attacker.atk += stolenAtk;
    addLogMessage(`🔥 [${pName}] ${attacker.name} の「直接行動」！ 議会を通さぬ革命的猛攻により、${target.name} の強打を封じ攻撃力を ${stolenAtk} 奪取した！`);
  },

  "kobayashi_hideo": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 批評の眼: 敵全体のバフ解除 ＆ 攻撃力大幅ダウン
    if (targetObj && targetObj.cards) {
      targetObj.cards.forEach(enemy => {
        if (enemy.hp > 0) {
          enemy.atkBuff = false;
          enemy.defenseBuff = false;
          enemy.atk = Math.max(0, enemy.atk - 15);
        }
      });
    }
    addLogMessage(`👓 [${pName}] ${attacker.name} の「批評の眼」！ 敵全カードの本質を冷徹に見抜き、全強化を解除し攻撃力を15低下させた！`);
  },

  "saicho": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 一切衆生悉有仏性: 敵全体に15ダメージを与え、自陣に報復のバフをかける
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
    // 堕落論: 敵味方全体のバフ・デバフをすべてリセット
    [actorObj, targetObj].forEach(side => {
      side.cards.forEach(c => {
        c.atkBuff = false;
        c.defenseBuff = false;
        c.nullifyCount = 0;
        c.isStunned = false;
      });
    });
    addLogMessage(`🍷 [${pName}] ${attacker.name} の「堕落論」！ 生きよ、堕ちよ！ 敵味方すべてのバフ・デバフがリセットされた！`);
  },

  "sakuma_shozan": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 和魂洋才: 自身を強化し合成大ダメージ
    attacker.atk += 15;
    const dmg = attacker.atk;
    target.hp -= dmg;
    if (target.hp < 0) target.hp = 0;
    addLogMessage(`⚙️ [${pName}] ${attacker.name} の「和魂洋才」！ 東洋の精神と西洋の技術を融合し、${target.name} に ${dmg} ダメージ！`);
  },

  "shotoku_taishi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 憲法十七条: 「和」により次の攻撃を回避
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
    addLogMessage(`📜 [${pName}] ${attacker.name} の「憲法十七条」！ 「以和為貴」の教えにより、次の攻撃を1回完全回避する！`);
  },

  "takano_choei": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 戊戌夢物語: 絶対回避(無効化バリア2回分)
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 2;
    addLogMessage(`🕯️ [${pName}] ${attacker.name} の「戊戌夢物語」！ 卓越した脱獄の知恵により身を隠し、敵の攻撃を2回まで絶対回避！`);
  },

  "chikamatsu_monzaemon": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 曽根崎心中: バリア等を無視して対象を確殺し、自身も死亡する
    target.nullifyCount = 0; // バリア破壊
    target.defenseBuff = false;
    target.hp = 0; // 相手を確殺
    attacker.hp = 0; // 自身も死亡
    addLogMessage(`🎭 [${pName}] ${attacker.name} の「曽根崎心中」！ 絆の極致により ${target.name} を道連れにし、共に命を絶った...！`);
  },

  "dogen": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 身心脱落: 2回分無敵状態を得て攻撃するが、反動で2ターン行動不能
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 2;
    const dmg = attacker.atk + 20;
    target.hp -= dmg;
    if (target.hp < 0) target.hp = 0;
    attacker.isStunned = true; // 反動による瞑想・身心脱落状態
    addLogMessage(`🧘 [${pName}] ${attacker.name} の「身心脱落」！ 執着を捨て去り ${dmg} ダメージ＆2回無敵を得たが、反動で深き沈黙（行動不能）に入った！`);
  },

  "tokutomi_soho": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 平民主義: 貴族・権力者出身の相手を特効攻撃
    const nobleIds = ["platon", "aristoteles", "hegel", "descartes", "nietzsche", "hobbes"];
    let nobleEnemies = targetObj.cards.filter(c => c.hp > 0 && nobleIds.includes(c.id));
    
    if (nobleEnemies.length > 0) {
      let nobleTarget = nobleEnemies[0];
      const dmg = attacker.atk * 2;
      nobleTarget.hp -= dmg;
      if (nobleTarget.hp < 0) nobleTarget.hp = 0;
      addLogMessage(`📢 [${pName}] ${attacker.name} の「平民主義」！ 特権階級たる ${nobleTarget.name} を激しく批判し、${dmg} の大ダメージ！`);
    } else {
      const dmg = attacker.atk;
      target.hp -= dmg;
      if (target.hp < 0) target.hp = 0;
      addLogMessage(`📢 [${pName}] ${attacker.name} の「平民主義」！ ${target.name} に ${dmg} ダメージを与えた！`);
    }
  },

  "tominaga_nakamoto": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 儒教批判: 孔子が居る場合、狙い撃ちダメージ
    let confucius = targetObj.cards.find(c => c.hp > 0 && c.id === "confucius");
    if (confucius) {
      const dmg = 45;
      confucius.hp -= dmg;
      if (confucius.hp < 0) confucius.hp = 0;
      addLogMessage(`📜 [${pName}] ${attacker.name} の「出定後語（儒教批判）」！ 敵陣の孔子へ痛烈な論破を行い、${dmg} ダメージを与えた！`);
    } else {
      addLogMessage(`📜 [${pName}] ${attacker.name} は儒教批判を展開したが、敵陣に孔子はいなかった。`);
    }
  },

  "nakae_chomin": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 自由民権運動: 独裁・絶対王政の思想家を即死(HP0)にする
    const tyrantIds = ["hobbes", "machiavelli", "han_feizi"]; // 該当する思想家ID
    let tyrantEnemies = targetObj.cards.filter(c => c.hp > 0 && tyrantIds.includes(c.id));
    
    if (tyrantEnemies.length > 0) {
      let tyrant = tyrantEnemies[0];
      tyrant.hp = 0;
      addLogMessage(`🔔 [${pName}] ${attacker.name} の「東洋のルソー（自由民権運動）」！ 専制政治を唱える ${tyrant.name} を打倒し、即死（HP0）せしめた！`);
    } else {
      const dmg = 25;
      target.hp -= dmg;
      if (target.hp < 0) target.hp = 0;
      addLogMessage(`🔔 [${pName}] ${attacker.name} の「自由民権運動」！ 民衆の権利を訴え、${target.name} に ${dmg} ダメージ！`);
    }
  },
"natsume_soseki": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 精神的に向上心のない奴は馬鹿だ: 名前に「K/k」が付くカードに特効
    let kTargets = targetObj.cards.filter(c => c.hp > 0 && (c.name.includes("K") || c.name.includes("k") || c.id.includes("k")));
    if (kTargets.length > 0) {
      kTargets.forEach(c => {
        c.hp -= 40;
        if (c.hp < 0) c.hp = 0;
      });
      addLogMessage(`📖 [${pName}] ${attacker.name} の「精神的に向上心のない奴は馬鹿だ」！ Kの影を持つものたちに 40 ダメージ！（漱石は無傷）`);
    } else {
      const dmg = attacker.atk;
      target.hp -= dmg;
      if (target.hp < 0) target.hp = 0;
      addLogMessage(`📖 [${pName}] ${attacker.name} の「こころ」！ ${target.name} に ${dmg} ダメージ！`);
    }
  },

  "nishida_kitaro": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 主客未分: 近代西洋思想家のHPを下げる
    const modernWesternIds = ["kant", "hegel", "nietzsche", "sartre", "husserl", "heidegger"];
    targetObj.cards.forEach(c => {
      if (c.hp > 0 && modernWesternIds.includes(c.id)) {
        c.hp = Math.max(0, c.hp - 20);
      }
    });
    addLogMessage(`🧘 [${pName}] ${attacker.name} の「主客未分」！ 主語と述語の対立を超克し、敵陣の近代西洋思想家のHPを20低下させた！`);
  },

  "ninomiya_sontoku": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 分度と推譲: 自身が倒れた時/瀕死の時に余力を味方に譲渡
    let aliveAllies = actorObj.cards.filter(c => c.hp > 0 && c !== attacker);
    if (aliveAllies.length > 0) {
      const shareAtk = Math.floor(attacker.atk / aliveAllies.length);
      aliveAllies.forEach(a => a.atk += shareAtk);
      addLogMessage(`🌾 [${pName}] ${attacker.name} の「積小為大・推譲」！ 自身の能力値（ATK）を味方に譲渡（各+${shareAtk}）した！`);
    }
  },

  "fukuzawa_yukichi": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 天は人の上に人を造らず...: 敵味方全員のHPを平均化する
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
    // 無責任の体系: 超国家主義・天皇制支持キャラを消去
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
    // 雨ニモマケズ: 味方の受けるダメージを無効化バリア化（肩代わり）
    actorObj.cards.forEach(c => {
      if (c.hp > 0) c.nullifyCount = (c.nullifyCount || 0) + 1;
    });
    addLogMessage(`🌧️ [${pName}] ${attacker.name} の「雨ニモマケズ」！ 苦難を引き受け、味方全員に攻撃を1回防ぐバリア（肩代わり）を張った！`);
  },

  "motoori_norinaga": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 国学: 日本人キャラ数×5ATKアップ ＋ 賀茂真淵と同席でさらに+5
    const japaneseIds = ["ippen", "ito_jinsai", "ihara_saikaku", "uchimura_kanzo", "kamo_no_mabuchi", "kitamura_tokoku", "kukai", "kotoku_shusui", "kobayashi_hideo", "saicho", "watsuji", "ando_shoeki", "motoori_norinaga", "natsume_soseki", "nishida_kitaro", "ninomiya_sontoku", "fukuzawa_yukichi", "maruyama_masao", "miyazawa_kenji", "yamaga_soko", "yokoi_shonan", "yoshino_sakuzo"];
    
    let jpCount = actorObj.cards.filter(c => c.hp > 0 && japaneseIds.includes(c.id)).length;
    let boost = jpCount * 5;
    
    let hasMabuchi = actorObj.cards.some(c => c.hp > 0 && c.id === "kamo_no_mabuchi");
    if (hasMabuchi) boost += 5;

    attacker.atk += boost;
    addLogMessage(`🌸 [${pName}] ${attacker.name} の「もののあはれ（国学）」！ 大和心の結集により攻撃力が【+${boost}】上昇した！`);
  },

  "yamaga_soko": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 古学派: 古学派の絆でHPが1.2倍(増幅)
    let extraHp = Math.floor(attacker.hp * 0.2);
    attacker.hp += extraHp;
    addLogMessage(`⚔️ [${pName}] ${attacker.name} の「聖教要録（古学派）」！ 武士道の原点を見直し、自身のHPが1.2倍（+${extraHp}）に増加した！`);
  },

  "yokoi_shonan": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 公武合体: 相手全体のバフ解除＆攻撃力を削る
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
    // 民本主義の運: ダイス成功で日本思想家を無力化、失敗で自身即死
    const isSuccess = Math.random() < 0.5;
    if (isSuccess) {
      const japaneseIds = ["ippen", "ito_jinsai", "ihara_saikaku", "uchimura_kanzo", "kamo_no_mabuchi", "kitamura_tokoku", "kukai", "kotoku_shusui", "kobayashi_hideo", "saicho", "watsuji", "ando_shoeki", "motoori_norinaga", "natsume_soseki", "nishida_kitaro", "ninomiya_sontoku", "fukuzawa_yukichi", "maruyama_masao", "miyazawa_kenji", "yamaga_soko", "yokoi_shonan", "yoshino_sakuzo"];
      targetObj.cards.forEach(c => {
        if (c.hp > 0 && japaneseIds.includes(c.id)) {
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
    // 風土改変: 全バフ・デバフ解除＋敵全体のHP/ATKを半減し、削った分を和辻自身に加算
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

    targetObj.cards.forEach(enemy => {
      if (enemy.hp > 0) {
        let hpCut = Math.floor(enemy.hp / 2);
        let atkCut = Math.floor(enemy.atk / 2);
        enemy.hp -= hpCut;
        enemy.atk -= atkCut;
        totalStolenHp += hpCut;
        totalStolenAtk += atkCut;
      }
    });

    attacker.hp += totalStolenHp;
    attacker.atk += totalStolenAtk;

    addLogMessage(`☯️ [${pName}] ${attacker.name} の「風土改変」！ 敵全体のHPとATKを半減させ、和辻自身が（HP+${totalStolenHp} / ATK+${totalStolenAtk}）奪い取った！`);
  },

  "miyoshi_keiko": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // トランプ氏召喚: 与えたダメージ分HPがUPする
    const dmg = attacker.atk;
    target.hp -= dmg;
    if (target.hp < 0) target.hp = 0;
    attacker.hp += dmg;
    addLogMessage(`🇺🇸 [${pName}] ${attacker.name} の「トランプ氏召喚」！ ${target.name} に ${dmg} ダメージを与え、同等のHP (+${dmg}) を獲得した！`);
  },

  "epicurus": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 隠れて生きよ: 50%の確率でダメージ回避(バリア獲得)
    if (Math.random() < 0.5) {
      attacker.nullifyCount = (attacker.nullifyCount || 0) + 1;
      addLogMessage(`🌱 [${pName}] ${attacker.name} の「隠れて生きよ」！ 庭園の隠道により敵の攻撃回避バリア (1回) を獲得！`);
    } else {
      addLogMessage(`🌱 [${pName}] ${attacker.name} は隠れようとしたが、見つかってしまった！`);
    }
  },

  "ganjin": function(pName, attacker, target, actorObj, targetObj, activePt) {
    // 日本への渡航失敗を糧に！: 5回の渡航失敗＝5回分の絶対攻撃無効バリア
    attacker.nullifyCount = (attacker.nullifyCount || 0) + 5;
    addLogMessage(`🌊 [${pName}] ${attacker.name} の「渡航失敗を糧に！」！ 5度の失明と荒波を乗り越えた不屈の精神により、攻撃を5回無効化する絶対鉄壁を展開！`);
  }
};
