// ==========================================
// パッシブスキル一括管理システム (passiveSkills.js)
// ==========================================

// === 1. スペシャルパッシブ個別の実装定義 (61種用) ===
const specialPassiveLogic = {
  //１． 吉野作造: このキャラクターのHPは7になる
  "yoshino_sakuzo": {
    onBattleStart: (card, pObj, enemyObj) => {
      card.maxHp = 7;
      card.hp = 7;
      card.currentHP = 7;
      addLogMessage(`📜 [${card.name}] のパッシブ発動！HPが 7 に固定された！`);
    }
  },

  //２． デカルト: HPが0になるダメージを受けた時に1度だけHP1で耐える
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

  // ３．パウロ: 自身が戦闘不能になったとき一度だけ完全復活
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

  // ４．エンペドクレス: 毎ターン味方全体HP+5、敵全体にダメージ5
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
  },

  // 5. アリストテレス: HPが中間(30%〜70%)の時、被ダメージ半減
  "aristotle": {
    onTakeDamage: (card, attacker, damage) => {
      const currentHp = card.currentHP ?? card.hp ?? 0;
      const maxHp = card.maxHp || 100;
      const ratio = currentHp / maxHp;
      if (ratio >= 0.3 && ratio <= 0.7) {
        const reduced = Math.floor(damage / 2);
        return reduced;
      }
      return damage;
    }
  },

  // ６. 韓非子: 相手の通常攻撃ダメージを半減
  "han_feizi": {
    onTakeDamage: (card, attacker, damage, isSkill) => {
      if (!isSkill) {
        const reduced = Math.floor(damage / 2);
        addLogMessage(`📜 [韓非子] 「非戦論」！相手の通常攻撃を半減！`);
        return reduced;
      }
      return damage;
    }
  },

  // ７. 荀子: 戦闘開始時にHPが少し減った状態でスタート
  "xunzi": {
    onBattleStart: (card) => {
      const maxHp = card.maxHp || 100;
      card.currentHP = Math.floor(maxHp * 0.8);
      card.hp = card.currentHP;
      addLogMessage(`😈 [荀子] 「性悪説」！初期HPが20%減少して開始。`);
    }
  },

  // ８. 荘子 / ヴァルダマーナ: 味方へのダメージを肩代わり（身代わり）
  "zhuangzi": {
    onTakeDamage: (card, attacker, damage) => {
      addLogMessage(`🦋 [荘子] 「真人」！受け入れる境地により被ダメージを代わりに引き受ける！`);
      return damage;
    }
  },

  // ９. デモクリトス: 被ダメージ時、50%の確率で半額を相手攻撃者に跳ね返す
  "democritus": {
    onTakeDamage: (card, attacker, damage) => {
      if (Math.random() < 0.5 && attacker) {
        const reflectDmg = Math.floor(damage / 2);
        const atkHp = attacker.currentHP ?? attacker.hp ?? 0;
        attacker.currentHP = Math.max(0, atkHp - reflectDmg);
        attacker.hp = attacker.currentHP;
        addLogMessage(`⚛️ [デモクリトス] 「アトムの反発」！${attacker.name} に ${reflectDmg} ダメージを反射！`);
      }
      return damage;
    }
  },

  // 10. 董仲舒: ターン開始時、相手にHP50以下の思想家がいれば1ターン行動不能（スタン）
  "dong_zhongshu": {
    onTurnStart: (card, pObj, enemyObj) => {
      enemyObj.cards.forEach(c => {
        const cHp = c.currentHP ?? c.hp ?? 0;
        if (cHp > 0 && cHp <= 50) {
          c.isStunned = true;
          addLogMessage(`🏛️ [董仲舒] 「儒教秩序」！HP50以下の ${c.name} は動けない！`);
        }
      });
    }
  },

  // 11. パルメニデス: 敵のスキルによるバフ（攻撃力上昇等）をリセット/無効化
  "parmenides": {
    onTurnStart: (card, pObj, enemyObj) => {
      enemyObj.cards.forEach(c => {
        if (c.baseAtk && c.atk > c.baseAtk) {
          c.atk = c.baseAtk;
          addLogMessage(`🛑 [パルメニデス] 「万物は変化しない」！${c.name} の攻撃力上昇を無効化！`);
        }
      });
    }
  },

  // 12. アダム・スミス: 味方がダメージを受けた際、20%分を相手に反射
  "adam_smith": {
    onTakeDamage: (card, attacker, damage) => {
      if (attacker) {
        const reflect = Math.max(1, Math.floor(damage * 0.2));
        const atkHp = attacker.currentHP ?? attacker.hp ?? 0;
        attacker.currentHP = Math.max(0, atkHp - reflect);
        attacker.hp = attacker.currentHP;
        addLogMessage(`⚖️ [アダム・スミス] 「道徳感情論」！共感と反発により ${attacker.name} に ${reflect} ダメージを反射！`);
      }
      return damage;
    }
  },

  // 13. マズロー: ターン開始時にダイス(1~3)で発動、回数に応じて効果がステップアップ
  "maslow": {
    onTurnStart: (card, pObj, enemyObj) => {
      const dice = Math.floor(Math.random() * 6) + 1;
      if (dice <= 3) {
        card.maslowCount = (card.maslowCount || 0) + 1;
        const count = card.maslowCount;
        addLogMessage(`📈 [マズロー] 「欲求段階説」 (段階 ${count}) 発動！`);

        if (count === 1) {
          // 敵2人に5ダメージ
          enemyObj.cards.filter(c => (c.currentHP ?? c.hp ?? 0) > 0).slice(0, 2).forEach(c => {
            c.currentHP = Math.max(0, (c.currentHP ?? c.hp) - 5);
            c.hp = c.currentHP;
          });
        } else if (count === 2) {
          // 自身HP10回復
          const cHp = card.currentHP ?? card.hp ?? 0;
          card.currentHP = Math.min(card.maxHp || 100, cHp + 10);
          card.hp = card.currentHP;
        } else if (count === 3) {
          // 全員HP5回復
          pObj.cards.forEach(c => {
            const cHp = c.currentHP ?? c.hp ?? 0;
            if (cHp > 0) {
              c.currentHP = Math.min(c.maxHp || 100, cHp + 5);
              c.hp = c.currentHP;
            }
          });
        } else if (count >= 4) {
          // ATK +10
          card.atk = (card.atk || 20) + 10;
        }
      }
    }
  },

