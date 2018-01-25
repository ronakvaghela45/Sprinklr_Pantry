

let adminOrderId=1;
setInterval(updateAdminOrders, 1000)
const adminOrderList=document.getElementsByClassName("a-penlist");
function updateAdminOrders()
{
	let retrievedOrder = localStorage.getItem("Order"+adminOrderId);
 	if(retrievedOrder==null)return ;
 	let order=JSON.parse(retrievedOrder);	
 	addToList(order);
 	adminOrderId++;
 	
}
function addToList(order){

	let newOrderElement = document.createElement('li');
	newOrderElement.setAttribute('class',"a-penlistitem");
	newOrderElement.innerHTML = `
				 	<div class="a-penperson">
				 		Order No. <br>${adminOrderId} 
				 	</div>
				 	<div class="a-penperson">
					 ${order.userDetails}			
					</div>
					<div class="a-penorder">
				 		<div class="a-penorderitems">
				  			${order.orderDetails}
				  		</div>
					</div>
					<div class="a-penstatus">
						<div class="statustext">
							Status 
						</div>
						<select>
				 		 	<option value="Pending">Pending</option>
				  			<option value="Ready">Ready</option>
				  			<option value="Delivered">Delivered</option>
			  			</select>
					 </div>
			 
				`
	adminOrderList[0].appendChild(newOrderElement);
	
}	