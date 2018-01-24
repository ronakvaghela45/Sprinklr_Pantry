
//categories -> id, name

//items -> item -> id, name, qty, image, category (id)

//order -> ghgh

let cartItems = [];
let categories=document.getElementsByClassName("categoryitem");
const cart=document.getElementById("cart");
const menu=document.getElementById("items");
const cancel=document.getElementsByClassName("pencancel");
let addToCartButtons = document.getElementsByClassName("addtocart-button");
let orderId=0;
//const catergoryA:{ "ALL" , "Beverages", "Snacks"};
const plus=document.getElementsByClassName("plus");
const minus=document.getElementsByClassName("minus");
const cartRemove=document.getElementsByClassName("cartremove");

localStorage.clear();

for(let i in addToCartButtons){
	addToCartButtons[i].onclick=addToCart;
}
function addToCart(event) {
	const selectedItem = event.currentTarget;
	const parent = selectedItem.parentNode.parentNode;
	const cartLocation = document.getElementsByClassName("cartcart");
	const currOrderList=document.getElementById("cartlist").getElementsByClassName("cartbox");
	let itemName;
	let itemImage;
	let imageSrc;
	let fileName;
	let newartElement ;
	let alreadyPresent=false;
	itemName=parent.getElementsByClassName("itemname")[0].innerHTML; 
	let itemIndex=cartItems.indexOf(itemName);
	if(itemIndex != -1)
	{
		for(let index in currOrderList)
		{
			if(currOrderList[index].getElementsByClassName("itemname")[0].innerHTML===itemName)
			{	
				let qty=currOrderList[index].getElementsByClassName("boxtext")[0];
				qty.setAttribute("value",parseInt(qty.value)+1);	
				return;
			}
		}
	}

	cartItems.push(itemName);
	
	itemImage=parent.getElementsByClassName("img")[0];
	imageSrc = itemImage.src;
	imageSrc=imageSrc.split("/");
	fileName=imageSrc[imageSrc.length-1];
	fileName="images/"+fileName;
	
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
	cartLocation[0].appendChild(newCartElement);
 
    plus[plus.length-1].onclick=increaseQty;
	minus[minus.length-1].onclick=decreaseQty;
	cartRemove[cartRemove.length-1].onclick=removeFromCart;
}

function displayBeverages(event){
    let currentelement = event.currentTarget;
  	for (let index in categories)
  	{
  		categories[index].className=("categoryitem nobg");
  	}
  	let allitem = document.getElementsByClassName("item");
    for(let i=0;i<allitem.length;i++){
        allitem[i].style.display = "none";
    }
    let items = document.getElementsByClassName("beverages");
    for(let i=0;i<items.length;i++){
   	    items[i].style.display = "block";
     }
     categories[1].className="categoryitem highlight";
}

function displayAll(event){
  	let allitem = document.getElementsByClassName("item");
   	for(let i=0;i<categories.length;i++)
  	{
  		categories[i].className=("categoryitem nobg");
  	}
  	
    for(let i=0;i<allitem.length;i++){
        allitem[i].style.display = "block";
    }
   categories[0].className=" categoryitem highlight";
}

function displaySnacks(event){
    let currentelement = event.currentTarget;
  
  	 for(let i=0;i<categories.length;i++)
  	{
  		categories[i].className=("categoryitem nobg");
  	}
  	let allitem = document.getElementsByClassName("item");
    for(let i=0;i<allitem.length;i++){
        allitem[i].style.display = "none";
    }
    let biscuit = document.getElementsByClassName("snacks");
    for(let i=0;i<biscuit.length;i++){
   	    biscuit[i].style.display = "block";
     }

   categories[2].className=" categoryitem highlight";
}
categories[0].onclick = displayAll;
categories[1].onclick = displayBeverages;
categories[2].onclick = displaySnacks;

function cancelOrder(event){
	let cancelBtn = event.currentTarget;
	let currOrderItem=cancelBtn.parentNode.parentNode;
	currOrderItem.parentNode.removeChild(currOrderItem);
}

function removeFromCart(event){
	//camelcase, const
	let delete_icon = event.currentTarget;
	let currItem= delete_icon.parentNode;
	let itemName=currItem.getElementsByClassName("itemname");
	let val=itemName[0].innerHTML;
	for(let index=0;index<cartItems.length;index++)
	{
		if(cartItems[index]===val)
		{		
			cartItems.splice(index,1);
			break;
		}
	}	
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

function placeOrder(event){
	let orderDetails=buildOrderDetails();
	if(orderDetails.length==0){return;}
	const pendingList = document.getElementsByClassName("penlist");
	let newOrderElement = document.createElement('li');
	newOrderElement.setAttribute('class',"penlistitem");
	newOrderElement.innerHTML = `
					<div class="penpersonimg">
					 	<img src="images/person.png" style="width: 100px;">
					</div>
					<div class="penperson">
						Table No : 1 <br>
						Time: 10:10
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
}
function addOrderToLocal(orderDetails)
{
	let orderObject={};
	orderObject.userDetails="Ronak Vaghela<br> Table No: 1 <br> Time: 10:10";
	orderObject.orderDetails=orderDetails;
	orderObject.status="pending";
	localStorage.setItem("Order"+orderId,JSON.stringify(orderObject));
	orderId++;	
}
document.getElementsByClassName("placeorderbutton")[0].onclick = placeOrder;



