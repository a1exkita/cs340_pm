var acceptBtn = document.getElementsByClassName('accept-button')[0];

acceptBtn.addEventListener('click', function () {

   var addName = document.getElementById('name-attribution-input').value.trim();
   var addStart = document.getElementById('start-date-attribution-input').value.trim();
   var addEnd = document.getElementById('end-date-attribution-input').value.trim();
   var addBudget = document.getElementById('budget-attribution-input').value.trim();
   var addClientId = document.getElementById('clientId-attribution-input').value.trim();
   var addDepartmentId = document.getElementById('departmentId-attribution-input').value.trim();
   var addProgrammerId = document.getElementById('programmerId-attribution-input').value.trim();

   // if(addName.length > 0 && addStart.length > 0 && addEnd.length > 0 &&
   //   addBudget.length > 0 && addClientId.length >= -1  && addDepartmentId.length >= -1 && addProgrammerId.length >= -1){
   if(addName.length > 0 && addStart.length > 0 && addEnd.length > 0 &&
     addBudget.length > 0 && addClientId.length >= -1 ){
      //insertNewTwit(addTxt, addAuthor);//line 79 and 78 can go in here, and then can do on lines 85/86 addTxt.value = "";
      console.log(addName);
      console.log(addStart);
      console.log(addEnd);
      console.log(addBudget);
      console.log(addClientId);
      // console.log(addDepartmentId);
      // console.log(addProgrammerId);
   }
   else{
      alert('Enter values in all required fields');
   }
   var postRequest = new XMLHttpRequest();
   var requestURL = 'insert';
   postRequest.open('POST', requestURL);

   var requestBody = JSON.stringify({
       name: addName,
       startDate: addStart,
       endDate: addEnd,
       budget: addBudget,
       clientId: addClientId
       // departmentId: addDepartmentId,
       // programmerId: addProgrammerId
   });

   postRequest.setRequestHeader('Content-Type', 'application/json');
   postRequest.send(requestBody);
   window.location.pathname ='/addDepartment';

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
