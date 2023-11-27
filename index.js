const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'bearer YOUR API KEYS'
    }  
  };

  const options2 = {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      Authorization: 'bearer YOUR API KEYS'
    }
  };


// Function to make GET and DELETE requests with a delay
async function fetchDataAndDeleteWithDelay(endpoint, delay) {
  try {
    // Make a GET request to the specified endpoint
    const getUrl = `https://app.doorloop.com/api/${endpoint}`;
    const response = await fetch(getUrl,  options);

    // Check if the GET request was successful (status code 200)
    if (!response.ok) {
      throw new Error(`GET request failed with status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Check if the response contains the expected structure
    if (data && data.hasOwnProperty('data') && Array.isArray(data.data)) {
      // Extract "id" values and make DELETE requests asynchronously with a delay
      for (const item of data.data) {
        if (item.hasOwnProperty('id')) {
          const itemId = item.id;
          const deleteUrl = `https://app.doorloop.com/api/${endpoint}/${itemId}`;

          // Make the DELETE request after a delay
          await new Promise(resolve => setTimeout(resolve, delay));
          const deleteResponse = await fetch(deleteUrl, options2);

          // Check if the DELETE request was successful
          if (deleteResponse.ok) {
            console.log(`DELETE request for id ${itemId} at endpoint ${endpoint} successful.`);
          } else {
            const errorMessage = `DELETE request for id ${itemId} at endpoint ${endpoint} failed with status: ${deleteResponse.status}`;
            console.error(errorMessage);

            // Print the response details
            const errorResponse = await deleteResponse.text();
            console.error(`Response details: ${errorResponse}`);
          }
        } else {
          console.error("One of the items does not have an 'id' property.");
        }
      }
    } else {
      throw new Error(`Invalid or unexpected data structure in the response for endpoint ${endpoint}.`);
    }
  } catch (error) {
    console.error(error.message);
  }
}

// Make GET and DELETE requests for lease-credits first with a delay of 3 seconds
fetchDataAndDeleteWithDelay("lease-credits", 3000)
  .then(() => {
    // Make GET and DELETE requests for lease-payments after lease-credits with a delay of 3 seconds
    return fetchDataAndDeleteWithDelay("lease-payments", 3000);
  })
  .then(() => {
    return fetchDataAndDelete("expenses", 3000)
  })
  .then(() => {
    return fetchDataAndDelete("tasks", 3000)
  })
  .then(() => {
    return fetchDataAndDelete("owners", 3000)
  })
  .then(() => {
    return fetchDataAndDelete("vendors-credits", 3000)
  })
  .then(() => {
    fetchDataAndDelete("vendors-bills", 3000)
  })
  .then(() => {
    return fetchDataAndDelete("vendors", 3000)
  })
  .then(() => {
    return fetchDataAndDelete("accounts", 3000)
  })
  .then(() => {
    return fetchDataAndDelete("communications", 3000)
  })
  .catch(error => {
    console.error(error.message);
  });
