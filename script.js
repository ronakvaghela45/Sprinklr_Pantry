
//categories -> id, name

//items -> item -> id, name, qty, image, category (id)

//order -> ghgh
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

const controller={	
	
	init : function(){
		//this.currCartList=document.getElementById("cart-list").getElementsByClassName("cart-box");	
		controller.initLocalStorage();
		pendingOrdersView.init();
		orderHistoryView.init();
	
		ReactDOM.render(<App />,document.getElementById("menuItems"));
		//itemView.init();
		//cartView.init();
		categoryView.init();
			
	},
	initLocalStorage : function(){
		if(localStorage.getItem("orderId")===null)
			localStorage.setItem("orderId",1);
		if(localStorage.getItem("Pending")===null)
			localStorage.setItem("Pending",JSON.stringify([]));
		if(localStorage.getItem("Completed")===null)
			localStorage.setItem("Completed",JSON.stringify([]));
	},
	getUserId: function(){
		return model.userId;
	},
	getCategories:function(){
		return model.categoryList;
	},
	getCurrCategory:function(){
		return model.currCategory || 'ALL';
	},
	setCurrCategory:function(newCategory){
		model.currCategory=newCategory;
	},
	changeCategory : function(newCategory){
		if(newCategory===controller.getCurrCategory()) return;
		controller.setCurrCategory(newCategory);
		categoryView.render();
		itemView.render();
	},
	getItemsOfCurrCategory: function(){
		let currCategory=controller.getCurrCategory();
		let items = controller.getAllItems();
		return items.filter(function(item) {
                return (item.category===currCategory || currCategory==="All");
            });
	},
	//
	getVisibleItems : function(){
		let displayItems=controller.getItemsOfCurrCategory();
		return displayItems;
	},
	getAllItems:function(){
		return model.items;
	},
	addToCart : function(item){
		
		let ifAlreadyInCart;
		ifAlreadyInCart=controller.ifAlreadyInCart(item);
		let itemName=item.name;
		
		if(ifAlreadyInCart){
			// for(let index in controller.currCartList)
			// {
			// 	if(controller.currCartList[index].getElementsByClassName('item-name')[0].innerHTML===itemName)
			// 	{	
			// 		controller.changeCartItemQty(item,controller.currCartList[index],1);
			// 		break;
			// 	}
			// }
			return;	
		}
		else{
			item.qty=1;
			const cartItems = controller.getCartItems();
			cartItems.push(item);
			cartView.render();	
		}
	},
	getCartItems: function(){
		return model.cartItems;
	},
	ifAlreadyInCart: function(item){
		const cartItems = controller.getCartItems();
		const itemIndex=cartItems.indexOf(item);
		return itemIndex !== -1;
	},
	changeCartItemQty: function(item,change){
		const qty=parseInt(item.qty);
		if(change===-1 && qty===1)
		{
			controller.removeItemFromCart(item);
			return;
		}
		item.qty=item.qty+parseInt(change);
		return item.qty;
	},
	removeItemFromCart:function(item){
		item.qty=0;
		let cartItems=controller.getCartItems();
		let index=cartItems.indexOf(item);
		cartItems.splice(index,1);
		cartView.render();
	
	},
	emptyCart:function(){
		model.cartItems=[];	
		cartView.render();
	},
	placeOrder: function(){
		
		let orderDetails=controller.buildOrderDetails();
		const noItemsinOrder =  Object.keys(orderDetails).length===0;
		if(!noItemsinOrder && confirm("Do you want to place order?"))
		{
			let orderObject=controller.buildOrderObject(orderDetails);
			controller.addOrderToLocal(orderObject);
			pendingOrdersView.render(orderObject);
			controller.emptyCart();
		}
	},
	//order deatils contains Item name:Qty
	buildOrderDetails: function(){
		const cartItems=controller.getCartItems();
		let orderDetails={};
		if(cartItems.length===0)
			return {};
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
		// let userName=
		orderObject.userDetails=model.userName;
		orderObject.tableNo=model.tableNo;
		orderObject.time=controller.getCurrTime();
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
		controller.removeOrderFromPendingList(orderElement,order);		
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
		controller.deleteOrderFromLocal(order);
		orderElement.parentNode.removeChild(orderElement);
	},
};


