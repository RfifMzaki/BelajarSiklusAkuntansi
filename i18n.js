(function(){
var K='accountingLabLanguage';
var D={
id:{
'tagline':'Learn the Logic. Practice the Process. Understand the Numbers.',
'nav.home':'Dasbor','nav.acc':'Jurnal, Buku Besar & Laporan','nav.lang':'Bahasa',
'ob.title':'Selamat Datang di Accounting Learning Lab','ob.sub':'Pilih bahasa pembelajaran yang kamu inginkan.',
'ob.id':'Bahasa Indonesia','ob.idd':'Antarmuka dan penjelasan dalam Bahasa Indonesia.','ob.en':'English','ob.end':'Interface and explanations in English.',
'home.title':'Dasbor Pembelajaran','home.intro':'Catat transaksi di Jurnal Umum; Buku Besar, Neraca Saldo, dan Laporan Keuangan dihitung otomatis dari data yang sama.',
'home.empty':'Belum ada transaksi tersimpan. Catat jurnal pertamamu atau muat contoh Nusa Konsultan.','home.start':'Mulai Mencatat',
'home.entries':'Jurnal tersimpan','home.accts':'Akun aktif','home.tb':'Neraca Saldo','home.ni':'Laba (rugi) bersih','bal':'Seimbang','unbal':'Tidak seimbang',
'acc.title':'Jurnal, Buku Besar, Neraca Saldo & Laporan Keuangan','acc.help':'Semua laporan dihitung otomatis dari jurnal yang kamu simpan (satu sumber data).',
'tab.j':'Jurnal Umum (General Journal)','tab.l':'Buku Besar (General Ledger)','tab.t':'Neraca Saldo (Trial Balance)','tab.f':'Laporan Keuangan (Financial Statements)',
'f.date':'Tanggal','f.desc':'Keterangan transaksi','f.acct':'Akun','f.sel':'— pilih akun —','f.debit':'Debit','f.credit':'Kredit',
'f.addline':'+ Tambah baris','f.rm':'Hapus baris','f.save':'Simpan Jurnal','f.upd':'Perbarui Jurnal','f.new':'Jurnal Baru','f.cancel':'Batal',
'f.edit':'Ubah','f.del':'Hapus','f.sample':'Muat contoh Nusa Konsultan','f.clear':'Hapus semua jurnal',
'f.help':'Debit = kredit hanyalah syarat minimum. Pastikan akun dan jumlahnya benar-benar sesuai dengan transaksi.',
'ok.saved':'Jurnal tersimpan dan otomatis diposting ke Buku Besar.','ok.del':'Jurnal dihapus.','ok.sample':'Contoh dimuat.','ok.clear':'Semua jurnal dihapus.',
'c.del':'Hapus jurnal ini?','c.clear':'Hapus SEMUA jurnal? Tindakan ini tidak dapat dibatalkan.','c.sample':'Ganti semua jurnal dengan contoh?',
'empty.j':'Belum ada jurnal. Isi formulir di tab Jurnal Umum atau muat contoh.',
'l.total':'Total','l.bal':'Saldo akhir','l.normal':'saldo normal','side.D':'Debit','side.C':'Kredit','side.-':'—','abn':'⚠ saldo tidak normal',
't.code':'Kode','t.name':'Nama akun','t.note':'Neraca saldo yang seimbang tidak menjamin semua transaksi dicatat dengan benar (mis. akun salah atau transaksi terlewat).',
'fs.is':'Laporan Laba Rugi (Income Statement)','fs.rev':'Pendapatan','fs.exp':'Beban','fs.trev':'Total pendapatan','fs.texp':'Total beban','fs.ni':'Laba bersih','fs.nl':'Rugi bersih',
'fs.eq':'Laporan Perubahan Ekuitas (Statement of Changes in Equity)','fs.beg':'Ekuitas awal (asumsi: periode pertama)','fs.cap':'Investasi pemilik','fs.draw':'Prive','fs.end':'Ekuitas akhir',
'fp':'Laporan Posisi Keuangan (Statement of Financial Position)','fs.assets':'Total aset','fs.liab':'Liabilitas','fs.tl':'Total liabilitas','fs.ast':'Aset','fs.te':'Total ekuitas','fs.le':'Total liabilitas + ekuitas',
'fs.chk':'Aset = Liabilitas + Ekuitas','fs.ok':'seimbang','fs.bad':'TIDAK seimbang — periksa jurnal',
'fs.note':'Laporan disusun dari saldo akun sebelum jurnal penutup; laba bersih dihitung dari akun pendapatan dan beban, lalu dimasukkan ke ekuitas. Jurnal penutup belum tersedia.',
'e.date':'Tanggal tidak valid.','e.desc':'Keterangan transaksi wajib diisi.','e.lines':'Minimal dua baris akun.','e.acct':'Baris {n}: pilih akun.',
'e.amt':'Baris {n}: isi tepat satu sisi (debit atau kredit) dengan bilangan bulat Rupiah lebih dari 0.','e.unbal':'Tidak seimbang: total debit Rp{d} ≠ total kredit Rp{c}.',
'e.dup':'Jurnal identik sudah ada (mencegah posting ganda).','e.store':'Gagal menyimpan ke penyimpanan browser.'
},
en:{
'nav.home':'Dashboard','nav.acc':'Journal, Ledger & Reports','nav.lang':'Language',
'ob.title':'Welcome to Accounting Learning Lab','ob.sub':'Choose your preferred learning language.',
'home.title':'Learning Dashboard','home.intro':'Record transactions in the General Journal; the Ledger, Trial Balance and Financial Statements are calculated automatically from the same data.',
'home.empty':'No transactions saved yet. Record your first journal entry or load the Nusa Konsultan sample.','home.start':'Start Recording',
'home.entries':'Saved entries','home.accts':'Active accounts','home.tb':'Trial Balance','home.ni':'Net income (loss)','bal':'Balanced','unbal':'Not balanced',
'acc.title':'Journal, Ledger, Trial Balance & Financial Statements','acc.help':'Every report is calculated from the entries you save (one source of data).',
'tab.j':'General Journal (Jurnal Umum)','tab.l':'General Ledger (Buku Besar)','tab.t':'Trial Balance (Neraca Saldo)','tab.f':'Financial Statements (Laporan Keuangan)',
'f.date':'Date','f.desc':'Transaction description','f.acct':'Account','f.sel':'— select account —','f.debit':'Debit','f.credit':'Credit',
'f.addline':'+ Add line','f.rm':'Remove line','f.save':'Save Entry','f.upd':'Update Entry','f.new':'New Entry','f.cancel':'Cancel',
'f.edit':'Edit','f.del':'Delete','f.sample':'Load Nusa Konsultan sample','f.clear':'Delete all entries',
'f.help':'Equal debits and credits are only the minimum requirement. Make sure the accounts and amounts truly match the transaction.',
'ok.saved':'Entry saved and automatically posted to the Ledger.','ok.del':'Entry deleted.','ok.sample':'Sample loaded.','ok.clear':'All entries deleted.',
'c.del':'Delete this entry?','c.clear':'Delete ALL entries? This cannot be undone.','c.sample':'Replace all entries with the sample?',
'empty.j':'No entries yet. Fill in the form on the General Journal tab or load the sample.',
'l.total':'Total','l.bal':'Ending balance','l.normal':'normal balance','side.D':'Debit','side.C':'Credit','abn':'⚠ abnormal balance',
't.code':'Code','t.name':'Account name','t.note':'A balanced trial balance does not guarantee every transaction was recorded correctly (e.g. a wrong account or a missing transaction).',
'fs.is':'Income Statement (Laporan Laba Rugi)','fs.rev':'Revenue','fs.exp':'Expenses','fs.trev':'Total revenue','fs.texp':'Total expenses','fs.ni':'Net income','fs.nl':'Net loss',
'fs.eq':'Statement of Changes in Equity (Laporan Perubahan Ekuitas)','fs.beg':'Beginning equity (assumption: first period)','fs.cap':'Owner investment','fs.draw':'Drawings','fs.end':'Ending equity',
'fp':'Statement of Financial Position (Laporan Posisi Keuangan)','fs.assets':'Total assets','fs.liab':'Liabilities','fs.tl':'Total liabilities','fs.ast':'Assets','fs.te':'Total equity','fs.le':'Total liabilities + equity',
'fs.chk':'Assets = Liabilities + Equity','fs.ok':'balanced','fs.bad':'NOT balanced — check the entries',
'fs.note':'Statements use account balances before closing entries; net income is calculated from revenue and expense accounts and carried into equity. Closing entries are not available yet.',
'e.date':'Invalid date.','e.desc':'Transaction description is required.','e.lines':'At least two account lines are required.','e.acct':'Line {n}: select an account.',
'e.amt':'Line {n}: fill exactly one side (debit or credit) with a whole-Rupiah amount greater than 0.','e.unbal':'Not balanced: total debit Rp{d} ≠ total credit Rp{c}.',
'e.dup':'An identical entry already exists (prevents double posting).','e.store':'Could not save to browser storage.'
}};
function get(){try{var v=localStorage.getItem(K);return v==='id'||v==='en'?v:null}catch(e){return null}}
var cur=get()||'id';
window.I18n={D:D,has:function(){return !!get()},lang:function(){return cur},
set:function(l){if(l!=='id'&&l!=='en')return;cur=l;try{localStorage.setItem(K,l)}catch(e){}},
t:function(k,p){var s=(D[cur]&&D[cur][k])||D.id[k]||k;for(var x in (p||{})){s=s.replace('{'+x+'}',typeof p[x]==='number'?p[x].toLocaleString('id-ID'):p[x])}return s}};
})();
