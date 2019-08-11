function delete_Employee(id) {
	$.ajax({
		url: '/deleteEmployee/' + id,
		type: 'PUT',
		data: $('#deleteEmployeeform').serialize(),
		success: function(result){
			window.location.replace("/");
		}	
	})
};
