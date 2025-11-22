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