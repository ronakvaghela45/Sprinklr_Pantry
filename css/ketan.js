



function deletionEventHandler(event){
	let delete_icon = event.currentTarget;
	let parent_element = delete_icon.parentNode.parentNode;
	parent_element.parentNode.removeChild(parent_element);
}
let delete_item = document.getElementsByClassName("orderinfocancle1");
for(let i=0;i<delete_item.length;i++){
	delete_item[i].onclick = deletionEventHandler;
}

function updateplusvalue(event){
	let plusbtn = event.currentTarget;
	let parent_plusbtn = plusbtn.parentNode.childNodes;
	for(let i=0;i<parent_plusbtn.length;i++){
		if(parent_plusbtn[i].className=="orderinfovalue"){
			//console.log(parent_plusbtn[i]);
            parent_plusbtn[i].value = parseInt(parent_plusbtn[i].value)+1;
            break;
		}
	}

}
let updateplus = document.getElementsByClassName("orderinfoplus");
for(let i=0;i<updateplus.length;i++){
	updateplus[i].onclick = updateplusvalue;
}

function updateminusvalue(event) {
    let minusbtn = event.currentTarget;
    let parent_minusbtn = minusbtn.parentNode.childNodes;
    for(let i=0;i<parent_minusbtn.length;i++){
    	if(parent_minusbtn[i].className=="orderinfovalue"){
            if(parent_minusbtn[i].value==0){
                return;
            }
            else{
            	parent_minusbtn[i].value = parseInt(parent_minusbtn[i].value)-1;
            	break;
			}
		}
	}
}
let updateminus = document.getElementsByClassName("orderinfominus");
for(let i=0;i<updateminus.length;i++){
    updateminus[i].onclick = updateminusvalue;
}


let addtocartitem = [];
function addToCartEventHandler(event) {
	let selecteditem = event.currentTarget;
	let parent = selecteditem.parentNode;
	let children = parent.childNodes;
	let itemname=undefined;
	for(let i=0;i<children.length;i++){
		if(children[i].className == "menuitemname")
		{
			itemname=children[i].innerHTML;
			break;
		}
	}
	let flag = 0;
	for(let i=0;i<addtocartitem.length;i++){
		if(addtocartitem[i]==itemname){
			flag = 1;
		}
	}
	if(flag==1){
		return ;
	}
	addtocartitem.push(itemname);
	if(addtocartitem.length>0)
		cart.setAttribute('display',block);
	
	let itemvalue=undefined;
	let desiredchild=undefined;
	for(let i=0;i<children.length;i++){
		if(children[i].className=="addremovebutton")
		{
			desiredchild=children[i];
			break;
		}
	}
	let tempchildren=desiredchild.childNodes;
	for(let i=0;i<tempchildren.length;i++){
		if(tempchildren[i].className=="addvalue")
		{
			itemvalue=tempchildren[i].value;
			break;
		}
	}
	tempchildren=parent.parentNode.parentNode.childNodes;
	for(let i=0;i<tempchildren.length;i++)
	{
		if(tempchildren[i].className=="menudisplay")
		{
			desiredchild=tempchildren[i];
			break;
		}
	}
	let imagesrc = desiredchild.childNodes[1].src;
	imagesrc=imagesrc.split("/");
	let filename=imagesrc[imagesrc.length-1];
	filename="Image/"+filename;
	console.log(filename);
	let desiredInsertionLocation = document.getElementsByClassName("orderinfodisplay");
	let maindiv = document.createElement('div');
	maindiv.setAttribute('class',"orderinfodisplay1");
	let imgdiv = document.createElement('div');
	imgdiv.setAttribute('class',"orderinfoimg");
	let imgtag = document.createElement('img');
	imgtag.setAttribute('src',filename);
	imgtag.setAttribute('width',"64px");
	imgtag.setAttribute('height',"64px");
	imgdiv.appendChild(imgtag);

	let itemname1 = document.createElement('div');
	itemname1.setAttribute('class',"orderinfoname");
	let spantag = document.createElement('span');
	spantag.setAttribute('class',"orderinfoname1");
	spantag.textContent = itemname;
	itemname1.appendChild(spantag);

	let addremovebtn = document.createElement('div');
	addremovebtn.setAttribute('class',"orderinfoaddremove");

	let minusbtn = document.createElement('button');
	minusbtn.setAttribute('class',"orderinfominus");
	minusbtn.textContent = '-';
	minusbtn.onclick = updateminusvalue;

	let inputvalue = document.createElement('input');
	inputvalue.setAttribute('class',"orderinfovalue");
	inputvalue.value = itemvalue;
//	console.log(itemvalue);
	let plusbtn =document.createElement('button');
	plusbtn.setAttribute('class',"orderinfoplus");
	plusbtn.textContent = '+';
	plusbtn.onclick = updateplusvalue;

	addremovebtn.appendChild(minusbtn);
	addremovebtn.appendChild(inputvalue);
	addremovebtn.appendChild(plusbtn);

	let canclebtn = document.createElement('div');
	canclebtn.setAttribute('class',"orderinfocancle");
	//canclebtn.setAttribute('onclick',"deletionEventHandler()");
	let spancancle = document.createElement('span');
	spancancle.setAttribute('class',"orderinfocancle1");
	spancancle.textContent = 'X';
    spancancle.onclick=deletionEventHandler;
	canclebtn.appendChild(spancancle);

	maindiv.appendChild(imgdiv);
	maindiv.appendChild(itemname1);
	maindiv.appendChild(addremovebtn);
	maindiv.appendChild(canclebtn);
	desiredInsertionLocation[0].appendChild(maindiv);

}
let addToCartButtons = document.getElementsByClassName("menuaddtocart");
for(let i in addToCartButtons){
	addToCartButtons[i].onclick=addToCartEventHandler;
}


