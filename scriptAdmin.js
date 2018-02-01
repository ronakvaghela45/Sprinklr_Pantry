
(function(){
const model={
	totalOrders:{},
	adminOrderId:1
}

const controller={
	init:function(){
		setInterval(controller.retrieveOrder,3000)
	},
	
	getAdminOrderId:function(){
		return model.adminOrderId;
	},
	incrementAdminOrderId:function(){
	 	model.adminOrderId++;
	},
	getTotalOrders:function(){
		return model.totalOrders;
	},
	retrieveOrder:function(){
		let adminOrderId=controller.getAdminOrderId();
		let retrievedOrder = localStorage.getItem("Order"+adminOrderId);
	 	if(retrievedOrder==null)return ;
	 	let order=JSON.parse(retrievedOrder);	
		controller.updateAdminOrders(order);
	},
	updateAdminOrders:function(order){
		orderView.render(order);
		controller.incrementAdminOrderId();
		controller.updateTotalOrder(order.orderDetails);
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
		totalOrderView.render();
	},
	orderInText:function(orderDetails){
			let details=[];
			for(let itemName in orderDetails){
				 if (orderDetails.hasOwnProperty(itemName))
				 	details.push(itemName+" : "+orderDetails[itemName]);
			}
			return details.join("<br>");
	},
	updateOrderStatus:function(order){
		order.status=this.value;
		let orderId=order.orderId;
		localStorage.setItem(orderId,JSON.stringify(order));
	}
	
}

const adminOrderList=document.getElementsByClassName("a-penlist");

const orderView={

		render:function(order){
			let newOrderElement = document.createElement('li');
			let orderDetails= controller.orderInText(order.orderDetails);
			newOrderElement.setAttribute('class',"a-penlistitem");
			newOrderElement.innerHTML = `
				 	<div class="a-penperson">
				 		 ${order.orderId} 
				 	</div>
				 	<div class="a-penperson">
						  ${order.userDetails}			
					</div>
					<div class="a-penorder">
				 		<div class="a-penorderitems">
				  			${orderDetails}
				  		</div>
					</div>
					<div class="a-penstatus">
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
			selectOptions.addEventListener('change',controller.updateOrderStatus.bind(selectOptions,order),false);
			adminOrderList[0].appendChild(newOrderElement);
		}
}

const totalOrderList=document.getElementById("a-penTotalOrder");
	
const totalOrderView={
	init:function(){
			
	},
	render: function() {
    	totalOrderList.innerHTML='';
    	let totalOrders=controller.getTotalOrders();
    	for(item in totalOrders){
    		let newOrderElement = document.createElement('li');
			newOrderElement.innerHTML = `${item} : ${totalOrders[item]}
										`;
    		totalOrderList.appendChild(newOrderElement);
    	}	
    }
}
controller.init();
}());