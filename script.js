
//categories -> id, name

//items -> item -> id, name, qty, image, category (id)

//order -> ghgh

const categoryList=["All","Beverages","Snacks"];
const items=[
    item1 = {
    		"id": 1,
			"name": "Tea",
			"image": "Cup-of-tea.jpg",	
			"category": 1,
			},
  	item2 = {
			"id": 2,
			"name": "Coffee",
			"image": "Coffee.jpeg",	
			"category": 1,
			},
	item3={
			"id": 3,
			"name": "Milk",
			"image": "milk.jpg",	
			"category": 1,
			},
	item4={
			"id": 4,
			"name": "Bourbon Biscuit",
			"image": "bourbon.jpg",	
			"category": 2,
			},
	item5={
			"id": 5,
			"name": "Jim Jam Biscuit",
			"image": "jimjam.jpeg",	
			"category": 2,
			},
	item6={
			"id": 6,
			"name": "Dark Fantasy",
			"image": "darkfantasy.jpg",	
			"category": 2,
			}
];

let cartItems = [];


const cart=document.getElementById("cart");
const cancel=document.getElementsByClassName("pencancel");
const plus=document.getElementsByClassName("plus");
const minus=document.getElementsByClassName("minus");
const cartRemove=document.getElementsByClassName("cartremove");

const cartLocation = document.getElementById("cartlist");
const pendingList = document.getElementsByClassName("penlist");
const itemList=document.getElementsByClassName("itemmenu")[0];
//const showItemList=document.getElementsByClassName("itemName")[0]; 		

addItemsFromLocal();
addCategoriesFromLocal();
localStorage.setItem("orderId",1);

function addCategoriesFromLocal(){
	let categoryBox=document.getElementsByClassName("categories")[0];
	categoryList.forEach((currCategory,index)=>{
		let newCategory = document.createElement('div');
		newCategory.setAttribute("class","categoryitem");
		newCategory.setAttribute("id","c"+index);
		if(currCategory==="All")
		{
			newCategory.setAttribute("class","categoryitem highlight");	
		}
		newCategory.innerHTML=`	<a href="#" style="text-decoration: none;">${currCategory}</a>`
		newCategory.onclick=displayCategoryItems;
		categoryBox.appendChild(newCategory);
		});
}

function addItemsFromLocal(){
		items.forEach((currItem)=>{	
			let newItem = document.createElement('li');
			newItem.setAttribute("class","item");
			let name=currItem.id;
			newItem.setAttribute("id",name);
			newItem.innerHTML=`	<div class="imgdiv">
					  					<img class="img" src="images/${currItem.image}" alt="${currItem.image} image">
					  				</div>
					  				<div class="itemname">${currItem.name}</div>
					  				<div class="buttondiv">
					  					<button class="addtocart-button w-green" onclick="addToCart(${name});">Add to cart</button>
					  				</div>
					  		   `
			itemList.appendChild(newItem);	
			});
}

function addnewCartElement(fileName,itemName){
	let newCartElement ;
	newCartElement = document.createElement('li');
	newCartElement.setAttribute('class',"w-bar cartbox");
	newCartElement.innerHTML = `
							<img src=${fileName} class="w-bar-item w-circle" style="width:130px" >
					     	<div class="w-bar-item">
					        	<div class="orderlistitem">
					        		<span class="itemname">${itemName}</span>
					    		</div>
					       		<button class="plus" onclick="increaseQty()">+</button>
					  			<div class="boxitemqty">
					  				<input type="text" value="1" class="boxtext">
					  			</div>
					  			<button class="minus">-</button>
					  	    	</div>
					  	    	<div class="cartremove">
					  	    		<span>Remove</span>		
					  	    	</div>
						`
	cartLocation.appendChild(newCartElement);
    plus[plus.length-1].onclick=increaseQty;
	minus[minus.length-1].onclick=decreaseQty;
	cartRemove[cartRemove.length-1].onclick=removeFromCart;
}

function ifAlreadyInCart(itemName){
	const currOrderList=document.getElementById("cartlist").getElementsByClassName("cartbox");
	let itemIndex=cartItems.indexOf(itemName);
	if(itemIndex != -1)
	{
		for(let index in currOrderList)
		{
			if(currOrderList[index].getElementsByClassName("itemname")[0].innerHTML===itemName)
			{	
				let qty=currOrderList[index].getElementsByClassName("boxtext")[0];
				qty.setAttribute("value",parseInt(qty.value)+1);	
				return true;
			}
		}
	}
	return false;
}

function addToCart(currentElementId) {
	//const selectedItem = event.currentTarget;
	//const parent = selectedItem.parentNode.parentNode;
	let itemName;
	let itemImage;
	let imageSrc;
	let fileName;
	let alreadyPresent=false;
	let parent=document.getElementById(currentElementId);
	let currentElement=parent.getElementsByClassName("itemname")[0];
	itemName=currentElement.innerHTML; 
	if(ifAlreadyInCart(itemName))return;
		
	cartItems.push(itemName);
	
	itemImage=parent.getElementsByClassName("img")[0];
	imageSrc = itemImage.src;
	imageSrc=imageSrc.split("/");
	fileName=imageSrc[imageSrc.length-1];
	fileName="images/"+fileName;
	addnewCartElement(fileName,itemName);	
}

