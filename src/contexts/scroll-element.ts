import React from "react";
import documentScrollingElement from "../utils/document-scrolling-element";

const Context = React.createContext<HTMLElement | null>(
  documentScrollingElement
);

export default Context;
