
(function(){

const model={
	totalOrders:{},
};

const controller={
	init:function(){
		totalOrderView.init();
		orderView.init();
	},
	getTotalOrders:function(){
		return model.totalOrders;
	},
	updateTotalOrder:function(orderDetails){
		let totalOrders=controller.getTotalOrders();
		for(let itemName in orderDetails){
			if (orderDetails.hasOwnProperty(itemName))
			{
				if(itemName in totalOrders){
					totalOrders[itemName]=totalOrders[itemName]+orderDetails[itemName];
				}
				else{
					totalOrders[itemName]=orderDetails[itemName];
				}
			}
		}
	},
	orderInText:function(orderDetails){
			let details=[];
			for(let itemName in orderDetails){
				 if (orderDetails.hasOwnProperty(itemName))
				 	details.push(itemName+" : "+orderDetails[itemName]);
			}
			return details.join("<br>");
	},
	removeFromPending:function(order){
		let pendingOrders=JSON.parse(localStorage.getItem("Pending"));
		let index=pendingOrders.indexOf(order.orderId);
		pendingOrders.splice(index,1);	
		localStorage.setItem("Pending",JSON.stringify(pendingOrders));
	},
	addInCompleted:function(order){
		let completedOrders=JSON.parse(localStorage.getItem("Completed"));
		completedOrders.push(order.orderId);	
		localStorage.setItem("Completed",JSON.stringify(completedOrders));
	},	
	
	updateOrderInLocal:function(order){
		controller.removeFromPending(order);
		controller.addInCompleted(order);
	},
	removeTotalOrders:function(){
		model.totalOrders={};
	},

	updateOrderStatus:function(order){
		order.status=this.value;
		let orderId=order.orderId;
		localStorage.setItem(orderId,JSON.stringify(order));
		if(order.status=="Delivered"){
			controller.updateOrderInLocal(order);
			orderView.renderTotal();
		}
	}
	
}

const orderView={

		init:function(){
				this.adminOrderList=document.getElementsByClassName("a-pen-list");
				orderView.renderTotal();
		},
		renderTotal: function(){
			this.adminOrderList[0].innerHTML='';
			let pendingOrders=JSON.parse(localStorage.getItem("Pending"));
			controller.removeTotalOrders();
			for(index in pendingOrders){
				let order=JSON.parse(localStorage.getItem(pendingOrders[index]));	
				controller.updateTotalOrder(order.orderDetails);
				orderView.render(order);
			}
			let completedOrders=JSON.parse(localStorage.getItem("Completed"));
			for(index in completedOrders){
				let order=JSON.parse(localStorage.getItem(completedOrders[index]));	
				orderView.render(order);
			}
			totalOrderView.renderTotal();
		},

		render:function(order){
			let newOrderElement = document.createElement('li');
			let orderDetails= controller.orderInText(order.orderDetails);
			newOrderElement.setAttribute('class',"a-pen-list-item");
			newOrderElement.innerHTML = `
				 	<div class="a-pen-person">
				 		 ${order.orderId} 
				 	</div>
				 	<div class="a-pen-person">
						  ${order.userDetails}<br>
						  Time: ${order.time}			
					</div>
					<div class="a-pen-order">
				 		<div class="a-pen-order-items">
				  			${orderDetails}
				  		</div>
					</div>
					<div class="a-pen-status">
						<div class="statustext">
							Status 
						</div>	
						<select class="statusOptions">
				 		 	<option value="Pending">Pending</option>
				  			<option value="Ready">Ready</option>
				  			<option value="Delivered">Delivered</option>
			  			</select>
					 </div>
			 
				`			
			let selectOptions=newOrderElement.getElementsByClassName("statusOptions")[0];
			selectOptions.value=order.status;
			selectOptions.addEventListener('change',controller.updateOrderStatus.bind(selectOptions,order),false);
			this.adminOrderList[0].appendChild(newOrderElement);
		}
}

const totalOrderView={
	init:function(){
		this.totalOrderList=document.getElementById("a-pen-Total-Order");
	},
	renderTotal: function() {
    	this.totalOrderList.innerHTML='';
    	let totalOrders=controller.getTotalOrders();
    	for(item in totalOrders){
    		let newOrderElement = document.createElement('li');
			newOrderElement.innerHTML = `${item} : ${totalOrders[item]}
										`;
    		this.totalOrderList.appendChild(newOrderElement);
    	}	
    }
}
controller.init();
}());