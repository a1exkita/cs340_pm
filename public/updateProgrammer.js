function update_Programmer(id) {
	$.ajax({
		url: '/updateProgrammer/' + id,
		type: 'PUT',
		data: $('#updateProgrammerform').serialize(),
		success: function(result){
			window.location.replace("/");
		}	
	})
};
