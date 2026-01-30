const API_BASE_URL = "http://127.0.0.1:5000";

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Backend not reachable");
  }

  return response.json();
}
