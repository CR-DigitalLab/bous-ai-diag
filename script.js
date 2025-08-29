// グローバルスコープにチャートインスタンスを保持する変数を定義
let myRadarChart = null;

function diagnose() {
    // --- 1. 入力値の取得 ---
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const totalPeople = adults + children;
    if (totalPeople === 0) {
        alert("人数を1人以上入力してください。");
        return;
    }

    // 食料・水
    const water = parseFloat(document.getElementById('water').value) || 0;
    const food = parseInt(document.getElementById('food').value) || 0;
    const hasPurifier = document.getElementById('purifier').checked;

    // 衛生
    const toiletPaper = parseInt(document.getElementById('toilet-paper').value) || 0;
    const hasPortableToilet = document.getElementById('portable-toilet').checked;
    const hasWetWipes = document.getElementById('wet-wipes').checked;
    const hasToothbrush = document.getElementById('toothbrush').checked;
    const hasSoap = document.getElementById('soap').checked;
    const hasDryShampoo = document.getElementById('dry-shampoo').checked;
    const hasMask = document.getElementById('mask').checked;

    // 電力・照明・情報
    const hasBattery = document.getElementById('battery').checked;
    const hasFlashlight = document.getElementById('flashlight').checked;
    const hasDryCell = document.getElementById('dry-cell').checked;
    const hasRadio = document.getElementById('radio').checked;
    
    // 快適・安全
    const hasGasStove = document.getElementById('gas-stove').checked;
    const hasFirstAid = document.getElementById('first-aid').checked;
    const hasGloves = document.getElementById('gloves').checked;
    const hasSleepingBag = document.getElementById('sleeping-bag').checked;
    const hasMedicine = document.getElementById('medicine').checked;
    const hasSaranWrap = document.getElementById('saran-wrap').checked;
    const hasGumTape = document.getElementById('gum-tape').checked;
    const hasCash = document.getElementById('cash').checked;
    const hasEarPlugs = document.getElementById('ear-plugs').checked;
    const hasEntertainment = document.getElementById('entertainment').checked;


    // --- 2. 生存可能日数の計算 ---
    const requiredWaterPerDay = adults * 3 + children * 2;
    const requiredFoodPerDay = adults * 3 + children * 3;
    
    let waterDays = requiredWaterPerDay > 0 ? Math.floor(water / requiredWaterPerDay) : 999;
    const foodDays = requiredFoodPerDay > 0 ? Math.floor(food / requiredFoodPerDay) : 999;
    
    if (hasPurifier) {
        waterDays += 21;
    }
    
    const survivalDays = Math.min(waterDays, foodDays);

    // --- 3. レーダーチャート用スコア計算 (各100点満点) ---
    // 食料・水
    let foodWaterScore = Math.min(survivalDays / 7, 1) * 80 + (hasPurifier ? 20 : 0);
    if (foodWaterScore > 100) foodWaterScore = 100;

    // 衛生
    let hygieneScore = 0;
    if (toiletPaper / totalPeople >= 12) hygieneScore += 20;
    if (hasPortableToilet) hygieneScore += 35; // 最重要
    if (hasWetWipes) hygieneScore += 10;
    if (hasToothbrush) hygieneScore += 10;
    if (hasSoap) hygieneScore += 10;
    if (hasDryShampoo) hygieneScore += 5;
    if (hasMask) hygieneScore += 10;

    // 電力・照明
    let powerScore = 0;
    if(hasBattery) powerScore += 50;
    if(hasFlashlight) powerScore += 30;
    if(hasDryCell) powerScore += 20;
    
    // 情報
    let infoScore = hasRadio ? 100 : 0;
    
    // 快適・安全
    let comfortScore = 0;
    if (hasGasStove) comfortScore += 20;
    if (hasFirstAid) comfortScore += 15;
    if (hasGloves) comfortScore += 5;
    if (hasSleepingBag) comfortScore += 15;
    if (hasMedicine) comfortScore += 10;
    if (hasSaranWrap) comfortScore += 10;
    if (hasGumTape) comfortScore += 8;
    if (hasCash) comfortScore += 5;
    if (hasEarPlugs) comfortScore += 7;
    if (hasEntertainment) comfortScore += 5;


    // --- 4. 防災タイプ称号の決定 ---
    let title = "";
    const avgScore = (hygieneScore + powerScore + infoScore + comfortScore) / 4;

    if (survivalDays >= 7 && foodWaterScore >= 95 && hygieneScore < 50) {
        title = "美食家サバイバー";
    } else if (survivalDays >= 7 && powerScore >= 95 && foodWaterScore < 50) {
        title = "ガジェット籠城者";
    } else if (survivalDays >= 7 && hygieneScore >= 95 && comfortScore < 50) {
        title = "潔癖症サバイバー";
    } else {
        if (survivalDays >= 30 && avgScore >= 95) {
            title = "防災神 👑";
        } else if (survivalDays >= 30 && avgScore >= 80) {
            title = "孤高のサバイバリスト";
        } else if (survivalDays >= 30 && avgScore >= 60) {
            title = "長期籠城の達人";
        } else if (survivalDays >= 21 && avgScore >= 85) {
            title = "防災エリート";
        } else if (survivalDays >= 21 && avgScore >= 70) {
            title = "冷静な戦略家";
        } else if (survivalDays >= 14 && avgScore >= 75) {
            title = "周到な準備家";
        } else if (survivalDays >= 14 && avgScore >= 60) {
            title = "頼れるご近所さん";
        } else if (survivalDays >= 7 && avgScore >= 60) {
            title = "備えある市民";
        } else if (survivalDays >= 7 && avgScore >= 40) {
            title = "不安な一週間";
        } else if (survivalDays >= 3 && avgScore >= 40) {
            title = "ギリギリ生存ライン";
        } else if (survivalDays >= 3 && avgScore >= 20) {
            title = "備蓄欠乏症";
        } else if (survivalDays < 3) {
            title = "防災ひよっこ";
        } else {
            title = "分類不能なサバイバー";
        }
    }


    // --- 5. アドバイスと買い物リストの生成 ---
    const adviceList = document.getElementById('advice-list');
    adviceList.innerHTML = '';
    const shoppingList = [];
    let adviceFound = false;

    const addSuggestion = (adviceText, needs, shoppingItem) => {
        const li = document.createElement('li');
        li.innerText = adviceText;
        adviceList.appendChild(li);
        adviceFound = true;
        if (needs && shoppingItem) {
            shoppingList.push(shoppingItem);
        }
    };

    if (survivalDays < 7) {
        if (waterDays < 7 && foodDays < 7) {
            addSuggestion("水と食料が1週間分に満たないようです。命に直結するため最優先で備蓄しましょう。", true, {name: "備蓄水・食料", query: "防災 備蓄 食料 7日"});
        } else if (waterDays < 7) {
            addSuggestion("食料に比べ、飲料水が不足しています。1人1日3Lを目安に確保しましょう。", true, {name: "飲料水 2L", query: "水 2l 備蓄"});
        } else {
            addSuggestion("水は十分ですが、食料が不足しています。ローリングストックなどを活用しましょう。", true, {name: "非常食 ローリングストック", query: "非常食 ローリングストック"});
        }
    }
    if (survivalDays < 30 && !hasPurifier) {
        addSuggestion("携帯浄水器があれば、飲める水の選択肢が増え生存率が飛躍的に向上します。", !hasPurifier, {name: "携帯浄水器", query: "防災 携帯浄水器"});
    }
    if (!hasPortableToilet) {
        addSuggestion("災害時に最も困るのがトイレです。簡易トイレは衛生と尊厳を守る必需品です。", !hasPortableToilet, {name: "簡易トイレ", query: "防災 簡易トイレ"});
    }
    if (!hasSaranWrap) {
        addSuggestion("サランラップは食器を汚さず節水になる他、防寒や応急処置にも使える万能品です。", !hasSaranWrap, {name: "サランラップ", query: "サランラップ 30cm"});
    }
    if (!hasBattery) {
        addSuggestion("情報収集や連絡に必須のスマホを守るため、大容量モバイルバッテリーを準備しましょう。", !hasBattery, {name: "モバイルバッテリー", query: "防災 モバイルバッテリー 大容量"});
    }
    if (!hasRadio) {
        addSuggestion("スマホが使えない状況も想定し、電池不要の手回し充電ラジオで情報を確保しましょう。", !hasRadio, {name: "防災ラジオ", query: "防災ラジオ 手回し"});
    }
    if (!hasCash) {
        addSuggestion("停電に備え、電子マネーに頼らない現金（特に小銭）を用意しておきましょう。", !hasCash, null);
    }
    if (!hasEntertainment) {
        addSuggestion("長期の避難生活では心の健康も重要。電気不要の娯楽品（本やカードゲームなど）が役立ちます。", !hasEntertainment, {name: "娯楽品 (本・ゲームなど)", query: "ボードゲーム"});
    }

    if (!adviceFound) {
        const li = document.createElement('li');
        li.innerText = "素晴らしい備えです！ほぼ完璧と言えるでしょう。この防災意識を維持してください。";
        adviceList.appendChild(li);
    }
    
    // --- 6. 結果の表示 ---
    const resultArea = document.getElementById('result-area');
    resultArea.style.display = 'block';
    
    document.getElementById('bousai-title').innerText = title;
    document.getElementById('survival-days').innerText = survivalDays;

    const shoppingListUl = document.getElementById('shopping-list');
    shoppingListUl.innerHTML = '';
    if(shoppingList.length > 0) {
        const uniqueShoppingList = [...new Map(shoppingList.map(item => [item.name, item])).values()];
        uniqueShoppingList.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `${item.name} <a href="https://www.amazon.co.jp/s?k=${encodeURIComponent(item.query)}" target="_blank" rel="noopener noreferrer">(Amazonで探す)</a>`;
            shoppingListUl.appendChild(li);
        });
    } else {
         const li = document.createElement('li');
         li.innerText = "素晴らしい！必需品に大きな不足はなさそうです。";
         shoppingListUl.appendChild(li);
    }

    // --- 7. レーダーチャートの描画 ---
    const chartScores = [
        { name: '食料・水', score: foodWaterScore },
        { name: '衛生', score: hygieneScore },
        { name: '電力', score: powerScore },
        { name: '情報', score: infoScore },
        { name: '快適・安全', score: comfortScore }
    ];

    const ctx = document.getElementById('radar-chart').getContext('2d');
    
    if (myRadarChart) myRadarChart.destroy();

    myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: chartScores.map(s => s.name),
            datasets: [{
                label: '防災スコア',
                data: chartScores.map(s => s.score),
                // ▼ 見やすいように配色をテーマに合わせる
                backgroundColor: 'rgba(0, 255, 0, 0.3)', // 蛍光グリーンの半透明
                borderColor: '#00ff00', // 蛍光グリーン
                pointBackgroundColor: '#00ff00', // 蛍光グリーン
                pointBorderColor: '#1a1a1a', // ポイントのフチを背景色に
                pointHoverBackgroundColor: '#fff', // ホバー時の色
                pointHoverBorderColor: '#00ff00' // ホバー時のフチの色
            }]
        },
        options: {
            scales: {
                r: {
                    // ▼ 線の色を明るくする
                    angleLines: {
                        color: '#666' // やや明るいグレー
                    },
                    // ▼ グリッド線の色を明るくする
                    grid: {
                        color: '#666' // やや明るいグレー
                    },
                    // ▼ 軸ラベルのフォント設定
                    pointLabels: {
                        font: {
                            size: 14
                        },
                        color: '#e0e0e0' // ゴーストホワイト
                    },
                    // ▼ 目盛りの数字の設定
                    ticks: {
                        color: '#e0e0e0', // ゴーストホワイト
                        backdropColor: 'rgba(42, 42, 42, 0.8)' // 背景色をコンテナに合わせる
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // --- 8. SNS共有ボタンの更新 ---
    const tweetText = `私の防災タイプは【${title}】でした！\n備蓄だけで暮らせる日数は【${survivalDays}日】です。\n\n#BousAI #ひきこもり防災診断`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
    document.getElementById('tweet-button').href = tweetUrl;

    resultArea.scrollIntoView({ behavior: 'smooth' });
}