function update_Employee(id) {
	$.ajax({
		url: '/updateEmployeeQuery/' + id,
		type: 'PUT',
		data: $('#updateProgrammerform').serialize(),
		success: function(result){
			window.location.replace("/");
		}	
	})
};
