// グローバルスコープにチャートインスタンスを保持する変数を定義
let myRadarChart = null;

// 称号に対応する画像パスを定義
const titleImages = {
    "防災神 👑": "bousai_god.png",
    "孤高のサバイバリスト": "solitary_survivor.png",
    "長期籠城の達人": "siege_master.png",
    "防災エリート": "elite_prepper.png",
    "冷静な戦略家": "calm_strategist.png",
    "サバイバルエージェント 🕵️": "survival_agent.png",
    "防災マッチョ 💪": "bousai_macho.png",
    "周到な準備家": "thorough_prepper.png",
    "頼れるご近所さん": "reliable_neighbor.png",
    "美食家サバイバー": "gourmet_survivor.png",
    "ガジェット籠城者": "gadget_prepper.png",
    "潔癖症サバイバー": "clean_survivor.png",
    "備えある市民": "prepared_citizen.png",
    "不安な一週間": "anxious_week.png",
    "ギリギリ生存ライン": "barely_surviving.png",
    "備蓄欠乏症": "stock_shortage.png",
    "防災ひよっこ": "bousai_chick.png",
    "分類不能なサバイバー": "unclassified_survivor.png",
    "嘘つき 🤥": "liar.png",
    "もはや宇宙 🌌": "cosmos.png",
    "もはや地球 🌍": "earth.png",
    "もはや国 🏛️": "country.png"
};

