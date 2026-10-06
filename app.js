'use strict';
const { terms, shuffle, choicesFor } = StudyData;
const { questions, optionsFor } = CoursePractice;
const $ = (id) => document.getElementById(id);
const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key = 'exam02-study-v1';
let storageAvailable = true;
let progress = { known: [], review: [], practiceReview: [], correct: 0, attempts: 0 };
try {
  const saved = JSON.parse(localStorage.getItem(key));
  if (saved && Array.isArray(saved.known) && Array.isArray(saved.review)) {
    const valid = ids => [...new Set(ids.filter(id => terms.some(t => t.id === id)))];
    progress.practiceReview = [...new Set((Array.isArray(saved.practiceReview) ? saved.practiceReview : []).filter(id => questions.some(q => q.id === id)))];
    progress.known = valid(saved.known);
    progress.review = valid(saved.review).filter(id => !progress.known.includes(id));
    if (Number.isSafeInteger(saved.attempts) && saved.attempts >= 0 && Number.isSafeInteger(saved.correct) && saved.correct >= 0 && saved.correct <= saved.attempts) {
      progress.correct = saved.correct; progress.attempts = saved.attempts;
    }
  }
} catch { storageAvailable = false; }
let mode = 'cards', deck = [], index = 0, revealed = false, quiz = [], answers = [], options = [], selected = null;
function save() {
  try { localStorage.setItem(key, JSON.stringify(progress)); }
  catch { storageAvailable = false; }
  stats();
}
function stats() {
  $('total-stat').textContent = terms.filter(t=>t.source==='Terminology list').length;
  $('known-stat').textContent = progress.known.length;
  $('review-stat').textContent = progress.review.length + progress.practiceReview.length;
  $('accuracy-stat').textContent = progress.attempts ? Math.round(progress.correct/progress.attempts*100)+'%' : '—';
  $('storage-note').textContent = storageAvailable ? 'Your progress stays in this browser. No account needed.' : 'Browser storage is unavailable. Progress is kept for this session only.';
}
function filtered() {
  return terms.filter(t => ($('category').value==='All' || t.category===$('category').value) &&
    ($('scope').value==='all' || ($('scope').value==='review' ? progress.review.includes(t.id) : t.source==='Terminology list')));
}
function buildDeck() {
  if(mode==='lab'||mode==='lecture') {render();return;}
  if(mode==='practice') {
    deck = shuffle(questions.filter(q => ($('chapter').value==='all' || ($('chapter').value==='lecture' ? q.id.startsWith('slides-') : q.chapter===$('chapter').value)) && ($('practice-scope').value==='all' || progress.practiceReview.includes(q.id))));
    index=0; revealed=false; quiz=deck; answers=[]; selected=null; options=quiz.length?practiceOptions(quiz[0]):[]; render(); return;
  }
  deck = shuffle(filtered()); index=0; revealed=false;
  quiz=deck.slice(0,10); answers=[]; selected=null; options=quiz.length?choicesFor(quiz[0]):[];
  render();
}
function setMode(next) {
  mode=next;
  document.querySelectorAll('.mode').forEach(b => { b.classList.toggle('active',b.dataset.mode===mode); b.setAttribute('aria-pressed',b.dataset.mode===mode); });
  const headings = {lecture:['BUILD YOUR UNDERSTANDING','Explore the concepts.'],cards:['ACTIVE RECALL','A term at a time.'],quiz:['CHECK YOUR UNDERSTANDING','Make it click.'],glossary:['YOUR REFERENCE SHELF','Find the right words.'],practice:['APPLY YOUR KNOWLEDGE','Read. Trace. Understand.'],lab:['PRACTICE WRITING CODE','Think it through. Write it out.']};
  $('mode-eyebrow').textContent=headings[mode][0]; $('mode-title').textContent=headings[mode][1];
  $('session-tag').textContent=mode==='practice'?'EXPLAINED PRACTICE':mode==='quiz'?'UP TO 10 QUESTIONS':'UNTIMED PRACTICE';
  $('term-filters').hidden=mode==='practice'||mode==='lab'||mode==='lecture';
  $('practice-filters').hidden=mode!=='practice';
  $('shuffle').hidden=mode==='glossary'||mode==='lab';
  buildDeck();
}
function detail(t) {
  return `<p class="definition">${formatProse(t.definition)}</p><pre class="example">${escape(t.example)}</pre><p class="tip"><strong>Make it stick.</strong> ${formatProse(t.tip)}</p>`;
}
function render() {
  stats();
  if(mode==='lecture') {renderLectureNotes();return;}
  if(mode==='lab') {renderExercises();return;}
  if(mode==='glossary') { renderLibrary(); return; }
  if(!deck.length && mode==='practice') {
    $('content').innerHTML='<div class="empty"><span class="tiny-star">✳</span><h3>No missed questions in this chapter.</h3><p>Missed course questions are saved here. Try a full round to check your understanding.</p><button class="primary" id="all-practice">Practice all questions</button></div>';
    $('all-practice').onclick=()=>{$('practice-scope').value='all';buildDeck();};return;
  }
  if(!deck.length) {
    $('content').innerHTML=`<div class="empty"><span class="tiny-star">✳</span><h3>${$('scope').value==='review'?'Nothing to revisit here.':'No terms in this selection.'}</h3><p>${$('scope').value==='review'?'Terms you miss in a quiz or mark “Review again” appear here.':'Try including extra topics or choosing a different topic.'}</p><button class="primary" id="all-terms">Browse guide terms</button></div>`;
    $('all-terms').onclick=()=>{$('scope').value='guide';$('category').value='All';buildDeck();}; return;
  }
  if(mode==='quiz' || mode==='practice') { renderQuiz(); return; }
  const t=deck[index];
  $('content').innerHTML=`<article class="card"><div class="card-meta"><span class="pill">${escape(t.category)}</span><span>${String(index+1).padStart(2,'0')} / ${String(deck.length).padStart(2,'0')}</span></div><div class="card-body"><p class="prompt">${revealed?'THE DEFINITION':'HOW WOULD YOU EXPLAIN…'}</p><h3 class="term-name">${escape(t.term)}</h3>${revealed?detail(t):'<p class="recall-hint">Take a moment. Put it in your own words.</p>'}</div><div class="card-action">${revealed?'<small>How did you do?</small><div class="answer-buttons"><button class="secondary review-button" id="review">↻ Review again</button><button class="primary known" id="known">✓ I know this</button></div>':'<small><span class="shortcut">Space</span> to reveal</small><button class="primary" id="reveal">Reveal definition <span aria-hidden="true">→</span></button>'}</div></article><div class="progress-track" aria-label="Deck position"><div style="width:${(index+1)/deck.length*100}%"></div></div><div class="card-footer"><button class="secondary" id="previous" ${index===0?'disabled':''}>← Previous</button><p>${progress.known.includes(t.id)?'✓ Marked as known':progress.review.includes(t.id)?'↻ In your review list':t.source==='Extra topic practice'?'Extra topic practice':'Core terminology'}</p><button class="secondary" id="next" ${index===deck.length-1?'disabled':''}>Next →</button></div>${index===deck.length-1?'<div class="result-actions"><button class="secondary" id="restart">Shuffle & start again</button></div>':''}`;
  $('previous').onclick=()=>move(-1); $('next').onclick=()=>move(1);
  if($('restart')) $('restart').onclick=buildDeck;
  if(revealed) {
    $('known').onclick=()=>mark(t.id,true); $('review').onclick=()=>mark(t.id,false);
  } else $('reveal').onclick=()=>{revealed=true;render();};
}
function move(direction) { index=Math.max(0,Math.min(deck.length-1,index+direction));revealed=false;render(); }
function mark(id,known) {
  progress.known=progress.known.filter(x=>x!==id); progress.review=progress.review.filter(x=>x!==id);
  progress[known?'known':'review'].push(id); save();
  if($('scope').value==='review' && known) {
    deck=deck.filter(t=>t.id!==id); index=Math.min(index,deck.length-1);revealed=false;render();
  } else if(index<deck.length-1) move(1);
  else render();
}
function practiceOptions(question) {
  return optionsFor(question).map(o=>({id:o.id,term:o.text}));
}
function answerId(question) { return mode==='practice' ? question.id+'-option-'+question.answer : question.id; }
function renderQuiz() {
  const course=mode==='practice';
  if(answers.length===quiz.length) {
    const correct=answers.filter(a=>a.correct).length;
    $('content').innerHTML=`<div class="card result"><span class="result-icon">✳</span><p class="eyebrow">SESSION COMPLETE</p><h2>One step closer.</h2><div class="result-score">${correct}<span style="font-size:24px;color:var(--muted)"> / ${quiz.length}</span></div><p>${correct===quiz.length?'Every answer correct. Try another topic or keep practicing with flashcards.':course?'Missed questions are saved in your course quiz review set. Revisit their explanations, then try another round.':'Your missed terms are saved in “Needs review.” Revisit them, then try another round.'}</p><div class="result-actions"><button class="primary" id="again">Another round →</button>${correct<quiz.length?`<button class="secondary" id="review-missed">Review missed ${course?'questions':'terms'}</button>`:''}</div></div>`;
    $('again').onclick=buildDeck;
    if($('review-missed')) $('review-missed').onclick=()=>{if(course){$('practice-scope').value='review';buildDeck();}else{$('scope').value='review';setMode('cards');}};
    return;
  }
  const t=quiz[answers.length],answered=selected!==null,correct=selected===answerId(t);
  $('content').innerHTML=`<article class="card"><div class="card-meta"><span class="pill">${escape(t.category)}</span><span>QUESTION ${answers.length+1} OF ${quiz.length}</span></div><div class="card-body"><p class="prompt">${course?'APPLY THE CONCEPT':'WHICH TERM MATCHES THIS DEFINITION?'}</p><h3 class="quiz-question">${formatProse(course?t.prompt:t.definition)}</h3>${course&&t.code?`<pre class="example question-code">${escape(t.code)}</pre>`:''}${course&&t.hint&&!answered?`<details class="question-hint"><summary>Need a starting point?</summary><p>${formatProse(t.hint)}</p></details>`:''}<div class="choices">${options.map((o,i)=>`<button class="choice ${answered?(o.id===answerId(t)?'correct':o.id===selected?'wrong':''):''}" data-choice="${o.id}" ${answered?'disabled':''}><span class="choice-letter">${String.fromCharCode(65+i)}</span><span class="${course&&t.codeChoices?'code-choice':''}">${escape(o.term)}</span>${answered&&o.id===answerId(t)?'<span style="margin-left:auto" aria-label="Correct answer">✓</span>':''}</button>`).join('')}</div>${answered?`<div class="feedback" role="status"><h3>${correct?'✓ That’s right.':'Let’s make this one stick.'} ${escape(course?t.options[t.answer]:t.term)}</h3><p>${formatProse(course?t.explanation:t.tip)}</p>${course?`<p class="tip">Related terminology: ${escape(t.relatedTerms.join(', '))}</p>`:`<pre class="example">${escape(t.example)}</pre>`}</div>`:''}</div><div class="card-action"><small>${answered?'Read the explanation before moving on.':'Choose an answer. There’s no timer.'}</small>${answered?`<button class="primary" id="next-question">${answers.length===quiz.length-1?'See results':'Next question'} →</button>`:'<span class="pill">ONE ANSWER</span>'}</div></article><div class="progress-track"><div style="width:${answers.length/quiz.length*100}%"></div></div>`;
  document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{
    if(selected!==null) return;
    selected=b.dataset.choice; progress.attempts++;
    if(selected===answerId(t)) {
      progress.correct++;
      if(course)progress.practiceReview=progress.practiceReview.filter(id=>id!==t.id);
    }
    else if(course) {if(!progress.practiceReview.includes(t.id))progress.practiceReview.push(t.id);}
    else {progress.known=progress.known.filter(id=>id!==t.id);if(!progress.review.includes(t.id)) progress.review.push(t.id);}
    save();renderQuiz();
  });
  if(answered) $('next-question').onclick=()=>{
    answers.push({id:t.id,correct});selected=null;
    if(answers.length<quiz.length)options=course?practiceOptions(quiz[answers.length]):choicesFor(quiz[answers.length]);
    renderQuiz();
  };
}
function renderLibrary() {
  $('content').innerHTML='<label class="search-label" for="search">Find a term, definition, or example<input id="search" type="search" placeholder="Try “pointer”, “const”, or “constructor”…" autocomplete="off"></label><p class="library-count" id="library-count"></p><div id="library-list"></div>';
  $('search').addEventListener('input',updateLibrary);updateLibrary();
}
function updateLibrary() {
  const query=$('search').value.toLowerCase().trim();
  const list=filtered().filter(t=>[t.term,t.definition,t.example,t.tip].join(' ').toLowerCase().includes(query));
  $('library-count').textContent=`${list.length} ${list.length===1?'term':'terms'}${query?' found':''}`;
  $('library-list').innerHTML=list.length?list.map(t=>`<details class="library-term"><summary>${escape(t.term)}<span class="pill">${escape(t.category)}</span></summary><div class="library-body">${detail(t)}<p class="tip">${progress.known.includes(t.id)?' · ✓ Known':progress.review.includes(t.id)?' · Needs review':''}</p><div class="answer-buttons"><button class="secondary" data-library-review="${t.id}">Review again</button><button class="primary known" data-library-known="${t.id}">I know this</button></div></div></details>`).join(''):'<div class="empty"><h3>No matching terms.</h3><p>Try another search or change the topic and deck filters.</p></div>';
  for(const [selector,known] of [['[data-library-review]',false],['[data-library-known]',true]]) document.querySelectorAll(selector).forEach(b=>b.onclick=()=>{
    const id=b.getAttribute(known?'data-library-known':'data-library-review');
    progress.known=progress.known.filter(x=>x!==id);progress.review=progress.review.filter(x=>x!==id);progress[known?'known':'review'].push(id);save();
    b.textContent=known?'✓ Marked known':'✓ Added to review';
    const opposite=b.parentElement.querySelector(known?'[data-library-review]':'[data-library-known]');opposite.textContent=known?'Review again':'I know this';
    if($('scope').value==='review'&&known)updateLibrary();
  });
}
[...new Set(terms.map(t=>t.category))].sort().forEach(c=>{const option=document.createElement('option');option.value=c;option.textContent=c;$('category').append(option);});
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$('chapter').onchange=buildDeck; $('practice-scope').onchange=buildDeck; $('practice-shuffle').onclick=buildDeck;
$('category').onchange=buildDeck; $('scope').onchange=buildDeck; $('shuffle').onclick=buildDeck;
$('reset').onclick=()=>$('reset-dialog').showModal();
$('cancel-reset').onclick=()=>$('reset-dialog').close();
$('confirm-reset').onclick=()=>{progress={known:[],review:[],practiceReview:[],correct:0,attempts:0};save();$('reset-dialog').close();buildDeck();};
document.addEventListener('keydown',e=>{
  if(mode!=='cards'||!deck.length||$('reset-dialog').open||['INPUT','SELECT','BUTTON','TEXTAREA','SUMMARY'].includes(document.activeElement.tagName))return;
  if(e.code==='Space'){e.preventDefault();revealed=!revealed;render();}
  if(e.key==='ArrowRight')move(1);
  if(e.key==='ArrowLeft')move(-1);
});
setMode('cards');
