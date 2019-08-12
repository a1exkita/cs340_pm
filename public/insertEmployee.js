var acceptBtn = document.getElementsByClassName('accept-button4')[0];

acceptBtn.addEventListener('click', function () {

   var addName = document.getElementById('name-attribution-input').value.trim();
   var addManager = document.getElementById('manager-attribution-input').value.trim();
   var addDepartment = document.getElementById('deparment-attribution-input').value.trim();

   if(addName.length > 0 && addDepartment.length > 0){
      console.log(addName);
      console.log(addManager);
      console.log(addDepartment);
   }
   else{
      alert('Enter values in all required fields');
   }
   var postRequest = new XMLHttpRequest();
   var requestURL = '/insertEmployee';
   postRequest.open('POST', requestURL);

   var requestBody = JSON.stringify({
       name: addName,
       manager: addManager,
       department: addDepartment
   });

   postRequest.setRequestHeader('Content-Type', 'application/json');
   postRequest.send(requestBody);

   window.location.replace('/');
});

function cleanInput() {
  document.getElementById('name-attribution-input').value = "";
  document.getElementById('manager-attribution-input').value = "";
  document.getElementById('deparment-attribution-input').value = "";
}
