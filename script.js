
//categories -> id, name

//items -> item -> id, name, qty, image, category (id)

//order -> ghgh

(function() {

const model={

     userId: "User1",
     userName:"Ronak Vaghela",
     tableNo:"1",
     categoryList : ["All","Beverages","Snacks"],
     currCategory: "All", 
 	 cartItems : [],
     items : [
	   			{
	    		"id": "item1",
				"name": "Tea",
				"image": "Cup-of-tea.jpg",	
				"category": "Beverages",
				"qty":0
				},
	  		    {
				"id": "item2",
				"name": "Coffee",
				"image": "Coffee.jpeg",	
				"category": "Beverages",
				"qty":0
				},
				{
				"id": "item3",
				"name": "Milk",
				"image": "milk.jpg",	
				"category": "Beverages",
				"qty":0
				},
				{
				"id": "item4",
				"name": "Bourbon Biscuit",
				"image": "bourbon.jpg",	
				"category": "Snacks",
				"qty":0
				},
				{
				"id": "item5",
				"name": "Jim Jam Biscuit",
				"image": "jimjam.jpeg",	
				"category": "Snacks",
				"qty":0
				},
				{
				"id": "item6",
				"name": "Dark Fantasy",
				"image": "darkfantasy.jpg",	
				"category": "Snacks",
				"qty":0
				}
				]

};  

const connecter={	
	
	init : function(){
		this.currCartList=document.getElementById("cart-list").getElementsByClassName("cart-box");	
		connecter.initLocalStorage();
		itemView.init();
		cartView.init();
		categoryView.init();
		pendingOrdersView.init();
		orderHistoryView.init();
	},
	initLocalStorage:function(){
		if(localStorage.getItem("orderId")===null)
			localStorage.setItem("orderId",1);
		if(localStorage.getItem("Pending")===null)
			localStorage.setItem("Pending",JSON.stringify([]));
		if(localStorage.getItem("Completed")===null)
			localStorage.setItem("Completed",JSON.stringify([]));
	},
	getUserId(){
		return model.userId;
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
		//need to be updated using data-id
		if(ifAlreadyInCart){
			for(let index in connecter.currCartList)
			{
				if(connecter.currCartList[index].getElementsByClassName('item-name')[0].innerHTML===itemName)
				{	
					connecter.changeQty(item,connecter.currCartList[index],1);
					break;
				}
			}
			return;	
		}
		else{
			item.qty=1;
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
		let qty=parseInt(item.qty);
		if(change===-1 && qty===1)
		{
			connecter.removeFromCart(item,cartElement);
			return;
		}
		item.qty=item.qty+parseInt(change);
		cartView.displayQtyChange(item,cartElement);
	},
	removeFromCart:function(item,cartElement){
		item.qty=0;
		let cartItems=connecter.getCartItems();
		let index=cartItems.indexOf(item);
		cartItems.splice(index,1);
		cartElement.parentNode.removeChild(cartElement);
	},
	emptyCart:function(){
		model.cartItems=[];	
		cartView.init();
	},
	placeOrder: function(){
		
		let orderDetails=connecter.buildOrderDetails();
		if(Object.keys(orderDetails).length==0){return;}	
		if(confirm("Do you want to place order?"))
		{
			let orderObject=connecter.buildOrderObject(orderDetails);
			connecter.addOrderToLocal(orderObject);
			pendingOrdersView.render(orderObject);
			connecter.emptyCart();
		}
		else{
			return;
		}
	},
	//order deatils contains Item name:Qty
	buildOrderDetails: function(){
		const cartItems=connecter.getCartItems();
		let orderDetails={};
		if(cartItems.length===0)
			return "";
		for(let item in cartItems){ 	
			let qty=cartItems[item].qty;
			orderDetails[cartItems[item].name]=qty;
		}
		return orderDetails;
	},
	getCurrTime: function(){
		let d = new Date(),
		    h = (d.getHours()<10?'0':'') + d.getHours(),
		    m = (d.getMinutes()<10?'0':'') + d.getMinutes();
		return h + ':' + m;
	},
	
	buildOrderObject:function(orderDetails){
		let orderObject={};
		let userName=
		orderObject.userDetails=model.userName+"<br> Table No:"+ model.tableNo;
		orderObject.time=connecter.getCurrTime();
		orderObject.orderDetails=orderDetails;
		orderObject.status="Pending";
		let orderId=parseInt(localStorage.getItem("orderId"));
		localStorage.setItem("orderId",parseInt(orderId+1));
		orderObject.orderId="Order"+orderId;
		return orderObject;
	},
	parseOrderDetails:function(orderDetails){
		let details=[];
			for(let itemName in orderDetails){
				 if (orderDetails.hasOwnProperty(itemName))
				 	details.push(itemName+" : "+orderDetails[itemName]);
			}
			return details.join("<br>");
	},
 	
 	addOrderToLocal:function(orderObject){
		
		let pendingOrders=JSON.parse(localStorage.getItem("Pending"));
		pendingOrders.push(orderObject.orderId);	
		localStorage.setItem(orderObject.orderId,JSON.stringify(orderObject));
		localStorage.setItem("Pending",JSON.stringify(pendingOrders));
	},

	cancelOrder:function(orderElement,order){
		connecter.removeOrderFromPendingList(orderElement,order);		
		pendingOrdersView.renderPrev();
		localStorage.removeItem(order.orderId);
	},
	removeOrderFromPendingList:function(orderElement,orderObject){
		orderElement.parentNode.removeChild(orderElement);
		let pendingOrders=JSON.parse(localStorage.getItem("Pending"));
		let index=pendingOrders.indexOf(orderObject.orderId);
		pendingOrders.splice(index,1);	
		localStorage.setItem("Pending",JSON.stringify(pendingOrders));
	},
	
	//removePendingOrderElement(orderElement){
	//},
	deleteOrderFromLocal:function(order){
		let completedOrders=JSON.parse(localStorage.getItem("Completed"));
		let index=completedOrders.indexOf(order.orderId);
		completedOrders.splice(index,1);	
		localStorage.setItem("Completed",JSON.stringify(completedOrders));
		localStorage.removeItem(order.orderId);
	},
	deleteOrder:function(orderElement,order){
		connecter.deleteOrderFromLocal(order);
		orderElement.parentNode.removeChild(orderElement);
	},
	/*
	checkIfDelivered:function(order,orderElement){
		if(order.status==="Delivered"){
			setTimeout(function(){connecter.removeOrderFromPending(orderElement)},9000);
			setTimeout(function(){orderHistoryView.render(order)},10005);
			order.status="Completed";
			addOrderToLocal(order);
		}
	},

	
	//need to be updated
	reorder(order){
		let newOrderDetails=order.orderDetails.copy();
		let orderObject=connecter.buildOrderObject(orderDetails);
		connecter.addOrderToLocal(order);
		pendingOrdersView.render(order);
	}
	*/

};

const itemView = { 

	init: function() {
	      this.itemList=document.getElementById("items"),
	      this.render();	
    },
    render: function() {
		let allItems = connecter.getVisibleItems();
        this.itemList.innerHTML = '';
		allItems.forEach((currItem)=>{	
			let newItem = document.createElement('li');
			newItem.setAttribute('class','item');
			newItem.innerHTML=`		<div class="imgdiv">
					  					<img class="img" src="images/${currItem.image}" alt="${currItem.image} image">
					  				</div>
					  				<div class="item-name">${currItem.name}</div>
					  				<div class="button-div">
					  					<button class="add-To-Cart-button w-green">Add to cart</button>
					  				</div>
					  		   `
			addToCartButton = newItem.getElementsByClassName('add-To-Cart-button')[0];
		   	addToCartButton.addEventListener('click', connecter.addToCart.bind(null,currItem),false);
     		this.itemList.appendChild(newItem);	
		});
    }
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
			newCategory.setAttribute("class","category-item");
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

const cartView = {

	init: function(){
		this.cartLocation = document.getElementById("cart-list");
		this.cartLocation.innerHTML='';
		document.getElementsByClassName("place-order-button")[0].addEventListener("click",connecter.placeOrder);
	 },	

	displayQtyChange:function(item,cartElement){
		let qty=cartElement.getElementsByClassName("box-text")[0];
		qty.setAttribute("value",item.qty);
	},
	
	render: function(item){
			let itemName=item.name;
			let itemImageSrc="images/"+item.image;
			let itemQty=item.qty;
			let newCartElement ;
			newCartElement = document.createElement('li');
			newCartElement.setAttribute('class',"w-bar cart-box");
			newCartElement.innerHTML = `
									<img src=${itemImageSrc} class="w-bar-item w-circle" style="width:130px" >
							     	<div class="w-bar-item">
							        	<div class="order-list-item">
							        		<span class="item-name">${itemName}</span>
							    		</div>
							       		<button class="plus">+</button>
							  			<div class="box-item-qty">
							  				<input type="text" value="${itemQty}" readonly class="box-text">
							  			</div>
							  			<button class="minus">-</button>
							  	    	</div>
							  	    	<div class="cart-remove">
							  	    		<span>Remove</span>		
							  	    	</div>
								`
			this.cartLocation.appendChild(newCartElement);
		  	plusButton = newCartElement.getElementsByClassName('plus')[0];
     	   	minusButton = newCartElement.getElementsByClassName('minus')[0];
     		removeButton = newCartElement.getElementsByClassName('cart-remove')[0];
     	   	
     	   	plusButton.addEventListener('click', connecter.changeQty.bind(null,item,newCartElement,1), false);
     		minusButton.addEventListener('click', connecter.changeQty.bind(null,item,newCartElement,-1), false);
     	    removeButton.addEventListener('click', connecter.removeFromCart.bind(null,item,newCartElement), false);
     	},
};
 
const pendingOrdersView={

	init:function(){
		this.pendingList = document.getElementById("pen-list");
		this.renderPrev();	
	},
	renderPrev:function(){
		this.pendingList.innerHTML='';
		let pendingOrders=JSON.parse(localStorage.getItem("Pending"));
		for(index in pendingOrders){
			let order=JSON.parse(localStorage.getItem(pendingOrders[index]));	
			this.render(order);
		}
	},
	/*
	displayStatusChange:function(order){
		let statusElement=this.getElementsByClassName("penstatus")[0];
		order=JSON.parse(localStorage.getItem(order.orderId));
		let status=order.status;
		statusElement.innerHTML=`Status : ${status}`;
		connecter.checkIfDelivered(order,this);
	},
	*/
	render:function(order){
		
		let orderDetails=connecter.parseOrderDetails(order.orderDetails);
		if(orderDetails.length==0){return;}
		let newOrderElement = document.createElement('li');
		newOrderElement.setAttribute('class',"pen-list-item");
		let userDetails=order.userDetails;
		let timeOfOrder=order.time;		
		newOrderElement.innerHTML = `
						<div class="pen-person-img">
						 	<img src="images/person.png" style="width: 100px;">
						</div>
					<div class="pen-person">
							${userDetails} <br>
							Time: ${timeOfOrder}
						</div>
						<div class="pen-order">
						 	<div class="pen-order-items">${orderDetails}</div>
						</div>
						<div class="pen-status">
						   Status : ${order.status}
						</div>
						<div class="pen-extra">
						  	 <div class="pen-cancel">	
						  	 	<button class="pen-cancel-button">Cancel Order</button>
						  	</div>
						 </div>
					`
		this.pendingList.appendChild(newOrderElement);
		
		//	setInterval(pendingOrdersView.displayStatusChange.bind(newOrderElement,order),10000);
	   	let cancelbutton=newOrderElement.getElementsByClassName("pen-cancel-button")[0];
		cancelbutton.addEventListener("click",connecter.cancelOrder.bind(null,newOrderElement,order),false);
	}
};

const orderHistoryView={

	init:function(){
		this.orderHistoryList=document.getElementById("order-History");
		this.renderPrev();	
	},
	renderPrev:function(){
		this.orderHistoryList.innerHTML='';
		let completedOrders=JSON.parse(localStorage.getItem("Completed"));
		for(index in completedOrders){
			let order=JSON.parse(localStorage.getItem(completedOrders[index]));	
			this.render(order);
		}
	},
	render:function(order){
		let orderElement = document.createElement('li');
		orderElement.setAttribute('class',"pen-list-item");
		let orderDetails=connecter.parseOrderDetails(order.orderDetails);
		orderElement.innerHTML = `
						<div class="pen-person-img">
						 	<img src="images/person.png" style="width: 100px;">
						</div>
						<div class="pen-person">
								${order.userDetails}<br>
								Time : ${order.time}
						</div>
						<div class="pen-order">
						 	<div class="pen-order-items">${orderDetails}</div>
						</div>
						<div class="pen-status">
						   Status : ${order.status}	
						</div>
						<div class="pen-extra">
							<div class="pen-update">
								<button class="delete-order-button">Delete Order</button>
							</div>
						</div>
				   `

		//	<div class="penupdate">
		//						 	<button class="reorderButton">Reorder</button>
		//					</div>
								   
		let deleteOrderButton=orderElement.getElementsByClassName("delete-order-button")[0];
		deleteOrderButton.addEventListener("click",connecter.deleteOrder.bind(null,orderElement,order),false);
		this.orderHistoryList.appendChild(orderElement);
	}
};
connecter.init();


}());