// 14. 王陽明: 朱子学派（またはEXタイプ等）のカードに追加ダメージ
  "wang_yangming": {
    onBattleStart: (card, pObj, enemyObj) => {
      enemyObj.cards.forEach(c => {
        if (c.rank === "EX") {
          const cHp = c.currentHP ?? c.hp ?? 0;
          c.currentHP = Math.max(0, cHp - 10);
          c.hp = c.currentHP;
          addLogMessage(`📝 [王陽明] 「朱子学批判」！EXタイプの ${c.name} に 10 ダメージ！`); // 👈 末尾を ` に修正
        }
      });
    }
  },
  // 15. ジェームズ: 不確定な行動（発動率100%未満のスキル等）を選択時、確定（100%）で成功させる
  "james": {
    onTurnStart: (card) => {
      card.alwaysSuccess = true;
      addLogMessage(`信念 [ジェームズ] 「信じる意思」！このターンの行動成功率が100%になる！`);
    }
  },

  // 16. スピノザ: 属性干渉による弱点ダメージ（1.5倍等）を無効化し、等倍に戻す
  "spinoza": {
    onTakeDamage: (card, attacker, damage) => {
      if (attacker && attacker.type) {
        const baseMult = getAttributeMultiplier(attacker.type, card.type);
        if (baseMult > 1.0) {
          const normalDmg = Math.floor(damage / baseMult);
          addLogMessage(`🌿 [スピノザ] 「神即自然」！弱点属性ダメージを無効化（${damage} ➔ ${normalDmg}）`);
          return normalDmg;
        }
      }
      return damage;
    }
  },

  // 17. ソシュール: 自分のカード属性は相手の効果等で固定化・変更不可
  "saussure": {
    onBattleStart: (card) => {
      card.isTypeLocked = true;
      addLogMessage(`🗣️ [ソシュール] 「言語の恣意性」！属性変更効果を永続無効化。`);
    }
  },

  // 18. ダ＝ヴィンチ: 戦闘開始時、自身のHP半分の分身を作成してダメージを肩代わり
  "da_vinci": {
    onBattleStart: (card) => {
      const currentHp = card.currentHP ?? card.hp ?? 100;
      card.decoyHp = Math.floor(currentHp / 2);
      addLogMessage(`🎨 [ダ＝ヴィンチ] 「動き出す第二の自分」！HP ${card.decoyHp} の分身（自画像）を生成！`);
    },
    onTakeDamage: (card, attacker, damage) => {
      if (card.decoyHp && card.decoyHp > 0) {
        if (card.decoyHp >= damage) {
          card.decoyHp -= damage;
          addLogMessage(`🖼️ [ダ＝ヴィンチ] 分身がダメージを全額肩代わり！（分身残HP: ${card.decoyHp}）`);
          return 0;
        } else {
          const remainDmg = damage - card.decoyHp;
          addLogMessage(`🖼️ [ダ＝ヴィンチ] 分身が消滅！（貫通ダメージ: ${remainDmg}）`);
          card.decoyHp = 0;
          return remainDmg;
        }
      }
      return damage;
    }
  },

  // 19. ニーチェ: 戦闘開始時、相手の「源」タイプのカードのHPを5低下させる
  "nietzsche": {
    onBattleStart: (card, pObj, enemyObj) => {
      enemyObj.cards.forEach(c => {
        if (c.type === "源流" || c.type === "源") {
          const cHp = c.currentHP ?? c.hp ?? 0;
          c.currentHP = Math.max(0, cHp - 5);
          c.hp = c.currentHP;
          addLogMessage(`⚡ [ニーチェ] 「神は死んだ」！源流タイプの ${c.name} のHPが 5 低下！`);
        }
      });
    }
  },

  // 20. ニュートン: 被弾時、相手をふらつかせて次ターンの攻撃力（ATK）をダウン
  "newton": {
    onTakeDamage: (card, attacker, damage) => {
      if (attacker) {
        attacker.atk = Math.max(0, (attacker.atk || 20) - 3);
        addLogMessage(`🍎 [ニュートン] 「慣性の法則」！${attacker.name} はふらつき、ATKが 3 低下した！`);
      }
      return damage;
    }
  },

  // 21. ノージック: 攻撃力ダウン（デバフ）の効果を受けない
  "nozick": {
    onTurnStart: (card) => {
      if (card.baseAtk && card.atk < card.baseAtk) {
        card.atk = card.baseAtk;
        addLogMessage(`🗽 [ノージック] 「所有権理論」！攻撃力低下デバフを打ち消した！`);
      }
    }
  },

  // 22. パスカル: 一度攻撃を受けた敵からのダメージを永久に半減（重複可）
  "pascal": {
    onTakeDamage: (card, attacker, damage) => {
      if (attacker) {
        card.damagedBy = card.damagedBy || {};
        card.damagedBy[attacker.id] = (card.damagedBy[attacker.id] || 0) + 1;
        
        const count = card.damagedBy[attacker.id];
        const reduced = Math.floor(damage / Math.pow(2, count));
        addLogMessage(`🌾 [パスカル] 「思考する葦」！${attacker.name} からの被ダメージを固定軽減（${damage} ➔ ${reduced}）`);
        return reduced;
      }
      return damage;
    }
  },

  // 23. ピコ＝デッラ＝ミランドラ: 被弾時、確率で緊急回避（ダメージ無効化）
  "pico_della_mirandola": {
    onTakeDamage: (card, attacker, damage) => {
      if (Math.random() < 0.4) {
        addLogMessage(`🕊️ [ピコ＝デッラ＝ミランドラ] 「自由意志」！自由なる意思により攻撃を完全回避！`);
        return 0;
      }
      return damage;
    }
  },

  // 24. フロイト: 無意識状態（デバフ状態異常をターン開始時に全自動解除）
  "freud": {
    onTurnStart: (card) => {
      if (card.isStunned) {
        card.isStunned = false;
        addLogMessage(`🧠 [フロイト] 「無意識」！スタン等の状態異常を無意識下で解除した！`);
      }
    }
  },

  // 25. マルクス: 相手のRank（A/EX等）が高いほど攻撃時の貫通ダメージ増加
  "marx": {
    onTurnStart: (card, pObj, enemyObj) => {
      const hasHighRank = enemyObj.cards.some(c => c.rank === "A" || c.rank === "EX");
      if (hasHighRank && !card.marxBuffed) {
        card.atk = (card.atk || 20) + 8;
        card.marxBuffed = true;
        addLogMessage(`☭ [マルクス] 「資本論の呪縛」！相手の豪華陣容に対し攻撃力が 8 上昇！`);
      }
    }
  },

  // 26. ヤスパース: ターン開始時、最もHPが低い味方への被ダメージを軽減するバフを付与
  "jaspers": {
    onTurnStart: (card, pObj) => {
      let lowestCard = null;
      let minHp = 999;
      pObj.cards.forEach(c => {
        const cHp = c.currentHP ?? c.hp ?? 0;
        if (cHp > 0 && cHp < minHp) {
          minHp = cHp;
          lowestCard = c;
        }
      });
      if (lowestCard) {
        lowestCard.defenseBuff = true;
        addLogMessage(`🧱 [ヤスパース] 「限界状況」！ピンチの ${lowestCard.name} の守りを固めた！`);
      }
    }
  },

  // 27. ライプニッツ: ダメージを受ける直前、30%の確率で「宇宙の調和」により完全無効化
  "leibniz": {
    onTakeDamage: (card, attacker, damage) => {
      if (Math.random() < 0.3) {
        addLogMessage(`🌌 [ライプニッツ] 「予定調和」！宇宙の調和の一部としてダメージを無効化した！`);
        return 0;
      }
      return damage;
    }
  },

  // 28. ルソー: 自身が倒れた時、相手のランダム1体に持続ダメージ（自然に返す）を付与
  "rousseau": {
    onDeath: (card, pObj, enemyObj) => {
      const aliveEnemies = enemyObj.cards.filter(c => (c.currentHP ?? c.hp ?? 0) > 0);
      if (aliveEnemies.length > 0) {
        const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
        const myAliveCount = pObj.cards.filter(c => (c.currentHP ?? c.hp ?? 0) > 0).length + 1;
        const dotDmg = myAliveCount * 5;
        const tHp = target.currentHP ?? target.hp ?? 0;
        target.currentHP = Math.max(0, tHp - dotDmg);
        target.hp = target.currentHP;
        addLogMessage(`🍃 [ルソー] 「自然に帰れ」！退場時に ${target.name} に ${dotDmg} ダメージ！`);
      }
    }
  },

  // 29. ルター: 味方全員が状態異常（スタン等）にかからなくなる
  "luther": {
    onTurnStart: (card, pObj) => {
      pObj.cards.forEach(c => {
        if (c.isStunned) {
          c.isStunned = false;
          addLogMessage(`✝️ [ルター] 「宗教的反抗心」！${c.name} の行動不能を解除！`);
        }
      });
    }
  },

  // 30. レヴィ＝ストロース: 試合中に変化した味方1人のステータスを初期値にリセット
  "levi_strauss": {
    onBattleStart: (card, pObj) => {
      pObj.cards.forEach(c => {
        if (c.baseAtk) c.atk = c.baseAtk;
        addLogMessage(`🌀 [レヴィ＝ストロース] 「構造の再編」！${c.name} のステータスを初期状態に調整。`);
      });
    }
  },

  // 31. レヴィナス: 被弾時、25%の確率で防御（ダメージ半減）
  "levinas": {
    onTakeDamage: (card, attacker, damage) => {
      if (Math.random() < 0.25) {
        const reduced = Math.floor(damage / 2);
        addLogMessage(`🛡️ [レヴィナス] 「倫理的抵抗」！相手の攻撃をガード（ダメージ: ${reduced}）`);
        return reduced;
      }
      return damage;
    }
  },