function displayallitem(event){
    let allitem = document.getElementsByClassName("menuitem1");
    document.getElementsByClassName("beverage")[0].className = "beverage";
    document.getElementsByClassName("snacks")[0].className = "snacks";
    for(let i=0;i<allitem.length;i++){
        allitem[i].style.display = "flex";
    }

}
document.getElementsByClassName("allmenu")[0].onclick = displayallitem;


function displaybeverage(event){

	let currentelement = event.currentTarget;
	currentelement.classList.add("active");
	document.getElementsByClassName("allmenu")[0].className = "allmenu";
	document.getElementsByClassName("snacks")[0].className = "snacks";
	let allitem = document.getElementsByClassName("menuitem1");
	for(let i=0;i<allitem.length;i++){
		allitem[i].style.display = "none";
	}
	let drink = document.getElementsByClassName("drink");
	for(let i=0;i<drink.length;i++){
		drink[i].style.display = "flex";
	}
}
document.getElementsByClassName("beverage")[0].onclick = displaybeverage;


function displaysnacks(event){
    let currentelement = event.currentTarget;
    currentelement.classList.add("active");
    document.getElementsByClassName("allmenu")[0].className = "allmenu";
    document.getElementsByClassName("beverage")[0].className = "beverage";

    let allitem = document.getElementsByClassName("menuitem1");
    for(let i=0;i<allitem.length;i++){
        allitem[i].style.display = "none";
    }
    let biscuit = document.getElementsByClassName("biscuit");
    for(let i=0;i<biscuit.length;i++){
        biscuit[i].style.display = "flex";
    }
}
document.getElementsByClassName("snacks")[0].onclick = displaysnacks;


function placeorderdelete(evet){
	let currentelement = event.currentTarget;
	let parentofcurrent = currentelement.parentNode.parentNode.parentNode;
	parentofcurrent.parentNode.removeChild(parentofcurrent);
}
let deleteorder = document.getElementsByClassName("delete");
for(let i=0;i<deleteorder.length;i++){
	deleteorder[i].onclick = placeorderdelete;
}

let text
function placeorder(event){
	let plactoeorder = event.currentTarget;
	let userfirstname = document.getElementById("firstname");
	let userlastname = document.getElementById("lastname");
	let tableno = document.getElementById("tablenum");
	let currentorder = document.getElementsByClassName("orderinfodisplay")[0].childNodes;

	let listitem = [];
	for(let i=0;i<currentorder.length;i++){
		let itemrow = currentorder[i].childNodes;
		let newitem = new Object();
		 for(let j=0;j<itemrow.length;j++){
		 	if(itemrow[j].className=="orderinfoname"){
				newitem.name = itemrow[j].childNodes[0].innerHTML;
		 	}
		 	if(itemrow[j].className == "orderinfoaddremove"){
		 		let temp =itemrow[j].childNodes;
		 		for(let k=0;k<temp.length;k++){
		 			if(temp[k].className=="orderinfovalue"){
		 				newitem.quentity = temp[k].value;
					}
				}
			}
		 }
		listitem.push(newitem);
	}


	let pendingorder = document.getElementsByClassName("unorderlist")[0];

	let  createlist = document.createElement('li');
	createlist.className = "listitem";

	let pendingimg = document.createElement('div');
	pendingimg.className = "pendingimg";
	let imgperson = document.createElement('img');
	imgperson.setAttribute('src',"Image/person.jpeg");
	imgperson.setAttribute('width',"85px");
	pendingimg.appendChild(imgperson);

	let nametable = document.createElement('div');
	nametable.className = "nameTable";
	let temp1 = document.createElement('span');
	temp1.className ="name1";
	temp1.textContent = userfirstname.value + " " +userlastname.value;
	let temp2 = document.createElement('span');
	temp2.className ="tablenumber";
	temp2.textContent = ("Table No:- "+tableno.value);

	nametable.appendChild(temp1);
	nametable.appendChild(temp2);

	let displayorderdiv = document.createElement('div');
	displayorderdiv.className = "displayorder";
	let vieworderdiv = document.createElement('div');
	vieworderdiv.className = "viewordertext";
	vieworderdiv.textContent = "View Order";
	let sublistdiv = document.createElement('div');
	sublistdiv.className = "sublist";
	for(let i=1;i<listitem.length;i++){
		let itemspan = document.createElement('span');
		itemspan.textContent = listitem[i].name+" :- "+listitem[i].quentity;
		sublistdiv.appendChild(itemspan);
	}
	displayorderdiv.appendChild(vieworderdiv);
	displayorderdiv.appendChild(sublistdiv);

	let buttondiv = document.createElement('div');
	buttondiv.className = "button";
	let statusdiv =document.createElement('div');
	statusdiv.className = "statusbutton";
	let textstatus = document.createElement('p');
	textstatus.className ="status";
	textstatus.textContent = "Pending...";
	statusdiv.appendChild(textstatus);

	let deletediv = document.createElement('div');
	deletediv.className ="deletebutton";
	let deletebtn = document.createElement('p');
	deletebtn.className ="delete";
	deletebtn.textContent = "Delete Order";
	deletebtn.onclick =placeorderdelete;
	deletediv.appendChild(deletebtn);

	buttondiv.appendChild(statusdiv);
	buttondiv.appendChild(deletediv);

	createlist.appendChild(pendingimg);
	createlist.appendChild(nametable);
	createlist.appendChild(displayorderdiv);
	createlist.appendChild(buttondiv);

	pendingorder.appendChild(createlist);


}
document.getElementsByClassName("orderinfobutton")[0].onclick = placeorder;


