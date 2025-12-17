'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";

const SearchInput = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const topicFromUrl = searchParams.get("topic") || "";
  const [searchQuery, setSearchQuery] = useState(topicFromUrl);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setSearchQuery(topicFromUrl);
  }, [topicFromUrl]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      if (searchQuery === topicFromUrl) return;

      let newUrl = "";

      if (searchQuery.trim()) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "topic",
          value: searchQuery,
        });
      } else {
        newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["topic"],
        });
      }

      router.replace(newUrl || pathname, { scroll: false });
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery, topicFromUrl, router, pathname]);

  return (
    <div className="relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit">
      <Image src="/icons/search.svg" alt="search" width={15} height={15} />
      <input
        placeholder="Search companions ..."
        className="outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