function displayCategoryItems(){
 	
 		let categoryBox=document.getElementsByClassName("categoryitem");
		console.log(categoryBox);
		for(category of categoryBox)
		{
			category.classList.remove("highlight");
		}
		let currentElement=event.currentTarget;
		currentElement.classList.add("highlight");
		let currCategory=parseInt(currentElement.id.substring(1));
		let categoryId=categoryList[currCategory];
		let allItems=document.getElementsByClassName("item");
		
		for(item of allItems)
		{
			let userId=item.getAttribute("id");
			let currItem = items.find((itemdata)=>{
							return userId==itemdata.id;
							});
			if(currCategory==0 || currItem.category===currCategory)
			{
				item.style.display="block";
			}
			else
			{
				item.style.display="none";
			}
		}
}

function cancelOrder(event){
	let cancelBtn = event.currentTarget;
	let currOrderItem=cancelBtn.parentNode.parentNode;
	currOrderItem.parentNode.removeChild(currOrderItem);
}
function removeFromCart(event){
	//camelcase, const
	let deleteIcon = event.currentTarget;
	let currItem= deleteIcon.parentNode;
	let itemName=currItem.getElementsByClassName("itemname");
	let val=itemName[0].innerHTML;
	let index=cartItems.indexOf(val);
	cartItems.splice(index,1);
	currItem.parentNode.removeChild(currItem);
}
//common functions and object implementation
function increaseQty(event){
	console.log("in");
	let plusbtn = event.currentTarget;
	let parent = plusbtn.parentNode;
	let parent_plusbtn=parent.getElementsByClassName("boxtext")[0];
	parent_plusbtn.setAttribute("value",parseInt(parent_plusbtn.value)+1);
}
function decreaseQty(event){
	let minusbtn = event.currentTarget;
	let parent = minusbtn.parentNode;
	let parent_minusbtn=parent.getElementsByClassName("boxtext")[0];
	if(parent_minusbtn.value==0)
		return ;
	parent_minusbtn.setAttribute("value",parseInt(parent_minusbtn.value)-1);
}

function buildOrderDetails(){
	const cart=document.getElementsByClassName("orderlistitem"); 
	const cartqty=document.getElementsByClassName("boxitemqty"); 
	let orderDetails="";
	if(cart.length==0)
		return "";
	// cart.forEach() //use data tags to add and retrive data
		//buildOrderDetails
	for(let i=0;i<cart.length;i++)
	{ 	
		const cartitem=cart[i].getElementsByClassName("itemname")[0].innerHTML; //camelcase
		const qty=cartqty[i].getElementsByClassName("boxtext")[0].value;
		orderDetails+=cartitem;
		orderDetails+=" : "
		orderDetails+=qty;
		orderDetails+='<br>';
	}
	return orderDetails;
}
function timeNow() {
  let d = new Date(),
      h = (d.getHours()<10?'0':'') + d.getHours(),
      m = (d.getMinutes()<10?'0':'') + d.getMinutes();
  return h + ':' + m;
}
function placeOrder(event){
	let orderDetails=buildOrderDetails();
	if(orderDetails.length==0){return;}
	let newOrderElement = document.createElement('li');
	newOrderElement.setAttribute('class',"penlistitem");
	currTime=timeNow();

	newOrderElement.innerHTML = `
					<div class="penpersonimg">
					 	<img src="images/person.png" style="width: 100px;">
					</div>
					<div class="penperson">
						Table No : 1 <br>
						Time: ${currTime}
					</div>
					<div class="penorder">
					 	<div class="penorderitems">${orderDetails}</div>
					</div>
					<div class="penstatus">
					   Status : Pending 	
					</div>
					<div class="penextra">
					  	 <div class="pencancel">	
					  	 	<button class="pencancelbutton">Cancel Order</button>
					  	</div>
					 </div>
				`
	pendingList[0].appendChild(newOrderElement);
	cancel[cancel.length-1].onclick=cancelOrder;
	addOrderToLocal(orderDetails);
	emptyCart();
}
function emptyCart(){
	cartItems = [];	
	cartLocation.innerHTML="";
}

function addOrderToLocal(orderDetails){
	let orderObject={};
	orderObject.userDetails="Ronak Vaghela<br> Table No: 1 <br> Time: 10:10";
	orderObject.orderDetails=orderDetails;
	orderObject.status="pending";
	let orderId=parseInt(localStorage.getItem("orderId"));
	localStorage.setItem("orderId",orderId+1);
	localStorage.setItem("Order"+orderId,JSON.stringify(orderObject));
}
document.getElementsByClassName("placeorderbutton")[0].onclick = placeOrder;



