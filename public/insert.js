var acceptBtn = document.getElementsByClassName('accept-button')[0];

acceptBtn.addEventListener('click', function () {

   var addName = document.getElementById('name-attribution-input').value.trim();
   var addStart = document.getElementById('start-date-attribution-input').value.trim();
   var addEnd = document.getElementById('end-date-attribution-input').value.trim();
   var addBudget = document.getElementById('budget-attribution-input').value.trim();
   var addClientName = document.getElementById('clientId-attribution-input').value.trim();

   if(addName.length > 0 && addStart.length > 0 && addEnd.length > 0 &&
     addBudget.length > 0 && addClientName.length > 0 ){
      console.log(addName);
      console.log(addStart);
      console.log(addEnd);
      console.log(addBudget);
      console.log(addClientName);
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
       clientName: addClientName
   });

   postRequest.setRequestHeader('Content-Type', 'application/json');
   postRequest.send(requestBody);

   window.location.replace('/addEmployee/' + addName);
});

function cleanInput() {
  document.getElementById('name-attribution-input').value = "";
  document.getElementById('start-date-attribution-input').value = "";
  document.getElementById('end-date-attribution-input').value = "";
  document.getElementById('budget-attribution-input').value = "";
  document.getElementById('clientId-attribution-input').value = "";
}
