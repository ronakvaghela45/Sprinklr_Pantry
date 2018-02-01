
//categories -> id, name

//items -> item -> id, name, qty, image, category (id)

//order -> ghgh



const model={

     categoryList : ["All","Beverages","Snacks"],
     currCategory: "All", 
 	 cartItems : [],
     items : [
	   			{
	    		"id": "item1",
				"name": "Tea",
				"image": "Cup-of-tea.jpg",	
				"category": "Beverages",
				"qty":0;
				},
	  		    {
				"id": "item2",
				"name": "Coffee",
				"image": "Coffee.jpeg",	
				"category": "Beverages",
				"qty":0;
				},
				{
				"id": "item3",
				"name": "Milk",
				"image": "milk.jpg",	
				"category": "Beverages",
				"qty":0;
				},
				{
				"id": "item4",
				"name": "Bourbon Biscuit",
				"image": "bourbon.jpg",	
				"category": "Snacks",
				"qty":0;
				},
				{
				"id": "item5",
				"name": "Jim Jam Biscuit",
				"image": "jimjam.jpeg",	
				"category": "Snacks",
				"qty":0;
				},
				{
				"id": "item6",
				"name": "Dark Fantasy",
				"image": "darkfantasy.jpg",	
				"category": "Snacks",
				"qty":0;
				}
				]
};  



const cancelbuttons=document.getElementsByClassName("pencancel");
const cartLocation = document.getElementById("cartlist");
const pendingList = document.getElementsByClassName("penlist");
const itemList=document.getElementById("items");


localStorage.setItem("orderId",1);


//html templates
//insert items together


const connecter={	
	
	init : function(){
		itemView.init();
		cartView.init();
		this.currCartList=document.getElementById("cartlist").getElementsByClassName("cartbox");	
		categoryView.init();
	},

	getCategories:function(){
		return model.categoryList;
	},
	getCurrCategory:function(){
		return model.currCategory;
	},
	setCurrCategory:function(newCategory){
		model.currCategory=newCategory;
	},
	changeCategory : function(newCategory){
		if(newCategory===connecter.getCurrCategory()) return;
		connecter.setCurrCategory(newCategory);
		categoryView.render();
		itemView.render();
	},
	getItemsOfCurrCategory: function(){
		let currCategory=connecter.getCurrCategory();
		let items = connecter.getAllItems();
		return items.filter(function(item) {
                return (item.category===currCategory || currCategory==="All");
            });
	 },
	getVisibleItems : function(){
		let displayItems=connecter.getItemsOfCurrCategory();
		return displayItems;
	},
	getAllItems:function(){
		return model.items;
	},
	addToCart : function(item){
		
		const cartItems=connecter.getCartItems();
		
		let ifAlreadyInCart;
		ifAlreadyInCart=connecter.ifAlreadyInCart(cartItems,item);
		let itemName=item.name;
		if(ifAlreadyInCart){
			for(let index in connecter.currCartList)
			{
				if(connecter.currCartList[index].getElementsByClassName('itemname')[0].innerHTML===itemName)
				{	
					connecter.changeQty(item,connecter.currCartList[index],1);
					break;
				}
			}
			return;	
		}
		else{
			cartItems.push(item);
			cartView.render(item);	
		}
	},
	getCartItems: function(){
		return model.cartItems;
	},


	ifAlreadyInCart: function(cartItems,item){
		let itemIndex=cartItems.indexOf(item);
		if(itemIndex != -1)
		{
			return true;
		}
		else{
			return false;
		}
	},
	changeQty: function(item,cartElement,change){
		let qty=cartElement.getElementsByClassName("boxtext")[0];
		if(change==-1 && qty.value==0)
		{
			connecter.removeFromCart(item,cartElement);
			return;
		}
		qty.setAttribute("value",parseInt(qty.value)+change);
		
	},
	removeFromCart:function(item,cartElement){
		let cartItems=connecter.getCartItems();
		let index=cartItems.indexOf(item);
		cartItems.splice(index,1);
		cartElement.parentNode.removeChild(cartElement);
	},
	buildOrderDetails: function(){
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
}


const itemView = { 

	init: function() {
	      this.render();
    },
    render: function() {
        
        let allItems = connecter.getVisibleItems();
        itemList.innerHTML = '';
		allItems.forEach((currItem)=>{	
			let newItem = document.createElement('li');
			newItem.setAttribute('class','item');
			newItem.innerHTML=`		<div class="imgdiv">
					  					<img class="img" src="images/${currItem.image}" alt="${currItem.image} image">
					  				</div>
					  				<div class="itemname">${currItem.name}</div>
					  				<div class="buttondiv">
					  					<button class="addToCart w-green">Add to cart</button>
					  				</div>
					  		   `
			addToCartButton = newItem.getElementsByClassName('addToCart')[0];
     	   	addToCartButton.addEventListener('click', connecter.addToCart.bind(null,currItem), false);
     		itemList.appendChild(newItem);	
		});
    }
};

const cartView = {

	init: function(){
			cartLocation.innerHTML='';
	    },	
    render: function(item){
			let itemName=item.name;
			let itemImageSrc="images/"+item.image;
			let itemQty=item.qty;
			let newCartElement ;
			newCartElement = document.createElement('li');
			newCartElement.setAttribute('class',"w-bar cartbox");
			newCartElement.innerHTML = `
									<img src=${itemImageSrc} class="w-bar-item w-circle" style="width:130px" >
							     	<div class="w-bar-item">
							        	<div class="orderlistitem">
							        		<span class="itemname">${itemName}</span>
							    		</div>
							       		<button class="plus">+</button>
							  			<div class="boxitemqty">
							  				<input type="text" value="${itemQty}" class="boxtext">
							  			</div>
							  			<button class="minus">-</button>
							  	    	</div>
							  	    	<div class="cartremove">
							  	    		<span>Remove</span>		
							  	    	</div>
								`
			cartLocation.appendChild(newCartElement);
		  	plusButton = newCartElement.getElementsByClassName('plus')[0];
     	   	minusButton = newCartElement.getElementsByClassName('minus')[0];
     		removeButton = newCartElement.getElementsByClassName('cartremove')[0];
     	   	
     	   	plusButton.addEventListener('click', connecter.changeQty.bind(null,item,newCartElement,1), false);
     		minusButton.addEventListener('click', connecter.changeQty.bind(null,item,newCartElement,-1), false);
     	    removeButton.addEventListener('click', connecter.removeFromCart.bind(null,item,newCartElement), false);
     	},
};
 
const categoryView={
	init:function(){
		this.render();
	},
	render: function(item){
		let categoryBox=document.getElementsByClassName("categories")[0];
		categoryBox.innerHTML='';
		let categories=connecter.getCategories();
		let currCategory=connecter.getCurrCategory();
		categories.forEach((category,categoryIndex)=>{
			let newCategory = document.createElement('div');
			newCategory.setAttribute("class","categoryitem");
			if(category===currCategory)
			{
				 newCategory.classList.add("highlight");
			}
			newCategory.innerHTML=`	<a href="#" style="text-decoration: none;" >${category}</a>`
			newCategory.addEventListener('click',connecter.changeCategory.bind(null,category),false);
			categoryBox.appendChild(newCategory);
		});
	}
};  
connecter.init();

const pendingOrdersView={

}


function cancelOrder(event){
	let cancelBtn = event.currentTarget;
	let currOrderItem=cancelBtn.parentNode.parentNode;
	currOrderItem.parentNode.removeChild(currOrderItem);
}

//common functions and object implementation


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
	cancelbuttons[cancelbuttons.length-1].onclick=cancelOrder;
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



