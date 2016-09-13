function check(){
	if(localStorage['token']){
		showWellcome();
		return true;
	}else{
		showLoginButtons();
		return false;
	}
}

function showWellcome(){
	$("#loginButtons").empty();
	$("#wellcome").empty();
	$('.bs-example-modal-sm').modal('hide');
	document.getElementById('wellcome').style.display='block';
	$('#wellcome').append('<p>HI,  '+localStorage['username']+'!</p><br><p><a href="#" onclick="singOut()" class="singOut">SING OUT</a></p>');
}

function showProducts(){
	check();
	$("#products").empty();
	document.getElementById('comments').style.display='none';
	$.get("http://smktesting.herokuapp.com/api/products", success);
	
	$('#products').append("<table id='products-table' class='table table-hover'>"+
				"<th>TITLE</th>"+
				"<th>IMG</th>"+
				"<th>TEXT</th>"+
				"<th>COMMENTS</th>"+
			"</table>");

		function success(data){
			document.getElementById('products').style.display='block';
				for (var c = 0; data.length-1 >= c; c++) {
					$('#products-table').append(
					'<tr><td>'+data[c]['title']+'</td>'
					+'<td>'+data[c]['img']+'</td>'
					+'<td>'+data[c]['text']+'</td>'
					+'<td><a href="#" onclick=showComments('+data[c]['id']+')>show</a></td></tr>');
				}
		}
};

function showComments(id){
	check();
	$("#comments").empty();
	document.getElementById('comments').style.display='block';
	$.get("http://smktesting.herokuapp.com/api/products", success);
		function success(data){
			console.log(data);
		}
	
	if(check()){
		var f = '<form method="POST" action=http://smktesting.herokuapp.com/api/reviews/'+id+'>'+
					'<input class="inputComment" type="number" name="product" value='+id+' /><br />' +
					'<input class="inputComment"type="number" name="rate" placeholder="Rating from 1 to 5"/><br />' +
					'<input class="inputComment"type="text" name="text" placeholder="Your comment on this" /><br />'+
					//'<input type="text" name="created_by" value='+ u +' /><br />'+
					'</br>'+
					'<center><input class="buttonSing" type="submit" value="POST COMMENT"/></center>';
		$('#comments').append(f);
	}

	$.get('http://smktesting.herokuapp.com/api/reviews/'+id, success);

	function success(data){
		document.getElementById('products').style.display='none';
			for (var c = 0; data.length-1 >= c; c++) {
				$('#comments').append(
				'<p>Rating: '+data[c]['rate']+'</p>'
				+'<p>Message: '+data[c]['text']+'</p>'
				+'<p>'+data[c]['created_by']['username']+' '+data[c]['created_by']['email']+'</p><hr>');
			}
	}
}

function showRegisterForm(){
	$("#modal-content").empty();
	$('#modal-content').append("<h4 class='title'>REGISTRATION</h4>"+
				"<div id='register-form'>"+
				"<input type='text' id='register-login' name='username' placeholder='Your login'/>"+
				"</br>"+
				"<input type='password' id='register-password' name='password' placeholder='Your password'/>"+
				"</br>"+
				"<center><button onclick='registration()' class='buttonSing'>SING ON</button></center>"+
				"</div>"
	);
}

function showLoginForm(){
	$("#modal-content").empty();
	$('#modal-content').append("<h4 class = 'title'>LOGIN</h4>"+
			"<div  id='login-form' >"+
				"<input id='login-name' type='text' name='login' placeholder='Login'/><br />"+
				"<input id='login-password' type='text' name='password' placeholder='Password'/><br />"+
				"<center><button onclick='login()' class='buttonSing'>SING IN</button></center>"+
				//"<center><button onclick='showRegisterForm()' class='buttonSing'>REGISTRATION</button></center>"+
			"</div>");
}

function showLoginButtons(){
	$("#loginButtons").empty();
	$('#loginButtons').append("<button class='classButton' data-toggle='modal' data-target='.bs-example-modal-sm' onclick='showLoginForm()'>Login</button><button class='classButton' data-toggle='modal' data-target='.bs-example-modal-sm' onclick='showRegisterForm()'>Registration</button>");
}

function registration(){
	var l = document.getElementById('register-login').value;
	var p = document.getElementById('register-password').value;
		if (l.length<3){
			alert('Login can not be less than 3 characters');
			return false;
		}
		if (p.length<5){
			alert('The password can not be less than 5 characters');
			return false;
		}
		
		$.post("http://smktesting.herokuapp.com/api/register/", {username : l, password : p}, function(data) {
			if(!data.success){
				alert(data.message);
			}else{
				showProducts();
			}
		});
}

function login(){
		var l = document.getElementById('login-name').value;
		var p = document.getElementById('login-password').value;
		
		$.post("http://smktesting.herokuapp.com/api/login/", {username : l, password : p}, function(data) {
			if(!data.success){
				alert(data.message);
			}else{
				localStorage['token'] = data.token;
				localStorage['username'] = l;
				$('.bs-example-modal-sm').modal('hide');
				showProducts();
			}
		});
}

function singOut(){
	delete localStorage['token'];
	delete localStorage['username'];
	showProducts();
	$("#wellcome").empty();
}

showProducts();