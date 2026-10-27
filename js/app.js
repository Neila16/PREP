const questions=[
 {topic:"Network Security",q:"Which protocol is commonly used to protect web traffic in transit?",opts:["FTP","TLS","Telnet","HTTP without encryption"],a:1,why:"TLS provides encryption and integrity protection for data sent over a connection.",src:"Sample course note: Transport Layer Security"},
 {topic:"Authentication",q:"What is the main purpose of multi-factor authentication (MFA)?",opts:["Make passwords shorter","Require more than one type of proof","Disable account logging","Replace all access controls"],a:1,why:"MFA combines different authentication factors, making a stolen password less sufficient on its own.",src:"Sample course note: Authentication controls"},
 {topic:"Access Control",q:"What does the principle of least privilege mean?",opts:["Give everyone administrator access","Grant only the access needed for a task","Share one account across a team","Never review permissions"],a:1,why:"Least privilege limits permissions to what is necessary for the user's role.",src:"Sample course note: Access control principles"},
 {topic:"Network Security",q:"Which firewall rule is generally safer?",opts:["Allow all incoming traffic","Allow only required traffic","Disable logging","Use the same rule for every network"],a:1,why:"Restricting traffic to necessary services reduces unnecessary exposure.",src:"Sample course note: Firewall configuration"},
 {topic:"Cryptography",q:"Which statement about hashing is correct?",opts:["A secure hash is designed to be one-way","Hashing always allows the original text to be recovered","Hashing is the same as compression","A hash automatically encrypts network traffic"],a:0,why:"Cryptographic hashing produces a fixed-size digest and is designed not to be reversed to recover the original input.",src:"Sample course note: Cryptographic hashes"}
];
let topics={"Network Security":40,"Authentication":80,"Access Control":55,"Cryptography":65,"Risk Assessment":70};
let exam={name:"Introduction to Cybersecurity",date:"",hours:60};
let quizAnswers={},mockAnswers={},mockInterval=null,timeLeft=300,mockStarted=false;
const $=id=>document.getElementById(id);
function showView(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id));const names={dashboard:"Your exam overview",setup:"Set up your exam",diagnostic:"Check your understanding",topics:"Your weak topics",mock:"Practice under exam conditions"};$('pageTitle').textContent=names[id];if(id==='topics')renderTopics();if(id==='dashboard')renderDashboard();window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
function renderBars(target,limit=5){$(target).innerHTML=Object.entries(topics).slice(0,limit).sort((a,b)=>a[1]-b[1]).map(([n,s])=>`<div class="topic"><div><b>${safeText(n)}</b><div class="bar"><i style="width:${s}%"></i></div></div><span class="pill ${s<50?'orange':s>=75?'green':''}">${s}%</span></div>`).join('')}
function renderDashboard(){ $('examName').textContent=exam.name;let days=exam.date?Math.max(0,Math.ceil((new Date(exam.date+'T00:00:00')-new Date(new Date().toDateString()))/86400000)):7;$('examDateText').textContent=exam.date?`${days} day${days===1?'':'s'} until exam · ${exam.hours} minutes/day`:'Example exam · demo schedule';renderBars('dashboardTopics',4);let weakest=Object.entries(topics).sort((a,b)=>a[1]-b[1])[0];$('nextTaskTitle').textContent='Review '+weakest[0];$('nextTaskDesc').textContent=`Current practice score: ${weakest[1]}%. Start with this topic, then test yourself again.`}
function renderTopics(){ $('topicList').innerHTML=Object.entries(topics).sort((a,b)=>a[1]-b[1]).map(([n,s])=>`<div class="topic"><div><b>${safeText(n)}</b><div class="bar"><i style="width:${s}%"></i></div><small>${s<50?'High priority · review next':s<75?'Medium priority · keep practicing':'Looking good · revisit later'}</small></div><span class="pill ${s<50?'orange':s>=75?'green':''}">${s}%</span></div>`).join('')}
function renderQuiz(target='quizArea',subset=questions){$(target).innerHTML=subset.map((q,i)=>`<div class="question"><b>${i+1}. ${q.q}</b><div class="muted small">Topic: ${q.topic}</div><div class="options">${q.opts.map((o,j)=>`<label class="option"><input type="radio" name="${target}${i}" value="${j}" ${((target==='quizArea'?quizAnswers:mockAnswers)[i]===j)?'checked':''}><span>${o}</span></label>`).join('')}</div><div id="${target}fb${i}"></div></div>`).join('');$(target).querySelectorAll('input').forEach(inp=>inp.addEventListener('change',()=>{let i=Number(inp.name.replace(target,''));(target==='quizArea'?quizAnswers:mockAnswers)[i]=Number(inp.value)}))}
function updateScores(subset,answers){let sums={},counts={};subset.forEach((q,i)=>{sums[q.topic]=(sums[q.topic]||0)+(answers[i]===q.a?1:0);counts[q.topic]=(counts[q.topic]||0)+1});Object.entries(counts).forEach(([t,c])=>{let score=Math.round(sums[t]/c*100);topics[t]=Math.round((topics[t]+score)/2)})}
function submitQuiz(){let unanswered=questions.some((q,i)=>quizAnswers[i]===undefined);if(unanswered){$('quizResult').innerHTML='<div class="feedback bad">Please answer all five questions first.</div>';return}let score=questions.reduce((n,q,i)=>n+(quizAnswers[i]===q.a),0);questions.forEach((q,i)=>{$('quizAreafb'+i).innerHTML=`<div class="feedback ${quizAnswers[i]===q.a?'':'bad'}">${quizAnswers[i]===q.a?'Correct.':'Not quite.'} ${q.why}<div class="source">${q.src}</div></div>`});updateScores(questions,quizAnswers);$('accuracyStat').textContent=Math.round(score/questions.length*100)+'%';$('reviewedStat').textContent=Object.values(topics).filter(s=>s>=70).length+'/5';$('quizResult').innerHTML=`<div class="feedback">You scored <b>${score}/${questions.length}</b> (${Math.round(score/questions.length*100)}%). Your topic priorities have been updated. <button class="secondary" onclick="showView('topics')">View weak topics</button></div>`;renderDashboard()}
function resetQuiz(){quizAnswers={};$('quizResult').innerHTML='';renderQuiz()}
// PDF syllabus import: local text extraction with PDF.js, no uploads to a server.
const syllabusFile=$('syllabusFile');
const syllabusStatus=$('syllabusStatus');
const syllabusPreview=$('syllabusPreview');
const syllabusTopics=$('syllabusTopics');
const syllabusTextPreview=$('syllabusTextPreview');
const safeText=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function extractSyllabusTopics(pages){
  const candidates=[];
  const seen=new Set();
  const ignore=/^(course|subject|instructor|teacher|office|email|phone|credits?|ects|grading|assessment|learning outcomes?|objectives?|description|references?|literature|attendance|policy|prerequisites?|contact|semester|year|total|hours|lecture|practice|laboratory|lab work|date|week|topic|no\.|№|midterm|final exam)$/i;
  function add(value){
    let t=value.replace(/^[\s•*–—-]+/,'').replace(/\s+/g,' ').replace(/[.;:,\s-]+$/,'').trim();
    t=t.replace(/^(?:week|module|unit|lecture|lesson|topic|chapter|section)\s*\d{1,2}\s*[:.\-–]?\s*/i,'').trim();
    if(t.length<5||t.length>95||ignore.test(t)||/^\d+[\s.)-]*$/.test(t)||/^https?:/i.test(t)||/@/.test(t)||t.split(' ').length>12)return;
    let key=t.toLowerCase();if(!seen.has(key)){seen.add(key);candidates.push(t)}
  }
  for(const page of pages){
    for(const line of page.split('\n')){
      const t=line.trim();
      let m=t.match(/^(?:week|module|unit|lecture|lesson|topic|chapter|section)\s*\d{1,2}\s*[:.\-–]?\s*(.{5,95})$/i)
        ||t.match(/^\d{1,2}\s*[.)-]\s*(.{5,95})$/);
      if(m)add(m[1]);
      else if(/^(?:topics? covered|course content|weekly schedule|thematic plan)\s*:/i.test(t)){
        const tail=t.replace(/^[^:]+:/,'');tail.split(/[,;]/).forEach(add);
      }
    }
  }
  return candidates.slice(0,20);
}
syllabusFile.addEventListener('change',async()=>{
  const file=syllabusFile.files[0];syllabusPreview.hidden=true;
  if(!file){syllabusStatus.textContent='';return}
  if(!/\.pdf$/i.test(file.name)||file.size>10*1024*1024){syllabusStatus.textContent='Please select a PDF smaller than 10 MB.';return}
  if(!window.pdfjsLib){syllabusStatus.textContent='PDF reader could not load. Check your internet connection, or enter topics manually.';return}
  syllabusStatus.textContent='Reading syllabus…';
  try{
    pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;
    if(pdf.numPages>80)throw new Error('This PDF is too long (maximum 80 pages).');
    const pages=[];
    for(let i=1;i<=pdf.numPages;i++){
      const page=await pdf.getPage(i);const content=await page.getTextContent();
      // Group text fragments into approximate lines based on their vertical position.
      const rows=[];for(const item of content.items){if(!item.str||!item.str.trim())continue;const y=Math.round(item.transform[5]/4)*4;let row=rows.find(r=>Math.abs(r.y-y)<3);if(!row){row={y,parts:[]};rows.push(row)}row.parts.push({x:item.transform[4],text:item.str})}
      rows.sort((a,b)=>b.y-a.y);pages.push(rows.map(r=>r.parts.sort((a,b)=>a.x-b.x).map(x=>x.text).join(' ')).join('\n'));
    }
    const fullText=pages.join('\n');
    if(fullText.replace(/\s/g,'').length<40){syllabusStatus.textContent='No readable text found. This may be a scanned PDF. Enter topics manually or use a text-based PDF.';return}
    const found=extractSyllabusTopics(pages);
    syllabusTextPreview.textContent=fullText.slice(0,3500)+(fullText.length>3500?'\n…':'');
    syllabusPreview.hidden=false;
    syllabusTopics.textContent='';
    if(found.length){
      found.forEach(topic=>{const label=document.createElement('label');label.className='topic-check';const cb=document.createElement('input');cb.type='checkbox';cb.checked=true;cb.value=topic;label.append(cb,document.createTextNode(' '+topic));syllabusTopics.append(label)});
      const apply=document.createElement('button');apply.type='button';apply.className='secondary';apply.textContent='Use selected topics';apply.addEventListener('click',()=>{const selected=[...syllabusTopics.querySelectorAll('input:checked')].map(el=>el.value);$('materials').value=selected.join(', ');syllabusStatus.textContent=selected.length+' topics added to the field below. You can edit them before saving.'});syllabusTopics.append(apply);
      syllabusStatus.textContent=`PDF read successfully (${pdf.numPages} pages). Found ${found.length} possible topics. Select and apply the ones you need.`;
    }else{syllabusTopics.textContent='No clear topic headings detected. Check the text preview and enter topics manually.';syllabusStatus.textContent=`PDF read successfully (${pdf.numPages} pages), but topics could not be identified automatically.`}
  }catch(err){console.error(err);syllabusStatus.textContent='Could not read PDF: '+(err.message||'Unknown error')+'. You can still enter topics manually.'}
});
$('examForm').addEventListener('submit',e=>{e.preventDefault();exam.name=$('subject').value.trim();exam.date=$('examDate').value;exam.hours=Number($('hours').value);const custom=$('materials').value.split(',').map(s=>s.trim()).filter(Boolean);if(custom.length){topics={};custom.slice(0,8).forEach((t,i)=>topics[t]=[45,60,70,55,65,75,50,68][i%8])}renderDashboard();renderTopics();showView('dashboard')});
function startMock(){if(mockInterval)clearInterval(mockInterval);mockAnswers={};timeLeft=300;mockStarted=true;$('mockResult').innerHTML='';renderQuiz('mockArea',questions);$('startMock').disabled=true;$('submitMock').disabled=false;updateTimer();mockInterval=setInterval(()=>{timeLeft--;updateTimer();if(timeLeft<=0)finishMock(true)},1000)}
function updateTimer(){$('timer').textContent=String(Math.floor(timeLeft/60)).padStart(2,'0')+':'+String(timeLeft%60).padStart(2,'0')}
function finishMock(auto){if(!mockStarted)return;if(mockInterval)clearInterval(mockInterval);mockInterval=null;mockStarted=false;let score=questions.reduce((n,q,i)=>n+(mockAnswers[i]===q.a),0);questions.forEach((q,i)=>{let fb=$('mockAreafb'+i);if(fb)fb.innerHTML=`<div class="feedback ${mockAnswers[i]===q.a?'':'bad'}">${mockAnswers[i]===q.a?'Correct.':'Review this answer.'} ${q.why}<div class="source">${q.src}</div></div>`});updateScores(questions,mockAnswers);$('mockResult').innerHTML=`<div class="feedback">Mock exam finished${auto?' (time is up)':''}. Score: <b>${score}/${questions.length}</b>. Your weak-topic priorities have been updated.</div>`;$('startMock').disabled=false;$('startMock').textContent='Try again';$('submitMock').disabled=true;renderDashboard();renderTopics()}
renderQuiz();renderDashboard();renderTopics();
