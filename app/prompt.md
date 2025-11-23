# 財政調整変数γの算出方法prompt

1. `app/public/data/actual_total_dict.json`を読み込んで、`actual_total`を取得し、`current_total`として値を保持し、`BI_total`を取得し、`BI_total`として値を保持。
2. 収入逓減率α`alpha`, 世帯構成補正β`beta_values`をフォーム入力から取得。
`beta_values`は各入力から以下のように登録。
```
beta_values: {
        "single_young": 大人(1) * 単身世帯(1) , 
        "single_elder": 高齢者 * 単身世帯(1), 
        "couple_young": 大人(1) * 複数人世帯, 
        "couple_elder": 高齢者 * 複数人世帯, 
        "child": 子供 * 複数人世帯 
    }

```

3. `app/public/data/persons_10k_preprocessed.json`を読み込んで、`persons`として値を保持。`persons`のkeyは`person_id`となっており、各`person`ごとに以下の処理を行う。
以下のpythonコードのアルゴリズムをtype scriptに翻訳し、取得したパラメータを使って`gamma`を計算する。

```python
beta_deduct_income_total = 0.0
for person in persons:
    # 収入_親と年齢を取得
    parent_income = float(person.get('収入_親', 0))
    age = person.get('年齢')  # 自分の年齢

    household_id = str(person.get('household_id', ''))
    if not household_id:
        continue

    household_type = person.get('世帯タイプ', None)
    beta = beta_values[household_type]
    alpha_offset = 1_000_000

    # 累進課税収入の計算
    if alpha_offset > 0 and parent_income > 0:
        deduct_income = alpha_offset * ((parent_income / alpha_offset) ** alpha)
    else:
        deduct_income = 0.0

    # beta適用
    beta_deduct_income = deduct_income * beta
    beta_deduct_income_total += beta_deduct_income

# current_total = gamma * beta_deduct_income_total + BI_total のため、gammaは以下の式で算出
gamma = (current_total - BI_total) / beta_deduct_income_total

```

4. 算出した`gamma`をページの`財政調整変数γ`の値として表示する。


# 収入逓減率αによるグラフ表示方法

以下のpythonコードと取得済みのαの値を参考にして、同様のグラフをtypescriptで表示するようにして。 
グラフの横軸は1億円までの範囲でスケールをユーザーが調整できるようにする。縦軸は横軸と同じスケール・アスペクトを維持するようにする。
目盛りの単位は万円単位で表示するようにする。


```python

# income_tax_listに基づいて所得税引き後の金額をグラフ化. 累進課税率のグラフ
income_tax_list = [
    {
        "income_range": (1000, 1_949_000),  
        "tax_rate": 0.05,
        "deduction": 0,
    },
    {
        "income_range": (1_950_000, 3_299_000),
        "tax_rate": 0.1,
        "deduction": 97_500,
    },
    {
        "income_range": (3_300_000, 6_949_000),
        "tax_rate": 0.2,
        "deduction": 427_500,
    },
    {   
        "income_range": (6_950_000, 8_999_000),
        "tax_rate": 0.23,
        "deduction": 636_000,
    },
    {
        "income_range": (9_000_000, 17_999_000),
        "tax_rate": 0.33,
        "deduction": 1_536_000,
    },
    {
        "income_range": (18_000_000, 39_999_000),
        "tax_rate": 0.4,
        "deduction": 2_796_000,
    },
    {
        "income_range": (40_000_000, float('inf')),
        "tax_rate": 0.45,
        "deduction": 4_796_000,
    },
]

x_max = 10_000_000  # NOTE: アプリでは1億円までの範囲で横軸のスケールを調整できるようにする
income_range = np.linspace(0, x_max, 10000)  

# 所得税引き後の金額を計算する関数
def calculate_after_tax_income(income):
    """所得から所得税を引いた金額を計算"""
    for tax_info in income_tax_list:
        min_income, max_income = tax_info['income_range']
        if min_income <= income <= max_income:
            tax = income * tax_info['tax_rate'] - tax_info['deduction']
            # 所得税が負の値にならないようにする
            tax = max(0, tax)
            return income - tax
    # 範囲外の場合は所得税なし
    return income

# 各所得に対する所得税引き後の金額を計算
after_tax_incomes = [calculate_after_tax_income(inc) for inc in income_range]

# グラフを描画
plt.plot(income_range, after_tax_incomes, label='従来所得税引き後の金額', linewidth=2, color='blue')

# 逓減率αの累進課税
# 100万 * (値 / 100万) ** α を計算（万円単位）
# xが0の場合は0を返す
y_alpha = np.where(income_range / 1_000_000 > 0, 
                1_000_000 * ((income_range / 1_000_000) ** alpha), 0)
plt.plot(income_range, y_alpha, linewidth=2, color='red', label=f"α={alpha}")

plt.plot(income_range, income_range, label='所得（比較用）', linewidth=2, linestyle='--', color='gray', alpha=0.7)

# 横軸と縦軸を万円単位で表示

plt.xlabel('所得（万円）')
plt.ylabel('金額（万円）')
plt.title('所得税引き後の金額')
plt.legend()
plt.show()

```