// 32. ロールズ: 自身の役割が分からなくなり、2ターン行動不能（無知のヴェール）
  "rawls": {
    onBattleStart: (card) => {
      card.isStunned = true;
      card.stunTurns = 2;
      addLogMessage(`🙈 [ロールズ] 「無知のヴェール」！自身が誰か分からなくなり2ターン行動不可！`);
    }
  },

  // 33. 安藤昌益: 儒教・仏教関係者・武士のHPを10下げる（自然世から法世への堕落）
  "ando_shoeki": {
    onBattleStart: (card, pObj, enemyObj) => {
      [...pObj.cards, ...enemyObj.cards].forEach(c => {
        const tags = c.synergyTags || [];
        if (tags.includes("儒教") || tags.includes("仏教") || tags.includes("武士")) {
          const cHp = c.currentHP ?? c.hp ?? 0;
          c.currentHP = Math.max(0, cHp - 10);
          c.hp = c.currentHP;
          addLogMessage(`🌾 [安藤昌益] 「自然世批判」！法世に属する ${c.name} のHPが 10 低下！`);
        }
      });
    }
  },

  // 34. 石田梅岩: 相手Bランク1人のHPを+10する代わりに、石田梅岩以外の自チームHPを+10（Bランク不在時無効）
  "ishida_baigan": {
    onBattleStart: (card, pObj, enemyObj) => {
      const enemyB = enemyObj.cards.find(c => c.rank === "B" && (c.currentHP ?? c.hp ?? 0) > 0);
      if (enemyB) {
        // 相手BランクのHP+10
        enemyB.currentHP = (enemyB.currentHP ?? enemyB.hp ?? 0) + 10;
        enemyB.hp = enemyB.currentHP;
        
        // 自分チーム(自分以外)のHP+10
        pObj.cards.forEach(c => {
          if (c.id !== card.id) {
            const cHp = c.currentHP ?? c.hp ?? 0;
            c.currentHP = Math.min(c.maxHp || 100, cHp + 10);
            c.hp = c.currentHP;
          }
        });
        addLogMessage(`⚖️ [石田梅岩] 「先も立ち、我も立つ」！相手 ${enemyB.name} と味方のHPが +10！`);
      }
    }
  },

  // 35. 賀茂真淵: 男性キャラの攻撃力を5上昇させる（ますらをぶり）
  "kamo_no_mabuchi": {
    onBattleStart: (card, pObj) => {
      pObj.cards.forEach(c => {
        // 性別判定または汎用付与
        if (c.gender === "male" || !c.gender) {
          c.atk = (c.atk || 20) + 5;
        }
      });
      addLogMessage(`⚔️ [賀茂真淵] 「ますらをぶり」！男らしき思想家の攻撃力が 5 上昇！`);
    }
  },

  // 36. 幸徳秋水: 国家権力・権力に関する攻撃の被ダメージを20%にする（80%カット）
  "kotoku_shusui": {
    onTakeDamage: (card, attacker, damage, isSkill) => {
      const tags = attacker ? (attacker.synergyTags || []) : [];
      if (tags.includes("権力") || tags.includes("支配者") || attacker.rank === "EX") {
        const reduced = Math.floor(damage * 0.2);
        addLogMessage(`🚩 [幸徳秋水] 「国家権力批判」！権力からの打撃を大幅カット（${damage} ➔ ${reduced}）`);
        return reduced;
      }
      return damage;
    }
  },

  // 37. 小林秀雄: デバフを受けにくい（デバフ系のダメージ/ステータス低下を半減）
  "kobayashi_hideo": {
    onTakeDamage: (card, attacker, damage, isSkill) => {
      if (isSkill && attacker && (attacker.skillType === "debuff" || attacker.type === "debuff")) {
        const reduced = Math.floor(damage / 2);
        addLogMessage(`🎭 [小林秀雄] 「無私の精神」！デバフ効果を無心で受け流した（${damage} ➔ ${reduced}）`);
        return reduced;
      }
      return damage;
    }
  },

  // 38. 坂口安吾: HPが減るほど攻撃力が上昇する（無頼派）
  "sakaguchi_ango": {
    onTurnStart: (card) => {
      const currentHp = card.currentHP ?? card.hp ?? 0;
      const maxHp = card.maxHp || 100;
      const lostHpRatio = (maxHp - currentHp) / maxHp;
      const bonusAtk = Math.floor(lostHpRatio * 20); // 最大+20
      card.atk = (card.baseAtk || 20) + bonusAtk;
      if (bonusAtk > 0) {
        addLogMessage(`🥃 [坂口安吾] 「無頼派」！背負ったダメージに応じて攻撃力 +${bonusAtk}！`);
      }
    }
  },

  // 39. 佐久間象山: 一度受けたスキルダメージを次回以降半減（省けん録）
  "sakuma_shozan": {
    onTakeDamage: (card, attacker, damage, isSkill) => {
      if (isSkill) {
        if (card.skillDamagedBefore) {
          const reduced = Math.floor(damage / 2);
          addLogMessage(`📖 [佐久間象山] 「省けん録」！一度受けたスキルダメージを学習して半減（${damage} ➔ ${reduced}）`);
          return reduced;
        }
        card.skillDamagedBefore = true;
      }
      return damage;
    }
  },

  // 40. 聖徳太子: 自分よりランクの低い相手（B/Cランク等）への攻撃力1.5倍（冠位十二階）
  "shotoku_taishi": {
    onTurnStart: (card, pObj, enemyObj) => {
      enemyObj.cards.forEach(c => {
        if (c.rank === "B" || c.rank === "C") {
          card.atk = Math.floor((card.baseAtk || 20) * 1.5);
          addLogMessage(`📜 [聖徳太子] 「冠位十二階」！下位ランクの相手に対して威圧（ATK1.5倍）`);
        }
      });
    }
  },

  // 41. 冨永仲基: 相手に仏教系の人物がいる場合、相手を1回休みにさせる（仏教批判）
  "tominaga_nakamoto": {
    onBattleStart: (card, pObj, enemyObj) => {
      const hasBuddhism = enemyObj.cards.some(c => c.synergyTags && c.synergyTags.includes("仏教"));
      if (hasBuddhism) {
        enemyObj.cards.forEach(c => c.isStunned = true);
        addLogMessage(`🧹 [冨永仲基] 「仏教批判（加上説）」！相手仏教勢力を混乱させ1ターン足止め！`);
      }
    }
  },

  // 42. 中江兆民: 場にいる限り自分の場の「ルソー」のアクティブ・パッシブ数値を2倍化
  "nakae_chomin": {
    onTurnStart: (card, pObj) => {
      pObj.cards.forEach(c => {
        if (c.id === "rousseau" && !c.chominBuffed) {
          c.atk = (c.atk || 20) * 2;
          c.passiveVal = (c.passiveVal || 0) * 2;
          c.chominBuffed = true;
          addLogMessage(`🌸 [中江兆民] 「東洋のルソー」！ルソーの能力数値を2倍に強化！`);
        }
      });
    }
  },

  // 43. 林羅山: 支配者層・武士等の思想家は50%の確率で先制効果（上下定分の理）
  "hayashi_razan": {
    onBattleStart: (card, pObj) => {
      const tags = card.synergyTags || [];
      if (tags.includes("武士") || tags.includes("支配者") || card.rank === "A") {
        if (Math.random() < 0.5) {
          card.atk = (card.atk || 20) + 10;
          addLogMessage(`🏯 [林羅山] 「上下定分の理」！身分秩序により先制攻撃バフ（ATK+10）を獲得！`);
        }
      }
    }
  },
