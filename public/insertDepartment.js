var acceptBtn = document.getElementsByClassName('accept-button5')[0];

acceptBtn.addEventListener('click', function () {

   var addName = document.getElementById('name-attribution-input').value.trim();

   if(addName.length > 0){
      console.log(addName);
   }
   else{
      alert('Enter values in all required fields');
   }
   var postRequest = new XMLHttpRequest();
   var requestURL = 'insertDepartment';
   postRequest.open('POST', requestURL);

   var requestBody = JSON.stringify({
       name: addName
   });

   postRequest.setRequestHeader('Content-Type', 'application/json');
   postRequest.send(requestBody);

   window.location.replace('/');
});

function cleanInput() {
  document.getElementById('name-attribution-input').value = "";
}