# 世帯のBI, 余剰額を計算
以下の手順で、入力された世帯情報からBI, 余剰額を計算してページに表示して。
1. 入力された世帯員ごとの情報を以下のフォーマットで保持する。
``` json
{
    "世帯一覧": {
        "世帯1": {
            "親一覧": ["親1"],  // 同一世帯内の18歳以上の世帯員を2人まで"親N"の形式で保持
            "子一覧": [],  // 同一世帯内の18歳未満の世帯員を"子N"の形式で保持
            "祖父母一覧": [], // 同一世帯内の3人目以降の18歳以上の世帯員を"祖父母N"の形式で保持
            "居住都道府県": {
                "2025-11-01": "神奈川県"  // 固定
            },
            "居住市区町村": {
                "2025-11-01": "横浜市"  // 固定
            },
            "生活保護": {
                "2025-11-01": null  // 固定
            },
            "児童手当": {
                "2025-11-01": null  // 固定
            },
            "児童扶養手当_最小": {
                "2025-11-01": null  // 固定
            }
        }
    },
    "世帯員": {
        "親1": { // "親N"は全世帯で一意なID. 世帯員が追加されるたびに追加. 子N, 祖父母Nについても同様  
            "誕生年月日": {
                "ETERNITY": "{2025 - 年齢}-01-01" // 2025年11月1日時点の年齢を考慮して誕生日を設定
            },
            "性別": {
                "2025-11-01": "男性" | "女性" | "その他" // "男"->"男性", "女"->"女性"に変換
            },
            "収入": {
                "2025-11-01": 0 // ユーザー入力を用いず0固定
            },
            "控除後所得": null  // 固定
        }
    }    
}
```

2. 上記のjsonを`https://openfisca-japan-ijgkugdoka-uc.a.run.app/calculate`にPOSTして、同じフォーマットで`null`が代入されたレスポンスを取得する。

3. レスポンスから、世帯ごとに"生活保護", "児童手当", "児童扶養手当_最小"の値を取得して、合計して12倍(月額→年額)し、最低生活保障`bi`の値とする。

4. 世帯に`子`がいる場合、`親`のユーザー入力された収入の平均を計算し、`子`の収入とする。（2人親の場合、親1と親2の収入の平均を計算する。）

5. 下記のpythonコードを参考に、各世帯員に対して、自分の年齢と所属世帯の世帯員数をもとに、`household_type`を設定する。
```python
# 世帯タイプ分類
if age < 18:  # 自分が児童. 児童のみの単身世帯はない
    household_type = "child"
elif age < 65:  # 現役世代
    if len(household_persons) == 1:  # 単身世帯  
        household_type = "single_young"
    else:
        household_type = "couple_young"
else:  # 高齢世代
    if len(household_persons) == 1:
        household_type = "single_elder"
    else:
        household_type = "couple_elder"
```

6. 設定された`household_type`と、ユーザー入力から既に求めた以下の`beta_values`をもとに、世帯員ごとに`beta`を計算する。
```
beta_values: {
    "single_young": 大人(1) * 単身世帯(1) , 
    "single_elder": 高齢者 * 単身世帯(1), 
    "couple_young": 大人(1) * 複数人世帯, 
    "couple_elder": 高齢者 * 複数人世帯, 
    "child": 子供 * 複数人世帯 
}

```

7. 世帯員ごとに、各パラメータと、自分の収入(`子`の場合は計算した`親`の平均収入)から、下記のように余剰額を計算する。

```python
surplus = gamma * beta * alpha_offset * ((parent_income / alpha_offset) ** alpha)

```

8. 世帯ごとに、以下をページに表示する。
- "合計 (A)+(B)": `bi + sum(surplus)`の額(万円単位)  # (最低生活保障) + (余剰額の世帯員総和)
- "最低生活保障 (A)": `bi`の額(万円単位)
- "余剰額 (B)": `sum(surplus)`の額(万円単位)