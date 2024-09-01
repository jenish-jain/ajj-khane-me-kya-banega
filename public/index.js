document.addEventListener('DOMContentLoaded', () => {
  const pageTitle = document.getElementById('page-title');
  const menuOfTheDayRadio = document.getElementById('menu-of-the-day');
  const availableMenuRadio = document.getElementById('available-menu');

  const fetchMenuOfTheDay = () => {
    pageTitle.textContent = 'Menu of the Day';
    fetch('/menu-of-the-day')
      .then(response => response.json())
      .then(data => {
        const { breakfast, lunch, dinner } = data;

        updateList('breakfast-list', [breakfast]);
        updateList('lunch-list', [lunch]);
        updateList('dinner-list', [dinner]);
      })
      .catch(error => console.error('Error fetching menu of the day data:', error));
  };

  const fetchAvailableMenu = () => {
    pageTitle.textContent = 'Available Menu';
    fetch('/menu')
      .then(response => response.json())
      .then(data => {
        const { breakfast, lunch, dinner } = data;

        updateList('breakfast-list', breakfast);
        updateList('lunch-list', lunch);
        updateList('dinner-list', dinner);
      })
      .catch(error => console.error('Error fetching menu data:', error));
  };

  const updateList = (listId, items) => {
    const list = document.getElementById(listId);
    list.innerHTML = ''; // Clear existing items
    items.forEach(row => {
      const listItem = document.createElement('li');
      listItem.textContent = row.map(toSentenceCase).join(', ');
      list.appendChild(listItem);
    });
  };

  // Helper function to convert a string to sentence case
  const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Event listeners for toggle buttons
  menuOfTheDayRadio.addEventListener('change', fetchMenuOfTheDay);
  availableMenuRadio.addEventListener('change', fetchAvailableMenu);

  // Fetch menu of the day by default
  fetchMenuOfTheDay();
});