import React from "react";

export default function NotFound(props) {
  return (
    <div className="text-center">
      <h1 className="text-8xl">404</h1>
      <h3 className="text-lg italic">
        {props.children
          ? props.children
          : "This is not the page you were looking for"}
      </h3>
    </div>
  );
}
