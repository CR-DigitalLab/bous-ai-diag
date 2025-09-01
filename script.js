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
    // まずローディング画面を表示する
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'flex';

    // 4秒後に診断結果を計算・表示する
    setTimeout(() => {
        
        // --- 1. 入力値の取得 ---
        const adults = parseInt(document.getElementById('adults').value) || 0;
        const children = parseInt(document.getElementById('children').value) || 0;
        const totalPeople = adults + children;

        const dogs = parseInt(document.getElementById('dogs').value) || 0;
        const cats = parseInt(document.getElementById('cats').value) || 0;
        const totalPets = dogs + cats;
        const housingType = document.querySelector('input[name="housing"]:checked').value;

        if (totalPeople === 0) {
            alert("人数を1人以上入力してください。");
            overlay.style.display = 'none'; // エラー時はオーバーレイを消す
            return;
        }

        // 食料・水
        const water = parseFloat(document.getElementById('water').value) || 0;
        const food = parseInt(document.getElementById('food').value) || 0;
        const hasPurifier = document.getElementById('purifier').checked;
        const toiletPaper = parseInt(document.getElementById('toilet-paper').value) || 0;
        const hasPortableToilet = document.getElementById('portable-toilet').checked;
        const hasWetWipes = document.getElementById('wet-wipes').checked;
        const hasToothbrush = document.getElementById('toothbrush').checked;
        const hasSoap = document.getElementById('soap').checked;
        const hasDryShampoo = document.getElementById('dry-shampoo').checked;
        const hasMask = document.getElementById('mask').checked;
        const hasBattery = document.getElementById('battery').checked;
        const hasFlashlight = document.getElementById('flashlight').checked;
        const hasDryCell = document.getElementById('dry-cell').checked;
        const hasRadio = document.getElementById('radio').checked;
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
        const requiredWaterPerDay = (adults * 3) + (children * 2) + (dogs * 0.5) + (cats * 0.3);
        const requiredFoodPerDay = (adults * 3) + (children * 3) + (dogs * 2) + (cats * 2);
        let waterDays = requiredWaterPerDay > 0 ? Math.floor(water / requiredWaterPerDay) : 999;
        const foodDays = requiredFoodPerDay > 0 ? Math.floor(food / requiredFoodPerDay) : 999;
        if (hasPurifier) {
            waterDays += 21;
        }
        const survivalDays = Math.min(waterDays, foodDays);

        // --- 3. レーダーチャート用スコア計算 ---
        let foodWaterScore = Math.min(survivalDays / 7, 1) * 80 + (hasPurifier ? 20 : 0);
        if (foodWaterScore > 100) foodWaterScore = 100;
        let hygieneScore = 0;
        if (toiletPaper / (totalPeople + totalPets) >= 12) hygieneScore += 20;
        if (hasPortableToilet) hygieneScore += 35;
        if (hasWetWipes) hygieneScore += 10;
        if (hasToothbrush) hygieneScore += 10;
        if (hasSoap) hygieneScore += 10;
        if (hasDryShampoo) hygieneScore += 5;
        if (hasMask) hygieneScore += 10;
        let powerScore = 0;
        if(hasBattery) powerScore += 50;
        if(hasFlashlight) powerScore += 30;
        if(hasDryCell) powerScore += 20;
        let infoScore = hasRadio ? 100 : 0;
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
        if (totalPets > 0) comfortScore += 5;
        if (comfortScore > 100) comfortScore = 100;

        // --- 4. 称号決定 ---
        let title = "";
        const avgScore = (hygieneScore + powerScore + infoScore + comfortScore) / 4;
        const foodAndWaterAmount = (water / (totalPeople || 1)) + (food / (totalPeople || 1));
        if (foodAndWaterAmount > 100000) { title = "嘘つき 🤥"; } else if (foodAndWaterAmount > 50000) { title = "もはや宇宙 🌌"; } else if (foodAndWaterAmount > 20000) { title = "もはや地球 🌍"; } else if (foodAndWaterAmount > 7000) { title = "もはや国 🏛️"; } else if (survivalDays >= 30 && avgScore >= 95) { title = "防災神 👑"; } else if (survivalDays >= 30 && avgScore >= 80) { title = "孤高のサバイバリスト"; } else if (survivalDays >= 30 && avgScore >= 60) { title = "長期籠城の達人"; } else if (survivalDays >= 21 && avgScore >= 85) { title = "防災エリート"; } else if (survivalDays >= 21 && avgScore >= 70) { title = "冷静な戦略家"; } else if (survivalDays >= 14 && avgScore >= 80 && powerScore > 80 && comfortScore < 60) { title = "サバイバルエージェント 🕵️"; } else if (survivalDays >= 14 && avgScore >= 80 && comfortScore > 80 && powerScore < 60) { title = "防災マッチョ 💪"; } else if (survivalDays >= 14 && avgScore >= 75) { title = "周到な準備家"; } else if (survivalDays >= 14 && avgScore >= 60) { title = "頼れるご近所さん"; } else if (survivalDays >= 7 && foodWaterScore >= 95 && hygieneScore < 50) { title = "美食家サバイバー"; } else if (survivalDays >= 7 && powerScore >= 95 && foodWaterScore < 50) { title = "ガジェット籠城者"; } else if (survivalDays >= 7 && hygieneScore >= 95 && comfortScore < 50) { title = "潔癖症サバイバー"; } else if (survivalDays >= 7 && avgScore >= 60) { title = "備えある市民"; } else if (survivalDays >= 7 && avgScore >= 40) { title = "不安な一週間"; } else if (survivalDays >= 3 && avgScore >= 40) { title = "ギリギリ生存ライン"; } else if (survivalDays >= 3 && avgScore >= 20) { title = "備蓄欠乏症"; } else if (survivalDays < 3) { title = "防災ひよっこ"; } else { title = "分類不能なサバイバー"; }

        // --- 5. アドバイスと買い物リスト生成 ---
        const adviceList = document.getElementById('advice-list');
        adviceList.innerHTML = '';
        const shoppingList = [];
        let adviceFound = false;
        const addSuggestion = (adviceText, needs, shoppingItem) => {
            const li = document.createElement('li');
            li.innerText = adviceText;
            adviceList.appendChild(li);
            adviceFound = true;
            if (needs && shoppingItem) { shoppingList.push(shoppingItem); }
        };
        if (survivalDays < 7) { addSuggestion("水と食料が1週間分に満たないようです。命に直結するため最優先で備蓄しましょう。", true, {name: "備蓄水・食料", query: "防災 備蓄 食料 7日"}); }
        if (totalPets > 0 && foodDays < 14) { addSuggestion("ペット用の食料・水も忘れずに。最低でも2週間分は確保しておくと安心です。", true, {name: "ペットフード・水", query: "ペット防災セット"});}
        if (survivalDays < 30 && !hasPurifier) { addSuggestion("携帯浄水器があれば、飲める水の選択肢が増え生存率が飛躍的に向上します。", !hasPurifier, {name: "携帯浄水器", query: "防災 携帯浄水器"}); }
        if (!hasPortableToilet) { addSuggestion("災害時に最も困るのがトイレです。簡易トイレは衛生と尊厳を守る必需品です。", !hasPortableToilet, {name: "簡易トイレ", query: "防災 簡易トイレ"}); }
        if (housingType === 'マンション' && !hasPortableToilet) { addSuggestion("特にマンションでは断水が長期化する可能性があります。簡易トイレの重要度は非常に高いです。", !hasPortableToilet, {name: "簡易トイレ 大容量", query: "防災 簡易トイレ 100回"}); }
        if (!hasSaranWrap) { addSuggestion("サランラップは食器を汚さず節水になる他、防寒や応急処置にも使える万能品です。", !hasSaranWrap, {name: "サランラップ", query: "サランラップ 30cm"}); }
        if (!hasBattery) { addSuggestion("情報収集や連絡に必須のスマホを守るため、大容量モバイルバッテリーを準備しましょう。", !hasBattery, {name: "モバイルバッテリー", query: "防災 モバイルバッテリー 大容量"}); }
        if (!hasRadio) { addSuggestion("スマホが使えない状況も想定し、電池不要の手回し充電ラジオで情報を確保しましょう。", !hasRadio, {name: "防災ラジオ", query: "防災ラジオ 手回し"}); }
        if (!hasCash) { addSuggestion("停電に備え、電子マネーに頼らない現金（特に小銭）を用意しておきましょう。", !hasCash, null); }
        if (!hasEntertainment) { addSuggestion("長期の避難生活では心の健康も重要。電気不要の娯楽品（本やカードゲームなど）が役立ちます。", !hasEntertainment, {name: "娯楽品 (本・ゲームなど)", query: "ボードゲーム"}); }
        if (!adviceFound) { const li = document.createElement('li'); li.innerText = "素晴らしい備えです！ほぼ完璧と言えるでしょう。この防災意識を維持してください。"; adviceList.appendChild(li); }

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
        if(shoppingList.length > 0) { const uniqueShoppingList = [...new Map(shoppingList.map(item => [item.name, item])).values()]; uniqueShoppingList.forEach(item => { const li = document.createElement('li'); li.innerHTML = `${item.name} <a href="https://www.amazon.co.jp/s?k=${encodeURIComponent(item.query)}" target="_blank" rel="noopener noreferrer">(Amazonで探す)</a>`; shoppingListUl.appendChild(li); }); } else { const li = document.createElement('li'); li.innerText = "素晴らしい！必需品に大きな不足はなさそうです。"; shoppingListUl.appendChild(li); }

        // --- 7. レーダーチャートの描画 ---
        const chartScores = [ { name: '食料・水', score: foodWaterScore }, { name: '衛生', score: hygieneScore }, { name: '電力', score: powerScore }, { name: '情報', score: infoScore }, { name: '快適・安全', score: comfortScore } ];
        const ctx = document.getElementById('radar-chart').getContext('2d');
        if (myRadarChart) myRadarChart.destroy();
        myRadarChart = new Chart(ctx, { type: 'radar', data: { labels: chartScores.map(s => s.name), datasets: [{ label: '防災スコア', data: chartScores.map(s => s.score), backgroundColor: 'rgba(0, 255, 0, 0.3)', borderColor: '#00ff00', pointBackgroundColor: '#00ff00', pointBorderColor: '#1a1a1a', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: '#00ff00' }] }, options: { scales: { r: { angleLines: { color: '#666' }, grid: { color: '#666' }, pointLabels: { font: { size: 14 }, color: '#e0e0e0' }, ticks: { color: '#e0e0e0', backdropColor: 'rgba(42, 42, 42, 0.8)' }, suggestedMin: 0, suggestedMax: 100 } }, plugins: { legend: { display: false } } } });

        // --- 8. SNS共有ボタンの更新 ---
        const tweetText = `私の防災タイプは【${title}】でした！\n備蓄だけで暮らせる日数は【${survivalDays}日】です。\n\n#BousAI #ひきこもり防災診断`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
        document.getElementById('tweet-button').href = tweetUrl;

        // --- 9. 結果の保存 ---
        const currentResult = { days: survivalDays, title: title, scores: chartScores };
        localStorage.setItem('bousaiResult', JSON.stringify(currentResult));
        
        // 最後にローディング画面を非表示にする
        overlay.style.display = 'none';
        resultArea.style.display = 'block';
        resultArea.scrollIntoView({ behavior: 'smooth' });

    }, 4000); // 4000ミリ秒 = 4秒の待ち時間
}