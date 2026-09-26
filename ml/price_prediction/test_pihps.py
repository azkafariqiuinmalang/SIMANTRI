import requests

url = 'https://www.bi.go.id/hargapangan/WebSite/Home/GetGridData1'
for pasokan in [0, 1]:
    for jenis in [1, 2]:
        for pt in [1, 2, 3, 4]:
            params = {
                'tanggal': 'Sep 25, 2026',
                'commodity': '5_11',
                'priceType': str(pt),
                'isPasokan': str(pasokan),
                'jenis': str(jenis),
                'periode': '1',
                'provId': '16'
            }
            try:
                res = requests.get(url, params=params, headers={'User-Agent': 'Mozilla/5.0'}).json()
                data = res.get('data', [])
                if data:
                    print(f"pt={pt}, isPasokan={pasokan}, jenis={jenis} -> Nilai={data[0].get('Nilai')}")
            except Exception as e:
                pass
