"use client";
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type InstagramPost = {
  id: string;
  caption: string;
  media_url: string;
  media_type: string;
  timestamp: string;
  permalink: string;
};

type InstagramFeed = {
  data: InstagramPost[];
  paging?: {
    cursors: {
      after: string;
    };
  };
};

export default function InstaFeed() {
  const [instagramFeed, setInstagramFeed] = useState<InstagramFeed | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async (after: string | null = null) => {
    try {
      let url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,timestamp,permalink&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}`;
      if (after) {
        url += `&after=${after}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch Instagram feed");
      }

      const feed = await response.json();
      setInstagramFeed(feed);
      setAfter(feed.paging?.cursors.after || null);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching Instagram feed:", err.message);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}

      {instagramFeed && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Trending Nail Styles from Our Instagram</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {instagramFeed.data.map((post) => (
              <Link
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {post.media_type === "VIDEO" ? (
                  <video
                    src={post.media_url}
                    controls={false}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <Image
                    src={post.media_url}
                    alt={post.caption ?? ""}
                    className="w-full h-auto object-cover"
                    width={300}
                    height={300}
                  />
                )}
                <p className="mt-2 text-center text-sm">
                  {post.caption || "No caption available"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}