document.addEventListener('DOMContentLoaded', function () {

  /**
   * Search
   */
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const apiCards = document.querySelectorAll('.api-card');
  const categorySections = document.querySelectorAll('.category-section');


  if (searchInput && categorySelect && apiCards && categorySections) {

    // Function to filter APIs
    function filterAPIs() {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedCategory = categorySelect.value;

      apiCards.forEach(card => {
        const apiName = card.getAttribute('data-name');
        const apiCategory = card.getAttribute('data-category');

        // Check if the API matches the search term and selected category
        const matchesSearch = apiName.includes(searchTerm);
        const matchesCategory = selectedCategory === '' || apiCategory === selectedCategory;

        // Show or hide the card based on the filters
        if (matchesSearch && matchesCategory) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      // Hide categories that have no visible cards
      categorySections.forEach(section => {
        const visibleCards = section.querySelectorAll('.api-card[style="display: block;"]');
        if (visibleCards.length > 0) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });
    }

    // Event listeners for input and select changes
    searchInput.addEventListener('input', filterAPIs);
    categorySelect.addEventListener('change', filterAPIs);
  }
});