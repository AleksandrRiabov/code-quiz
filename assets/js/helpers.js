//=== function delay
function delay(callBack, time, arguments) {
  setTimeout(() => {
    if (timeLeft) {
      callBack(arguments);
    }
  }, time);
}


//=== Function to validate input
function validateInitials(value) {
  const trimedValue = value.trim().replace(/[^a-zA-Z ]/g, "");

  if (!value.length) {
    return alert('Can not be empty!');
  }
  if (trimedValue.length < 2) {
    return alert('Please enter both letters.');
  }
  if (trimedValue.length > 2) {
    return alert("Too long. Please enter the first letter of your name and last name only.");
  }

  return trimedValue;
}