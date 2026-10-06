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
 $('lecture-list').innerHTML=list.length?list.map(l=>`<details class="library-term lecture-lesson"><summary>${escape(l.title)}<span class="pill">${escape(l.topic)}</span></summary><div class="library-body"><p class="definition">${escape(l.summary)}</p><ol class="lecture-steps">${l.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol><pre class="example">${escape(l.code)}</pre><p class="lab-notice">${escape(l.note)}</p>${l.link?`<p class="tip"><a href="${l.link}" target="_blank" rel="noopener noreferrer">C++ standard reference ↗</a></p>`:''}</div></details>`).join(''):'<div class="empty"><h3>No matching lessons.</h3><p>Try another search or choose all topics.</p></div>';
}
