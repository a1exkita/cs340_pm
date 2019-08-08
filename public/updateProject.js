function update_Project(id) {
	$.ajax({
		url: '/index/' + id,
		type: 'PUT',
		data: $('#updateProjectform').serialize(),
		success: function(result){
			window.location.replace("/");
		}	
	})
};