class ListItem extends React.Component {
 
  constructor(props){
	super(props);
	this.handleAddToCart=this.handleAddToCart.bind(this);
  	this.state={inCart:false};
   }
 	
    handleAddToCart(){
		if(!this.state.inCart)	
			controller.addToCart(this.props.itemDetails);
	 	else{
	 		controller.removeItemFromCart(this.props.itemDetails);
	 	}
	 	 	this.props.handleUpdateInCart(this.props.itemDetails);				
	}
	render(){
	 const currItem=this.props.itemDetails;
	 const imageName="images/"+currItem.image;
	 const itemStatus=this.state.inCart?"Added to Cart":"Add to Cart";
	 return (
	  		<li className="item">
	  		<div className="imgdiv">
				<img className="img" src={imageName} alt={imageName}/>
			</div>
			<div className="item-name">{currItem.name}</div>
			<div className="button-div">
				<button className="add-To-Cart-button w-green" onClick={this.handleAddToCart}>{itemStatus}</button>
			</div>	
			</li>
	 	);
	}
}

class Items extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		const allItems=this.props.items;
		const listItems = allItems.map((currItem) =>
			<ListItem key={currItem.id}
		    	      itemDetails={currItem}
		    	      handleUpdateInCart={this.props.handleUpdateInCart} />

		);

 		return (<div id='items' className="gallary">
				<ul class="list item-menu">
					{listItems}
  		  	 	</ul>
  		 		</div>
  		 );
	}
}


class CartItem extends React.Component{
	constructor(props){
		super(props);
		this.state={qty:this.props.item.qty};
		this.handlePlusBtn=this.handlePlusBtn.bind(this);
		this.handleMinusBtn=this.handleMinusBtn.bind(this);
		this.handleRemoveBtn=this.handleRemoveBtn.bind(this);
	}
	handlePlusBtn(){
	 	 const newQty=controller.changeCartItemQty(this.props.item,1);
		 this.setState({qty : newQty});
	}
	handleMinusBtn(){
		 const newQty=controller.changeCartItemQty(this.props.item,-1);
		 this.setState({qty : newQty});
	}
	handleRemoveBtn(){
		controller.removeItemFromCart(this.props.item);
		this.props.handleUpdateInCart(this.props.item);
	}

	render(){	
		const itemImageSrc="images/"+this.props.item.image;
		return (
			<li className="w-bar cart-box">
				<img src={itemImageSrc} className="w-bar-item w-circle" style={{width:'130px'}}/>
				<div className="w-bar-item">
					<div className="order-list-item">
						<span className="item-name">{this.props.item.name}</span>
					</div>
					<button className="plus" onClick={this.handlePlusBtn}>+</button>
					<div className="box-item-qty">
						<input type="text" value={this.state.qty} readonly className="box-text"/>
					</div>
					<button className="minus" onClick={this.handleMinusBtn}>-</button>
				</div>
				<div className="cart-remove" onClick={this.handleRemoveBtn}>
					<span>Remove</span>		
				</div>
			</li>

		);
	}
}

class Cart extends React.Component{
	constructor(props){
		super(props);
		this.handlePlaceOrder=this.handlePlaceOrder.bind(this);
	}
	handlePlaceOrder(){
		controller.placeOrder();
		this.props.handleUpdateInCart();
	}


	render(){
		const cartItems=this.props.cartItems;	
		const items = cartItems.map((currItem) =>
			<CartItem key={currItem.id}
		    	      item={currItem}
		    	      handleUpdateInCart={this.props.handleUpdateInCart} />

		);
		return (	
				<div id='cart' className="cart-items">
					<div className="order-list"> Your Order </div>
					<ul id="cart-list" className="list cart-list">
						{items}
					</ul>	
					<div className="place-order">
						 <button className="place-order-button" onClick={this.handlePlaceOrder}> Place Order</button>
					</div>
				</div>
		);

	}
}

