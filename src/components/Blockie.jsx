import React from "react";
import makeBlockie from "ethereum-blockies-base64";

export default function Blockie({ address }) {
  return (
    <div style={{ height: "40px" }}>
      <img
        style={{ height: "100%", borderRadius: "5px" }}
        src={makeBlockie(address)}
      />
    </div>
  );
}
