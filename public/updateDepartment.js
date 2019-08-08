function update_Department(id) {
	$.ajax({
		url: '/updateDepartment/' + id,
		type: 'PUT',
		data: $('#updateDepartmentform').serialize(),
		success: function(result){
			window.location.replace("/");
		}	
	})
};
