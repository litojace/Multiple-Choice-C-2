(function(root){
'use strict';
const coding={
 id:'swap-values',title:'Swap values without creating pointers',source:'ch2 sample coding question.pdf',
 signature:'void DoublyList::swapFirstCallingSecondParam(DoublyList& paramlist)',
 prompt:'Write the missing function body. Swap two DATA VALUES: the first value in this list (the object calling the function) and the second value in paramlist.\n\nRules: If either list has fewer than two nodes, do nothing. Create no pointer variables and change no links. Node data is int. The class has first, last, and count members. Nodes provide getData(), setData(), and getNext().',
 solution:`if (count > 1 && paramlist.count > 1)
{
    int temp = first->getData();
    first->setData(
        paramlist.first->getNext()->getData());
    paramlist.first->getNext()->setData(temp);
}`,
 checks:[
 'I check that BOTH lists have at least two nodes before accessing either target.',
 'I save the calling list’s first value in an int before overwriting it.',
 'I read the parameter list’s SECOND node, using first->getNext().',
 'I write the saved value into the parameter list’s second node.',
 'I create no pointer variables and change no next or prev links.',
 'I use braces, consistent indentation, a descriptive parameter name, and spaces around logical/comparison/assignment operators.'
 ],
 note:'The handout’s bullet about updating a last node’s next pointer does not apply to this value-only swap. Keep all links, node identities, and list counts unchanged. The code below follows the actual question and its supplied solution. Course-specific formatting still needs comparison with your full style guide.',
 examples:[{calling:[1,2,3],parameter:[10,20,30]},{calling:[70,45,32,78,51,67,23,56],parameter:[9,5,3,8,6,1,4]},{calling:[1],parameter:[10,20]},{calling:[1,2],parameter:[]}]
};
const steps=[
 {text:'Start: two distinct lists; both contain at least three nodes.',code:'// Calling: 1 2 3 4 5; parameter: 6 7 8 9'},
 {text:'Line 1: save the calling list’s first node in current.',code:'Node* current = first;'},
 {text:'Line 2: set Node2’s prev to Node9.',code:'current->getNext()->setPrev(paramlist.last);'},
 {text:'Line 3: set Node8’s next to Node1.',code:'paramlist.last->getPrev()->setNext(current);'},
 {text:'Line 4: set Node1’s prev to Node8.',code:'current->setPrev(paramlist.last->getPrev());'},
 {text:'Line 5: set Node9’s next to Node2.',code:'paramlist.last->setNext(current->getNext());'},
 {text:'Line 6: set Node1’s next to nullptr.',code:'current->setNext(nullptr);'},
 {text:'Line 7: set Node9’s prev to nullptr.',code:'paramlist.last->setPrev(nullptr);'},
 {text:'Line 8: move the calling list’s first pointer to Node9.',code:'first = paramlist.last;'},
 {text:'Line 9: move the parameter list’s last pointer to Node1.',code:'paramlist.last = current;'}
];
const pseudocode={id:'swap-nodes',title:'Complete a swap of two nodes',source:'ch2 sample pseudocode question.pdf',
 prompt:'Choose the two missing statements to swap whole NODES: the first node of this list and the last node of paramlist. Rearrange links; do not swap data values.\n\nAssume two separate lists, each with at least three nodes. Node numbers identify the original nodes by their values. Follow the lines in order and track each changed link.',
 signature:'void DoublyList::swapFirstCallingLastParameter(DoublyList& paramlist)',
 lines:steps.slice(1).map((s,i)=>i===2||i===6?`Line ${i+1}: [choose the missing statement]`:s.text),
 blanks:[
 {line:3,answer:1,options:['current->getNext()->setPrev(paramlist.last);','paramlist.last->getPrev()->setNext(current);','current->getPrev()->setNext(paramlist.last);','paramlist.last->getNext()->setPrev(current);'],explanation:'paramlist.last still points to Node9. Its existing prev reaches Node8; set Node8’s next to current (Node1). The first option repeats line 2, while the last two try to follow null links at this stage.'},
 {line:7,answer:2,options:['current->setPrev(nullptr);','paramlist.last->setNext(nullptr);','paramlist.last->setPrev(nullptr);','paramlist.last->getPrev()->setPrev(nullptr);'],explanation:'Node9 will become the calling list’s first node, so its prev must be nullptr. Do this after line 3, which needs Node9’s old prev to find Node8. Node1 already received its new prev in line 4.'}
 ],
 note:'The intermediate pointer states temporarily break list invariants. Follow the specified order and avoid traversing the whole list until repairs are complete. At the end, first->prev and last->next are nullptr in both lists; counts and all node data are unchanged.'
};
function swapValues(calling,parameter){const a=[...calling],b=[...parameter];if(a.length>=2&&b.length>=2)[a[0],b[1]]=[b[1],a[0]];return{calling:a,parameter:b};}
function traceState(step){
 const n={};for(const list of [[1,2,3,4,5],[6,7,8,9]])list.forEach((id,i)=>{n[id]={id,prev:list[i-1]??null,next:list[i+1]??null};});
 let current=null,first=1,last=5,paramFirst=6,paramLast=9;
 if(step>=1)current=1;
 if(step>=2)n[2].prev=9;
 if(step>=3)n[8].next=1;
 if(step>=4)n[1].prev=8;
 if(step>=5)n[9].next=2;
 if(step>=6)n[1].next=null;
 if(step>=7)n[9].prev=null;
 if(step>=8)first=9;
 if(step>=9)paramLast=1;
 return{nodes:n,current,first,last,paramFirst,paramLast};
}
const data={coding,pseudocode,steps,swapValues,traceState};
if(typeof module!=='undefined')module.exports=data;else root.ExamExercises=data;
})(typeof window!=='undefined'?window:globalThis);
