import React, { useRef, useLayoutEffect, useState } from "react";
export const PageLayout = (props: {
  header?: React.ReactNode;
  content?: React.ReactNode;
}) => {
  const { header, content } = props;

  return (
    <div style={{ 
      height: "100vh", 
      display: "grid", 
      gridTemplateRows: "auto 1fr",
    }}>
      <div
        style={{ 
          gridRow: "1",
        }}
      >
        {header}
      </div>
      <div
        style={{ 
          gridRow: "2",
          overflow: "auto"
        }}
      >
        {content}
      </div>
    </div>
  );
};
export default PageLayout;

