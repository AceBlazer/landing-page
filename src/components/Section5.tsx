export default function Section5() {
  return (
    <div className="h-auto px-5 py-20 flex w-full  after:content-[''] after:w-[80px]">
      <div className="relative" style={{ width: "60px", flex: "0 0 auto" }}>
        <div
          className="z-10 relative inline-block ml-1/2"
          style={{ transform: "translateX(-50%)" }}
        >
          <div
            className="uppercase whitespace-nowrap text-primaryText text-xs font-arialNarrow -rotate-90 -translate-x-1/2 translate-y-full after:content-[''] after:inline-block after:align-middle after:w-4 after:h-0.5 after:ml-1 after:bg-current"
            style={{
              paddingTop: "100%",
              transformOrigin: "left top",
              letterSpacing: "0.25em",
              fontWeight: "bold",
            }}
          >
            À L'AFFICHE
          </div>
        </div>
      </div>
      <div className="min-w-0 after:block" style={{ flex: "1 1 100%" }}>
        <div className="max-w-full mx-auto my-0">
          <section>
            <div
              className="relative z-1 text-center text-customBlack"
              style={{ marginBottom: "65px" }}
            >
              <h1
                className="m-0 font-normal text-center"
                style={{ marginBlockStart: "0.83em", marginBlockEnd: "0.83em" }}
              >
                <span className="text-xl italic leading-[1.1rem] font-semibold tracking-widest block">
                  <div
                    style={{
                      animationDuration: "2000ms",
                      animationDelay: "100ms",
                      animationTimingFunction:
                        "cubic-bezier(0.165, 0.84, 0.44, 1)",
                      clipPath: "polygon(100% 100%, -200% 100%, 100% -200%)",
                      display: "inline-block",
                    }}
                  >
                    <span>EN DÉCOUVRIR</span>
                  </div>
                </span>
                <strong className="uppercase sm:text-[calc(43.27px + 2.12vw)] italic tracking-[0.03em] font-extrabold block">
                  <div
                    style={{
                      animationDuration: "2000ms",
                      animationDelay: "100ms",
                      animationTimingFunction:
                        "cubic-bezier(0.165, 0.84, 0.44, 1)",
                      clipPath: "polygon(100% 100%, -200% 100%, 100% -200%)",
                      display: "inline-block",
                    }}
                  >
                    <span>DAVANTAGE</span>
                  </div>
                </strong>
              </h1>
            </div>
            <ul className="relative z-1 w-full max-w-[960px] list-none	p-0 flex mobile:flex-col "></ul>
          </section>
        </div>
      </div>
    </div>
  );
}
