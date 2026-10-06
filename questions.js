(function(root) {
'use strict';
const traceCode = `Node *p1 = new Node(8, nullptr, nullptr);
Node *p2 = new Node(6, p1, nullptr);
first = p2;
Node *p3 = new Node(7, p1, p2);
p3->getNext()->setData(5);
p2->setNext(new Node(2, first, p1));
p2 = nullptr;
Node *p4 = p3;
p1->setPrev(first->getNext());
first->setPrev(p3);
p3 = first->getNext();
first->setPrev(p3);
p4->setNext(p2);
last = p4;
p1->setNext(p4);
p1 = p2;
p3->getPrev()->setPrev(p1);`;
const traceExplanation = 'Name the allocated nodes A(8), B(6 → changed to 5), C(7), and D(2). first stays at B. p4 stays at C and last becomes p4. p2 becomes nullptr and p1 is later assigned p2. p3 is reassigned to first->next, which is D. Changing a node’s links does not move pointers that already refer to it. The code is a tracing exercise, not a correct list-building algorithm.';
const passContext = 'A function swaps the contents of a non-empty vector<int> and a raw int array, updates the array’s element count, and appends the first three values from a DArray object without modifying that object. Assume enough array capacity and at least three DArray elements.';
const questions = [];
function add(id, chapter, sourceQuestion, category, prompt, options, answer, explanation, code='', codeChoices=false, relatedTerms=[]) {
  questions.push({id,chapter,sourceQuestion,category,prompt,options,answer,explanation,code,codeChoices,relatedTerms,
    source: chapter==='2'?'Ch2 quiz.pdf · Quiz 2, chapter 2':'Ch1 quiz.pdf · Quiz 3, chapters 3–4'});
}
add('dll-1','2','1','Linked lists',
'A member function replaceValue changes the last node’s data to 999. Which declaration belongs inside class DoublyList?',
['void DoublyList::replaceValue();','void replaceValue();','void replaceValue() const;','void DoublyList::replaceValue() const;'],1,
'Inside the class, write the unqualified member name. The operation changes the list’s logical state, so the intended interface is non-const. Use DoublyList:: when defining the function outside the class. Note that const on a class containing raw pointers does not automatically make the pointed-to nodes const.', '',true,['Member function','Class qualifier','const modifier on a member function']);
add('dll-2','2','2','Linked lists',
'Append a new node containing the first node’s data. first and last point to a list with at least two nodes; last->next is nullptr. Which sequence is correct? Assume Node(data, prev, next), and that the count is incremented separately.',
['last = last->getNext();\nlast->setNext(new Node(first->getData(), last, nullptr));',
'last->setNext(new Node(first->getData(), last, nullptr));\nlast = last->getNext();',
'last->setNext(new Node(first->getNext()->getData(), last, nullptr));\nlast = last->getNext();',
'last->getNext()->setNext(new Node(first->getData(), last, nullptr));\nlast = last->getNext();'],1,
'Create the new node with its prev pointing to the old tail and its next set to nullptr. Link the old tail to it, then move last to the new node. Moving last first would make it nullptr. Using first->getNext()->getData() copies the second node’s data.', '',true,['Node','Pointer','new operator']);
add('dll-3','2','3','Linked lists',
'Inside a DoublyList member function, what does paramList.first = first; do?',
['Copies the first node’s data into the parameter list’s first node.','Makes the calling object’s first pointer point to the parameter list’s first node.','Makes the parameter object’s first pointer point to the calling object’s first node.','Creates a deep copy of the calling object’s list.'],2,
'This assigns an address. The left side belongs to paramList and the right side belongs to the calling object. Both pointers now refer to the same node; no node or data value is copied. Shared ownership can cause problems if both objects later delete the same nodes.',
'void DoublyList::function(DoublyList& paramList)\n{\n    paramList.first = first;\n}',false,['Pointer','Passing by reference']);
for(const [suffix,label,answer] of [['first','first',1],['last','last',2],['p1','p1',0],['p3','p3',3]]) {
 add('dll-4-'+suffix,'2','4 · '+label,'Linked lists',
 `After this tracing code runs, where does ${label} point? Assume Node(data, prev, next) and ordinary link getters/setters.`,
 ['nullptr','The node storing 5','The node storing 7','The node storing 2','The node storing 8'],answer,traceExplanation,traceCode,false,['Pointer','Node']);
}
add('dll-5','2','5','Linked lists',
'A three-node list has first → node 1, p → node 2, q → node 3. Which segments correctly connect both ends into a doubly linked circular list? Each segment starts from the original list.',
['1 and 3 only','2 and 3 only','1 only','1, 2, and 3','3 only','1 and 2 only','2 only'],1,
'Segment 2 sets node 1’s prev to node 3 and node 3’s next to node 1. Segment 3 does the same using p->getNext() to reach node 3. Segment 1 sets node 3’s next correctly, but then moves q to node 1 and incorrectly makes node 1’s prev point to itself.',
'1. q->setNext(first);\n   q = q->getNext();\n   first->setPrev(q);\n\n2. p->getPrev()->setPrev(q);\n   q->setNext(p->getPrev());\n\n3. first->setPrev(p->getNext());\n   p->getNext()->setNext(first);',false,['Doubly linked list','Pointer']);
add('dll-6','2','6','Linked lists',
'ptr points to node 2. Copy node 3’s data into node 1, leaving node 3 unchanged. Assume getData() returns int by value and setData(int) updates a node.',
['ptr->getPrev()->setData(ptr->getData());','ptr->getPrev()->getData() = ptr->getNext()->getData();','ptr->getPrev()->setData(ptr->getNext()->getData());','ptr->setPrev(ptr->getNext()->getData());'],2,
'ptr->getPrev() reaches the destination (node 1). ptr->getNext()->getData() reads the source (node 3). Pass the source value into the destination’s setData. A value-returning getter cannot be assigned to.',
'node 1  ⇄  node 2  ⇄  node 3\n             ↑ ptr',true,['Pointer','Node','Member function']);
add('dll-7','2','7','Linked lists',
'ptr points to node 2. Copy node 1’s data into node 3, leaving node 1 unchanged. Assume getData() returns int by value.',
['ptr->getNext()->setData(ptr->getPrev()->getData());','ptr->getNext()->setData(ptr->getData());','ptr->getNext()->getData() = ptr->getPrev()->getData();','ptr->getNext()->setData() = ptr->getPrev()->getData();'],0,
'The destination is ptr->getNext() (node 3), so call its setter. The source is ptr->getPrev() (node 1), so read its data. Keep “destination setter(source getter)” in mind.',
'node 1  ⇄  node 2  ⇄  node 3\n             ↑ ptr',true,['Pointer','Node','Member function']);
add('dll-8','2','8','Linked lists',
'Insert a node storing 9 between node 1 and node 2. ptr points to node 2. Which code correctly preserves both directions? Assume DLLNode(data, prev, next).',
['DLLNode* tempPtr = new DLLNode(9, ptr->getPrev(), ptr);\nptr->getPrev()->setNext(tempPtr);\nptr->setPrev(tempPtr);',
'DLLNode* tempPtr = new DLLNode(9, ptr->getPrev(), ptr);\nptr->setPrev(tempPtr);\nptr->getPrev()->setNext(tempPtr);',
'DLLNode* tempPtr = new DLLNode(9, ptr->getNext(), ptr);\nptr->getPrev()->setNext(tempPtr);\nptr->setPrev(tempPtr);',
'DLLNode* tempPtr = new DLLNode(9, ptr->getPrev(), ptr);\nptr->setPrev(tempPtr->getNext());'],0,
'The constructor connects the new node backward to node 1 and forward to node 2. Set node 1’s next to the new node before replacing node 2’s prev. Doing these two updates in the wrong order loses access to node 1 through ptr->getPrev().',
'Before: node 1 ⇄ node 2 (ptr) ⇄ node 3\nAfter:  node 1 ⇄ new node(9) ⇄ node 2 (ptr) ⇄ node 3',true,['Node','new operator','Doubly linked list']);
add('array-1','3–4','1','DArray',
'In a DArray destructor, what does delete[] a; do when a points to storage allocated with new int[n]?',
['Deletes the pointer variable itself.','Releases the dynamically allocated array that a points to.','Deletes both the array and the pointer variable.','Sets a to nullptr without releasing the array.'],1,
'delete[] matches an allocation with new[]. It releases the array storage; it does not delete the pointer variable or set it to nullptr. The pointer value is dangling afterward unless overwritten.',
'DArray::~DArray()\n{\n    delete[] a;\n}',false,['Destructor','Dynamic array','Pointer']);
add('array-2','3–4','2','DArray',
'Overwrite the calling object’s first element with the parameter object’s last element. Both arrays are non-empty. Which statement is correct inside DArray::overwrite?',
['otherArray[0] = arr[otherArray.numOfElements - 1];','arr[0] = otherArray.arr[numOfElements - 1];','arr[0] = otherArray[otherArray.numOfElements - 1];','arr[0] = otherArray.arr[otherArray.numOfElements - 1];'],3,
'The destination is this object’s arr[0]. The source storage and size must both come from otherArray. A member function may access private members of another instance of its own class. The parameter is const because it is only read.',
'// Private members: int* arr; int capacity; int numOfElements;\nvoid DArray::overwrite(const DArray& otherArray)\n{\n    // statement goes here\n}\n// Calling: 1 2 3 4; parameter: 5 6 7 8\n// Result:  8 2 3 4; parameter unchanged',true,['Instance of a class','const modifier on a parameter']);
const passParts = [
 ['vector','vector',['const vector<int> aVector','vector<int> aVector','const vector<int>& aVector','vector<int>& aVector'],3,'The function changes the caller’s vector, so use a non-const reference. Passing by value modifies a copy; passing by const reference disallows the required modifications.',['Passing by reference','Passing by value']],
 ['object','DArray object',['DArray darrayObj','DArray& darrayObj','const DArray darrayObj','const DArray& darrayObj'],3,'The object is read but not changed. const DArray& avoids copying and expresses read-only access. DArray& could work but permits unnecessary mutation.',['const modifier on a parameter','Passing by reference']],
 ['array','raw int array',['int arr[]','const int arr[]','int& arr[]','const int& arr[]'],0,'In a function parameter, int arr[] is adjusted to int* arr, allowing changes to the original elements. const int arr[] prohibits element changes. Arrays of references are not valid C++. This is not pass-by-reference of the whole array.',['Dynamic array','Pointer']],
 ['count','number of elements',['const int& numOfElem','int numOfElem','int& numOfElem','const int numOfElem'],2,'The example requires the caller’s array count to change. int& binds to the caller’s count and allows that update. A value parameter changes only a local copy; const reference prevents modification.',['Passing by reference','Passing by value']]
];
for(const [suffix,label,opts,answer,explanation,related] of passParts) add('pass-'+suffix,'3–4','3 · '+label,'Functions',`${passContext}\n\nWhat is the best parameter declaration for the ${label}?`,opts,answer,explanation,'',true,related);
add('template-4','3–4','4','Templates',
'Which is the correct out-of-class definition header for TestTemp<T>::getValue()? The class declares T getValue() const;',
['template<typename T>\nT TestTemp<T>::getValue() const','T TestTemp::getValue() const','T TestTemp<T>::getValue() const','template<T>\nT TestTemp<T>::getValue() const','template<typename T>\nT TestTemp::getValue() const'],0,
'Restate the template parameter list, qualify the class with <T>, and match the trailing const in the declaration. Template definitions normally need to be visible where they are instantiated (often in a header); placing them in a separately compiled .cpp requires an explicit-instantiation strategy.',
 'template<typename T>\nclass TestTemp\n{\npublic:\n    TestTemp();\n    void setValue(const T& newValue);\n    T getValue() const;\nprivate:\n    T value;\n};',true,['Class template','Class qualifier','Header file']);
add('template-5','3–4','5','Templates',
'A class template stores T memberVar. Its getter is meant to return that stored value. Which declaration gives the getter the correct return type?',
['TemplateClass getMemberVar() const;','T getMemberVar() const;','TemplateClass<T> getMemberVar() const;','void getMemberVar() const;'],1,
'The stored value has type T, so a getter that returns that value should return T. Returning TemplateClass or TemplateClass<T> returns a class object instead. This item isolates the getter issue shown in the PDF; other declarations in the original snippet also need review if their comments promise whole-object comparison.',
 'template<typename T>\nclass TemplateClass\n{\npublic:\n    // Declare the getter here.\nprivate:\n    T memberVar;\n};',true,['Class template','Member function']);
add('template-6','3–4','6','Templates',
'Why can using const T& param be more efficient than T param in a function template when the function only reads the argument?',
['A reference always requires const.','T may be a large object type, and binding a reference avoids copying it.','Returning T& requires every parameter to be a reference.','A non-member function cannot take arguments by value.'],1,
'T can be an object whose copy is expensive. A const reference avoids that copy and prevents modification through the parameter. References do not inherently require const, and for small scalar types passing by value may be just as good or better. The return type is not the reason.',
 'template<typename T>\nvoid inspect(const T& param);',true,['Passing by reference','Passing by value','const modifier on a parameter']);
add('template-7','3–4','7','Templates',
'What happens when swapValues(num1, num2) is compiled with the code below?',
['Compilation error','6 6','3 3','3 6','6 3'],0,
'Template argument deduction tries to deduce a single T from both arguments. int& requires T = int, while double& requires T = double. These conflict, so no matching instantiation is deduced. The program does not reach the output statement.',
 'template<typename T>\nvoid swapValues(T& value1, T& value2)\n{\n    T temp = value1;\n    value1 = value2;\n    value2 = temp;\n}\nint main()\n{\n    int num1 = 3;\n    double num2 = 6;\n    swapValues(num1, num2);\n    std::cout << num1 << " " << num2;\n}',false,['Function template','Passing by reference']);
function optionsFor(question, random=Math.random) {
 const choices=question.options.map((text,index)=>({id:question.id+'-option-'+index,text,correct:index===question.answer}));
 for(let i=choices.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}return choices;
}
if(typeof module!=='undefined')module.exports={questions,optionsFor};else root.CoursePractice={questions,optionsFor};
})(typeof window!=='undefined'?window:globalThis);
