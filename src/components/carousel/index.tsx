import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
  useCallback,
} from "react";

import Swiper, { ReactIdSwiperProps, SwiperRefNode } from "react-id-swiper";
import { useResize } from "../../utils/hooks/use-resize";

const defaultSwiperOptions = {
  shouldSwiperUpdate: true,
  // rebuildOnUpdate: true,
  slidesPerView: "auto" as const,
  freeMode: true,
  spaceBetween: 0,
  speed: 500,
};

export interface ComponentCarouselProps extends ReactIdSwiperProps {
  className?: string;
  onItemClick?: (index: number) => void;
  activeItemIndex?: number;
  handleClickImplicitly?: boolean;
}

const CarouselComponent = React.forwardRef<
  SwiperRefNode,
  ComponentCarouselProps
>(
  (
    {
      children,
      className,
      onItemClick = () => null,
      activeItemIndex = 0,
      handleClickImplicitly = true,
      ...swiperOptions
    },
    ref
  ) => {
    const swiperRef = useRef<SwiperRefNode | null>(null);
    const [swiper, setSwiper] = useState(false);
    const setRef = useCallback((node: any) => {
      if (node) {
        swiperRef.current = node;
        setSwiper(true);
      }
    }, []);
    useImperativeHandle<SwiperRefNode | null, SwiperRefNode | null>(
      ref,
      () => swiperRef.current
    );

    const onSwiperClick = useCallback(
      (...args: any) => {
        if (!swiper || !swiperRef.current?.swiper) return;
        if (!swiperRef.current) return;
        const clickedIndex = swiperRef.current.swiper.clickedIndex;
        if (clickedIndex !== undefined) {
          swiperRef.current.swiper.slideTo(clickedIndex, 500);
          onItemClick(clickedIndex);
        }
      },
      [onItemClick, swiper]
    );

    useEffect(() => {
      if (!swiper || !swiperRef.current?.swiper) return;
      swiperRef.current.swiper.slideTo(activeItemIndex, 500);
    }, [activeItemIndex, swiper]);

    useEffect(() => {
      if (!swiper || !swiperRef.current?.swiper) return;

      if (handleClickImplicitly) {
        swiperRef.current.swiper.on("click", onSwiperClick);
      }

      return () => swiperRef.current?.swiper?.off("click", onSwiperClick);
    }, [handleClickImplicitly, onSwiperClick, swiper]);

    useResize(() => {
      if (!swiper || !swiperRef.current?.swiper) return;
      const wrapper = swiperRef.current.swiper.$wrapperEl[0] as HTMLElement;
      const wrapperWidth = swiperRef.current.clientWidth;
      const totalWidthReducer = (total: number, child: HTMLElement) =>
        total + child.offsetWidth;
      const childrenWidth = Array.prototype.slice
        .call(wrapper.children)
        .reduce(totalWidthReducer, 0);

      if (childrenWidth <= wrapperWidth) {
        wrapper.classList.add("has-no-scrollable-width");
      } else {
        wrapper.classList.remove("has-no-scrollable-width");
      }
    }, [swiper]);

    return (
      <Swiper
        containerClass={`swiper swiper-container ${className ? className : ""}`}
        ref={setRef}
        {...defaultSwiperOptions}
        {...swiperOptions}
      >
        {children}
      </Swiper>
    );
  }
);

CarouselComponent.displayName = "Carousel";

export default CarouselComponent;
