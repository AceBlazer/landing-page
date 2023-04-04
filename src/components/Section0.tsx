export default function Section0() {
  return (
    <section
      className="relative min-h-10 p-1"
      style={{ minHeight: "20.25rem", boxSizing: "border-box" }}
    >
      <div className="absolute overflow-hidden left-0 top-0 bottom-0 w-full">
        <div className="w-full h-full relative z-0">
          <video
            className="overflow-clip relative z-0 w-full h-full"
            preload="metadata"
            style={{ objectFit: "cover", objectPosition: "center top" }}
            playsInline
            loop
            muted
            autoPlay
          >
            <source
              src="/videos/hero-blurred-7572101a2ce5e003b66483b7fe5c5d36.webm"
              type="video/webm"
            />
            <source
              src="/videos/hero-blurred-89a1d97affb8756b6763d75dcab20bb6.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
      <div
        className="relative z-1 flex items-center justify-center mx-0 my-auto"
        style={{
          minHeight: "20rem",
          height: "55vh",
          maxWidth: "40rem",
          WebkitBoxPack: "center",
          WebkitBoxAlign: "center",
        }}
      >
        <div className="absolute left-0 top-0 w-full h-full">
          <div className="w-full h-full block relative z-0">
            <video
              className="overflow-clip relative z-0"
              preload="none"
              style={{
                objectFit: "cover",
                objectPosition: "center center",
              }}
              playsInline
              loop
              muted
              autoPlay
            >
              <source
                src="/videos/hero-0632cbf2872c5cc0dffa93d2ae8a29e8.webm"
                type="video/webm"
              />
              <source
                src="/videos/hero-de0ba45b1d0959277d12545fbb645722.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
        <div className="absolute inset-1 pointer-events-none">
          <canvas
            className="absolute block overflow-clip"
            width="418"
            height="491"
            style={{
              height: "589.612px",
              left: "8px",
              top: "-12px",
              width: "501.612px",
            }}
          ></canvas>
        </div>
        <div className="w-full">
          <div className="mt-1 text-center">
            <div
              className="inline-block relative"
              style={{
                // width: "40vw",
                width: "20vw",
                height: "calc(17.633)vw",
                maxWidth: "37.5rem",
                maxHeight: "16.5312rem",
              }}
            >
              <img
                className="absolute left-0 top0 block m-0"
                style={{
                  animation: "1s cubic-bezier(0.215, 0.61, 0.355, 1) 0.5s",
                }}
                src="/images/logo-1200-589b3ef693ce8a750fa4b4704f1e61f2.png"
                sizes="(max-width: 599px) 80vw,40vw"
              />
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </section>
  );
}
