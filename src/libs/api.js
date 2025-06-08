export const fetchApi = async (resource, query) => {
  try {
    const response = await fetch(`http://localhost:3000/${resource}/${query}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data dari /api/${resource}`);
    }

    return response.json();
  } catch (err) {
    console.error(`Error di fetchApi untuk resource ${resource}:`, err);
    throw err;
  }
};
