var acceptBtn = document.getElementsByClassName('accept-button')[0];

acceptBtn.addEventListener('click', function () {

   var selectProject = document.getElementById('select-project').value.trim();
   var addDepartment = document.getElementById('add-department').value.trim();

   if(selectProject.length > 0 && addDepartment.length > 0){
      console.log(selectProject);
      console.log(addDepartment);
   }
   else{
      alert('Select options in all required fields');
   }
   var postRequest = new XMLHttpRequest();
   var requestURL = 'insert';
   postRequest.open('POST', requestURL);

   var requestBody = JSON.stringify({
       selectProject: selectProject,
       addDepartment: addDepartment
   });

   postRequest.setRequestHeader('Content-Type', 'application/json');
   postRequest.send(requestBody);
   window.location.pathname ='/addProgrammer';

   cleanInput();
});

function cleanInput() {
  document.getElementById('name-attribution-input').value = "";
  document.getElementById('start-date-attribution-input').value = "";
  document.getElementById('end-date-attribution-input').value = "";
  document.getElementById('budget-attribution-input').value = "";
  document.getElementById('clientId-attribution-input').value = "";
  document.getElementById('departmentId-attribution-input').value = "";
  document.getElementById('programmerId-attribution-input').value = "";
}

cleanInput();