class Category extends React.Component{
	constructor(props){
		super(props);
		this.handleCategoryChange=this.handleCategoryChange.bind(this);
	}
	handleCategoryChange(){
		this.props.onCategoryChange(this.props.category);
	}
	render(){
		let categoryClass="category-item nobg";
		if(this.props.category===this.props.currCategory){
			categoryClass="category-item highlight";
		}	
		return(
				<div className={categoryClass} onClick={this.handleCategoryChange}>
					<a href="#" style={{"text-decoration": "none"}}> {this.props.category} </a>
				</div>
			);
	}
}

class CategoryList extends React.Component{
	constructor(props)
	{
		super(props);
		//this.state={currCategory:"All"};
		this.changeCategory=this.changeCategory.bind(this);
	}
	changeCategory(category){
		const newCategory=category;
		const currCategory=controller.changeCategory(newCategory);
		this.props.changeCategory(category);
	}

	render(){
		const currCategory=this.props.currCategory;
		const categories = this.props.categories.map((category) =>
			<Category category={category} onCategoryChange={this.changeCategory} currCategory={this.props.currCategory} />
		);
 		
 		return (<div class="categories">
 					{categories}
 				</div>
		);
	}
}

class Header extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div class="pantry">
				<h1 class="pantry-title">
			  		Sprinklr Pantry 
				</h1>			
				<div className="header-box">
					<CategoryList currCategory={this.prop.currCategory} onCategoryChange={this.props.onCategoryChange}/> 
					<div className="orders">
			    		<div className="order-option">
			      			<a href="#pending" style={{"text-decoration": "none"}}>Pending Orders</a>
			    		</div>
			    		<div className="order-option">
			      			<a href="#completed" style={{"text-decoration": "none"}}>Order History</a>
			    	    </div>
				    </div>
				</div>
			</div>
			);
	}
}

class PendingList extends React.Component{
	constructor(props){
		super(props);
	}
	render(){

			
	}
}

class App extends React.Component{
	constructor(props){
		super(props);
		this.state={cartItems:[],currCategory:"All"};
		this.handleUpdateInCart=this.handleUpdateInCart.bind(this);
	}
	changeCategory(newCategory){
		this.setState({currCategory:newCategory});
	}
	handleUpdateInCart(){
		const cartItems=controller.getCartItems();
		this.setState({cartItems:cartItems});
	}

	render(){
		const categories=controller.getCategories();
		const cartItems=controller.getCartItems();
		const allItems = controller.getVisibleItems();
   		return(
   				<React.Fragment>
					<Items items={allItems} handleUpdateInCart={this.handleUpdateInCart}/>
					<Cart cartItems={this.state.cartItems} handleUpdateInCart={this.handleUpdateInCart}/>
				</React.Fragment>
			
		);
	}
}


// const lists = {
// 	pending: {
// 		listIdSelector: 'pending-'
// 	},

// 	completed: {
// 		listIdSe: 
// 	}
// };

const itemView = { 

	init: function() {
	      this.itemList=document.getElementById("items"),
	      this.render();	
    },
    render: function() {
    	const allItems = controller.getVisibleItems();
   		//ReactDOM.render(<Items items={allItems}/>, document.getElementById('items'));

		// let allItems = controller.getVisibleItems();
  //       //this.itemList.innerHTML = '';
		// allItems.forEach((currItem)=>{	
		// 	let newItem = document.createElement('li');
		// 	newItem.setAttribute('class','item');
		// 	newItem.innerHTML=`		<div class="imgdiv">
		// 			  					<img class="img" src="images/${currItem.image}" alt="${currItem.image} image">
		// 			  				</div>
		// 			  				<div class="item-name">${currItem.name}</div>
		// 			  				<div class="button-div">
		// 			  					<button class="add-To-Cart-button w-green">Add to cart</button>
		// 			  				</div>
		// 			  		   `
		//	addToCartButton = newItem.getElementsByClassName('add-To-Cart-button')[0];
		// 	addToCartButton.addEventListener('click', controller.addToCart.bind(null,currItem),false);
     	//	this.itemList.appendChild(newItem);	
		}
};

