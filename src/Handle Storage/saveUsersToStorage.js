const itemName = "users";
const usersArray = [];

const addDataToStorage = (obj) => {
  let rawUsers = window.localStorage.getItem(itemName);
  let isMatched = false;

  if (rawUsers === null || rawUsers === "") {
    usersArray.push(obj);
    window.localStorage.setItem(itemName, JSON.stringify(usersArray));
  } else {
    rawUsers = JSON.parse(window.localStorage.getItem(itemName));
    for (let i = 0; i < rawUsers.length; i++) {
      if (rawUsers[i].name === obj.name) {
        isMatched = true;
        break;
      }
    }
    if (!isMatched) {
      rawUsers.push(obj);
      window.localStorage.setItem(itemName, JSON.stringify(rawUsers));
    }
  }
};

export { addDataToStorage };
