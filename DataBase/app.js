document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/api/data';
    const addForm = document.getElementById('addForm');
    const dataList = document.getElementById('dataList');
    const readButton = document.getElementById('readButton');

    // Fetch and display data on page load
    fetchData();

    // Add event listener for form submission
    addForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const inputData = document.getElementById('dataInput').value;
        addData(inputData);
    });

    // Add event listener for read button
    readButton.addEventListener('click', function () {
        fetchData();
    });

    // Function to fetch data from the server
    function fetchData() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Display data on the page
                displayData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to display data on the page
    function displayData(data) {
        dataList.innerHTML = '';
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.value;

            // Add update button
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.className = 'ml-2 p-2 bg-yellow-500 text-white rounded-md';
            updateButton.addEventListener('click', function () {
                const newValue = prompt('Enter the new value:', item.value);
                if (newValue !== null) {
                    updateData(item.id, newValue);
                }
            });

            listItem.appendChild(updateButton);
            dataList.appendChild(listItem);
        });
    }

    // Function to add data
    function addData(data) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: data }),
        })
            .then(response => response.json())
            .then(newData => {
                // Fetch and display updated data
                fetchData();
            })
            .catch(error => console.error('Error adding data:', error));
    }

    // Function to update data
    function updateData(id, newValue) {
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: newValue }),
        })
            .then(response => response.json())
            .then(updatedData => {
                // Fetch and display updated data
                fetchData();
            })
            .catch(error => console.error('Error updating data:', error));
    }
});
