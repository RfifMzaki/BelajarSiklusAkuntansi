/* Accounting engine: no DOM code. Single source of truth = journal entries in localStorage. Money = integer Rupiah. */
(function(){
var A=function(c,i,e,t,n){return{code:c,id:i,en:e,type:t,normal:n}};
var COA=[A('1101','Kas','Cash','asset','D'),A('1102','Piutang Usaha','Accounts Receivable','asset','D'),A('1103','Perlengkapan','Supplies','asset','D'),
A('1104','Sewa Dibayar Dimuka','Prepaid Rent','asset','D'),A('1201','Peralatan','Equipment','asset','D'),
A('1202','Akumulasi Penyusutan Peralatan','Accumulated Depreciation - Equipment','asset','C'),
A('2101','Utang Usaha','Accounts Payable','liability','C'),A('2102','Utang Gaji','Salaries Payable','liability','C'),A('2103','Pendapatan Diterima di Muka','Unearned Revenue','liability','C'),
A('3101','Modal Pemilik','Owner\'s Capital','equity','C'),A('3102','Prive','Owner\'s Drawings','equity','D'),
A('4101','Pendapatan Jasa','Service Revenue','revenue','C'),
A('5101','Beban Gaji','Salaries Expense','expense','D'),A('5102','Beban Sewa','Rent Expense','expense','D'),A('5103','Beban Perlengkapan','Supplies Expense','expense','D'),
A('5104','Beban Penyusutan','Depreciation Expense','expense','D'),A('5105','Beban Utilitas','Utilities Expense','expense','D')];
var KEY='alab.journal.v1';
function byCode(c){return COA.filter(function(a){return a.code===c})[0]}
function validDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return false;var t=Date.parse(s+'T00:00:00Z');return !isNaN(t)&&new Date(t).toISOString().slice(0,10)===s}
function validate(e){
 var er=[];if(!e||!validDate(e.date))er.push({k:'e.date'});
 if(!e||!String(e.desc||'').trim())er.push({k:'e.desc'});
 var ls=(e&&e.lines)||[],d=0,c=0;if(ls.length<2)er.push({k:'e.lines'});
 ls.forEach(function(l,i){
  if(!byCode(l.code))er.push({k:'e.acct',p:{n:i+1}});
  var dv=l.debit||0,cv=l.credit||0;
  if(!Number.isSafeInteger(dv)||!Number.isSafeInteger(cv)||dv<0||cv<0||(dv>0)===(cv>0))er.push({k:'e.amt',p:{n:i+1}});else{d+=dv;c+=cv}});
 if(!er.length&&d!==c)er.push({k:'e.unbal',p:{d:d,c:c}});
 return er}
function load(){try{var r=JSON.parse(localStorage.getItem(KEY));return Array.isArray(r)?r.filter(function(e){return e&&e.id&&!validate(e).length}):[]}catch(x){return[]}}
function save(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true}catch(x){return false}}
function sig(e){return e.date+'|'+e.desc.trim().toLowerCase()+'|'+e.lines.map(function(l){return l.code+':'+(l.debit||0)+':'+(l.credit||0)}).join(',')}
function upsert(e){
 var er=validate(e);if(er.length)return{ok:false,errors:er};
 var a=load();if(a.some(function(x){return x.id!==e.id&&sig(x)===sig(e)}))return{ok:false,errors:[{k:'e.dup'}]};
 var i=a.map(function(x){return x.id}).indexOf(e.id);
 if(i>=0)a[i]=e;else{e.id=Date.now().toString(36)+Math.random().toString(36).slice(2,6);a.push(e)}
 return save(a)?{ok:true}:{ok:false,errors:[{k:'e.store'}]}}
