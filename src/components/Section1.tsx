import Carousel from "./carousel";
import NewsItem from "./news-item";

export default function Section1() {
  const items = [
    {
      link: { url: "http://a.com" },
      category: "ACTUALITES",
      headline: "jasser1",
      blurb: "blurb blurb blurbblurbblurbblurbblurb.",
      image: (
        <img
          src="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt70d18ef2e0b06bc8/6446e0a888e91a10e63c955b/043023_MSI23_Esports_Premium_Bundle_Banner.jpg?quality=90&amp;crop=1%3A1&amp;width=720"
          style={{ objectFit: "cover" }}
          sizes="240px"
        />
      ),
    },
    {
      link: { url: "http://a.com" },
      category: "ACTUALITES",
      headline: "jasser2",
      blurb: "blurb blurb blurbblurbblurbblurbblurb.",
      image: (
        <img
          src="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt70d18ef2e0b06bc8/6446e0a888e91a10e63c955b/043023_MSI23_Esports_Premium_Bundle_Banner.jpg?quality=90&amp;crop=1%3A1&amp;width=720"
          style={{ objectFit: "cover" }}
          sizes="240px"
        />
      ),
    },
    {
      link: { url: "http://a.com" },
      category: "ACTUALITES",
      headline: "jasser3",
      blurb: "blurb blurb blurbblurbblurbblurbblurb.",
      image: (
        <img
          src="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt70d18ef2e0b06bc8/6446e0a888e91a10e63c955b/043023_MSI23_Esports_Premium_Bundle_Banner.jpg?quality=90&amp;crop=1%3A1&amp;width=720"
          style={{ objectFit: "cover" }}
          sizes="240px"
        />
      ),
    },
    {
      link: { url: "http://a.com" },
      category: "ACTUALITES",
      headline: "jasser4",
      blurb: "blurb blurb blurbblurbblurbblurbblurb.",
      image: (
        <img
          src="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt70d18ef2e0b06bc8/6446e0a888e91a10e63c955b/043023_MSI23_Esports_Premium_Bundle_Banner.jpg?quality=90&amp;crop=1%3A1&amp;width=720"
          style={{ objectFit: "cover" }}
          sizes="240px"
        />
      ),
    },
    {
      link: { url: "http://a.com" },
      category: "ACTUALITES",
      headline: "jasser5",
      blurb: "blurb blurb blurbblurbblurbblurbblurb.",
      image: (
        <img
          src="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt70d18ef2e0b06bc8/6446e0a888e91a10e63c955b/043023_MSI23_Esports_Premium_Bundle_Banner.jpg?quality=90&amp;crop=1%3A1&amp;width=720"
          style={{ objectFit: "cover" }}
          sizes="240px"
        />
      ),
    },
  ];

  const newsItemNodes = items.map((item, index) => {
    if (!item?.link?.url) {
      throw new Error(
        `news item ${index} ${item.link} ${item.headline} is missing link url`
      );
    }
    return (
      <NewsItem
        isActive
        key={item.link.url + item.headline}
        visible={true}
        transitionDelay={index * 150}
        {...item}
        testId={`featurednews:article-${index}`}
      />
    );
  });

  return (
    <section className="relative py-[40px] px-0 bg-tiles bg-repeat-x bg-left-top -mt-[120px]  z-0 mobile:py-[23rem] mobile:px-0">
      <div
        className={`my-0 mx-auto flex flex-nowrap justify-end mobile:h-[80%]`}
      >
        <div className="flex items-center justify-between h-[200px] w-full">
          <Carousel>{newsItemNodes}</Carousel>
        </div>
      </div>
    </section>
  );
}
