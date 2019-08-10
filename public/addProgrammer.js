var acceptBtn = document.getElementsByClassName('accept-button2')[0];

acceptBtn.addEventListener('click', function () {

   var selectProject = document.getElementById('select-project').value.trim();
   var addProgrammer = document.getElementById('add-programmer').value.trim();

   if(selectProject.length > 0 && addProgrammer.length > 0){ 
      console.log(selectProject);
      console.log(addProgrammer);
   }   
   else{
      alert('Select options in all required fields');
   }   
   var postRequest = new XMLHttpRequest();
   var requestURL = 'addProgrammer';
   postRequest.open('POST', requestURL);

   var requestBody = JSON.stringify({
       selectProject: selectProject,
       addProgrammer: addProgrammer
   }); 

   postRequest.setRequestHeader('Content-Type', 'application/json');
   postRequest.send(requestBody);
});


