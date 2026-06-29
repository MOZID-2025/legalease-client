import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <div>
      <Link href="/">
        <h1 className="text-3xl font-extrabold text-white">
          Legal<span className="text-amber-400">Ease</span>
        </h1>
      </Link>
    </div>
  );
};

export default Logo;