const categoryView={
	init:function(){
		this.render();
	},
	render: function(){
		const categoryBox=document.getElementsByClassName("header-box")[0];
		const categories=controller.getCategories();
		ReactDOM.render(<CategoryList categories={categories} />,categoryBox);
		// categoryBox.innerHTML='';
		// let categories=controller.getCategories();
		// let currCategory=controller.getCurrCategory();
		// categories.forEach((category,categoryIndex)=>{
		// 	let newCategory = document.createElement('div');
		// 	newCategory.setAttribute("class","category-item");
		// 	if(category===currCategory)
		// 	{
		// 		 newCategory.classList.add("highlight");
		// 	}
		// 	newCategory.innerHTML=`	<a href="#" style="text-decoration: none;" >${category}</a>`
		// 	newCategory.addEventListener('click',controller.changeCategory.bind(null,category),false);
		// 	categoryBox.appendChild(newCategory);
		// });
	}
};

const cartView = {

	init: function(){
		this.cartLocation = document.getElementById("cart-list");
		//document.getElementsByClassName("place-order-button")[0].addEventListener("click",controller.placeOrder);
	 },	

	displayQtyChange:function(item,cartElement){
		//let qty=cartElement.getElementsByClassName("box-text")[0];
		//qty.setAttribute("value",item.qty);
	},
	
	render: function(){
			const cartItems=controller.getCartItems();
			//ReactDOM.render(<Cart cartItems={cartItems} />,document.getElementById('cart'));
		
			// let itemName=item.name;
			// let itemImageSrc="images/"+item.image;
			// let itemQty=item.qty;
			// let newCartElement ;
			// newCartElement = document.createElement('li');
			// newCartElement.setAttribute('class',"w-bar cart-box");
			// newCartElement.innerHTML = `
			// 						<img src=${itemImageSrc} class="w-bar-item w-circle" style="width:130px" >
			// 				     	<div class="w-bar-item">
			// 				        	<div class="order-list-item">
			// 				        		<span class="item-name">${itemName}</span>
			// 				    		</div>
			// 				       		<button class="plus">+</button>
			// 				  			<div class="box-item-qty">
			// 				  				<input type="text" value="${itemQty}" readonly class="box-text">
			// 				  			</div>
			// 				  			<button class="minus">-</button>
			// 				  	    	</div>
			// 				  	    	<div class="cart-remove">
			// 				  	    		<span>Remove</span>		
			// 				  	    	</div>
			// 					`
			// this.cartLocation.appendChild(newCartElement);
		 //  	plusButton = newCartElement.getElementsByClassName('plus')[0];
   //   	   	minusButton = newCartElement.getElementsByClassName('minus')[0];
   //   		removeButton = newCartElement.getElementsByClassName('cart-remove')[0];
     	   	
   //   	   	plusButton.addEventListener('click', controller.changeCartItemQty.bind(null,item,newCartElement,1), false);
   //   		minusButton.addEventListener('click', controller.changeCartItemQty.bind(null,item,newCartElement,-1), false);
   //   	    removeButton.addEventListener('click', controller.removeFromCart.bind(null,item,newCartElement), false);
   //   	},
	}	
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
		controller.checkIfDelivered(order,this);
	},
	*/
	render:function(order){
		
		let orderDetails=controller.parseOrderDetails(order.orderDetails);
		if(orderDetails.length==0){return;}
		let newOrderElement = document.createElement('li');
		newOrderElement.setAttribute('class',"pen-list-item");
		let userDetails=order.userDetails;
		let tableNo=order.tableNo;
		let timeOfOrder=order.time;		
		newOrderElement.innerHTML = `
						<div class="pen-person-img">
						 	<img src="images/person.png" style="width: 100px;">
						</div>
						<div class="pen-person">
							<span> ${userDetails} </span>
							<span> Table No.: ${tableNo}</span>
							<span> Time: ${timeOfOrder}</span>
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
		cancelbutton.addEventListener("click",controller.cancelOrder.bind(null,newOrderElement,order),false);
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
		let orderDetails=controller.parseOrderDetails(order.orderDetails);
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
		deleteOrderButton.addEventListener("click",controller.deleteOrder.bind(null,orderElement,order),false);
		this.orderHistoryList.appendChild(orderElement);
	}
};

controller.init();


