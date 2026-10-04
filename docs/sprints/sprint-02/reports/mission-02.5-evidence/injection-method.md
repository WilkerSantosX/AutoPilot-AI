# Método de injeção controlada — missão 02.5

Apoio temporário executado fora do repositório; código da aplicação servido sem alteração. Salve o bloco como arquivo Python temporário e execute com Python 3.11.3. Acesse http://localhost:18766/__mission.html e opere as opções registradas em injected-observations.json. `preserve` mantém o valor; `stay` não navega. Respostas `valid` são sintéticas, não um percurso manual. O botão de inspeção relê o estado após transições assíncronas. Use uma origem exclusivamente sintética.

```python
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json
root = Path(r'C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI/apps/autopilot-web')
evidence = root.parents[1] / 'docs/sprints/sprint-02/reports/mission-02.5-evidence'
panel = '''
<aside id="mission-panel" style="background:white;color:black;padding:12px;position:relative;z-index:9999;font:14px Arial">
<h2>Apoio temporário da missão 02.5</h2>
<label>Storage sintético <select id="test-storage"><option>preserve</option><option>absent</option><option>corrupt</option><option>schema</option><option>invalid</option><option>toyota</option><option>honda</option><option>readfail</option><option>writefail</option><option>getterfail</option><option>restore</option></select></label>
<label>Respostas sintéticas <select id="test-answers"><option>preserve</option><option>empty</option><option>incomplete</option><option>invalid</option><option>valid</option></select></label>
<label>Destino de teste <select id="test-target"><option>stay</option><option>landing</option><option>questionnaire</option><option>hero</option><option>cockpit</option><option>vehicle-profile</option></select></label>
<button id="test-apply">Aplicar estado sintético</button><button id="test-snapshot">Inspecionar estado de teste</button><pre id="test-output" style="white-space:pre-wrap"></pre>
</aside>
<script type="module">
import {AppState,goToScreen} from './router.js';
import {createVehicleProfile} from './vehicle/vehicleModel.js';
import {Questions} from './data/questions.js';
const key='autopilot.vehicle-profile.v1';
const real=window.localStorage;
const original=Object.getOwnPropertyDescriptor(window,'localStorage');
let mode='normal';
function restore(){if(original)Object.defineProperty(window,'localStorage',original);else delete window.localStorage;mode='normal';}
function seed(which){return createVehicleProfile(which==='toyota'?{manufacturer:'Toyota',model:'Corolla',year:2020,engine:'2.0',fuelType:'Flex',mileage:0}:{manufacturer:'Honda',model:'Civic',year:2022,engine:'1.5 Turbo',fuelType:'Gasolina',mileage:42000},{id:which+'-mission-025',now:'2026-10-04T12:00:00Z'}).profile;}
function snapshot(){let raw=real.getItem(key);document.getElementById('test-output').textContent=JSON.stringify({mode,screen:AppState.currentScreen,answerVehicleId:AppState.answerVehicleId,answers:AppState.answers,storage:raw?JSON.parseSafe(raw):null,userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight},scrollWidth:document.documentElement.scrollWidth},null,2);}
JSON.parseSafe=x=>{try{return JSON.parse(x)}catch{return x}};
document.getElementById('test-apply').onclick=()=>{
 const s=document.getElementById('test-storage').value,a=document.getElementById('test-answers').value,t=document.getElementById('test-target').value;
 if(s!=='preserve'){restore();if(s==='absent')real.removeItem(key);if(s==='corrupt')real.setItem(key,'{broken');if(s==='schema')real.setItem(key,JSON.stringify({...seed('toyota'),schemaVersion:2}));if(s==='invalid')real.setItem(key,JSON.stringify({...seed('toyota'),mileage:-1}));if(['toyota','honda'].includes(s))real.setItem(key,JSON.stringify(seed(s)));
 if(['readfail','writefail'].includes(s)){mode=s;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>{if(mode==='readfail')throw new DOMException('synthetic read','SecurityError');return real.getItem(k)},setItem:(k,v)=>{if(mode==='writefail')throw new DOMException('synthetic write','QuotaExceededError');return real.setItem(k,v)}}});}
 if(s==='getterfail'){mode=s;Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new DOMException('synthetic getter','SecurityError')}});}}
 if(a!=='preserve'){let p=JSON.parseSafe(real.getItem(key));AppState.answerVehicleId=p?.id??null;AppState.answers={};if(a!=='empty'){for(const q of Questions)AppState.answers[q.id]={questionId:q.id,value:q.options[0],answeredAt:'2026-10-04T12:00:00Z'};if(a==='incomplete')delete AppState.answers[3];if(a==='invalid')AppState.answers[2].value='invalid-test-option';}}
 if(t!=='stay')goToScreen(t);snapshot();
};
document.getElementById('test-snapshot').onclick=snapshot;
snapshot();
</script>
'''
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(root),**kw)
 def do_GET(self):
  if self.path.split('?')[0]=='/__mission.html':
   body=root.joinpath('index.html').read_text(encoding='utf-8').replace('</body>',panel+'</body>').encode()
   self.send_response(200);self.send_header('Content-type','text/html; charset=utf-8');self.end_headers();self.wfile.write(body)
  else:super().do_GET()
 def log_message(self,fmt,*args):
  entry={'path':self.path,'message':fmt%args,'userAgent':self.headers.get('User-Agent')}
  with evidence.joinpath('http-harness.jsonl').open('a',encoding='utf-8') as f:f.write(json.dumps(entry)+'\n')
  print(json.dumps(entry),flush=True)
ThreadingHTTPServer(('127.0.0.1',18766),Handler).serve_forever()
```
