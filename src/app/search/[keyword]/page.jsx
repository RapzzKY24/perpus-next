import { fetchApi } from "@/libs/api";
const Page = async ({ params }) => {
  try {
    const { keyword } = params;
    const decodeKeyword = decodeURI(keyword);
    const searchBook = await fetchApi("api/buku", `q=${decodeKeyword}`);
    return (
      <section>
        <h1>pencarian dengan judul : {decodeKeyword}</h1>
        <BooksList api={searchBook} />
      </section>
    );
  } catch (error) {
    return <div>Error: {error.message}</div>;
  }
};
export default Page;
