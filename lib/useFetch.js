async function useFetch(url, options) {
  try {
    const res = await fetch(url, options);
    const json = await res.json();

    return json;
  } catch (e) {
    throw new Error(e);
  }
}

export default useFetch;
