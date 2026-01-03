export const get = async (apiBaseUrl, endpoint) => {
  try {
    const response = await fetch(`${apiBaseUrl}/${endpoint}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export const post = async (apiBaseUrl, endpoint, data) => {
  try {
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
}

export const put = async (apiBaseUrl, endpoint, data) => {
  try {
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error putting to ${endpoint}:`, error);
    throw error;
  }
}

export const del = async (apiBaseUrl, endpoint) => {
  try {
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error deleting ${endpoint}:`, error);
    throw error;
  }
}

export const handleResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `API request failed with status ${response.status}: ${errorMessage}`
    );
  }
  const data = await response.json();
  return data;
}
