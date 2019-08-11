var acceptBtn = document.getElementsByClassName('accept-button3')[0];

acceptBtn.addEventListener('click', function () {

   var selectProject = document.getElementById('select-project').value.trim();
   var addEmployee = document.getElementById('add-employee').value.trim();

   if(selectProject.length > 0 && addEmployee.length > 0){
      console.log(selectProject);
      console.log(addEmployee);
   }
   else{
      alert('Select options in all required fields');
   }
   var postRequest = new XMLHttpRequest();
   var requestURL = '../addEmployee';
   postRequest.open('POST', requestURL);

   var requestBody = JSON.stringify({
       selectProject: selectProject,
       addEmployee: addEmployee
   });
   postRequest.setRequestHeader('Content-Type', 'application/json');
   postRequest.send(requestBody);
   window.location.replace('/');

});
