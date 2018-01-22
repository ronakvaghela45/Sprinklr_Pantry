


let addtocartitem = [];
function addToCartEventHandler(event) {
	let selecteditem = event.currentTarget;
	let parent = selecteditem.parentNode.parentNode;
	let children = parent.childNodes;
	let itemname;
	let flag = 0;
	let itemimage;
	
	for(let i in children){
		if(children[i].className == "itemname")
		{
			itemname=children[i].innerHTML;
			break;
		}
	}
	for(let i in addtocartitem){
		if(addtocartitem[i]==itemname){
			flag = 1;
		}
	}
	if(flag==1){
		return ;
	}
	addtocartitem.push(itemname);
	console.log(cart);
	
	for(let i in children){
		if(children[i].className == "imgdiv")
		{
			for(let j=0;j<children[i].childNodes.length;j++)
				if(children[i].childNodes[j].className=="img")
					itemimage=children[i].childNodes[j];
			break;		
		}
	}

	let imagesrc = itemimage.src;
	imagesrc=imagesrc.split("/");
	let filename=imagesrc[imagesrc.length-1];
	filename="images/"+filename;
	console.log(filename);
	let desiredInsertionLocation = document.getElementsByClassName("cartcart");
	let plus=document.getElementsByClassName("plus");
	let minus=document.getElementsByClassName("minus");
	let cartremove=document.getElementsByClassName("cartremove");

	let maindiv = document.createElement('li');
	maindiv.setAttribute('class',"w-bar cartbox");
	maindiv.innerHTML = `
	<img src=${filename} class="w-bar-item w-circle" style="width:130px" >
					     	<div class="w-bar-item">
					        	<div class="orderlistitem">
					        		<span> ${itemname} </span>
					    		</div>
					       		<button class="plus">+</button>
					  			<div class="boxitemqty">
					  				<input type="text" value="1" class="boxtext">
					  			</div>
					  			<button class="minus">-</button>
					  	    	</div>
					  	    	<div class="cartremove">
					  	    		<span>Remove</span>		
					  	    	</div>
					  

	`
	desiredInsertionLocation[0].appendChild(maindiv);

	plus[plus.length-1].onclick=menuplusvalue;
	minus[minus.length-1].onclick=menuminusvalue;
	cartremove[cartremove.length-1].onclick=deletionEventHandler;
	

}

let addToCartButtons = document.getElementsByClassName("addtocart-button");
for(let i in addToCartButtons){
	addToCartButtons[i].onclick=addToCartEventHandler;
}



function deletionEventHandler(event){
	let delete_icon = event.currentTarget;
	let parent_element = delete_icon.parentNode;
	parent_element.parentNode.removeChild(parent_element);
}

let delete_item = document.getElementsByClassName("cartremove");
for(let i=0;i<delete_item.length;i++){
	delete_item[i].onclick = deletionEventHandler;
}


function menuplusvalue(event){
	let plusbtn = event.currentTarget;
	let parentchildren = plusbtn.parentNode.childNodes;
	let parent_plusbtn=undefined;
	for(let i=0;i<parentchildren.length;i++){
		if(parentchildren[i].className=="boxitemqty")
		{
			for(let j=0;j<parentchildren[i].childNodes.length;j++){
				if(parentchildren[i].childNodes[j].className=="boxtext")
						parent_plusbtn=parentchildren[i].childNodes[j];
			}
		}
	}
	parent_plusbtn.setAttribute("value",parseInt(parent_plusbtn.value)+1);
}


function menuminusvalue(event){
	let minusbtn = event.currentTarget;
	let parentchildren = minusbtn.parentNode.childNodes;
	let parent_minusbtn=undefined;
	for(let i=0;i<parentchildren.length;i++){
		if(parentchildren[i].className=="boxitemqty")
		{
			for(let j=0;j<parentchildren[i].childNodes.length;j++){
				if(parentchildren[i].childNodes[j].className=="boxtext")
						parent_minusbtn=parentchildren[i].childNodes[j];
			}
		}
	}
	if(parent_minusbtn.value==0)
		return ;
	parent_minusbtn.setAttribute("value",parseInt(parent_minusbtn.value)-1);
}
let menuminus = document.getElementsByClassName("minus");
for(let i=0;i<menuminus.length;i++){
	menuminus[i].onclick = menuminusvalue;
}