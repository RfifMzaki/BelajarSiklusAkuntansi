/* Rule-based transaction analyzer (ID + EN). NOT a real AI model: deterministic patterns, no network. */
(function(){
function T(r){return function(x){return r.test(x)}}
function L(d,c,a){return[{code:d,debit:a,credit:0},{code:c,debit:0,credit:a}]}
var CR=/(kredit|utang|hutang|belum dibayar|belum dilunasi|on credit|on account|payable|unpaid|paid later|akan dibayar|dibayar nanti|ditagih|invoice|billed)/,
CASHW=/(tunai|\bkas\b|cash|transfer|bank)/,PAY=/(bayar|membayar|dibayar|dibayarkan|paid|\bpay\b)/,
BUY=/(\bbeli|membeli|pembelian|dibeli|bought|purchas|\bbuy\b|acquir)/,RCV=/(terima|menerima|diterima|received|receive)/,
ADV=/(di ?muka|uang muka|advance|upfront|deposit|retainer|prepa)/,SAL=/(gaji|upah|salary|salaries|\bwages?\b|payroll)/,
SVC=/(jasa|konsultasi|layanan|service|consult|advisory|\bfee\b)/,REV=/(terima|menerima|diterima|received|earned|memperoleh|memberikan|memberi|menyelesaikan|provided|performed|rendered|completed|mengerjakan|pendapatan)/,
ACC=/(belum dibayar|akrual|masih harus|accrued|unpaid|owed|not yet paid|yet to be paid|terutang)/,
CPAY=/(perusahaan|company|kami|\bwe\b)\W+(\w+\W+){0,2}(membayar|bayar|paid|pay)/,
RENT=/(sewa|\brent)/,UT=/(listrik|telepon|internet|air minum|tagihan air|utilit|electric|water bill|phone|telephone)/;
function cr(x){return CR.test(x)?'2101':'1101'}
var MU={juta:1e6,jt:1e6,million:1e6,mio:1e6,ribu:1e3,rb:1e3,thousand:1e3,k:1e3,miliar:1e9,billion:1e9};
function pn(s){return /^\d{1,3}([.,]\d{3})+$/.test(s)?+s.replace(/[.,]/g,''):+s.replace(',','.')}
function amounts(x){
 x=x.replace(/\d{4}-\d{2}-\d{2}/g,' ').replace(/\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/g,' ');
 var re=/(rp\.?|idr)?\s*(\d[\d.,]*)\s*(juta|jt|million|mio|ribu|rb|thousand|miliar|billion|k)?(?![a-z0-9])/g,m,mk=[],pl=[];
 while((m=re.exec(x))){
  var b=pn(m[2].replace(/[.,]+$/,''));if(!isFinite(b)||b<=0)continue;
  if(!m[3]&&b%1!==0)continue;
  var v=Math.round(b*(m[3]?MU[m[3]]:1)),rest=x.slice(re.lastIndex);
  if(m[1]||m[3])mk.push(v);
  else if(v>=1000&&!(v>=1990&&v<=2100)&&!/^\s*(bulan|tahun|month|year|hari|day|unit|buah|pcs)/.test(rest))pl.push(v)}
 var a=mk.length?mk:pl,u=[];a.forEach(function(v){if(u.indexOf(v)<0)u.push(v)});return u}
var R=[
{id:'unsup',f:T(/(barang dagang|persediaan|merchandise|inventory|bahan baku|raw material|barang dalam proses|work in process|finished goods|barang jadi|harga pokok|cost of goods)/)},
{id:'supplies_used',f:T(/(perlengkapan|supplies|atk).{0,40}(terpakai|dipakai|habis|digunakan|used|consumed)|(used|consumed|menggunakan|memakai).{0,40}(perlengkapan|supplies)/),b:function(a){return L('5103','1103',a)}},
{id:'depr',f:T(/(penyusutan|depreciat)/),b:function(a){return L('5104','1202',a)},as:['as.depr']},
{id:'collect',f:T(/(menagih|penagihan|pelunasan piutang|piutang.{0,25}(dibayar|lunas|diterima|dilunasi)|(terima|menerima|diterima).{0,40}piutang|collect\w*|receivable.{0,25}(paid|settled|received)|(customer|client|pelanggan|klien).{0,20}(paid|membayar).{0,30}(invoice|account|balance|receivable|tagihan|piutang)|(paid|membayar).{0,20}(invoice|tagihan|piutang))/),b:function(a){return L('1101','1102',a)}},
{id:'pay_sal',f:T(/(bayar|membayar|melunasi|paid|pay|settle\w*)\W+(\w+\W+){0,4}(utang gaji|hutang gaji|salaries payable|salary payable|wages payable)/),b:function(a){return L('2102','1101',a)}},
{id:'pay_ap',f:T(/(bayar|membayar|melunasi|pelunasan|paid|pay|settle\w*|repa\w+)\W+(\w+\W+){0,4}(utang|hutang|payable|supplier|vendor|pemasok|creditor|kreditur)/),b:function(a){return L('2101','1101',a)}},
{id:'invest',f:function(x){return /(investasi|setoran modal|setor modal|menyetor|modal awal|setoran pemilik|invest|contribut|owner.{0,15}(deposit|put))/.test(x)&&!/(peralatan|equipment|computer|komputer|laptop|kendaraan|vehicle|supplies|perlengkapan)/.test(x)},b:function(a){return L('1101','3101',a)},as:['as.invest']},
{id:'draw',f:T(/(prive|pengambilan pribadi|ambil.{0,15}pribadi|withdr|drawing)/),b:function(a){return L('3102','1101',a)}},
{id:'unearned',f:function(x){return ADV.test(x)&&RCV.test(x)&&/(pelanggan|klien|customer|client|jasa|service|konsultasi|consult|proyek|project)/.test(x)&&!RENT.test(x)},b:function(a){return L('1101','2103',a)},as:['as.unearned']},
{id:'prepaid',f:function(x){return RENT.test(x)&&PAY.test(x)&&!RCV.test(x)&&(ADV.test(x)||/\d+\s*(bulan|tahun|month|year)/.test(x))},b:function(a){return L('1104','1101',a)},as:['as.prepaid']},
{id:'rent_exp',f:function(x){return RENT.test(x)&&PAY.test(x)&&!RCV.test(x)},b:function(a){return L('5102','1101',a)},as:['as.rentexp']},
{id:'sal_accr',f:function(x){return SAL.test(x)&&ACC.test(x)&&!RCV.test(x)},b:function(a){return L('5101','2102',a)}},
{id:'sal_paid',f:function(x){return SAL.test(x)&&!RCV.test(x)},b:function(a){return L('5101','1101',a)}},
{id:'util',f:function(x){return UT.test(x)&&(PAY.test(x)||CR.test(x)||BUY.test(x))&&!RCV.test(x)},b:function(a,x){return L('5105',cr(x),a)}},
{id:'supplies_buy',f:function(x){return /(perlengkapan|supplies|\batk\b|alat tulis)/.test(x)&&BUY.test(x)},b:function(a,x){return L('1103',cr(x),a)}},
{id:'equip_buy',f:function(x){return /(peralatan|equipment|komputer|computer|laptop|mesin|furnitur|furniture|kendaraan|vehicle|printer)/.test(x)&&BUY.test(x)},b:function(a,x){return L('1201',cr(x),a)},as:['as.equip']},
{id:'rev_credit',f:function(x){return SVC.test(x)&&REV.test(x)&&!CPAY.test(x)&&CR.test(x)},b:function(a){return L('1102','4101',a)},as:['as.rev']},
{id:'rev_cash',f:function(x){return SVC.test(x)&&REV.test(x)&&!CPAY.test(x)},b:function(a){return L('1101','4101',a)},as:['as.rev']}];
function analyze(raw){
 var x=String(raw||'').toLowerCase().replace(/\s+/g,' ').trim();
 if(!x)return{status:'ask',key:'a.empty'};
 var rule=null;for(var i=0;i<R.length;i++){if(R[i].f(x)){rule=R[i];break}}
 if(!rule)return{status:'ask',key:'a.unk'};
 if(rule.id==='unsup')return{status:'ask',key:'a.unsup'};
 var am=amounts(x);
 if(!am.length)return{status:'ask',key:'a.noamt',rule:rule.id};
 if(am.length>1)return{status:'ask',key:'a.multi',vals:am.map(function(v){return v.toLocaleString('id-ID')}).join(', ')};
 var lines=rule.b(am[0],x),as=(rule.as||[]).slice();
 if(lines.some(function(l){return l.code==='1101'})&&!CASHW.test(x))as.push('as.cash');
 return{status:'ok',rule:rule.id,amount:am[0],lines:lines,as:as}}
window.Analyzer={analyze:analyze};
Object.assign(I18n.D.id,{
'n.title':'Catat Otomatis dari Narasi (Analisis Transaksi)',
'n.help':'Tulis transaksi dalam Bahasa Indonesia atau English. Akun, debit, dan kredit ditentukan otomatis lalu langsung diposting ke Jurnal, Buku Besar, Neraca Saldo, dan Laporan. Ini penganalisis berbasis aturan (bukan AI sungguhan): periksa hasilnya, dan gunakan Batalkan/Ubah bila perlu.',
'n.ph':'Contoh: Perusahaan menerima pendapatan jasa tunai sebesar Rp5.000.000. / The company bought supplies on credit for Rp500,000.',
'n.go':'Analisis & Catat','n.done':'Tercatat otomatis','n.why':'Alasan debit/kredit','n.eq':'Dampak pada persamaan akuntansi','n.as':'Asumsi','n.upd':'Laporan diperbarui','n.undo':'Batalkan','n.edit':'Ubah di formulir','ok.undo':'Jurnal dibatalkan.','eq.l':'Ekuitas',
'ty.asset':'aset','ty.liability':'liabilitas','ty.equity':'ekuitas','ty.revenue':'pendapatan','ty.expense':'beban','ty.contra':'akun kontra',
'x.l':'{a} ({ty}) {dir} → dicatat di sisi {side}.','x.inc':'bertambah','x.dec':'berkurang',
'a.empty':'Tulis dulu narasi transaksinya.',
'a.noamt':'Terdeteksi: {r}, tetapi nominal (Rp) tidak ditemukan. Tambahkan nominal, mis. "Rp500.000". Nominal tidak ditebak, jadi belum ada yang diposting.',
'a.multi':'Ditemukan lebih dari satu nominal ({v}). Tulis satu transaksi per narasi dengan satu nominal. Belum ada yang diposting.',
'a.unk':'Jenis transaksi belum dikenali. Gunakan kata kerja yang jelas, mis. "membayar sewa", "menerima pendapatan jasa", "membeli perlengkapan secara kredit". Belum ada yang diposting.',
'a.unsup':'Transaksi persediaan/barang dagang/manufaktur belum didukung: bagan akun saat ini untuk perusahaan jasa. Belum ada yang diposting.',
'rule.supplies_used':'Pemakaian perlengkapan','rule.depr':'Beban penyusutan','rule.collect':'Penagihan piutang','rule.pay_sal':'Pelunasan utang gaji','rule.pay_ap':'Pelunasan utang usaha','rule.invest':'Investasi pemilik','rule.draw':'Prive (pengambilan pemilik)','rule.unearned':'Pendapatan diterima di muka','rule.prepaid':'Sewa dibayar di muka','rule.rent_exp':'Beban sewa','rule.sal_accr':'Gaji akrual (belum dibayar)','rule.sal_paid':'Pembayaran gaji','rule.util':'Beban utilitas','rule.supplies_buy':'Pembelian perlengkapan','rule.equip_buy':'Pembelian peralatan','rule.rev_credit':'Pendapatan jasa secara kredit','rule.rev_cash':'Pendapatan jasa tunai',
'as.cash':'Cara pembayaran tidak disebutkan, dianggap tunai (Kas).','as.depr':'Nominal penyusutan sesuai yang kamu tulis (tidak dihitung otomatis).','as.invest':'Setoran dianggap berupa uang tunai.',
'as.unearned':'Jasa belum diberikan, sehingga uang muka dicatat sebagai liabilitas, bukan pendapatan.','as.prepaid':'Sewa untuk periode mendatang dicatat sebagai aset; dibebankan lewat jurnal penyesuaian.',
'as.rentexp':'Sewa dianggap untuk periode berjalan. Jika dibayar untuk bulan mendatang, sebutkan "di muka".','as.rev':'Jasa dianggap sudah selesai diberikan pada tanggal transaksi.','as.equip':'Peralatan dikapitalisasi sebagai aset; penyusutan dicatat terpisah.'});
Object.assign(I18n.D.en,{
'n.title':'Auto-record from a Narrative (Transaction Analyzer)',
'n.help':'Write the transaction in English or Indonesian. Accounts, debits and credits are determined automatically and posted straight to the Journal, Ledger, Trial Balance and Reports. This is a rule-based analyzer (not a real AI): review the result, and use Undo/Edit if needed.',
'n.ph':'Example: The company received Rp5,000,000 in cash for consulting services. / Perusahaan membeli perlengkapan secara kredit Rp500.000.',
'n.go':'Analyze & Record','n.done':'Recorded automatically','n.why':'Why these debits/credits','n.eq':'Effect on the accounting equation','n.as':'Assumptions','n.upd':'Reports updated','n.undo':'Undo','n.edit':'Edit in form','ok.undo':'Entry undone.','eq.l':'Equity',
'ty.asset':'asset','ty.liability':'liability','ty.equity':'equity','ty.revenue':'revenue','ty.expense':'expense','ty.contra':'contra account',
'x.l':'{a} ({ty}) {dir} → recorded on the {side} side.','x.inc':'increases','x.dec':'decreases',
'a.empty':'Please write the transaction narrative first.',
'a.noamt':'Detected: {r}, but no amount (Rp) was found. Add an amount, e.g. "Rp500,000". Amounts are never guessed, so nothing was posted.',
'a.multi':'More than one amount was found ({v}). Write one transaction per narrative with a single amount. Nothing was posted.',
'a.unk':'Transaction type not recognised. Use a clear verb, e.g. "paid rent", "received service revenue", "bought supplies on credit". Nothing was posted.',
'a.unsup':'Inventory/merchandise/manufacturing transactions are not supported yet: the current chart of accounts is for a service company. Nothing was posted.',
'rule.supplies_used':'Supplies used','rule.depr':'Depreciation expense','rule.collect':'Receivable collection','rule.pay_sal':'Salaries payable settled','rule.pay_ap':'Accounts payable settled','rule.invest':'Owner investment','rule.draw':'Owner drawings','rule.unearned':'Advance payment received (unearned revenue)','rule.prepaid':'Prepaid rent','rule.rent_exp':'Rent expense','rule.sal_accr':'Accrued salaries (unpaid)','rule.sal_paid':'Salaries paid','rule.util':'Utilities expense','rule.supplies_buy':'Supplies purchase','rule.equip_buy':'Equipment purchase','rule.rev_credit':'Service revenue on credit','rule.rev_cash':'Service revenue in cash',
'as.cash':'Payment method not stated, assumed cash (Kas).','as.depr':'Depreciation amount is as you wrote it (not calculated automatically).','as.invest':'The investment is assumed to be cash.',
'as.unearned':'Services not yet performed, so the advance is a liability, not revenue.','as.prepaid':'Rent for future periods is an asset; it is expensed through adjusting entries.',
'as.rentexp':'Rent is assumed to be for the current period. If paid for future months, say "in advance".','as.rev':'The service is assumed to be completed on the transaction date.','as.equip':'Equipment is capitalized as an asset; depreciation is recorded separately.'});
})();
