function renderLectureNotes(){
 const topics=[...new Set(LectureStudio.lessons.map(l=>l.topic))];
 $('content').innerHTML=`<div class="lecture-intro"><p class="definition">Study concepts, organized into ${LectureStudio.lessons.length} lessons.</p><p class="tip">Read a topic, follow the example, then test your understanding. Examples clarify assumptions and common mistakes.</p><button class="primary" id="lecture-practice">Practice these 20 questions →</button></div><div class="filters"><label>Topic<select id="lecture-topic"><option value="all">All topics</option>${topics.map(t=>`<option>${escape(t)}</option>`).join('')}</select></label><label>Search<input id="lecture-search" type="search" placeholder="Try reserve, T3, or last…"></label></div><p class="library-count" id="lecture-count"></p><div id="lecture-list"></div>`;
 $('lecture-practice').onclick=()=>{$('chapter').value='lecture';$('practice-scope').value='all';setMode('practice');};
 $('lecture-topic').onchange=updateLectureNotes;$('lecture-search').oninput=updateLectureNotes;updateLectureNotes();
}
function updateLectureNotes(){
 const topic=$('lecture-topic').value,query=$('lecture-search').value.trim().toLowerCase();
 const list=LectureStudio.lessons.filter(l=>(topic==='all'||l.topic===topic)&&[l.title,l.summary,...l.steps,l.code,l.note].join(' ').toLowerCase().includes(query));
 $('lecture-count').textContent=`${list.length} lessons`;
 $('lecture-list').innerHTML=list.length?list.map(l=>`<details class="library-term lecture-lesson"><summary>${escape(l.title)}<span class="pill">${escape(l.topic)}</span></summary><div class="library-body"><p class="definition">${formatProse(l.summary)}</p>${renderLessonExamples(l)}<p class="lab-notice">${formatProse(l.note)}</p>${l.link?`<p class="tip"><a href="${l.link}" target="_blank" rel="noopener noreferrer">C++ standard reference ↗</a></p>`:''}</div></details>`).join(''):'<div class="empty"><h3>No matching lessons.</h3><p>Try another search or choose all topics.</p></div>';
}

function renderLessonExamples(lesson){
 const sections=lesson.id==='deduction'
  ? [{title:'One shared type',code:lesson.code.split('// Alternative: independent types')[0].trim(),steps:lesson.steps.slice(0,2)},
     {title:'Two independent types',code:lesson.code.split('// Alternative: independent types')[1].trim(),steps:lesson.steps.slice(2,3)},
     {title:'Supplying types explicitly',code:lesson.code.split('// Alternative: independent types')[1].trim()+"\n\nprintPair<int>('A', 3.14);\nprintPair<double, int>(2.5, 8.9);",steps:lesson.steps.slice(3)}]
  : [{code:lesson.code,steps:lesson.steps}];
 return sections.map(section=>`<section class="lesson-example">${section.title?`<h3 class="lesson-example-title">${escape(section.title)}</h3>`:''}<pre class="example">${escape(section.code)}</pre><ol class="lecture-steps">${section.steps.map(step=>`<li>${formatProse(step)}</li>`).join('')}</ol></section>`).join('');
}