function diagnose() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'flex';

    setTimeout(() => {
        // --- 1. 入力値の取得 ---
        const adults = parseInt(document.getElementById('adults').value) || 0;
        const children = parseInt(document.getElementById('children').value) || 0;
        const totalPeople = adults + children;

        if (totalPeople === 0) {
            alert("人数を1人以上入力してください。");
            overlay.style.display = 'none';
            return;
        }

        const water = parseFloat(document.getElementById('water').value) || 0;
        const food = parseInt(document.getElementById('food').value) || 0;
        const hasPurifier = document.getElementById('purifier').checked;
        const hasVitamins = document.getElementById('vitamins').checked;

        const toiletPaper = parseInt(document.getElementById('toilet-paper').value) || 0;
        const hasPortableToilet = document.getElementById('portable-toilet').checked;
        const hasDeodorizingBags = document.getElementById('deodorizing-bags').checked;
        const hasGarbageBags = document.getElementById('garbage-bags').checked;
        const hasWetWipes = document.getElementById('wet-wipes').checked;
        const hasToothbrush = document.getElementById('toothbrush').checked;
        const hasSoap = document.getElementById('soap').checked;
        const hasDryShampoo = document.getElementById('dry-shampoo').checked;
        const hasMask = document.getElementById('mask').checked;
        const hasTowels = document.getElementById('towels').checked;
        const hasNailClippers = document.getElementById('nail-clippers').checked;
        const hasDisposableDishes = document.getElementById('disposable-dishes').checked;

        const hasPowerStation = document.getElementById('power-station').checked;
        const hasSolarCharger = document.getElementById('solar-charger').checked;
        const hasBattery = document.getElementById('battery').checked;
        const hasDryCell = document.getElementById('dry-cell').checked;
        const hasLantern = document.getElementById('lantern').checked;
        const hasFlashlight = document.getElementById('flashlight').checked;
        const hasCandles = document.getElementById('candles').checked;
        const hasRadio = document.getElementById('radio').checked;
        const hasWhistle = document.getElementById('whistle').checked;

        const hasHelmet = document.getElementById('helmet').checked;
        const hasGasStove = document.getElementById('gas-stove').checked;
        const hasGasCanisters = document.getElementById('gas-canisters').checked;
        const hasWaterTank = document.getElementById('water-tank').checked;
        const hasFirstAid = document.getElementById('first-aid').checked;
        const hasMedicine = document.getElementById('medicine').checked;
        const hasSleepingBag = document.getElementById('sleeping-bag').checked;
        const hasGloves = document.getElementById('gloves').checked;
        const hasSaranWrap = document.getElementById('saran-wrap').checked;
        const hasGumTape = document.getElementById('gum-tape').checked;
        const hasCash = document.getElementById('cash').checked;
        const hasEarPlugs = document.getElementById('ear-plugs').checked;
        const hasEntertainment = document.getElementById('entertainment').checked;

        // --- 2. 生存可能日数の計算 ---
        const requiredWaterPerDay = (adults * 3) + (children * 2);
        const requiredFoodPerDay = (adults * 3) + (children * 3);
        let waterDays = requiredWaterPerDay > 0 ? Math.floor(water / requiredWaterPerDay) : 999;
        const foodDays = requiredFoodPerDay > 0 ? Math.floor(food / requiredFoodPerDay) : 999;
        if (hasPurifier) {
            waterDays += 21;
        }
        const survivalDays = Math.min(waterDays, foodDays);

        // --- 3. レーダーチャート用スコア計算 ---
        let foodWaterScore = Math.min(survivalDays / 10, 1) * 80 + (hasPurifier ? 20 : 0);
        if (foodWaterScore > 100) foodWaterScore = 100;

        let hygieneScore = 0;
        if (hasPortableToilet) hygieneScore += 20;
        if (hasDeodorizingBags) hygieneScore += 10;
        if (hasGarbageBags) hygieneScore += 15;
        if (hasSoap) hygieneScore += 10;
        if (hasWetWipes) hygieneScore += 10;
        if (toiletPaper / totalPeople >= 12) hygieneScore += 5;
        if (hasMask) hygieneScore += 5;
        if (hasToothbrush) hygieneScore += 5;
        if (hasTowels) hygieneScore += 5;
        if (hasDisposableDishes) hygieneScore += 5;
        if (hasDryShampoo) hygieneScore += 5;
        if (hasNailClippers) hygieneScore += 5;
        if (hygieneScore > 100) hygieneScore = 100;

        let powerScore = 0;
        if (hasPowerStation) powerScore += 35;
        if (hasSolarCharger) powerScore += 20;
        if (hasBattery) powerScore += 15;
        if (hasFlashlight) powerScore += 10;
        if (hasLantern) powerScore += 10;
        if (hasDryCell) powerScore += 5;
        if (hasCandles) powerScore += 5;
        if (powerScore > 100) powerScore = 100;

        let infoScore = 0;
        if (hasRadio) infoScore += 60;
        if (hasWhistle) infoScore += 20;
        if (hasBattery) infoScore += 20;
        if (infoScore > 100) infoScore = 100;
        
        let comfortScore = 0;
        if (hasHelmet) comfortScore += 15;
        if (hasSleepingBag) comfortScore += 10;
        if (hasFirstAid) comfortScore += 10;
        if (hasMedicine) comfortScore += 10;
        if (hasGasStove && hasGasCanisters) comfortScore += 10;
        if (hasWaterTank) comfortScore += 10;
        if (hasVitamins) comfortScore += 5;
        if (hasSaranWrap) comfortScore += 5;
        if (hasGloves) comfortScore += 5;
        if (hasCash) comfortScore += 5;
        if (hasGumTape) comfortScore += 5;
        if (hasEntertainment) comfortScore += 5;
        if (hasEarPlugs) comfortScore += 5;
        if (comfortScore > 100) comfortScore = 100;
        
        // --- 4. 称号決定 ---
        let title = "";
        const avgScore = (hygieneScore + powerScore + infoScore + comfortScore) / 4;
        const foodAndWaterAmount = (water / (totalPeople || 1)) + (food / (totalPeople || 1));
        if (foodAndWaterAmount > 100000) { title = "嘘つき 🤥"; } else if (foodAndWaterAmount > 50000) { title = "もはや宇宙 🌌"; } else if (foodAndWaterAmount > 20000) { title = "もはや地球 🌍"; } else if (foodAndWaterAmount > 7000) { title = "もはや国 🏛️"; } else if (survivalDays >= 30 && avgScore >= 95) { title = "防災神 👑"; } else if (survivalDays >= 30 && avgScore >= 80) { title = "孤高のサバイバリスト"; } else if (survivalDays >= 30 && avgScore >= 60) { title = "長期籠城の達人"; } else if (survivalDays >= 21 && avgScore >= 85) { title = "防災エリート"; } else if (survivalDays >= 21 && avgScore >= 70) { title = "冷静な戦略家"; } else if (survivalDays >= 14 && avgScore >= 80 && powerScore > 80 && comfortScore < 60) { title = "サバイバルエージェント 🕵️"; } else if (survivalDays >= 14 && avgScore >= 80 && comfortScore > 80 && powerScore < 60) { title = "防災マッチョ 💪"; } else if (survivalDays >= 14 && avgScore >= 75) { title = "周到な準備家"; } else if (survivalDays >= 14 && avgScore >= 60) { title = "頼れるご近所さん"; } else if (survivalDays >= 7 && foodWaterScore >= 95 && hygieneScore < 50) { title = "美食家サバイバー"; } else if (survivalDays >= 7 && powerScore >= 95 && foodWaterScore < 70) { title = "ガジェット籠城者"; } else if (survivalDays >= 7 && hygieneScore >= 95 && comfortScore < 50) { title = "潔癖症サバイバー"; } else if (survivalDays >= 7 && avgScore >= 60) { title = "備えある市民"; } else if (survivalDays >= 7 && avgScore >= 40) { title = "不安な一週間"; } else if (survivalDays >= 3 && avgScore >= 40) { title = "ギリギリ生存ライン"; } else if (survivalDays >= 3 && avgScore >= 20) { title = "備蓄欠乏症"; } else if (survivalDays < 3) { title = "防災ひよっこ"; } else { title = "分類不能なサバイバー"; }

        // --- 5. アドバイスと買い物リスト生成 ---
        const adviceList = document.getElementById('advice-list');
        adviceList.innerHTML = '';
        const shoppingList = [];
        let adviceFound = false;

        const addSuggestion = (adviceText, shoppingItem) => {
            const li = document.createElement('li');
            li.innerText = adviceText;
            adviceList.appendChild(li);
            adviceFound = true;
            if (shoppingItem) shoppingList.push(shoppingItem);
        };

        const allItems = [
            { condition: survivalDays >= 7, advice: "【最優先】水と食料が7日分に満たないようです。命に直結するため、何よりも先に備蓄しましょう。", item: { name: "備蓄水・食料 (7日分)", query: "防災 備蓄 食料 7日" } },
            { condition: hasHelmet, advice: "【安全確保】地震時の落下物から頭を守るヘルメットは、命を守る最重要アイテムの一つです。", item: { name: "防災ヘルメット", query: "防災 ヘルメット" } },
            { condition: hasPortableToilet, advice: "【衛生管理】災害時に最も深刻な問題の一つがトイレです。簡易トイレは衛生と尊厳を守る必需品です。", item: { name: "簡易トイレ", query: "防災 簡易トイレ" } },
            { condition: hasPowerStation || hasBattery, advice: "【情報・電力】停電に備え、情報収集や連絡に必須のスマホを維持するため、ポータブル電源やモバイルバッテリーを準備しましょう。", item: { name: "ポータブル電源", query: "ポータブル電源 大容量" } },
            { condition: hasRadio, advice: "【情報収集】スマホが使えない状況も想定し、電池不要の手回し充電ラジオで広域の情報を確保しましょう。", item: { name: "防災ラジオ", query: "防災ラジオ 手回し" } },
            { condition: hasSleepingBag, advice: "【防寒・睡眠】停電時、暖房は使えません。寝袋等は低体温症から命を守る重要なアイテムです。", item: { name: "寝袋・シュラフ", query: "寝袋 シュラフ 防災" } },
            { condition: hasLantern, advice: "【照明】ランタンがあれば空間全体が明るくなり、夜間の作業や食事が快適になります。懐中電灯との併用がおすすめです。", item: { name: "LEDランタン", query: "ledランタン 防災" } },
            { condition: hasGasStove && hasGasCanisters, advice: "【食生活の質向上】温かい食事は体と心を温めます。カセットコンロとボンベはセットで備えましょう。", item: { name: "カセットコンロ・ボンベ", query: "カセットコンロ" } },
            { condition: hasGarbageBags, advice: "【衛生管理】ゴミ袋は衛生管理だけでなく、防寒・防水など多様な使い方ができる万能品です。", item: { name: "大容量ゴミ袋", query: "ゴミ袋 45L 丈夫" } },
            { condition: hasWaterTank, advice: "【水確保】給水車が来た際に、一度に多くの水を確保できるポリタンクは非常に重要です。", item: { name: "ポリタンク (給水用)", query: "水 タンク 10l" } },
            { condition: hasFirstAid, advice: "【ケガ・病気】軽度のケガが命取りになることも。救急セットで基本的な応急処-置ができるようにしましょう。", item: { name: "救急セット", query: "救急セット 防災" } },
            { condition: hasSoap, advice: "【感染症対策】石鹸やアルコール消毒液による手洗いを徹底し、病気を予防しましょう。", item: { name: "石鹸・アルコール消毒液", query: "アルコール消毒液" } },
            { condition: hasPurifier, advice: "【水確保の多様化】携帯浄水器があれば、飲める水の選択肢が増え生存率が飛躍的に向上します。", item: {name: "携帯浄水器", query: "防災 携帯浄水器"} },
            { condition: hasSolarCharger, advice: "【電力の自給】ソーラー充電器があれば、長期的な電力確保への道が開けます。", item: { name: "ソーラー充電器", query: "ソーラーパネル 充電器" } },
            { condition: hasDeodorizingBags, advice: "【衛生環境の改善】簡易トイレのゴミや生ゴミの悪臭はストレスになります。防臭袋で衛生環境を保ちましょう。", item: { name: "防臭袋 (BOSなど)", query: "防臭袋 BOS" } },
            { condition: hasSaranWrap, advice: "【万能アイテム】サランラップは食器を汚さず節水になる他、防寒や応急処置にも使える万能品です。", item: { name: "サランラップ", query: "サランラップ 30cm" } },
            { condition: hasWhistle, advice: "【救助要請】瓦礫の下などに閉じ込められた際、ホイッスルは体力を消耗せず自分の居場所を知らせる最後の命綱になります。", item: {name: "ホイッスル 防災", query: "ホイッスル 防災"} },
            { condition: hasGloves, advice: "【手の保護】片付けや作業時の手のケガを防ぐため、軍手や作業用手袋を用意しましょう。", item: { name: "作業用手袋", query: "防災 軍手" } },
            { condition: hasVitamins, advice: "【健康維持】偏りがちな避難生活の栄養を補い、体調不良を防ぐためにビタミン剤も有効です。", item: { name: "ビタミン剤", query: "マルチビタミン サプリメント" } },
            { condition: hasWetWipes, advice: "【衛生】断水時にお風呂の代わりになるウェットティッシュは、体を清潔に保ち気分をリフレッシュさせます。", item: { name: "からだふきシート", query: "からだふきシート 大判" } },
            { condition: hasDisposableDishes, advice: "【節水】使い捨ての食器や割り箸は、洗い物を無くし貴重な水を節約するのに役立ちます。", item: { name: "使い捨て食器セット", query: "紙皿 割り箸 セット" } },
            { condition: hasCash, advice: "【決済手段】停電に備え、電子マネーに頼らない現金（特に小銭）を用意しておきましょう。", item: null },
            { condition: hasEntertainment, advice: "【心の健康】長期の避難生活では心の健康も重要。電気不要の娯楽品が役立ちます。", item: { name: "娯楽品 (本・ゲームなど)", query: "ボードゲーム" } }
        ];

        allItems.forEach(s => {
            if (!s.condition) {
                addSuggestion(s.advice, s.item);
            }
        });

        if (!adviceFound) {
            addSuggestion("素晴らしい備えです！ほぼ完璧と言えるでしょう。この防災意識を維持してください。", null);
        }
        
        // --- 6. 結果の表示 ---
        const resultArea = document.getElementById('result-area');
        const comparisonArea = document.getElementById('comparison-area');
        const comparisonText = document.getElementById('comparison-text');
        const previousResult = JSON.parse(localStorage.getItem('bousaiResult'));
        if (previousResult) { const daysDiff = survivalDays - previousResult.days; let daysComparison = ''; if (daysDiff > 0) { daysComparison = `生存日数が前回より <span class="up">${daysDiff}日</span> 延びました！🎉`; } else if (daysDiff < 0) { daysComparison = `生存日数が前回より <span class="down">${Math.abs(daysDiff)}日</span> 減りました...`; } else { daysComparison = '生存日数は前回と変わりありません。'; } comparisonText.innerHTML = `${daysComparison}<br>前回の称号: <strong>${previousResult.title}</strong>`; comparisonArea.style.display = 'block'; } else { comparisonArea.style.display = 'none'; }
        document.getElementById('bousai-title').innerText = title;
        document.getElementById('survival-days').innerText = survivalDays;
        const titleImageElement = document.getElementById('bousai-title-image');
        if (titleImages[title]) { titleImageElement.src = titleImages[title]; titleImageElement.style.display = 'block'; } else { titleImageElement.style.display = 'none'; }
        const shoppingListUl = document.getElementById('shopping-list');
        shoppingListUl.innerHTML = '';
        if(shoppingList.length > 0) {
            const uniqueShoppingList = [...new Map(shoppingList.map(item => [item.name, item])).values()];
            uniqueShoppingList.forEach(item => {
                const li = document.createElement('li');
                if (item.query) {
                    const amazonUrl = `https://www.amazon.co.jp/s?k=${encodeURIComponent(item.query)}`;
                    const rakutenUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(item.query)}/`;
                    li.innerHTML = `${item.name}<span class="shopping-links"><a href="${amazonUrl}" target="_blank" rel="noopener noreferrer">(Amazonで探す)</a><a href="${rakutenUrl}" target="_blank" rel="noopener noreferrer">(楽天で探す)</a></span>`;
                } else {
                    li.innerText = item.name;
                }
                shoppingListUl.appendChild(li);
            });
        } else {
             const li = document.createElement('li');
             li.innerText = "素晴らしい！必需品に大きな不足はなさそうです。";
             shoppingListUl.appendChild(li);
        }

        // --- 7. レーダーチャートの描画 ---
        const chartScores = [ { name: '食料・水', score: foodWaterScore }, { name: '衛生', score: hygieneScore }, { name: '電力', score: powerScore }, { name: '情報', score: infoScore }, { name: '快適・安全', score: comfortScore } ];
        const ctx = document.getElementById('radar-chart').getContext('2d');
        if (myRadarChart) myRadarChart.destroy();
        myRadarChart = new Chart(ctx, { type: 'radar', data: { labels: chartScores.map(s => s.name), datasets: [{ label: '防災スコア', data: chartScores.map(s => s.score), backgroundColor: 'rgba(0, 255, 0, 0.3)', borderColor: '#00ff00', pointBackgroundColor: '#00ff00', pointBorderColor: '#1a1a1a', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: '#00ff00' }] }, options: { scales: { r: { angleLines: { color: '#666' }, grid: { color: '#666' }, pointLabels: { font: { size: 14 }, color: '#e0e0e0' }, ticks: { color: '#e0e0e0', backdropColor: 'rgba(42, 42, 42, 0.8)' }, suggestedMin: 0, suggestedMax: 100 } }, plugins: { legend: { display: false } } } });

        // --- 8. SNS共有ボタンの更新 ---
        const tweetText = `私の防災診断結果\n【${title}】生存可能日数: ${survivalDays}日\n\n戦闘力\n食料・水: レベル${Math.round(foodWaterScore)}\n衛生: レベル${Math.round(hygieneScore)}\n電力: レベル${Math.round(powerScore)}\n情報: レベル${Math.round(infoScore)}\n快適・安全: レベル${Math.round(comfortScore)}\n\n#BousAI #ひきこもり防災診断`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
        document.getElementById('tweet-button').href = tweetUrl;

        // --- 9. 結果の保存 ---
        const currentResult = { days: survivalDays, title: title, scores: chartScores };
        localStorage.setItem('bousaiResult', JSON.stringify(currentResult));
        
        // 最後にローディング画面を非表示にする
        overlay.style.display = 'none';
        resultArea.style.display = 'block';
        resultArea.scrollIntoView({ behavior: 'smooth' });

    }, 4000); 
}