// ==========================================
  // スペシャルパッシブ (44. 丸山真男 〜 54. コント)
  // ==========================================

  // 44. 丸山真男: 自身が生存中、明治以降の思想家（近代/日本）の通常攻撃力を 3 ダウン
  "maruyama_masao": {
    onTurnStart: (card, pObj, enemyObj) => {
      enemyObj.cards.forEach(c => {
        const tags = c.synergyTags || [];
        if (c.type === "日本" || tags.includes("近代")) {
          c.atk = Math.max(0, (c.baseAtk || 20) - 3);
          addLogMessage(`😏 [丸山真男] 「不敵な笑み」！${c.name} の通常攻撃力を 3 ダウン！`);
        }
      });
    }
  },

  // 45. 宮沢賢治: 自身が戦闘不能になった際、味方全員のHPを全回復＆次ターンの攻撃力を倍増させる
  "miyazawa_kenji": {
    onDeath: (card, pObj) => {
      addLogMessage(`🌌 [宮沢賢治] 「銀河鉄道の夜」！自己犠牲により味方全員のHPが全回復＆攻撃力2倍！`);
      pObj.cards.forEach(c => {
        const cHp = c.currentHP ?? c.hp ?? 0;
        if (cHp > 0) {
          c.currentHP = c.maxHp || 100;
          c.hp = c.currentHP;
          c.atk = (c.atk || 20) * 2;
        }
      });
    }
  },

  // 46. 本居宣長: 外国人（西洋・源流等）の思想家から受けるダメージを半減する
  "motoori_norinaga": {
    onTakeDamage: (card, attacker, damage) => {
      if (attacker && (attacker.type === "西洋" || attacker.type === "源流")) {
        const reduced = Math.floor(damage / 2);
        addLogMessage(`🌸 [本居宣長] 「漢心批判」！異国の思想家からのダメージを半減（${damage} ➔ ${reduced}）`);
        return reduced;
      }
      return damage;
    }
  },

  // 47. 山鹿素行: 相手のパーティーに朱子学者が居る場合、戦闘開始時にダメージを与える
  "yamaga_soko": {
    onBattleStart: (card, pObj, enemyObj) => {
      enemyObj.cards.forEach(c => {
        const tags = c.synergyTags || [];
        if (c.id === "zhu_xi" || c.id === "hayashi_razan" || tags.includes("朱子学")) {
          const cHp = c.currentHP ?? c.hp ?? 0;
          c.currentHP = Math.max(0, cHp - 10);
          c.hp = c.currentHP;
          addLogMessage(`⚔️ [山鹿素行] 「朱子学批判」！朱子学派の ${c.name} に 10 ダメージ！`);
        }
      });
    }
  },

  // 48. 山本常朝: HP1のまま2度までなら耐えられる（武士道）
  "yamamoto_tsunetomo": {
    onTakeDamage: (card, attacker, damage) => {
      const currentHp = card.currentHP ?? card.hp ?? 0;
      if (currentHp - damage <= 0) {
        card.bushidoCount = (card.bushidoCount || 0) + 1;
        if (card.bushidoCount <= 2) {
          addLogMessage(`⚔️ [山本常朝] 「死を思い死を決す」！食いしばり発動（${card.bushidoCount}/2回目：HP1で耐えた！）`);
          return currentHp - 1;
        }
      }
      return damage;
    }
  },

  // 49. 和辻哲郎: 自身はBランク以下のダメージを反射。他の日本キャラはCランクダメージを反射
  "watsuji": {
    onTakeDamage: (card, attacker, damage) => {
      if (attacker && (attacker.rank === "B" || attacker.rank === "C")) {
        const atkHp = attacker.currentHP ?? attacker.hp ?? 0;
        attacker.currentHP = Math.max(0, atkHp - damage);
        attacker.hp = attacker.currentHP;
        addLogMessage(`👥 [和辻哲郎] 「間柄支配」！${attacker.name} の攻撃をそのまま反射！`);
        return 0;
      }
      return damage;
    }
  },

  // 50. 濱田和幸: 味方に日属性がいる時ATK3倍/不利属性半減/一度だけHP50%復活/Bランク以上耐性
  "hamada_yaho": {
    onBattleStart: (card, pObj) => {
      const hasJapan = pObj.cards.some(c => (c.type === "日本" || c.type === "日") && c.id !== card.id);
      if (hasJapan) {
        card.atk = (card.atk || 20) * 3;
        addLogMessage(`🌟 [濱田和幸] 「格の違い」！同属性共鳴により攻撃力が 3倍 に上昇！`);
      }
    },
    onTakeDamage: (card, attacker, damage) => {
      if (attacker && (attacker.rank === "A" || attacker.rank === "B" || attacker.rank === "EX")) {
        const reduced = Math.floor(damage / 2);
        addLogMessage(`🛡️ [濱田和幸] 「格の違い」！高ランクからの被ダメージを半減（${damage} ➔ ${reduced}）`);
        return reduced;
      }
      return damage;
    },
    onDeath: (card) => {
      if (!card.hamadaRevived) {
        card.hamadaRevived = true;
        const halfHp = Math.floor((card.maxHp || 100) / 2);
        card.currentHP = halfHp;
        card.hp = halfHp;
        addLogMessage(`🔥 [濱田和幸] 「格の違い」！一度だけHP 50% （${halfHp}）で復活！`);
      }
    }
  },

  // 51. 美濃子谷知行: 相手のHPが初期値の30%以下になった時、追い打ちダメージを与える
  "minokotani_tomoyuki": {
    onTurnEnd: (card, pObj, enemyObj) => {
      enemyObj.cards.forEach(c => {
        const cHp = c.currentHP ?? c.hp ?? 0;
        const maxHp = c.maxHp || 100;
        if (cHp > 0 && (cHp / maxHp) <= 0.3) {
          c.currentHP = Math.max(0, cHp - 8);
          c.hp = c.currentHP;
          addLogMessage(`📝 [美濃子谷知行] 「赤点追撃」！弱っている ${c.name} に 8 の追い打ちダメージ！`);
        }
      });
    }
  },

  // 52. 三好景子: 同じランク（Cランク）の敵からのみダメージを受ける
  "miyoshi_keiko": {
    onTakeDamage: (card, attacker, damage) => {
      if (attacker && attacker.rank !== "C") {
        addLogMessage(`👑 [三好景子] 「大統領就任」！同ランク（Cランク）以外の攻撃を受け付けない！`);
        return 0;
      }
      return damage;
    }
  },

  // 53. ピアジェ: たまに（30%の確率で）攻撃を回避
  "piaget": {
    onTakeDamage: (card, attacker, damage) => {
      if (Math.random() < 0.3) {
        addLogMessage(`🎈 [ピアジェ] 「ごっこ遊び」！攻撃を完全回避！`);
        return 0;
      }
      return damage;
    }
  },

  // 54. コント: 確率（40%）で、敵味方関係なくバフを解除
  "comte": {
    onTurnStart: (card, pObj, enemyObj) => {
      if (Math.random() < 0.4) {
        addLogMessage(`📊 [コント] 「社会学の創始者」！実証主義により全フィールドのバフを解除！`);
        [...pObj.cards, ...enemyObj.cards].forEach(c => {
          if (c.baseAtk) c.atk = c.baseAtk;
          c.atkBuff = false;
          c.defenseBuff = false;
        });
      }
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
