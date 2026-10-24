# Önizleme sayfasını üretir: uygulama (Claude sürümü) + Android taklidi + canlı widget'lar
import base64, json, sys
app=open('/home/user/hafif-kaynak/artifact.html',encoding='utf8').read()
mock=open('taklit.js',encoding='utf8').read()
t=open('sablon.html',encoding='utf8').read()
t=t.replace('__APP_B64__',base64.b64encode(app.encode('utf8')).decode()).replace('__MOCK_JSON__',json.dumps(mock))
out=sys.argv[1]
open(out,'w',encoding='utf8').write(t)
print(out,len(t))