function remove(id){save(load().filter(function(e){return e.id!==id}))}
function clear(){save([])}
var S=[['2026-10-01','Setoran modal pemilik / Owner investment',[['1101','D',50000000],['3101','C',50000000]]],
['2026-10-02','Beli peralatan tunai / Equipment bought for cash',[['1201','D',12000000],['1101','C',12000000]]],
['2026-10-03','Beli perlengkapan kredit / Supplies bought on credit',[['1103','D',2000000],['2101','C',2000000]]],
['2026-10-05','Sewa 6 bulan dibayar di muka / 6 months rent prepaid',[['1104','D',6000000],['1101','C',6000000]]],
['2026-10-10','Pendapatan jasa tunai / Cash service revenue',[['1101','D',9000000],['4101','C',9000000]]],
['2026-10-15','Jasa secara kredit / Service on credit',[['1102','D',7000000],['4101','C',7000000]]],
['2026-10-20','Penagihan piutang / Receivable collected',[['1101','D',3000000],['1102','C',3000000]]],
['2026-10-25','Bayar gaji / Salaries paid',[['5101','D',4000000],['1101','C',4000000]]],
['2026-10-31','Penyesuaian sewa 6.000.000/6 / Adjust prepaid rent',[['5102','D',1000000],['1104','C',1000000]]],
['2026-10-31','Perlengkapan terpakai / Supplies used',[['5103','D',500000],['1103','C',500000]]],
['2026-10-31','Penyusutan 12.000.000/60 bln, garis lurus, tanpa nilai sisa / Depreciation (straight-line, no salvage)',[['5104','D',200000],['1202','C',200000]]],
['2026-10-31','Gaji akrual / Accrued salaries',[['5101','D',800000],['2102','C',800000]]]];
function loadSample(){save(S.map(function(s,i){return{id:'s'+i,date:s[0],desc:s[1],lines:s[2].map(function(l){return{code:l[0],debit:l[1]==='D'?l[2]:0,credit:l[1]==='C'?l[2]:0}})}}))}
function ledger(es){
 var m={};COA.forEach(function(a){m[a.code]={d:0,c:0,rows:[]}});
 es.slice().sort(function(x,y){return x.date<y.date?-1:x.date>y.date?1:0}).forEach(function(e){e.lines.forEach(function(l){
  var r=m[l.code];r.d+=l.debit||0;r.c+=l.credit||0;r.rows.push({date:e.date,desc:e.desc,debit:l.debit||0,credit:l.credit||0})})});
 return COA.map(function(a){var r=m[a.code],s=r.d-r.c;
  return{a:a,d:r.d,c:r.c,rows:r.rows,net:s,side:s>0?'D':s<0?'C':'-',bal:Math.abs(s),abnormal:s!==0&&(s>0?'D':'C')!==a.normal}})}
function trial(es){
 var rows=ledger(es).filter(function(r){return r.net!==0}).map(function(r){return{a:r.a,debit:r.net>0?r.net:0,credit:r.net<0?-r.net:0}});
 var td=0,tc=0;rows.forEach(function(r){td+=r.debit;tc+=r.credit});return{rows:rows,td:td,tc:tc,balanced:td===tc}}
function statements(es){
 var L=ledger(es);
 function pick(ty,sg){return L.filter(function(r){return r.a.type===ty&&r.net!==0}).map(function(r){return{a:r.a,v:sg*r.net}})}
 function sum(x){return x.reduce(function(s,r){return s+r.v},0)}
 var rev=pick('revenue',-1),exp=pick('expense',1),assets=pick('asset',1),liab=pick('liability',-1),eqa=pick('equity',-1);
 var totRev=sum(rev),totExp=sum(exp),ni=totRev-totExp;
 var cap=sum(eqa.filter(function(x){return x.a.normal==='C'})),draw=-sum(eqa.filter(function(x){return x.a.normal==='D'}));
 var totE=cap-draw+ni,totA=sum(assets),totL=sum(liab);
 return{rev:rev,exp:exp,assets:assets,liab:liab,totRev:totRev,totExp:totExp,ni:ni,cap:cap,draw:draw,totE:totE,totA:totA,totL:totL,ok:totA===totL+totE}}
window.Acc={COA:COA,byCode:byCode,validate:validate,load:load,upsert:upsert,remove:remove,clear:clear,loadSample:loadSample,ledger:ledger,trial:trial,statements:statements};
})();
