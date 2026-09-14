const port = 3000;
const root = document.getElementById("root");
const dataContainer = document.getElementById("dataContainer");

async function fetchMoviesData() {
  try {
    const response = await fetch(`http://localhost:3000/movies`);
    const data = await response.json();
    dataContainer.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error fetching data:", error);
    dataContainer.textContent = "Error fetching data.";
  }
}

const fetchButton = document.createElement("button");
fetchButton.textContent = "Fetch Movies Data";
root.appendChild(fetchButton);

fetchButton.addEventListener("click", fetchMoviesData);
