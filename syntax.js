(function(root){
'use strict';
const keywords=new Set('template typename class struct public private protected const return if else for while do switch case break continue new delete nullptr true false using namespace sizeof static virtual override explicit this throw try catch auto'.split(' '));
const types=new Set('void bool char short int long float double unsigned signed size_t string vector Node DLLNode DoublyList DArray T T1 T2 T3'.split(' '));
const escapeText=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function highlightCode(source){
 const tokens=String(source).match(/\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[ \t]*[a-zA-Z_]+|\b(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[fFuUlL]*\b|\b[a-zA-Z_]\w*\b|->|::|<<|>>|==|!=|<=|>=|&&|\|\||[+*\/=%!&|<>~^?-]|[^\w]/g)||[];
 return tokens.map((token,i)=>{
  let kind='';
  if(token.startsWith('//')||token.startsWith('/*'))kind='comment';
  else if(token[0]==='"'||token[0]==="'")kind='string';
  else if(token[0]==='#')kind='directive';
  else if(/^\d|^\.\d/.test(token))kind='number';
  else if(keywords.has(token))kind='keyword';
  else if(types.has(token))kind='type';
  else if(/^[a-zA-Z_]\w*$/.test(token)&&tokens.slice(i+1).find(t=>!/^\s+$/.test(t))==='(')kind='function';
  else if(/^(?:->|::|<<|>>|==|!=|<=|>=|&&|\|\||[+*\/=%!&|<>~^?-])$/.test(token))kind='operator';
  return kind?`<span class="syntax-${kind}">${escapeText(token)}</span>`:escapeText(token);
 }).join('');
}
if(typeof module!=='undefined')module.exports={highlightCode};else{
 root.highlightCode=highlightCode;
 const content=document.getElementById('content');
 function paint(){
  content.querySelectorAll('pre.example,.code-choice').forEach(el=>{
   const source=el.textContent;
   if(el.dataset.highlightedSource===source)return;
   el.dataset.highlightedSource=source;
   el.innerHTML=highlightCode(source);
   el.classList.add('syntax-highlighted');
  });
 }
 new MutationObserver(paint).observe(content,{childList:true,subtree:true});paint();
}
})(typeof window!=='undefined'?window:globalThis);
